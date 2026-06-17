#!/usr/bin/env node
/**
 * In-place image compression for public/ assets.
 * Keeps filenames and URLs unchanged (CLAUDE.md §7).
 *
 * Usage: node scripts/compress-images.mjs [--min-kb=400] [--all]
 */
import { readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('../public', import.meta.url).pathname;
const MIN_KB = Number(process.argv.find((a) => a.startsWith('--min-kb='))?.split('=')[1] ?? 400);
const MIN_BYTES = MIN_KB * 1024;
const ALL = process.argv.includes('--all');

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) walk(path, out);
    else if (IMAGE_EXT.has(extname(name).toLowerCase())) out.push(path);
  }
  return out;
}

async function compress(file) {
  const before = statSync(file).size;
  if (!ALL && before < MIN_BYTES) return null;

  const ext = extname(file).toLowerCase();
  const img = sharp(file, { failOn: 'none' });
  const meta = await img.metadata();
  let pipeline = sharp(file, { failOn: 'none' });

  const maxWidth = 1920;
  if (meta.width && meta.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  if (ext === '.png') {
    // Photo PNGs: palette compression when large; preserve transparency for small graphics.
    if (before > 500_000 && (!meta.hasAlpha || (meta.width ?? 0) > 800)) {
      pipeline = pipeline.png({ quality: 80, compressionLevel: 9, palette: true });
    } else {
      pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
    }
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: 82 });
  } else {
    pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });
  }

  const buf = await pipeline.toBuffer();
  if (buf.length >= before) return null;

  await sharp(buf).toFile(file);
  const saved = before - buf.length;
  const pct = ((saved / before) * 100).toFixed(1);
  return { file: file.replace(ROOT, ''), before, after: buf.length, saved, pct };
}

const files = walk(ROOT);
let totalSaved = 0;
let count = 0;

console.log(`Scanning ${files.length} images (threshold: ${MIN_KB}KB, all=${ALL})…\n`);

for (const file of files) {
  try {
    const result = await compress(file);
    if (result) {
      count++;
      totalSaved += result.saved;
      console.log(
        `${result.file}: ${(result.before / 1024).toFixed(0)}KB → ${(result.after / 1024).toFixed(0)}KB (−${result.pct}%)`,
      );
    }
  } catch (err) {
    console.warn(`Skip ${file}: ${err.message}`);
  }
}

console.log(`\nDone: ${count} files compressed, ${(totalSaved / 1024 / 1024).toFixed(2)}MB saved.`);
