# Forex Trade Technology — FSE editing upgrade (preservation-first)

**Status:** development preview only. Do not activate native template alternatives or change production DNS without review.

## Sources and invariant

- Current implementation: `wordpress/forex-trade-technology/` in this repository (the WordPress source of truth).
- Reference: user-provided `forex-trade-technology-fse.zip`, v5.4.8, audited October 31 2026. It illustrates FSE parts but is **not** used to overwrite the current design.
- Preserve the current page order, routes, brand palette, Manrope/Inter typography, front-end CSS and JavaScript, 13-page content contracts, original responsive layout, forms, SEO, animations and social links.
- The live Next.js/Vercel site is **not** changed by this branch.

## Changes in this branch

1. **Existing header/footer:** original `parts/header.html` and `parts/footer.html` are unchanged, retaining their same server-side renderers and CSS class names.
2. **Header editing:** Inspector offers brand mark, primary/accent/tagline, home destination; add/delete/reorder main links; add/edit/delete submenu links; add dropdowns; edit CTA label and destination.
3. **Footer editing:** edit logo copy, about, footer columns, link labels and URLs, add/remove/reorder columns, contact email/links, bottom CTA, copyright. Social icon destinations remain synchronized through **Appearance → Social Links**.
4. **Dropdown resilience:** navigation script now supports multiple dropdowns with unique menu IDs and Escape-to-close; legacy single-menu appearance remains the default.
5. **Native FSE opt-in parts:** `parts/header-native.html` and `parts/footer-native.html` are alternate Site Editor template parts with `core/navigation`, `core/site-title`, `core/columns`, `core/paragraph`, `core/buttons`, `core/social-links`. Native styling is scoped to `.ftt-native-header` / `.ftt-native-footer` and **not loaded onto the current chrome**. **These parts are prototypes, not a recommendation to switch production yet.**
6. **Theme tokens:** `theme.json` palette and global styles remain unchanged; only two optional template part registrations were added.
7. **Automated safety:** `scripts/validate-fse-editing.mjs` checks active parts, template balanced block markup, links, editing features and CSS scoping. The WordPress package workflow runs it and also lints PHP/JS and builds theme/plugin ZIPs.

## Test on disposable WordPress staging

1. Export WordPress database, `wp-content/uploads`, active theme, current `wp_template`, `wp_template_part`, `wp_navigation`, and `wp_global_styles` records, before testing. Git alone is *not* an adequate Site Editor backup.
2. Install the theme and its separate contact plugin on an **isolated WordPress site**. Use the existing explicit, dry-run-first import process; do not re-import over edited pages.
3. Visit **Appearance → Editor → Patterns → Template Parts → Site Header**. Keep the existing template. Select the custom Header block and test every Inspector field, submenu, menu action and Save/Reload; verify changed item appears on all pages.
4. In **Site Footer**, test both existing columns, every link, legal row, brand, email, and contact CTA. Ensure shared social destination URLs remain controlled through Appearance → Social Links.
5. Explore **Header — native Navigation (preview)** and **Footer — native Gutenberg (preview)** as alternative template parts. Their content is editable with Core Gutenberg tools, but they must **not** replace the active parts until exact screenshots and keyboard/mobile behavior match.
6. Capture production and staging desktop, tablet, mobile screenshots at **1440 / 1024 / 768 / 390 / 320 px**, including expanded desktop submenu and mobile menu. Verify contrast, focus order, keyboard Escape, footer links and legal copy.
7. Validate all 13 pages, slideshow, carousel, FAQ, consultation form (400/503/provider-success), CTA link targets, scroll-to-top, SEO and media.
8. If WordPress already stores customized template-part records in the database, those saved overrides take precedence over files in this branch. Inspect and migrate them explicitly; never silently reset templates.

## Release gates (not yet satisfied)

- [ ] CI WordPress package verification passes.
- [ ] CI isolated WordPress runtime smoke passes.
- [ ] Header/Footer Inspector changes survive Save + reload on WordPress.
- [ ] Native menu prototypes are validated in WordPress 6.8+ / 7.0.
- [ ] Native header/footer visual parity, accessibility and interaction screenshots approved.
- [ ] Every current page's custom monolithic section blocks converted where appropriate to per-element Core Gutenberg content.
- [ ] All existing WordPress template database overrides backed up and reconciled.
- [ ] Approval for production deployment.

**Rollback:** Keep the existing parts referenced by templates; revert the isolated branch if an editor/runtime regression appears. For an already-updated WordPress site, restore the WordPress DB backup as well as the theme when necessary. Never substitute this branch for a verified database backup.
