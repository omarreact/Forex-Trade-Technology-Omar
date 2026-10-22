# Forex Trade Technology — Dense Professional Layout v4

This site is generated from three versioned source files under `site-data/`: `site.config.json`, `theme.styles.json`, and `pages.content.json`. They are the source of truth, separate from components.

## Layout rules

- Use `section.layout` and `preferredRender`; don't infer layouts randomly.
- Section padding: `clamp(48px, 5.5vw, 72px)`. Card gap: 16px. Auto card height. Avoid unnecessary minimum heights and empty gaps.
- `cardGrid2`, `cardGrid3`, `cardGrid4`: turn H3 content groups into compact equal cards with icons or small thumbnails; preserve every paragraph.
- `stack`: max-width 720px prose. Never float a decorative image beside short copy.
- `mediaBand`: full-width 280–360px editorial image between sections; resolve imageKey through `theme.assets.images`.
- `trustStrip`: compact icons and labels. `ctaBand`: broad dark/lime CTA, optional low-opacity background imagery.
- `faqAccordion`: full-width accordions, **never** a decorative side image.
- Home only: 5 different carousel images, autoplay every 6 seconds, arrows/dots, accessible pause/focus, height `clamp(480px,62vh,640px)`.
- Interior: 240px breadcrumb header, **never** a second oversized hero.
- No trailing slash redirect loops: `/faq`, `/contact` and original nested URLs stay canonical.

## Fidelity

All 13 pages, full original Google Docs prose, FAQs (42 in FAQ page), SEO, source image keys and route map must remain intact. Don't replace the copy with summaries, truncate H2/H3 or remove disclaimers.

## Visual QA

Check desktop and mobile, especially homepage, brokerage setup, FAQ and contact. Verify there are no lonely right-side stock photos, forced tall gaps, cropped copy, horizontal scrolling, empty cards, overlapping slider controls or broken routes. Keep form functional, navigation keyboard-accessible, proper headings and alt text, and view-transition behavior respectful of reduced-motion preferences.

Run `npm run validate:data`, `npm run build`, and route/visual checks before promoting production.