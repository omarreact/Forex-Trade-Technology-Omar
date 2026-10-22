# Forex Trade Technology — Lime Fintech v4 Dense

Next.js website with the complete 13-page Google Docs content, separated from the design source files in `site-data/`.

## Install / run

```bash
npm install
npm run validate:data
npm run build
npm run dev
```

## Design system

- Five-slide full-width home carousel; 6-second autoplay
- 240px breadcrumb headers on all interior pages
- Explicit `section.layout`: compact two/three-column cards, 720px prose, full-width 320px image bands, dark/lime CTA bands
- 48–72px vertical padding, 16px card gaps, no lonely image floats
- 26 curated external images, source-driven image keys
- All 42 FAQs in accessible full-width accordions
- Exact original page routes and safe aliases
- Contact form sends via Resend with `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`

For layout policies and QA, see [docs/IMPLEMENTATION_PROMPT.md](docs/IMPLEMENTATION_PROMPT.md). Data validation runs before production builds.
