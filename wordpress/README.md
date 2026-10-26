# Phase C: Forex Trade Technology WordPress FSE package

This folder contains **a separate WordPress block theme and a separate Resend contact plugin**. The existing Next.js website is still the live Vercel runtime. No WordPress/PHP is needed to build or deploy Next.js.

## Installation

Download both ZIP archives from the `WordPress Phase C package and syntax verification` GitHub Actions run, or create them with:
```bash
cd wordpress
zip -r forex-trade-technology-theme.zip forex-trade-technology
zip -r forex-trade-technology-contact-plugin.zip forex-trade-technology-contact
```
1. On **a WordPress staging installation (6.5+, PHP 8.1+)**, go to Appearance → Themes → Add Theme → Upload. Install and activate **forex-trade-technology-theme.zip**.
2. Go to Plugins → Add New → Upload Plugin. Install/activate **forex-trade-technology-contact-plugin.zip**.
3. Go to Appearance → **Import Forex Content**. Run dry-run preview first; verify expected 13 pages, then uncheck dry run and import. WordPress creates **13 marketing pages and 3 route-parent pages** for `/solutions/`, `/products/`, and `/technology/`. Existing non-FTT pages are not overwritten. WP-CLI equivalent: `wp ftt import --dry-run`, then `wp ftt import`.
4. In `wp-config.php` or your server secret manager configure `FTT_RESEND_API_KEY`, `FTT_CONTACT_FROM_EMAIL`, `FTT_CONTACT_TO_EMAIL`. **Never put Resend secrets in theme or public JSON.**
5. In Settings → Permalinks select **Post name** and save. Verify `/faq`, `/contact`, `/solutions/brokerage-setup`, and all remaining routes.
6. In Appearance → Editor inspect template parts: Site Header, Site Footer, Final CTA, Home Final CTA. In Pages → Edit open imported Gutenberg pages, edit section copy in the sidebar, and compare canvas and public site.

## Contract and editing architecture

- `theme.json` ports canonical palette, typography, widths, spacing.
- `assets/css/front.css` reproduces the **same 17 ordered original imports** from Next.js, copied byte-for-byte. `wp-parity.css` patches WP wrapper/layout and image positioning differences. `editor.css` scopes the canvas and `add_editor_style` loads front + editor CSS.
- `parts/header.html`, `footer.html`, `final-cta.html`, `final-cta-home.html` are global Gutenberg template parts. `templates/front-page.html`, `page.html`, `404.html` are native FSE templates.
- `blocks/*/block.json` registers **13 dynamic Gutenberg block types**; `assets/js/editor.js` presents editable inspectors and a **WordPress ServerSideRender** preview using the same PHP renderer as the frontend; `assets/js/front.js` implements the slider, mobile menu, audience carousel, form and scroll button.
- `patterns/` gives ten insertable layout starters. `inc/render.php`, `inc/render-sections.php` hold server render contracts. `inc/import.php` serializes every JSON page section into post_content without duplicating `ctaBand` or showing interior `mediaBand`. The 42 FAQ items, five slider records, image keys and full technical-guide source are retained.
- `data/pages/*.json` carries the exact 13 Phase B content documents; `data/render-map.json` and `data/source-theme.json` capture a frozen snapshot. Updating source content requires a deliberate importer rerun and only touches pages already managed by the importer.

## QA gates and current limitations

**Automated in GitHub:** PHP syntax, JS syntax, 13-page/87-section/42-FAQ/5-slide/26-image consistency, CSS source equality, and two valid ZIP archives.

**Still required in a real WordPress staging site:** activate theme/plugin, import pages, verify menu and navigation, contact 400/503/provider 200, full block editor interaction, and visual screenshot comparison at **320, 768, 1440 px** against https://forextrade.pincodeit.com/ on home, one solution, FAQ, contact, then all 13 pages.

**Do not claim exact pixel parity without those browser screenshots.** Gutenberg canvas uses server-side previews to minimize markup drift, but WordPress wrappers, glyph/icon fallbacks, dynamic layout differences, font-loading, carousels, and technical guide present remaining risks. The technical guide draws from bundled source JSON (preserving content), so it is not an ordinary RichText-editable core block yet. Header/footer text and menu structure currently come from bundled site configuration; blocks/template parts can be rearranged in FSE, but advanced navigation editing and exact per-element WYSIWYG parity need a follow-up editor pass.

**Production cutover:** Keep WordPress in staging/parallel run until all screenshots and form delivery tests are approved; do not move the Vercel DNS to WP as part of this package.
