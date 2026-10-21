# Design 2 — matchtrade

**Reference:** https://match-trade.com/  
**Audit date:** 2026-10-21  
**Implementation:** app/design-2-matchtrade.css  
**Method:** Inspected published page text/navigation via web and, when available, public screenshot search results. The site browser connector was inaccessible, so computed CSS, live viewport captures, and precise source font-family names **could not be verified**. Token values below are **implemented colors**, not copied or measured reference styles.

## Reference observations
Reference has product-first nested navigation, ecosystem/product lists and a platform-first explanation. Bright tech screenshot of Match-Trader front page is corroborating visual material.

## Implemented visual system

- **Typography:** Arial, Helvetica, sans-serif (implemented; reference computed font not verified). Titles use adaptive clamp sizing with compressed tracking, body copy remains readable.
- **Primary / secondary / accent:** #45BED7, #DFF8FF, #199AB1. Background #FAFCFD; foreground #101F2E.
- **Header / dropdowns:** Horizontal white header, inline Products/Solutions dropdowns and a pill contact link. Native disclosure/Next.js links on approved pages; mobile control is horizontally accessible.
- **Hero:** Static copy-left/photo-right with overlapping floating product panels; not Design 1 slider.
- **Section order / grouping:** Bright dual-column product-first homepage with hover panel and asymmetric engineering photography. Complete approved content is sourced from the central 13-page manifest; grouping may differ without rewriting content.
- **Container / grid:** Floating wide content grids; source chapters in split media modules; 3 product tiles. Width controls are defined in app/design-2-matchtrade.css and are responsive; no empty fixed-width sidebar on content sections.
- **Photography:** Pexels trading tech in long oval-arch cuts, floated mini status panels; no grouped gallery. Pexels source IDs, alt text and attribution remain in `lib/pexels-photos.ts`; users see only appropriately described photos.
- **Button design:** Cyan rounded pills and light outline button.
- **CTA immediately before footer:** Two-part dark-teal text panel and photographic panel. Action links lead to the matching design's approved contact route (Design 1 uses the canonical contact route).
- **Footer:** Light blue-gray four-column corporate product directory; all links remain within the approved site pages.
- **Responsive:** Header becomes scrollable nav, photo below copy, split stories stack. Planned verification widths: 360, 390, 768, 1024, 1280, 1440px.
- **Animation:** Hover on CTA and photo overlay; reduced-motion overrides.
- **Difference from Design 1:** Unlike Design 1, cyan/white product UI and split hero, no full-width slider.

## Verification limitations
Reference screenshots and exact computed CSS/fonts were **not directly captured** in this session. Treat the reference similarities as verified at a *conceptual/content level*, not pixel-matched. The repo preview build/CI results and actual browser screenshots are required before production acceptance. Do not use copyrighted competitor brand/media/code.
