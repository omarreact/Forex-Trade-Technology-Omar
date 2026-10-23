# Forex Trade Technology v5 — No Repeated Section Designs

## Non-negotiable visual rules

1. Every top-level \`section.layout\` appears **at most once on the same page**. No two consecutive layouts are identical.
2. Render \`section.layout\`, not just \`section.type\`. Supported: \`iconRow\`, \`cardGrid2\`, \`cardGrid3\`, \`stack\`, \`mediaBand\`, \`timeline\`, \`splitContent\`, \`darkBand\`, \`gallery3\`, \`faqAccordion\`, \`ctaBand\` and \`statsRow\`.
3. All service pages use a 240px breadcrumb header. The homepage alone uses a five-slide image carousel with 6-second autoplay, navigation arrows and keyboard-friendly controls.
4. Never float one lonely image beside short text. Media bands are full width (~300px); galleries have three equal photos; cards are equal-width, compact and use icons.
5. Vertical section padding 48–72px, gaps 16–20px, auto height, copy prose capped around 720px. FAQ has no decorative side image.
6. One closing CTA at the bottom of each page, and exact canonical URLs with no trailing slash.
7. Maintain the original Google Doc copy. The v5 curated layouts show only selected H2 sections, but \`pages.content.json\` includes **fullBlocks** with all source paragraphs and H3s. Before the closing CTA, the renderer must display every block not already shown, in a single accessible "Detailed guidance" disclosure panel. Don't drop content to achieve layout variety.
8. Keep SEO metadata, contact form, scroll-to-top, accessibility, mobile responsive layouts, and reduced-motion behavior.

## QA required

- \`npm run validate:data\` succeeds with 13 pages, 87 unique top-level layouts, 42 FAQs, 11 full-width image bands and 26 image assets.
- Check routes \`/\`, \`/solutions/brokerage-setup\`, \`/products/forex-crm\`, \`/faq\`, \`/contact\`. Old short aliases must redirect without loops.
- Verify every original \`fullBlocks\` text fragment is either in the selected visible section, or displayed by "Detailed guidance", including all FAQ responses.
- Check for overlap, large blank areas, image ratios, keyboard navigation, skip link, form submit error/success and responsive layout at mobile/tablet/desktop.
- Don't claim visual QA or an email-delivery test without testing them.
