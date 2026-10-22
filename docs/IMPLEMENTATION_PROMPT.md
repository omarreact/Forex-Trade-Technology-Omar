# Prompt: Implement Forex Trade Technology Next.js site from JSON (v3)

You are implementing a production Next.js (App Router) website for **Forex Trade Technology** using three JSON files. Do not invent alternate brand names. Keep the Lime Fintech visual language (dark greens, lime #d9f17a accents).

## Source files (required)

1. `site.config.json` — site meta, **routing paths** (no trailing slash), main nav, footer, feature flags (slider, pageHeader, scrollToTop, view transitions).
2. `theme.styles.json` — design tokens, CSS variables, component specs, **image library** (`assets.images`), icons (NextIcons), Magnific-style element flags.
3. `pages.content.json` — **full Google Doc content** for 13 pages, plus media layout instructions.

## Critical product rules

### 1. Routing (fix redirect loops)
- Use exact paths from `site.config.json → routing.paths`.
- **No trailing slashes** (`trailingSlash: false`).
- Especially fix `/faq` and `/contact` so they do not redirect to themselves.
- Canonical path per page = `page.seo.canonicalPath`.

### 2. Home page only: full-width hero slider
- When `page.pageTop.variant === "homeSlider"`, render a **full-viewport-width** slider.
- Slides come from `page.pageTop.slides[]` (`imageKey`, title, subtitle, kicker, cta).
- Resolve each `imageKey` with `theme.styles.json → assets.images[imageKey].url`.
- Autoplay interval = `page.pageTop.intervalMs` (default 6000). Pause on hover.
- Overlay text on dark gradient; primary CTA button lime.
- Use CSS view transitions / cross-fade (`viewTransitions.slider`).

### 3. All other pages: 300px page title bar (NOT a tall banner)
- When `page.pageTop.variant === "pageHeader"`:
  - Height **300px** (`theme.tokens.innerHeaderHeight`).
  - Show **breadcrumbs** from `page.pageTop.breadcrumbs`.
  - Show kicker + H1 title + short subtitle.
  - Optional background from `page.pageTop.backgroundImageKey` with dark overlay.
- Do **not** reuse the home full-height slider on inner pages.

### 4. Images on every page (mandatory)
- Almost every section should use `section.media.imageKey` + `section.media.layout`.
- Layouts to implement:
  - `splitLeft` / `splitRight` — text + large photo
  - `cardThumb` — image on top of cards
  - `fullBleed` — wide image band
  - `gridGallery` — multi-image grid
  - `backgroundWash` — subtle section background image
- **Only** use URLs from `theme.styles.json → assets.images` (Pexels / Unsplash). Do not download and rehost unless needed for performance; remote CDN URLs are intentional.
- Use `loading="lazy"` except for the first slider slide / pageHeader image (`priority` / `fetchPriority=high`).
- Always set meaningful `alt` from the image object.

### 5. Content fidelity
- Prefer rendering `page.fullBlocks` (ordered H2/H3/p) for long-form accuracy **or** `page.sections` with all nested paragraphs.
- FAQ: render **all** items in `faqAccordion.items` (source has 42 questions). Do not truncate.
- Keep CTAs, trust strips, and closing `darkCta` sections.
- SEO: set `<title>` and meta description from `page.seo`.

### 6. Global chrome
- Sticky header from `site.navigation` (Solutions dropdown with all 8 children).
- Footer from `site.footer`.
- **Scroll-to-top** button from `site.features.scrollToTop` + `theme.components.scrollToTop`.
- Icons: map `icon` string keys via `theme.assets.icons` → NextIcons (https://www.nexticons.com/).
- Optional Magnific-inspired decorative orbs/grid only if they do not hurt performance.

### 7. View transitions
- Enable Next.js view transitions where supported (see https://nextjs.org/docs/app/guides/view-transitions).
- Names: page, slider, section, card as in theme JSON.

### 8. Accessibility & quality
- Keyboard-operable slider and FAQ accordion.
- Visible focus states (lime outline).
- Forms on contact: fields from contact section; client-side validation; no fake success if API missing.
- Mobile: collapse nav; stack split layouts; slider content readable on small screens.

### 9. What “done” means
- [ ] Home full-width multi-image slider works
- [ ] Inner pages use 300px header + breadcrumbs only
- [ ] /faq and /contact load (no redirect loop)
- [ ] Every major section shows relevant images
- [ ] Full doc text present (not the old short summaries)
- [ ] All 13 routes in main menu + footer
- [ ] Scroll-to-top visible after scroll
- [ ] SEO titles/descriptions set

## Implementation sketch

```tsx
// Resolve image
const img = theme.assets.images[imageKey];

// Home
if (page.pageTop?.variant === 'homeSlider') return <HomeSlider slides={page.pageTop.slides} />;

// Inner
if (page.pageTop?.variant === 'pageHeader') return <PageHeader {...page.pageTop} />;

// Section media
<Section layout={section.media?.layout} image={theme.assets.images[section.media.imageKey]}>
  ...content from section.blocks or section.items
</Section>
```

## Do not
- Do not replace full content with short marketing blurbs.
- Do not put tall heroes on every page.
- Do not use random external image hosts outside the JSON library without adding them to `theme.assets.images`.
- Do not enable trailing-slash redirects that conflict with existing routes.

Build the complete App Router structure (`app/(marketing)/...`) consuming these three files as the single source of truth.