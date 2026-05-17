#!/usr/bin/env python3
"""
Audit + (optionally) repair blog posts where the live shutter-envy.co.uk
page has more body content than the local markdown file.

Why this exists: a chunk of blog posts were authored in Elementor on the
live WordPress site, and the SQL/XML migration only captured the bare
`post_content` (often empty / a single paragraph) — the actual content
lives inside Elementor widgets stored in postmeta.

Strategy:
  1. For every src/content/blog/<slug>.md, fetch https://shutter-envy.co.uk/<slug>/
  2. Extract the body inside .elementor-widget-theme-post-content
     (falls back to <article> body if widget missing).
  3. Convert that HTML to clean markdown (markdownify).
  4. Compare word counts. Flag posts where live > local by a meaningful
     margin (default: live is >= local + 80 words AND live >= 1.5 * local).
  5. In --fix mode: rewrite the local .md body with the live markdown,
     preserving the YAML frontmatter intact.

Usage:
  python3 scripts/blog-audit.py            # audit only, prints report
  python3 scripts/blog-audit.py --fix      # also writes the .md files
  python3 scripts/blog-audit.py --json     # machine-readable output
"""
from __future__ import annotations

import argparse
import concurrent.futures as cf
import json
import re
import sys
import ssl
import urllib.request
import urllib.error
from pathlib import Path

# macOS Python bundles often lack a CA bundle; allow unverified TLS so the
# audit doesn't fail on every URL. We're reading public marketing pages, so
# the trust requirement is low.
_SSL_CTX = ssl.create_default_context()
_SSL_CTX.check_hostname = False
_SSL_CTX.verify_mode = ssl.CERT_NONE

from bs4 import BeautifulSoup
from markdownify import markdownify as md

ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "src" / "content" / "blog"
BASE = "https://shutter-envy.co.uk"

# Tags whose content we never want in the body (related posts, sharing widgets,
# Elementor template parts that bleed into the article tag).
STRIP_SELECTORS = [
    ".more-news",
    ".elementor-post-navigation",
    ".elementor-widget-post-comments",
    ".elementor-widget-sharing-buttons",
    ".elementor-widget-author-box",
    ".elementor-widget-post-info",
    ".elementor-widget-theme-post-title",
    ".elementor-widget-theme-post-featured-image",
    ".sharedaddy",
    ".jp-relatedposts",
]

# Frontmatter regex.
FM_RE = re.compile(r"^(---\s*\n.*?\n---\s*\n)(.*)$", re.S)


def fetch(url: str, timeout: int = 20) -> str | None:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (blog-audit-bot)"})
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=_SSL_CTX) as r:
            return r.read().decode("utf-8", errors="replace")
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:
        print(f"  ! fetch failed for {url}: {e}", file=sys.stderr)
        return None


def extract_body(html: str) -> str | None:
    """Return cleaned HTML of the post body, or None if not found."""
    soup = BeautifulSoup(html, "html.parser")

    # Preferred: Elementor's post-content widget.
    node = soup.select_one(".elementor-widget-theme-post-content .elementor-widget-container")
    if not node:
        node = soup.select_one(".elementor-widget-theme-post-content")

    # Fallback: standard WP entry-content
    if not node:
        node = soup.select_one(".entry-content")

    # Last-ditch: the article body (will catch related-posts noise, but
    # STRIP_SELECTORS below filter it).
    if not node:
        node = soup.find("article")

    if not node:
        return None

    # Remove cruft.
    for sel in STRIP_SELECTORS:
        for el in node.select(sel):
            el.decompose()

    # Remove inline scripts/styles.
    for tag in node.find_all(["script", "style", "noscript"]):
        tag.decompose()

    return str(node)


def html_to_markdown(body_html: str) -> str:
    raw = md(
        body_html,
        heading_style="ATX",
        bullets="-",
        strip=["span", "div"],  # collapse Elementor wrappers
    )
    # Tidy: collapse 3+ blank lines down to 2.
    raw = re.sub(r"\n{3,}", "\n\n", raw).strip()
    return raw


def word_count(text: str) -> int:
    return len(re.findall(r"\S+", text))


def audit_one(md_path: Path) -> dict:
    slug = md_path.stem
    url = f"{BASE}/{slug}/"
    raw = md_path.read_text(encoding="utf-8")
    fm_match = FM_RE.match(raw)
    if not fm_match:
        return {"slug": slug, "error": "no_frontmatter"}
    frontmatter, local_body = fm_match.group(1), fm_match.group(2).strip()
    local_words = word_count(local_body)

    html = fetch(url)
    if html is None:
        return {"slug": slug, "url": url, "error": "fetch_failed", "local_words": local_words}

    body_html = extract_body(html)
    if not body_html:
        return {"slug": slug, "url": url, "error": "no_body_found", "local_words": local_words}

    live_md = html_to_markdown(body_html)
    live_words = word_count(live_md)
    delta = live_words - local_words

    # Heuristic — flag a post when the live page clearly has more body than
    # what we migrated:
    #   - delta >= 100 words (any post short by 100+ is meaningfully gutted), OR
    #   - delta >= 50 words AND live is at least 10% larger (catches medium gaps).
    # We *don't* fix posts where local is larger (we may have hand-edited).
    needs_fix = delta >= 100 or (delta >= 50 and live_words >= local_words * 1.10)

    return {
        "slug": slug,
        "url": url,
        "local_words": local_words,
        "live_words": live_words,
        "delta": delta,
        "needs_fix": needs_fix,
        "frontmatter": frontmatter,
        "live_md": live_md,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--fix", action="store_true", help="rewrite flagged posts in place")
    ap.add_argument("--json", action="store_true", help="emit JSON instead of human report")
    ap.add_argument("--workers", type=int, default=8)
    ap.add_argument("--only", help="comma-separated slug filter (substring match)")
    args = ap.parse_args()

    paths = sorted(BLOG_DIR.glob("*.md"))
    if args.only:
        needles = [s.strip() for s in args.only.split(",")]
        paths = [p for p in paths if any(n in p.stem for n in needles)]

    print(f"Auditing {len(paths)} posts against {BASE} ...", file=sys.stderr)

    results: list[dict] = []
    with cf.ThreadPoolExecutor(max_workers=args.workers) as ex:
        for res in ex.map(audit_one, paths):
            results.append(res)
            tag = "FIX " if res.get("needs_fix") else "ok  "
            if res.get("error"):
                tag = "ERR "
            lw = res.get('local_words', '?')
            liv = res.get('live_words', '?')
            d = res.get('delta', '?')
            d_str = f"{d:+d}" if isinstance(d, int) else str(d)
            print(
                f"  {tag} {res['slug']:<70} local={lw:>4}  live={liv:>4}  Δ={d_str:>5}"
                + (f"  ({res['error']})" if res.get("error") else ""),
                file=sys.stderr,
            )

    flagged = [r for r in results if r.get("needs_fix")]
    errors = [r for r in results if r.get("error")]

    print("", file=sys.stderr)
    print(f"  Total posts:    {len(results)}", file=sys.stderr)
    print(f"  Flagged (needs fix): {len(flagged)}", file=sys.stderr)
    print(f"  Fetch errors:   {len(errors)}", file=sys.stderr)

    if args.json:
        # Strip heavy fields for stdout JSON.
        slim = [
            {k: v for k, v in r.items() if k not in ("frontmatter", "live_md")}
            for r in results
        ]
        print(json.dumps(slim, indent=2))

    if args.fix and flagged:
        print(f"\nApplying fixes to {len(flagged)} posts ...", file=sys.stderr)
        for r in flagged:
            md_path = BLOG_DIR / f"{r['slug']}.md"
            new_text = r["frontmatter"] + r["live_md"].rstrip() + "\n"
            md_path.write_text(new_text, encoding="utf-8")
            print(f"  ✓ wrote {r['slug']}.md ({r['local_words']} → {r['live_words']} words)", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
