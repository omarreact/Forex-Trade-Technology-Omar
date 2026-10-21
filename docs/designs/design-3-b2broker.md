# Design 3 — b2broker

**Reference:** https://b2broker.com/  
**Audit date:** 2026-10-21  
**Implementation:** app/design-3-b2broker.css  
**Method:** Inspected published page text/navigation via web and, when available, public screenshot search results. The site browser connector was inaccessible, so computed CSS, live viewport captures, and precise source font-family names **could not be verified**. Token values below are **implemented colors**, not copied or measured reference styles.

## Reference observations
Reference homepage uses high-density trading infrastructure headline, institutional audience description, top navigation and product/turnkey taxonomy.

## Implemented visual system

- **Typography:** Arial Narrow, Arial, Helvetica, sans-serif (implemented; reference computed font not verified). Titles use adaptive clamp sizing with compressed tracking, body copy remains readable.
- **Primary / secondary / accent:** #0A0F14, #17222B, #BEFFF1. Background #060A0D; foreground #F4F8FA.
- **Header / dropdowns:** Two-tier dark utility strip + institutional navigation/dropdowns. Native disclosure/Next.js links on approved pages; mobile control is horizontally accessible.
- **Hero:** Full-bleed monochrome photographic background under a high-contrast dark overlay.
- **Section order / grouping:** Institutional editorial: extra utility header, dark immersive hero, large uppercase heading, tabular chapter rail. Complete approved content is sourced from the central 13-page manifest; grouping may differ without rewriting content.
- **Container / grid:** Full-width section divider + meaningful chapter index side rails, large editorial columns. Width controls are defined in app/design-3-b2broker.css and are responsive; no empty fixed-width sidebar on content sections.
- **Photography:** Monochrome financial infrastructure, occasional cinematic wide strip photos. Pexels source IDs, alt text and attribution remain in `lib/pexels-photos.ts`; users see only appropriately described photos.
- **Button design:** Square mint-white action buttons.
- **CTA immediately before footer:** Centered extra-large type on deep teal field; no photo card. Action links lead to the matching design's approved contact route (Design 1 uses the canonical contact route).
- **Footer:** Black three-column product taxonomy, enormous typographic wordmark; all links remain within the approved site pages.
- **Responsive:** Labels stack, content index narrows to a line; full-bleed photo remains. Planned verification widths: 360, 390, 768, 1024, 1280, 1440px.
- **Animation:** Restrained reveal via hovering links; reduced-motion overrides.
- **Difference from Design 1:** Institutional dark editorial with top utility rail, not an original-card copy.

## Verification limitations
Reference screenshots and exact computed CSS/fonts were **not directly captured** in this session. Treat the reference similarities as verified at a *conceptual/content level*, not pixel-matched. The repo preview build/CI results and actual browser screenshots are required before production acceptance. Do not use copyrighted competitor brand/media/code.


## 2026-10-22 screenshot-driven correction (supersedes earlier color/layout interpretation)

Confirmed from user-supplied desktop screenshot: cinematic blue cloud/city hero, white ecosystem panel overlapping hero, light corporate solution/product grids, green CTAs and dark corporate footer. Implemented separately in HomeSpotlight.tsx and reference-3.css.

- **Typography:** Inter (body and controls, 300–700), Manrope (headings, 400–700), using user-supplied Google Fonts v20 WOFF2 files with swap loading. Alternative fallbacks are system sans-serif.
- **Evidence:** Full-page desktop screenshot supplied by the project owner. Colors are approximate sampled interpretations, not exact computed CSS. Direct reference CSS, screenshot filenames and assets were not downloaded to GitHub.
- **Photography/UI licensing:** UI preview components are our own CSS/React illustrations; Pexels images remain in their original license-tracked source map and competitor screenshots are not reused in code.
- **QA:** GitHub Actions runs structural regression tests, TypeScript, ESLint, Next.js build and 78 routes × six screen widths, plus full-page screenshots for six homepages and three matching interior pages. No claim about mobile fidelity to competitors whose screenshots were desktop-only.
