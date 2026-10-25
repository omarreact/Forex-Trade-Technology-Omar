# Site-wide UI audit — 25 October 2026

## Scope and sources
- Audited all 13 defined pages and their source section layouts in `site-data/pages.content.json`.
- Reviewed four supplied desktop screenshots showing empty right columns, dark text-only bands, contact audiences and an overly narrow supplementary FAQ.
- Used connected browser text for a currently open Forex Trade Technology tab to check rendered section labels and identify leaked source-document metadata.
- Reviewed publicly available 2026 B2B and W3C accessibility guidance for meaningful visuals, heading hierarchy, responsive reflow and adequate whitespace.
- **Limitations:** Vercel's production build verifies compilation/deployment, not cross-browser visual integrity, accessibility conformance, media availability, forms, or Core Web Vitals. The connected browser read-only interface cannot perform a comprehensive viewport-by-viewport interaction suite.

## Root causes identified
1. `V5SectionContent` used a 720px prose list inside a 1210px container with no other content beside it.
2. Several `darkBand` and `timeline` sections had only paragraphs, leaving the right side unoccupied.
3. The supplementary `V5Guide` was limited to 960px, with every accordion in a single column.
4. The homepage photo gallery and subsequent carousel duplicated the heading "Who We Work With".
5. Source-document metadata, including `Breadcrumb:` and `Label:`, leaked into displayed technical-guide content.
6. Sticky navigation could overlap in-page anchor targets; story photos required explicit layering.

## Changes delivered
- `components/new-theme/VisualStorySection.tsx`: shared full-width editorial panel. Reuses each page's existing factual text, its curated image reference, and content-grounded technology process labels. The story visual is complementary; decorative image alt is empty while labels are accessible as text.
- `components/new-theme/PageRenderer.tsx`: routes prose-only `stack`, `timeline` and `darkBand` sections through the reusable panel. Preserves the original text, H2/H3 hierarchy, CTA rendering, site routing, first H1 and structured home hero. Removes duplicated homepage gallery heading and filters source-only breadcrumb/label lines in supplemental accordions.
- `app/editorial-story.css`: a responsive two-column Flexbox system with alternating visual placements, wrapping single-column presentation at narrow widths, consistent dark/light contrasts, precise photo/overlay z-index order and no nested scrollbars. Technical guide accordion tiles use Flexbox and stretch to the available container width.

## Page coverage
| Page | Changed repeated sections / inherited improvements |
|---|---|
| Home | Unique gallery heading; other sections retain trust carousel, full-width banner and audience carousel |
| Brokerage Setup | "Who This Is For" full-width narrative plus launch process visualization; text-only timeline filled |
| MT5 White Label | Explanation and technology relationship shown with connected-system visual |
| Broker Hosting | Hosting reliability story and VPS distinction use diagrams and relevant infrastructure image |
| Liquidity & Connectivity | Explanation and connectivity-chain text now have balanced visual panels |
| Forex CRM | CRM introduction and workflow use right-hand visuals |
| KYC & AML | Verification introduction and process content balanced with document workflow visual |
| Payment Gateway | Payment-system explanation and flow narrative balanced with process visual |
| Prop Firm CRM & API | Evaluation operations explanation and supporting systems visual |
| How It Works | Text-only process timeline and launch guidance get full-width story compositions |
| About Us | "Who We Are" and "How We Work" no longer leave empty right-side columns |
| FAQs | Existing FAQ accordion preserved, supporting guide presentation remains reusable |
| Contact | "Who Should Get in Touch" becomes an actual icon checklist with contextual consultation visual; technical guide no longer shows source metadata |

## Explicit QA before treating this as visually signed off
- Desktop: 1440px, 1280px, 1024px. Mobile/tablet: 768px, 390px, 360px, 320px.
- Check DOM scrollWidth vs innerWidth at every route and width.
- Test expanded guide accordion wrapping, keyboard focus, all navigation links, slide controls, mobile menu and contact form submit/error states.
- Check external image load failures, image aspect crops, fonts and footer/CTA position.
- Verify first contentful paint, LCP, INP and CLS against production analytics or Lighthouse.
- WCAG reflow at 320 CSS pixels and 200% zoom plus keyboard/screen-reader spot checks.
- Confirm no secondary page H1 or missing heading-level hierarchy in rendered HTML.
- Check data source and actual product/technology claims with the business owner; visuals are conceptual illustrations, not proof of infrastructure or compliance.

## Design guidance
- W3C: https://www.w3.org/WAI/WCAG21/Understanding/reflow
- W3C: https://www.w3.org/WAI/WCAG2/supplemental/patterns/o2p03-page-structure/
- 2026 fintech editorial guidance: https://www.webstacks.com/blog/fintech-websites
