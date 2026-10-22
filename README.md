# Forex Trade Technology — Lime Fintech Next.js

A Next.js App Router site powered **entirely by three separate JSON files in `site-data/`**, created from the attached `nextjs-theme-json-v3.zip` with full v3 source content and media/layout rules.

## Start

```sh
npm install
cp .env.example .env.local
npm run validate:data
npm run dev
```

All 13 JSON-defined pages are statically generated. Run `npm run build` for production.

### Source-of-truth separation

- `site-data/site.config.json` — primary navigation, footer, features, exact routes for all 13 pages.
- `site-data/theme.styles.json` — colors, typography, 26 image-library entries, section layout rules, transition keys.
- `site-data/pages.content.json` — SEO, 5-slide home hero, 300px interior header data, 138 content sections, 42 FAQs, section media.
- `components/new-theme` — generic, reusable presentation. No marketing copy duplicated in components except decorative supporting UI.
- `app/new-theme.css` — design CSS. All original Design-1 code is intentionally omitted from this package.

### Deployment notes

- Configure `NEXT_PUBLIC_SITE_URL` for your production domain (defaults to `https://forextrade.pincodeit.com`), because the site needs a stable canonical URL that should not accidentally become the live canonical URL.
- The contact form only sends if `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` are configured and sender identity verified. Otherwise it returns a transparent 503; no fake success message.
- External image URLs are linked to Pexels/Unsplash and may depend on provider availability; no local rights or backups are assumed.
- The source specifies NextIcons/Magnific providers but is not an installable icon package. Lucide SVG icons implement the supplied semantic icon keys without remotely loading executable assets.
- CSS `@view-transition` and named component transitions progressively enhance navigation in browsers that implement View Transitions. Do not assume unsupported browsers have identical animations.

## v3 features

- Home-only full-width slider: five unique curated backgrounds, 6000ms autoplay, focus and hover pause, keyboard arrows, reduced-motion awareness.
- All 12 interior pages: 300px title band, source-defined breadcrumbs and background image; no tall interior hero.
- Section-level image layouts: splitLeft, splitRight, cardThumb, gridGallery, backgroundWash and fullBleed.
- Source material is not truncated; all detailed prose and FAQ answers are present in `site-data/pages.content.json`.
- `npm run validate:data` checks content totals, all referenced images, route/canonical consistency, and slider configuration.
- SEO paths are nested (`/solutions/...`, `/products/...`, `/technology/...`) with no trailing slashes; legacy short aliases redirect one-way without redirecting `/faq` or `/contact`.
