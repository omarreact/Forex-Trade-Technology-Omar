# Design 4 — leverate

**Reference:** https://leverate.com/  
**Audit date:** 2026-10-21  
**Implementation:** app/design-4-leverate.css  
**Method:** Inspected published page text/navigation via web and, when available, public screenshot search results. The site browser connector was inaccessible, so computed CSS, live viewport captures, and precise source font-family names **could not be verified**. Token values below are **implemented colors**, not copied or measured reference styles.

## Reference observations
Reference leads with all-in-one brokerage journey, marketing platform imagery, product mega-navigation and vivid high-impact cards.

## Implemented visual system

- **Typography:** Arial, Helvetica, sans-serif (implemented; reference computed font not verified). Titles use adaptive clamp sizing with compressed tracking, body copy remains readable.
- **Primary / secondary / accent:** #4825AC, #E2CAFF, #EAFF82. Background #F7F5FF; foreground #1D173B.
- **Header / dropdowns:** Dark brand ribbon + floating white rounded header, contextual product dropdowns. Native disclosure/Next.js links on approved pages; mobile control is horizontally accessible.
- **Hero:** Gradient light-lilac artboard with one huge rotated photo and a second offset photo, glass label.
- **Section order / grouping:** Expressive cloud-style campaign with violet gradient, rounded floating header and editorial photo overlaps. Complete approved content is sourced from the central 13-page manifest; grouping may differ without rewriting content.
- **Container / grid:** Alternating photo/word service stories; soft-lilac three-way service cards. Width controls are defined in app/design-4-leverate.css and are responsive; no empty fixed-width sidebar on content sections.
- **Photography:** Real Pexels photos presented as energetic asymmetric stacks and pill-shaped crops. Pexels source IDs, alt text and attribution remain in `lib/pexels-photos.ts`; users see only appropriately described photos.
- **Button design:** Neon lime/violet high-contrast round pills.
- **CTA immediately before footer:** Oversized violet curved gradient panel with blurred ornamental orb. Action links lead to the matching design's approved contact route (Design 1 uses the canonical contact route).
- **Footer:** Violet strong-heading + three-column nested links; all links remain within the approved site pages.
- **Responsive:** Hero stacks with compact visual collage; content photo/card stacks. Planned verification widths: 360, 390, 768, 1024, 1280, 1440px.
- **Animation:** Soft float transform and gentle link microinteraction, reduced-motion overrides.
- **Difference from Design 1:** Rounded lavender energetic compositions instead of product panel/black editorial.

## Verification limitations
Reference screenshots and exact computed CSS/fonts were **not directly captured** in this session. Treat the reference similarities as verified at a *conceptual/content level*, not pixel-matched. The repo preview build/CI results and actual browser screenshots are required before production acceptance. Do not use copyrighted competitor brand/media/code.


## 2026-10-22 screenshot-driven correction (supersedes earlier color/layout interpretation)

Confirmed from user-supplied screenshot: WHITE base, PEACH/PASTEL split hero, CORAL accent, platform desktop/mobile interface, segmented solution groups, technology comparison rows and dark feature band. Implemented separately in HomeSpotlight.tsx and reference-4.css.

- **Typography:** Inter (body and controls, 300–700), Manrope (headings, 400–700), using user-supplied Google Fonts v20 WOFF2 files with swap loading. Alternative fallbacks are system sans-serif.
- **Evidence:** Full-page desktop screenshot supplied by the project owner. Colors are approximate sampled interpretations, not exact computed CSS. Direct reference CSS, screenshot filenames and assets were not downloaded to GitHub.
- **Photography/UI licensing:** UI preview components are our own CSS/React illustrations; Pexels images remain in their original license-tracked source map and competitor screenshots are not reused in code.
- **QA:** GitHub Actions runs structural regression tests, TypeScript, ESLint, Next.js build and 78 routes × six screen widths, plus full-page screenshots for six homepages and three matching interior pages. No claim about mobile fidelity to competitors whose screenshots were desktop-only.
