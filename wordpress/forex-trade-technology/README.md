# Forex Trade Technology — WordPress Block Theme

This folder is the installable WordPress theme. See [../README.md](../README.md) for the importer, plugin, QA and staging instructions.


## v0.1.4 — Header-to-content gap correction
WordPress injects 24px of margin between Full Site Editing template blocks.
The scoped override in `assets/css/wp-parity.css` removes that structural spacing
only on direct children of `.wp-site-blocks`, leaving inner section spacing,
header height, colors and Gutenberg content editing intact.
The stylesheet and asset cache versions are bumped to 0.1.4.
After uploading the theme, clear any server/CDN caches and the browser cache.

## v0.1.5 — Contact Us button in native FSE header
WordPress persists template-part edits in its database. An existing header can therefore
retain the legacy Gutenberg wrapper `wp-block-button bs-btn bs-btn-primary bs-header-cta`
even after the default file has been updated. The outer block inherited lime button
padding/background, while the inner `wp-block-button__link` drew a second dark pill.
A scoped fix in `assets/css/fse-native.css` resets only the header CTA wrappers,
then draws a **single** dark, accessible clickable pill on the anchor.
The default `parts/header-native.html` uses a single `ftt-native-cta` class for new installations.
Current saved Site Editor logo and navigation remain untouched. After updating,
clear full-page/CSS CDN caches and re-check desktop and mobile.
