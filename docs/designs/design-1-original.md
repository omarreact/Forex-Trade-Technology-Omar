# Design 1 — original

**Reference:** https://forextrade.pincodeit.com/  
**Audit date:** 2026-10-21  
**Implementation:** app/home-polish.css + app/design-1-original-cta.css  
**Method:** Inspected published page text/navigation via web and, when available, public screenshot search results. The site browser connector was inaccessible, so computed CSS, live viewport captures, and precise source font-family names **could not be verified**. Token values below are **implemented colors**, not copied or measured reference styles.

## Reference observations
Existing deployed site and source Gutenberg HTML are the baseline; pixel preservation except targeted fixes.

## Implemented visual system

- **Typography:** Existing Tailwind/theme default sans-serif; no font-family change. Titles use adaptive clamp sizing with compressed tracking, body copy remains readable.
- **Primary / secondary / accent:** #17241A, #F6F7F2, #D9F17A. Background #FFFFFF; foreground #192219.
- **Header / dropdowns:** Original sticky SiteHeader navigation with Solutions/Products dropdowns. Native disclosure/Next.js links on approved pages; mobile control is horizontally accessible.
- **Hero:** Existing full-panel sliding photographic banner.
- **Section order / grouping:** Original full-panel photo slider + editorial Gutenberg sections. Complete approved content is sourced from the central 13-page manifest; grouping may differ without rewriting content.
- **Container / grid:** Source original editorial sections, established grid layouts and preserved style. Width controls are defined in app/home-polish.css + app/design-1-original-cta.css and are responsive; no empty fixed-width sidebar on content sections.
- **Photography:** Existing source-backed editorial photos and Pexels media. Pexels source IDs, alt text and attribution remain in `lib/pexels-photos.ts`; users see only appropriately described photos.
- **Button design:** Lime/dark circular CTAs.
- **CTA immediately before footer:** Full-width dark green original-brand banner. Action links lead to the matching design's approved contact route (Design 1 uses the canonical contact route).
- **Footer:** Original SiteFooter, navigation preserved; all links remain within the approved site pages.
- **Responsive:** Preserve original hero; collapse empty legacy rail. Planned verification widths: 360, 390, 768, 1024, 1280, 1440px.
- **Animation:** Original slider + reduced-motion support.
- **Difference from Design 1:** Baseline style is untouched except required footer CTA and article rail repair.

## Verification limitations
Reference screenshots and exact computed CSS/fonts were **not directly captured** in this session. Treat the reference similarities as verified at a *conceptual/content level*, not pixel-matched. The repo preview build/CI results and actual browser screenshots are required before production acceptance. Do not use copyrighted competitor brand/media/code.


## 2026-10-22 screenshot-driven correction (supersedes earlier color/layout interpretation)

Design 1 remains the source-Gutenberg editorial design with compact full-panel slider, full-width content sections, capped photography and image lightbox. The homepage and interiors now use Inter body and Manrope headings. No empty fixed article rails.

- **Typography:** Inter (body and controls, 300–700), Manrope (headings, 400–700), using user-supplied Google Fonts v20 WOFF2 files with swap loading. Alternative fallbacks are system sans-serif.
- **Evidence:** Full-page desktop screenshot supplied by the project owner. Colors are approximate sampled interpretations, not exact computed CSS. Direct reference CSS, screenshot filenames and assets were not downloaded to GitHub.
- **Photography/UI licensing:** UI preview components are our own CSS/React illustrations; Pexels images remain in their original license-tracked source map and competitor screenshots are not reused in code.
- **QA:** GitHub Actions runs structural regression tests, TypeScript, ESLint, Next.js build and 78 routes × six screen widths, plus full-page screenshots for six homepages and three matching interior pages. No claim about mobile fidelity to competitors whose screenshots were desktop-only.
