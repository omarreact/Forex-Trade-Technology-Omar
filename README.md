# Forex Trade Technology — Lime Fintech Next.js

A Next.js App Router site powered **entirely by three separate JSON files in `site-data/`**, created from the attached `nextjs-theme-json.zip` without changing their content.

## Start

```sh
npm install
cp .env.example .env.local
npm run validate:data
npm run dev
```

All 13 JSON-defined pages are statically generated. Run `npm run build` for production.

### Source-of-truth separation

- `site-data/site.config.json` — primary navigation, footer, features, all 13 routes.
- `site-data/theme.styles.json` — colors, radii, type, provider references, images, transition keys.
- `site-data/pages.content.json` — SEO, hero, content sections, FAQ, contact form.
- `components/new-theme` — generic, reusable presentation. No marketing copy duplicated in components except decorative supporting UI.
- `app/new-theme.css` — design CSS. All original Design-1 code is intentionally omitted from this package.

### Deployment notes

- Configure `NEXT_PUBLIC_SITE_URL` for your production domain (defaults to `https://forextrade.pincodeit.com`), because the supplied JSON has an alternate brand domain that should not accidentally become the live canonical URL.
- The contact form only sends if `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` are configured and sender identity verified. Otherwise it returns a transparent 503; no fake success message.
- External image URLs are linked to Pexels/Unsplash and may depend on provider availability; no local rights or backups are assumed.
- The source specifies NextIcons/Magnific providers but is not an installable icon package. Lucide SVG icons implement the supplied semantic icon keys without remotely loading executable assets.
- CSS `@view-transition` and named component transitions progressively enhance navigation in browsers that implement View Transitions. Do not assume unsupported browsers have identical animations.
