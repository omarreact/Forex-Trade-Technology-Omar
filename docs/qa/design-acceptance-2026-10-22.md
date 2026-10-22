# Design showroom acceptance — 2026-10-22

## Scope

Follow-up acceptance for the merged six-design Forex Trade Technology showroom. The 13 approved content pages remain available in each of the six designs (78 preview routes). This follow-up improves image distribution and failure treatments, normalizes canonical metadata, publishes robots and sitemap metadata, and aligns CI with Node.js 24.

PR #5 was already merged as `2835d7cbf2ef24f0aa91f16783a9ccf090063a13`; these post-merge corrections are prepared on `post-merge-visual-acceptance-20261022` for a follow-up PR.

## Verification

- `npm run build`: passed; includes variants, design, reference, and premium test suites (29 assertions total), TypeScript validation, and Next.js production build (101 static pages).
- `npm run lint`: passed with zero errors and four existing `@next/next/no-img-element` warnings.
- `npx tsc --noEmit`: passed as part of the build.
- Production browser checks: 468 of 468 checks passed across 1440, 1280, 1024, 768, 390, and 360 px. The checks cover every preview route, navigation, responsive overflow, content, image alt attributes, keyboard interaction, CTA links, canonical/noindex behavior, and the 13 source-page canonicals.
- Screenshot review: 24 comparable full-page captures (six homepages plus MT5 White Label, Forex CRM, and About Us in all six designs) were visually reviewed. Four distinct original-photo fallbacks were also verified.
- Sitemap: exactly the approved 13 canonical content routes; design previews are excluded. Preview routes carry `noindex` metadata and an `X-Robots-Tag` response header.
- Canonical origin: all 13 indexable source routes point to `https://forextrade.pincodeit.com`; preview routes canonicalize to their corresponding source paths.

## Screenshot artifacts

- [Homepage comparison sheet](screenshots/compare-home.png)
- [MT5 White Label comparison sheet](screenshots/compare-mt5-white-label.png)
- [Forex CRM comparison sheet](screenshots/compare-forex-crm.png)
- [About Us comparison sheet](screenshots/compare-about-us.png)
- [Automated browser check results](visual-checks.json)

Full-resolution captures for all 24 comparisons are available in the generated local artifact archive at `artifacts/design-acceptance-2026-10-22/screenshots.zip`.

## Release status

Production deployment and domain verification are pending the follow-up PR merge. The contact form was not submitted or provider-configured.
