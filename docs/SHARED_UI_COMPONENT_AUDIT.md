# Shared UI component audit and consolidation
Date: 2026-10-26
Repository: omarreact/Forex-Trade-Technology-Omar
Scope: All 13 route definitions in `site-data/pages.content.json`, plus actual `PageRenderer` dispatch and shared components.

## Source-level inventory

**87 configured sections on 13 pages**, grouped by their original content layout keys:

| Original layout key | Section occurrences | Shared rendering pattern |
|---|---:|---|
| `cardGrid2` | 12 | IconCard + SectionHeading |
| `cardGrid3` | 11 | IconCard + SectionHeading |
| `timeline` | 12 | Shared cards where topic blocks exist; VisualStorySection where they do not |
| `darkBand` | 12 | Shared dark IconCard or VisualStorySection |
| `stack` | 12 | Shared VisualStorySection heading, narrative and contextual illustration |
| `ctaBand` | 13 | One shared FinalCTA rendered once at the end of each page |
| `mediaBand` | 11 | Homepage image title band retained; 10 internal bands excluded |
| `iconRow` | 1 | Full-width TrustCarousel |
| `gallery3` | 1 | Gallery with shared SectionHeading |
| `faqAccordion` | 1 | FAQ with shared SectionHeading and isolated accordion styling |
| `splitContent` | 1 | Contact form with site-specific form layout |
| **Total** | **87** | |

The number of configured sections is not the count of DOM sections: internal image bands and source CTA bands are intentionally filtered, and the main renderer can choose a special component by section title.

## Duplicated component designs found

1. Heading typography was duplicated across `PageRenderer` section headings, `FeatureFlexSection`, `AudienceCarousel`, `VisualStorySection`, `PageHeader`, FAQ, gallery and supplementary guide.
2. Boxes used at least three card class families: `bs-v5-card`, `bs-feature-flex-card`, and `bs-audience-icon-card`, all backed by `IconCard` for some routes but with competing CSS. Step and dark feature cards still used plain article markup.
3. The hero copy was a full-width shell with separately sized heading/description; there was no independent width contract for desktop copy.
4. Earlier layout/CSS files contained historical variants and overrides from multiple iterations. The active route now has a single high-priority shared style file. Historic variants remain in the repository but should not be individually restyled.

## Reusable component contracts

### `SectionHeading` — `components/new-theme/SectionHeading.tsx`

Accepts `title`, optional `subtitle`, `kicker`, `children` and optional semantic `h1`/default `h2`, plus compatible class hooks. Used by:
- Regular card, timeline and dark-band section headers
- FeatureFlexSection and AudienceCarousel
- Gallery, FAQ and technical guide
- VisualStorySection
- Inner PageHeader (single H1)
- Previously created editorial variants in PageRenderer

**Light-surface defaults from the six attached screenshots:** kicker 11px, Inter, 800, #637D2B; section H2 up to 46px, Manrope, 600, #161816, line-height 1.12; subtitle 15px, Inter, 400, #4C5C53, line-height 1.7. On phones, section H2 scales down to 28–39px. Dark backgrounds invert text contrast through a scoped variant.

### `IconCard` — `components/new-theme/IconCard.tsx`

Accepts `icon`, optional `title`, `description`, `paragraphs[]`, optional additional children, and layout-only `className`.
- Icon badge: 46 × 46px, background #D8E9A2, foreground #161816
- Decorative background/watermark: same icon, no repeated accessibility announcement
- Title: Manrope 23px maximum, 600, #161816, line-height 1.25
- Description: Inter 14px, 400, #4C5C53, line-height 1.72
- Card title / body margin: 11px
- Icon-to-title margin: 24px desktop; 20px mobile
- Card padding: `clamp(20px, 2.2vw, 27px)`, rounded 18px
- Dark feature cards retain same typography and icon badge size but invert title/body colors

Used for `cardGrid2`, `cardGrid3`, special infrastructure/benefit sections, audience carousel and the timeline/dark-band cards with individual topics. Flexbox wrap fills partial last rows.

### `HomeSlider` copy slot

The full-width slider image, overlay, dots and autoplay remain unchanged. A nested `bs-slide-content` wrapper controls the text width:
- Desktop ≥1024px: 60% of the standard content shell
- Tablet 768–1023px: 78%
- Mobile ≤767px: 100%
- No nested scrollbar; mobile height remains `clamp(430px, 68svh, 570px)`, with the existing very-short-viewport adjustment

## Config and CSS source of truth

- Semantic components: `components/new-theme/SectionHeading.tsx`, `IconCard.tsx`
- Unified final CSS priority: `app/component-system.css`, imported last in `app/layout.tsx`
- JSON token metadata: `site-data/theme.styles.json`
- Content data: `site-data/pages.content.json`
- Existing shared footer/CTA remain controlled by `SiteFooter` and `FinalCTA`

## Production checks

`scripts/responsive-smoke.mjs` now measures computed typography and badge color/size, validates the ratio of banner copy width to slide shell, and keeps earlier checks for H1 counts, no horizontal overflow, carousel presence, FAQ readability and common CTA/footer.

The test matrix uses Chromium at 320, 360, 390, 430, 768, 1024, 1440 and 1920px on all 13 routes. This does **not** verify actual Firefox/iOS Safari rendering or prove perfect visual alignment by itself.

## Forward development standard

For a new titled section:
```tsx
<SectionHeading title={section.title} subtitle={section.description} />
```

For a reusable service card:
```tsx
<IconCard icon={section.icon} title={section.title} description={section.description} />
```

Use props or source JSON to change content, and use layout wrappers only to arrange components. Do not introduce per-page H2, H3, badge, or paragraph colors/sizes. Preserve one H1 per route.
