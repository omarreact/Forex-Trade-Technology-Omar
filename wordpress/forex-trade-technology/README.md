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

## v0.1.6 — Unify homepage and inner-page navigation

The WordPress site `omar.akogs-fashion.com` saves a custom `wp_template_part`
named `ftt-header` and a custom `front-page` template that references it.
Other pages and the blog use the theme-provided `header` part, previously the
older dynamic navigation. That creates two different bars.

**Resolution:** `parts/header.html` and `parts/header-native.html` now forward
to `parts/ftt-header.html` — the canonical, block-editable header. The saved
database version of `ftt-header` always wins over its file fallback, preserving
the existing live logo, links, and Site Editor edits. Fresh installations get a
complete core Site Logo + Navigation + Contact button + WhatsApp/Telegram header
from the bundled `ftt-header.html`.

`assets/css/fse-native.css` fixes white-on-white icon glyphs from saved
`wp:social-links` `iconColor:white` attributes using scoped color/fill rules,
and keeps WhatsApp green / Telegram blue. Existing header action fixes remain.

After replacing the theme ZIP: purge any WordPress/CDN caches, verify homepage,
About, FAQ, Contact and blog all show the same header. **Do not reset or delete
the saved `ftt-header` template part**, re-import content, or manually replace
the Site Editor customization. Template changes made to `ftt-header` then
appear everywhere. If an older saved `header` part overrides the theme file,
edit that part to a single Template Part block referencing `ftt-header`.

## v0.1.7 — Original navigation look on Core Gutenberg menus

The shared header is now a native `core/navigation` block, but WordPress Core
renders `.wp-block-navigation__submenu-container` rather than the original
`.bs-submenu`, so original `clean-reference.css` rules did not reach it.
Default block styles caused oversized top-level/menu fonts, wide row spacing,
square edges, and no original muted-lime highlight.

`assets/css/fse-native.css` now maps the *original* header rules onto the Core
Navigation markup: Inter 14px/600 top-level links, Inter 13px/550 dropdown
items, maximum 320px rounded 13px white menu, 40px rows, subtle shadow,
soft green hover/focus, and active-page highlighting. The submenu arrow is
small and rotates on expanded hover/focus. Mobile WordPress's overlay toggle
remains reachable below 830px, avoiding the legacy `.bs-inline-nav{display:none}`
rule accidentally hiding the entire WordPress navigation.

The fix is CSS-only in the live saved FSE header: no WordPress database edits,
no reset of your site logo, navigation links, CTA block, page designs, or social
links. WordPress Core Nav remains editable under Appearance → Editor.

QA: On desktop compare Home, About, FAQ and Contact headers, hover/focus
Solutions, and test long dropdown items. On mobile test open/close, submenu
keyboard access, and no horizontal overflow. Purge CSS caches after replacing
the theme ZIP; the new theme version is 0.1.7.
