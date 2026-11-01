# Forex Trade Technology FSE (source-synchronized)

This repository retains the Next.js marketing site as the design and content source. The **only WordPress theme source** is `wordpress/forex-trade-technology/`, with exactly the original 31 files and seven directories. Do not add files inside that theme path.

## WordPress installation

1. Download the folder `wordpress/forex-trade-technology` from GitHub and install it as a theme on a **staging** WordPress installation.
2. Import the repository root `website.xml` through **Tools → Import → WordPress**. This is a native WXR 1.2 document containing 13 marketing pages and three hierarchy parents.
3. In Settings → Reading select the imported **Home** page as the static homepage. Save Post name permalinks.
4. Appearance → Editor: edit the theme’s global Header and Footer; Pages → Edit to modify granular Gutenberg elements.
5. The contact form is handled by the theme using `wp_mail()`. Configure a working mail transport and the WordPress administrator email address. Do not install a separate FTT contact plugin. Server delivery and browser confirmation must be validated before production use.

## Synchronization

The existing `.github/workflows/sync-fse-locked.yml` regenerates the theme directory and `website.xml` from Next.js content, CSS, theme tokens, navigation, and logo assets whenever source code changes on `main`. It commits only those two destinations and does not generate or publish ZIP archives. The existing XML manual workflow permits an on-demand refresh. The `scripts/build-fse-locked.py` converter enforces the exact file inventory.

**Note:** The historical reference archive contains more elaborate editor controls; the generated 11-block Gutenberg implementation must be staged and tested for editor parity. WordPress templates, logo placement, contact mail transport, and responsive screenshot parity are not certified merely by structural checks. Keep production DNS unchanged pending QA.

Latest repository synchronization: root `website.xml` is WordPress WXR 1.2 and the theme directory contains exactly 31 files. The reference tree is validated in CI; full visual/editor parity and email delivery need WordPress staging verification.
