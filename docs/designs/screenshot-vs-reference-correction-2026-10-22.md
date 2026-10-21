# Visual correction against user-supplied reference captures
Date reviewed: 2026-10-22.

## What was wrong in the production screenshots

The seven user-supplied `design-1.webp` through `design-6.webp` images show a repeated defect in Designs 2–6. The existing `HomeSpotlight` components rendered multiple marketing sections before a second presentation of the approved homepage from `VariationContent.sections`. These were not identical text everywhere but were visually duplicative: solution groups, product groups, process, benefits and FAQs appeared as parallel versions of the same narrative. The original `Page.tsx` renderers then assigned large images to one grid cell and placed ALL service cards within the other grid cell. This caused narrow tall cards followed by blank right-hand space.

Design 1 had a separate content-only section, `#how-your-trading-stack-connects`, in which all explanatory paragraphs occupied the left and the right had no useful interface. A short, linked platform → liquidity → CRM flow now fills that intentional area without replacing document text.

## Screenshot-to-architecture mapping

| Design | Approved reference composition | Production screenshot defect | Corrected unique composition |
|---|---|---|---|
| 1 Original | Original green brand, editorial cards, compact technical content | Trading-stack narrative had no useful right-hand element | Native three-stage system navigation beside original words; original slider/cards retained |
| 2 Match-Trade | Navy hero with two trading devices, horizontal software catalogue, product/systems directory, corporate footer | Added company, product and offer sections BEFORE repeating source sections; cards confined to left half | Dual-phone hero, 3 source-feature tiles, horizontal product catalogue; source chapter headings with compact media on the right and full-width 3-column copy grids |
| 3 B2Broker | Blue/cinematic institutional hero, white overlapping ecosystem, green accents, light white catalogue, black footer | Introductory ecosystem and solution blocks repeated before institutional source narrative, text/photo occupied half width | Blue hero, interactive white ecosystem panel, short source-feature tiles; source content uses a complete institutional article with alternating image-side insets and full-width matrix cards |
| 4 Leverate | Coral/white split technology hero, segmented solution catalogue, modular platform components, light corporate footer | Platform, product and comparisons duplicated the source 13-section narrative, cards forced to narrow column | Coral platform hero, route-linked solution catalogue, short original-slide feature row; full-width solution matrix underneath heading/photo row |
| 5 Soft-FX | Black/neon engineering terminal hero, technology product matrix, topology, engineering cards and black footer | Several marketing feature/product sections duplicated; technical cards were confined to half of the page | Terminal hero, clickable solution matrix and architecture topology, short three-piece source-feature rail; source technical matrices occupy whole container, optional small image sits beside title |
| 6 UpTrader | Pale-blue CRM dashboard hero, alternating software features and process, minimal footer | Intro, process and repeated CRM panels plus source chapters, narrow cards and unused right side | CRM dashboard hero, three source-highlight cards; existing source features rendered once as alternating software/editorial rows with full-width CRM process cards |

## Invariants

1. The source of truth is unchanged: 13 approved WordPress/Gutenberg pages are loaded centrally.
2. Each page contains its source headings and paragraphs once. One deliberately concise design-specific lead highlights original introductory slides instead of duplicating source sections.
3. Desktop source-card grids fill their row (minimum 75% of the enclosing section for full-width layouts). B2Broker allocates the balance to useful institutional image panels (minimum 55% text zone).
4. No CSS allocates a photo column when the corresponding JSX section has no photo.
5. All three CTA/footer/navigation interfaces remain design-specific; switcher and routing are unchanged.
6. Breakpoints: 1440, 1280, 1024, 768, 390 and 360. Mobile cards collapse to one column, with no horizontal scrolling except intentional Match-Trade product carousel.
7. Photographs use the existing Pexels source registry; failure falls back to original UI illustrations. No competitor proprietary assets are shipped.
8. User-requested Inter/Manrope font stack is preserved across designs.

## QA evidence required before release

Run `npm run test:variants`, `npm run test:designs`, `npm run test:references`, `npm run test:premium`, TypeScript, ESLint, build and 468 Playwright viewport/route checks. At 1440px homepage level Playwright additionally rejects duplicated H2 section titles and oversized narrow source-copy containers. Review screenshot artifacts at 1440px for Designs 1–6, plus three comparison interior pages. Merge to `main` only if these checks pass.
