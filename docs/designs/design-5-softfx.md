# Design 5 — softfx

**Reference:** https://www.soft-fx.com/  
**Audit date:** 2026-10-21  
**Implementation:** app/design-5-softfx.css  
**Method:** Inspected published page text/navigation via web and, when available, public screenshot search results. The site browser connector was inaccessible, so computed CSS, live viewport captures, and precise source font-family names **could not be verified**. Token values below are **implemented colors**, not copied or measured reference styles.

## Reference observations
Reference publicly displays trading software and solutions/product ecosystem with multi-level category navigation; screenshot shows black/green high-contrast theme.

## Implemented visual system

- **Typography:** system-ui, -apple-system, Segoe UI, Arial (implemented; reference computed font not verified). Titles use adaptive clamp sizing with compressed tracking, body copy remains readable.
- **Primary / secondary / accent:** #0B1010, #182A1B, #A9F06A. Background #090E0B; foreground #EDF6EE.
- **Header / dropdowns:** Dark two-row header with service navigation, top status/integration positioning. Native disclosure/Next.js links on approved pages; mobile control is horizontally accessible.
- **Hero:** Split headline and native-CSS technical infrastructure topology illustration.
- **Section order / grouping:** Precise developer/engineering system: upper logo rail, secondary navigation, graphic system diagram. Complete approved content is sourced from the central 13-page manifest; grouping may differ without rewriting content.
- **Container / grid:** Interleaved source-backed module paragraphs, full-width infra photos and thin-lime outlines. Width controls are defined in app/design-5-softfx.css and are responsive; no empty fixed-width sidebar on content sections.
- **Photography:** Real server-room and infrastructure photo strips, no glossy rounded gallery. Pexels source IDs, alt text and attribution remain in `lib/pexels-photos.ts`; users see only appropriately described photos.
- **Button design:** Green square rounded CTA.
- **CTA immediately before footer:** Lime-toned photo/text technical callout, flush to dark footer. Action links lead to the matching design's approved contact route (Design 1 uses the canonical contact route).
- **Footer:** Charcoal engineering specification footer with slash-prefixed groups; all links remain within the approved site pages.
- **Responsive:** Diagram shrinks to card; units reflow into meaningful single-column content. Planned verification widths: 360, 390, 768, 1024, 1280, 1440px.
- **Animation:** Small hover/diagram transitions; reduced-motion overrides.
- **Difference from Design 1:** Systems diagram and technical documentation feel, distinct from violet/photo/editorial.

## Verification limitations
Reference screenshots and exact computed CSS/fonts were **not directly captured** in this session. Treat the reference similarities as verified at a *conceptual/content level*, not pixel-matched. The repo preview build/CI results and actual browser screenshots are required before production acceptance. Do not use copyrighted competitor brand/media/code.
