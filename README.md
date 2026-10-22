# Forex Trade Technology — Full-content Lime Fintech Next.js

Production-oriented Next.js App Router site using the supplied **`nextjs-theme-json-full.zip`** package. The three source JSON files remain separate under `site-data/` and are not duplicated into React components.

## Content coverage

- **13** pages, including nested `/solutions/`, `/products/` and `/technology/` original document URLs.
- **19,517** approximate source words, **114** editorial `contentSection` blocks, **42** FAQ answers, and all original source `fullBlocks` preserved in the JSON.
- Rich content display uses accessible editorial card grids, staged timelines, technical feature lists, two-column bands, question accordions and dark content panels.
- All source heading and paragraph blocks are rendered once (except contact form labels and instructions, represented by functional accessible form controls). SEO uses original source canonical paths.
- Short legacy URLs such as `/crm` and `/hosting` permanently redirect to the original nested URLs. Header and footer use canonical destinations automatically.

## Start

```sh
npm install
cp .env.example .env.local
npm run validate:data
npm run build
npm run start
```

## Source-of-truth separation

- `site-data/site.config.json` — navigation, footer, 13-page inventory, site features.
- `site-data/theme.styles.json` — palette, CSS variables, assets, icons and transition settings.
- `site-data/pages.content.json` — all hero and section source content, metadata, CTAs and FAQs.
- `components/new-theme` — reusable components, no business content databases.
- `app/new-theme.css` — Lime Fintech design.
- `scripts/validate-data.mjs` — regression checks for 13 pages, original full headings, 42 FAQs, source volume and supported content sections.

## Production setup and limitations

- Set `NEXT_PUBLIC_SITE_URL` to `https://forextrade.pincodeit.com` for canonical URLs. The source JSON's `site.url` points to a different domain, which is deliberately not assumed to be the deployment domain.
- To enable real message delivery set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL`; verify the Resend sender domain. Until then the contact form reports a configuration error rather than claiming an email was sent.
- Pexels and Unsplash externally hosted images may change or fail; replace these with owned local media if permanent image availability is required.
- Semantic Lucide SVGs implement icons; the bundled NextIcons/Magnific URLs remain references, not external runtime dependencies.
- CSS view transitions are progressive enhancements. Reduced-motion preferences are honored.
