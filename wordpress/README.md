# Forex Trade Technology — WordPress native website.xml release

**Source of truth:** `website.xml` from `omarreact/Forex-Trade-Technology-Omar`, SHA-256 `8ac014971eb3ce30f2cb633253a4dc9c7cf9a1ff46802ea0cf5231f38c2786db`.

## Deliverables

- `forex-trade-technology/` — Gutenberg-native **block theme** (13 pages, 87 sections, 42 FAQs, all XML content; source CSS order; 12 one-click patterns; 5 interactive blocks).
- `forex-trade-technology-contact/` — **optional isolated server transport** for contact email, no credentials in theme/attributes.
- `forex-trade-technology/data/website.xml` — exact canonical portable specification.
- `scripts/build-xml.py` (included in the source archive) — XML → page Gutenberg blocks, theme data, stylesheets and patterns. No React/Next import or transpilation.

## Install on WordPress 6.6+ / PHP 8.1+

1. Backup WordPress database, theme and Site Editor customizations.
2. Appearance → Themes → Add New → Upload Theme → **forex-trade-technology-theme-xml.zip** → Activate.
3. Optionally Plugins → Add New → Upload Plugin → **forex-trade-technology-contact-xml.zip**.
4. Tools → **Import Forex XML** → keep **Preview without writing** checked, inspect 13 page actions.
5. Run the import after checking backup. **Existing pages are skipped by default.** To migrate pages from the older Forex theme, explicitly select **Migrate previous theme pages**; this replaces those managed pages and keeps WordPress revisions. New pages are imported automatically when absent.
6. Settings → Permalinks → Post name → Save. Homepage is assigned automatically when home page is created or explicitly migrated.

WP-CLI via `.wp-env.json`:

```bash
cd wordpress
npx @wordpress/env start
npx @wordpress/env run cli wp theme activate forex-trade-technology
npx @wordpress/env run cli wp plugin activate forex-trade-technology-contact
npx @wordpress/env run cli wp ftt import --dry-run
npx @wordpress/env run cli wp ftt import
# Migrate old Forex theme-generated pages (only after DB backup):
npx @wordpress/env run cli wp ftt import --adopt-legacy
```

## Source updates and reproducibility

To change site content, extract the **source archive**, edit **website.xml**, then rebuild compiled page blocks before packaging:

```bash
python3 scripts/build-xml.py
python3 scripts/theme-base.py
python3 scripts/validate-package.py
```

Every import verifies the source XML SHA-256 against the bundled generated manifest. This prevents importing stale blocks after editing the raw XML. WordPress runtime only reads compiled PHP/Gutenberg blocks and JSON; it does **not** require Python, React, Next.js or external APIs. Source XML remains in the ZIP for verification and rebuilding.

## Editing the site

- Appearance → **Editor** → Template Parts: edit global **Site Header, Footer, Final CTA**, WordPress Navigation, logo and colors.
- Pages → select any imported page: choose a heading/paragraph/image/button/cover/details; edit text and media directly in canvas; reorder groups/sections in List View.
- Inserter → Patterns → **Forex Trade Technology** to insert any section type.
- Interactive blocks: select Slider, Trust Carousel, Audience Carousel, Trading Flow or Contact Form and edit items in the block Settings sidebar. No raw CSS or JSON required.
- `theme.json` exposes the stable brand palette, Manrope/Inter type scale and 1210px width. Site Editor also supports WordPress standard spacing, dimensions and color controls on core blocks.

## Contact configuration (optional plugin)

Use server environment variables or `wp-config.php` only:

```php
// wp-config.php examples — replace with your own verified sender/recipient.
define('FTT_CONTACT_MAIL_TRANSPORT', 'wp_mail'); // or 'resend'
define('FTT_CONTACT_TO_EMAIL', 'your-inbox@example.com');
define('FTT_CONTACT_FROM_EMAIL', 'verified@example.com');
// For Resend only:
// define('FTT_RESEND_API_KEY', getenv('FTT_RESEND_API_KEY'));
```

The form uses a same-origin check, a WordPress nonce if provided, honeypot, content validation and a hashed-IP rate limit. Logged-out nonces alone are not an anti-spam mechanism. On hosts without `wp_mail` delivery, use a correctly configured SMTP provider or Resend. API credentials never belong in the theme or block attributes.

## Parity acceptance gates

- Verify all 13 imported routes and mobile header/navigation, slider, FAQ, form, footer, CTA.
- Compare WP site **front and Site Editor canvas** with reference at 1440/1280/1024/768/390/360 pixels (home, brokerage setup, FAQ, contact minimum).
- Inspect image CDN reachability and image crops, keyboard interactions and reduced-motion handling.
- Generate screenshots from real `wp-env` before claiming **pixel-perfect parity**. Static validation is **not a substitute**.

See `PARITY-REPORT.md` for current evidence and blockers.
