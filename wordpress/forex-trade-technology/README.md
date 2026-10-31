# Forex Trade Technology — WordPress Block Theme

This folder is the installable WordPress theme. See [../README.md](../README.md) for the importer, plugin, QA and staging instructions.


## v0.1.4 — Header-to-content gap correction
WordPress injects 24px of margin between Full Site Editing template blocks.
The scoped override in `assets/css/wp-parity.css` removes that structural spacing
only on direct children of `.wp-site-blocks`, leaving inner section spacing,
header height, colors and Gutenberg content editing intact.
The stylesheet and asset cache versions are bumped to 0.1.4.
After uploading the theme, clear any server/CDN caches and the browser cache.
