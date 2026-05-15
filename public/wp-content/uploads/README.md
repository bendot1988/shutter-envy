# /wp-content/uploads/

This directory mirrors the WordPress media library path so existing image URLs
(`/wp-content/uploads/YYYY/MM/file.jpg`) keep resolving after the rebuild.

**Do not rename or restructure subdirectories here.** See CLAUDE.md §7.

The media library will be migrated into this folder during a later step,
preserving the YYYY/MM subdirectories from the WordPress export.
