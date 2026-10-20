Forex Trade Technology v3.2.0 — Complete standalone WordPress FSE theme.

For installation, import, the local page layout generator, performance enhancements, and limitations, read INSTALL.md in this theme.

FOREX TRADE TECHNOLOGY — WORDPRESS 6.6+ FULL SITE EDITING THEME
Version 2.0.0

INSTALLATION
1. Appearance > Themes > Add New > Upload Theme.
2. Select forex-trade-technology.zip and activate Forex Trade Technology.
3. Appearance > Editor lets you edit header, footer, and the Home template.
4. The homepage matches the supplied standalone HTML, with an inline disclosure submenu.
5. Open your site's homepage to verify.

NAVIGATION
Desktop and mobile: all primary links remain in a horizontal/wrapping navigation bar.
The Roadmap button expands the second row IN FLOW (not a popup/overlay/drawer).
Items link to #roadmap, #step-1..#step-5, #offer.
To edit navigation links, open Appearance > Editor > Patterns > Template Parts > Header
and edit the Custom HTML block. No third-party navigation plugin required.

HOME PAGE CONTENT AND EDITOR
The homepage is intentionally split into Custom HTML blocks by section, to preserve
100% of the supplied HTML's markup and design. In the Site Editor, select a section's
Custom HTML block to edit its text/markup. If normal rich-text editable blocks are
required, converting the bespoke HTML into core blocks may alter the exact design.
The contact form is rendered by the short code block [ftt_roadmap_contact_form].
Other WordPress pages/blog posts use native WordPress post-content blocks and the
same header, footer and styling.

CONTACT FORM
The Contact section's visual layout is from your original HTML; submission uses
WordPress admin-post.php, nonce verification, validation, honeypot and rate limiting.
Messages are delivered using wp_mail() to Settings > General > Administration Email.
For reliable external email delivery, configure your WordPress mail transport (SMTP).
Test this in a real WordPress installation; static HTML previews cannot send email.

FILES
style.css: exact CSS from supplied HTML + no-overlay menu adaptations
screenshot.png: WordPress Theme screen thumbnail, 1200x900
patterns/: reusable visual section patterns available in the Site Editor
parts/: header/footer block template parts
templates/: front page + page/post/archive/search/404 templates
functions.php: native stylesheet loading and secure contact handler
theme.json: WordPress editor palette/layout design tokens
assets/reference/brokersetup-roadmap-preview.html: ORIGINAL UNCHANGED USER FILE
assets/reference/forex-trade-technology-browser-preview.html: modified standalone preview
assets/html/contact-form.html: original form markup, used by PHP shortcode
assets/js/inline-menu.js: optional enhancement to collapse submenu after navigation

No Elementor, page builders, CDN assets or external CSS/JS dependencies.
All design assets and code are included in the theme ZIP.

LIMITATION: Final functional contact-email/editor QA requires a WordPress installation.


Version 3.0.0 — Forex Broker Technology homepage
The homepage contains fourteen reusable home-* patterns using core Gutenberg blocks.
Edit it in Appearance > Editor. Original Roadmap patterns and reference HTML are retained.
The preserved Roadmap uses the page-roadmap template. An administrator visit creates the
Roadmap page and imports the three bundled stock photographs to the Media Library once.
The homepage template references local, responsive WebP assets; native Image blocks can
be replaced in the editor. Photo credits and license links: assets/images/credits.json.
The existing enquiry form uses admin-post.php, a nonce, honeypot, validation and rate limits.
Messages go to the WordPress administration email. A successful wp_mail handoff is not a
guarantee of inbox delivery; configure and verify production mail transport separately.
SEO metadata is provided only when a recognised SEO plugin does not own it. Existing
WordPress indexability settings remain authoritative. No claims, metrics or case studies
were invented. The portfolio area explicitly states that case studies are being prepared.
