# Design 6 — uptrader

**Reference:** https://uptrader.io/  
**Audit date:** 2026-10-21  
**Implementation:** app/design-6-uptrader.css  
**Method:** Inspected published page text/navigation via web and, when available, public screenshot search results. The site browser connector was inaccessible, so computed CSS, live viewport captures, and precise source font-family names **could not be verified**. Token values below are **implemented colors**, not copied or measured reference styles.

## Reference observations
Reference emphasizes Forex CRM and brokerage operations, product categories and direct contact action; visible screenshot features generous light-space and blue-highlighted text.

## Implemented visual system

- **Typography:** Trebuchet MS, Arial, Helvetica, sans-serif (implemented; reference computed font not verified). Titles use adaptive clamp sizing with compressed tracking, body copy remains readable.
- **Primary / secondary / accent:** #08AACF, #B0E8E7, #1484A1. Background #F7F7F3; foreground #202A30.
- **Header / dropdowns:** Short white header with narrow Products/Solutions dropdowns and quiet outline contact action. Native disclosure/Next.js links on approved pages; mobile control is horizontally accessible.
- **Hero:** Static copy-left with a three-tile photographic bento right.
- **Section order / grouping:** Friendly warm SaaS editorial, human-focused bento hero with two photographs and a statement tile. Complete approved content is sourced from the central 13-page manifest; grouping may differ without rewriting content.
- **Container / grid:** Pastel product cards, alternating story text/media, occasional full-span editorial photos. Width controls are defined in app/design-6-uptrader.css and are responsive; no empty fixed-width sidebar on content sections.
- **Photography:** Soft natural-light workspaces and operations photos in asymmetric arch/bento crops. Pexels source IDs, alt text and attribution remain in `lib/pexels-photos.ts`; users see only appropriately described photos.
- **Button design:** Bright ocean-blue capsule CTA.
- **CTA immediately before footer:** Full-bleed photograph with blue gradient scrim and oversized type. Action links lead to the matching design's approved contact route (Design 1 uses the canonical contact route).
- **Footer:** Soft pale-teal three-column editorial directory; all links remain within the approved site pages.
- **Responsive:** Friendly bento keeps two mini tiles while content stories collapse to full width. Planned verification widths: 360, 390, 768, 1024, 1280, 1440px.
- **Animation:** Simple hover actions and reduced-motion overrides.
- **Difference from Design 1:** Warm pastel human/team photography and bento collage rather than technical charts.

## Verification limitations
Reference screenshots and exact computed CSS/fonts were **not directly captured** in this session. Treat the reference similarities as verified at a *conceptual/content level*, not pixel-matched. The repo preview build/CI results and actual browser screenshots are required before production acceptance. Do not use copyrighted competitor brand/media/code.


## 2026-10-22 screenshot-driven correction (supersedes earlier color/layout interpretation)

Confirmed from user-supplied screenshot: white/blue CRM product-led hero with large dashboard, mobile software panel, sequential workflow explanation and alternating software feature showcases. Implemented separately in HomeSpotlight.tsx and reference-6.css.

- **Typography:** Inter (body and controls, 300–700), Manrope (headings, 400–700), using user-supplied Google Fonts v20 WOFF2 files with swap loading. Alternative fallbacks are system sans-serif.
- **Evidence:** Full-page desktop screenshot supplied by the project owner. Colors are approximate sampled interpretations, not exact computed CSS. Direct reference CSS, screenshot filenames and assets were not downloaded to GitHub.
- **Photography/UI licensing:** UI preview components are our own CSS/React illustrations; Pexels images remain in their original license-tracked source map and competitor screenshots are not reused in code.
- **QA:** GitHub Actions runs structural regression tests, TypeScript, ESLint, Next.js build and 78 routes × six screen widths, plus full-page screenshots for six homepages and three matching interior pages. No claim about mobile fidelity to competitors whose screenshots were desktop-only.
