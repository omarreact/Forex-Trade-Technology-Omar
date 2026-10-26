# Forex Trade Technology — standalone WordPress phase C package

## Scope and limitations
This is an **initial functional WordPress FSE conversion**, not a screenshot-validated pixel-perfect recreation. It lives in `wordpress/` separately from the Next.js runtime and should be tested in staging before public cutover.

- `forex-trade-technology/`: WordPress block theme, templates and shared parts, source design files, dynamic custom blocks, editor styles and importer.
- `forex-contact/`: independent Resend delivery plugin. Configure via server-side constants only.
- Source JSON snapshots: all 13 page documents and 26 curated image definitions, canonical menus and tokens.
- The importer preserves section order, skips suppressed JSON CTA sections and interior media bands, and creates the front page. It **overwrites the imported page content when rerun**; back up edits first.
- WordPress editor uses JSON attribute controls and a server-rendered preview. Many detailed controls, animated parity and fine-grained widget UI are still incomplete. Do not claim exact webview parity.

## Installation on staging WordPress (6.6+, PHP 8.1+)
1. Build theme and plugin ZIPs via the GitHub Actions artifact workflow or zip the **contents** so the archive root is `forex-trade-technology/` or `forex-contact/`, respectively.
2. Appearance → Themes → Add New → Upload Theme. Activate **Forex Trade Technology**.
3. Plugins → Add New → Upload Plugin. Activate **Forex Trade Technology Contact**.
4. Tools → **Import FTT pages** → Import; or WP CLI `wp ftt import --dry-run` then `wp ftt import`.
5. Settings → Permalinks → Post name → Save. Pages should resolve at the 13 Next.js URLs.
6. Appearance → Editor → Templates / Template Parts. Customize header, footer and final CTA. Pages use registered editable Gutenberg blocks.
7. Configure these constants **outside version control** in wp-config.php or a secret-manager injection:
```php
define('FTT_RESEND_API_KEY', getenv('FTT_RESEND_API_KEY'));
define('FTT_CONTACT_FROM', 'verified@example.com');
define('FTT_CONTACT_TO', 'inbox@example.com');
```
8. Use a staging sender/recipient to test delivery. Never put the API key in the theme or a block's attributes.

## Editor parity QA — still required
For homepage, brokerage setup, FAQ and contact capture **frontend and editor canvas screenshots** at 320, 768, 1440. Compare against Next.js production and fix CSS, markup, header/footer, form and custom carousel differences before shipping. Test all 13 pages, slide autoplay, FAQ expansion, sticky header, mobile navigation, keyboard controls, image crops, and header/footer CTA. Do not redirect DNS until QA passes.

## Known gaps
The current PHP renderer uses generic section wrappers for some Next-specific overrides (TradingStackFlow, FeatureFlex, AudienceCarousel). It does **not** yet reproduce their unique component structure/animations. The existing CSS is copied with its original import order, but additional editor-specific selectors and pixel-diff QA are necessary. WP menus require configuring the Navigation block. The current import creates intermediate parent pages and stores original SEO titles in post meta; dedicated SEO plugin integration is a follow-up.

## Build/validate
```bash
find wordpress -name '*.php' -print0 | xargs -0 -n1 php -l
python3 scripts/validate-wp-package.py
```
