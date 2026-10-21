# Six-design structural comparison — 2026-10-21

Values below describe **the implemented code**, not unverified pixel measurements from competitor websites. Design 1 preserves the original site apart from an accessibility-sized contact CTA and removal of the empty article rail.

| Property | 1 — Original | 2 — Match-Trade | 3 — B2Broker | 4 — Leverate | 5 — Soft-FX | 6 — UpTrader |
|---|---|---|---|---|---|---|
| Font family | Original Tailwind theme sans | Arial | Arial Narrow / Arial | Arial | System UI / Segoe UI | Trebuchet MS |
| Primary colors | Deep green / lime | Cyan / ice-white | Ink-black / mint | Violet / lilac / lime | Charcoal / fluorescent green | Cream / ocean cyan |
| Header | Original sticky company nav | Wide white single-row, dropdowns | Two-level institutional dark utility + main nav | Dark notice and floating white pill nav | Dark logo rail and independent secondary nav | Minimal warm-white inline nav |
| Hero | Existing complete-panel sliding photo banner | Static split photo + hovering UI info tiles | Cinematic grayscale full-bleed overlay | Purple gradient + overlapping rotated photography | Technical CSS infrastructure diagram + side copy | Soft photo bento collage + oversized copy |
| Section layout | Original editorial Gutenberg flow | Product strip + staggered 2-column chapters | High-contrast chapter index rails and photo dividers | Alternating image/text stories, pastel cards | System-oriented module grids and full-width photo strips | Staggered editorial stories and pastel product bento |
| Card design | Original original-theme cards | Thin-line square industrial cards | Flat dark segmented matrix | Large rounded shadow product cards | Lime outlined square technical units | Rounded pastel editorial cards |
| Photo style | Original source/editorial photos | Tall arch crops and cyan info panels | Cinematic black-and-white full-width cuts | Overlapping rotated photos and blurred glass chip | Cropped data center infrastructure strips | Human workspace collages and bento crops |
| CTA design | Green original-style banner | Dark teal split photograph panel | Centered mint-on-black editorial CTA | Vivid violet rounded gradient billboard | Two-part lime image/system consultation panel | Dark photographic immersive hero-style CTA |
| Footer layout | Existing SiteFooter | Light corporate four columns | Black typographic footer and three directories | Purple billboard wordmark/three columns | Black engineering directory with slash labels | Soft turquoise broad header and three columns |
| Responsive behavior | Original stacked hero + rail repair | Scrollable compact nav, split-to-stack media | Compressed utility rail, dark tabular layout | Floating nav wrap, compact collage | Technical diagram shrink and module-stack | Two-tile mobile bento, editorial stories stack |
| Source components | app/page.tsx / InteriorPageShell | components/designs/design-2-matchtrade/Page.tsx | components/designs/design-3-b2broker/Page.tsx | components/designs/design-4-leverate/Page.tsx | components/designs/design-5-softfx/Page.tsx | components/designs/design-6-uptrader/Page.tsx |

## Content scope and navigation

The same `page-manifest.json` defines 13 approved content pages. Each design uses the same source documents through `lib/variants/content.ts`; design-specific React trees handle the *visual* hierarchy. The common design selector preserves the route segment. No competitor branding, photography, copy or statistics are imported.

## Acceptance and verification

- Static guardrails: `npm run test:variants` and `npm run test:designs` (when configured).
- Build: `npm run build` and TypeScript compile via Next.js.
- Browser: all 78 route pairs at 360, 390, 768, 1024, 1280 and 1440 px; 6 homepage + 18 requested three-interior screenshots, subject to browser access.
- Browser screenshots and exact reference computed CSS are **not yet verified** in this session. Do not mark browser-dependent checks passed until an actual runner reports results.
- Contact submission email delivery is deferred by prior user instruction; CTA routes remain operational but email sending is not.
