# Forex Trade Technology — Standalone WordPress FSE theme (v3.2)

## Install (no CLI required)
1. Back up your existing site/database. WordPress 6.6+ with PHP 8.0+ recommended.
2. Upload `forex-trade-technology-final.zip` in **Appearance → Themes → Add New → Upload Theme**; then **Activate**.
3. On first activation, the theme creates **only missing** pages from the 22 supplied source-backed layouts. It never overwrites existing page copy, and it sets the generated homepage only when no page_on_front is configured. Parent `solutions` and `products` pages are only blank navigation placeholders; the actual source-backed pages are their children.
4. If upgrading an already-active copy of this theme, visit **Appearance → FTT Site Setup → Create Missing Pages**. This action has an admin capability and nonce requirement; existing content is preserved.
5. Set **Settings → Permalinks → Post name → Save**. Check the homepage; under **Settings → Reading**, pick the generated homepage if your existing homepage should be replaced.
6. Check all pages. Only the Forex CRM page is missing because source Google Doc was inaccessible; no fabricated content is included.
7. Configure reliable WordPress outgoing email (SMTP/MTA) and test the contact form. `wp_mail()` success does not guarantee inbox delivery.

## WP-CLI importer (optional, overwrites matching routes — backup first)

```bash
wp eval-file wp-content/themes/forex-trade-technology/tools/import-pages.php -- --dry-run
wp eval-file wp-content/themes/forex-trade-technology/tools/import-pages.php -- --publish
```

## Visual editor and slider
- Every generated page is built from editable native Gutenberg group, heading, paragraph, image, list and button blocks. Open **Pages → Edit**.
- Homepage uses a three-scene image/text carousel beside the **unchanged source hero wording**, with local images, a small deferred JS controller, accessible buttons, keyboard navigation, pause on hover/focus, and reduced-motion support.
- Customize slider captions/photos in the homepage editor. Carousel controls are generated automatically by frontend JavaScript.
- Header and footer remain the theme's pre-existing Custom HTML template parts. They are editable in **Appearance → Editor → Patterns → Template parts**, but not as individually rich-text Gutenberg blocks.

## Free local page generator (no API and no LLM)
- **Pages → Add New → Editor sidebar → Free Local Page Designer.** If not visible, open the editor's plugin/sidebar menu.
- Paste content or a description. For explicit headings use `H1:`, `H2:`, `H3:` or Markdown `#`, `##`, `###`.
- Choose **Editorial**, **Service Cards**, or **Split Spotlight**, then click **Insert editable layout**.
- Output is standard WordPress core blocks saved to the page as fully editable markup.
- Pasted wording is retained, not paraphrased. Description-only input creates explicit placeholder sections instead of fabricating company claims. An existing non-empty page is never overwritten: with confirmation the new layout appends at the end.
- This is **deterministic client-side pattern matching and layout generation**, not generative AI in the model-based sense. All execution is in your browser; the generator makes no external requests or paid API calls.
- Three starter block patterns are also added: `FTT · Editorial Starter`, `FTT · Services Grid Starter`, `FTT · Split Spotlight Starter`.

## Notes and limitations
- Original Google Doc wording of all 22 accessible page layouts remains intact; carousel reuses source-backed service descriptions. No new client case-study claims are introduced.
- This package is not an FTP server, WordPress hosting, email service, or third-party brokerage integration.
- WordPress upload/theme installation and actual end-to-end browser rendering must be tested on the destination site; this package underwent static analysis, PHP syntax checks, JS syntax checks and source content assertions.
- Source metadata manifest: `assets/content/page-manifest.json`, content: `assets/content/pages/`, original 22 page patterns: `patterns/content-*.php`.
- WordPress theme images are all local WebP; no Google Fonts, jQuery, CDNs, remote AI, or external animation dependencies.


## v3.3 Interior redesign
All 22 Google Docs were exported, including Forex CRM, supplying 23 pages. The existing homepage HTML, homepage slider, home patterns, and global navigation remain unchanged.
For a new site: upload and activate the theme; missing pages are created automatically.
For an existing site, back up the database first. Appearance > FTT Site Setup creates only missing pages. To replace interior layouts (but NOT the homepage) use WP-CLI:

    wp eval-file wp-content/themes/forex-trade-technology/tools/import-pages.php -- --dry-run
    wp eval-file wp-content/themes/forex-trade-technology/tools/import-pages.php -- --publish

The homepage is skipped unless --include-home is explicitly set. Source documents are in the separate DOCX archive.
