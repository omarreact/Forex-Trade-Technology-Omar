# Forex Trade Technology — Global Design System
Updated: 25 October 2026

## Source of truth
- **Config:** `site-data/theme.styles.json` → `tokens`, `cssVariables`
- **Global site/content:** `site-data/site.config.json` → `footer`, `footer.cta`
- **Base CSS:** `app/new-theme.css`
- **Final CTA and footer:** `app/global-cta-footer.css`
- **Reference typography + FAQ:** `app/clean-reference.css`, `app/faq-polish.css`
- **Responsive layout:** `app/responsive-polish.css`
- **Shared CTA React component:** `components/new-theme/FinalCTA.tsx`
- **Shared footer React component:** `components/new-theme/SiteFooter.tsx`

The final CTA is now **a single site-wide component**, rendered exactly once as the last section in `PageRenderer`, immediately before the global footer. Its **copy and link are configured once** in `site.config.json`, not copied from individual page sections. The home version uses the exact same text and destination but adds an ornamental connected-systems visual. No page has a second local CTA. Existing detailed page content, technical guides, notes, and single H1 headings remain.

## Colors — canonical brand tokens

| Role | Token / CSS variable | Value |
|---|---|---|
| Main text | `--bs-ink` | `#161816` |
| Dark surfaces | `--bs-dark` | `#141613` |
| Deep dark | `--bs-deep` | `#101210` |
| Accent soft lime | `--bs-lime` | `#d8e9a2` |
| Accent hover/strong | `--bs-lime-strong` | `#c3d982` |
| Light stone | `--bs-stone` | `#f4f5f0` |
| White surface | `--bs-white` | `#ffffff` |
| Muted text | `--bs-muted` | `#767970` |
| Neutral border | `--bs-border` | `#dedfd8` |
| Actual footer surface | `--ftt-footer-bg` | `#10130f` |

### Global CTA colors

| Use | Hex |
|---|---|
| CTA primary panel background | `#e8f1d8` |
| CTA panel gradient end | `#f3f8e9` |
| CTA outer surface | `#f8faf5` |
| CTA panel border | `#d1e3b7` |
| CTA heading / text | `#172118` |
| CTA description | `#45543f` |
| CTA kicker/accent | `#63842f` |
| CTA button background | `#1b281c` |
| CTA button text | `#ffffff` |
| CTA button hover | `#344a28` |
| Home gradient start | `#e5f0c9` |
| Home gradient end | `#f3f8e9` |
| Home system-diagram background | `#1d2b1b` → `#101a12` |
| Footer text | `#f6f8f0` |

### Existing specific UI state colors
- Navigation hover: ink `#3b551d`, background `#f3f8e7`
- Navigation active: ink `#24350f`, background `#e7f1c7`, accent line `#6f922b`
- FAQ text ink: `#1a2118`; muted answer: `#52614f`
- FAQ open-state text: `#3f571e`; open-state surface `#f5f8ee`
- FAQ divider: `#dce5d8`
- Section tint/background: `#f8faf7` / `#f4f5f0`

## Typography — effective system

| Element | Family | Size | Weight | Line height / tracking |
|---|---|---|---|---|
| Body | Inter | `clamp(14px, calc(13.427px + .179vw), 16px)` | 400 | 1.65 |
| Display headings | Manrope (Inter fallback) | context-dependent | 600–700 | 1.04–1.16, negative tracking |
| Hero title (home) | Manrope | `clamp(27px, min(5.3vw, 7svh), 70px)` | 600–700 | 1.09, `-.052em` |
| Inner-page H1 | Manrope | `clamp(27px, 3.25vw, 43px)` | 600 | ≈1.12, `-.045em` |
| H2 general / section titles | Manrope | `clamp(30px, calc(21.2px + 1.72vw), 46px)` | 600 | 1.1, `-.045em` |
| Card H3 | Manrope | `1.25rem` (20px at default root) | 600 | 1.25, `-.025em` |
| Kicker / eyebrow | Inter | 11–12px | 800 | 1.4, +.12em to +.15em |
| Breadcrumb | Inter | 12–13px desktop; ≈10px mobile | medium | Muted |
| CTA heading / all inner pages | Manrope | `clamp(30px, 3.65vw, 51px)` | 700 | 1.12, `-.047em` |
| CTA heading / homepage | Manrope | `clamp(35px, 4.6vw, 64px)` | 700 | 1.12, `-.052em` |
| CTA description | Inter | `clamp(14px, 1.15vw, 16px)` | 400 | 1.72 |
| CTA button | Inter | 14px | 750 | 1.25 |
| Footer column headings | Inter | 13px | 800 | regular |
| Footer links | Inter | 12px | regular | regular |

Font import: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap`.

**Note:** Older CSS and JSON still contain some inherited aliases (e.g. earlier 17px body or 1210px vs 1180px helper widths). The values above describe the updated config and the high-priority site CSS. Responsive selectors or individual component declarations may specialize them.

## Spacing & dimensions

| Role | Effective token / value |
|---|---|
| Primary container | `--bs-shell: min(1210px, calc(100% - 88px))` from runtime JSON on body |
| Desktop container gutters | 44px each when fluid |
| Mobile container gutters | 16px nominal at ≤767px; 14px at ≤390px in direct component CSS |
| Section padding | `--bs-section-y: clamp(48px, 5.5vw, 72px)` runtime token |
| Tight section padding | `clamp(36px, 4vw, 56px)` |
| Global block gap | 20–24px depending on section |
| Grid / card gap | 16px default; `clamp(14px,1.4vw,20px)` flexible card rows |
| Standard section heading bottom gap | approx. 22–35px |
| Base card rounding | `--bs-radius: 22px` |
| Small/medium/large/pill rounding | 8px / 13px / 18px / 100px |
| Inner page hero title band | 240px per page-header token |
| Homepage slider height | `85svh` with `85vh` fallback; no nested scroll |
| CTA outer vertical spacing | `clamp(36px, 5vw, 66px)` top / `clamp(44px, 5vw, 66px)` bottom |
| CTA panel padding | `clamp(30px, 4.2vw, 60px)` |
| CTA inner flex gap | `clamp(26px, 3vw, 46px)` |
| CTA panel radius | `clamp(18px, 2.2vw, 26px)` |
| CTA button minimum height | 52px |
| Footer top padding | `clamp(53px, 6vw, 79px)` |
| Footer columns spacing | `clamp(28px, 5vw, 70px)` column and 35px row |
| Footer bottom padding | 20–25px |
| Carousel/animated SVGs | Honor `prefers-reduced-motion` |

## CTA and footer usage

- **All pages:** same title, description, action and background palette from shared configuration.
- **Homepage:** same CTA with an extra dark connected-systems diagram, a brighter sage background gradient and a larger headline.
- **Internal pages:** elegant one-column copy and CTA with a subtle ring watermark; no clutter or blank second column.
- **Footer:** single `SiteFooter` from `app/layout.tsx` across all pages. Footer continues to use dark `#10130f` and consistent site navigation.

## QA expectations

`scripts/responsive-smoke.mjs` checks 13 routes at 320, 360, 390, 430, 768, 1024, 1440 and 1920px (104 checks). It now additionally asserts exactly **one final CTA and footer per page**, checks identical CTA title and button, the homepage-only visual treatment, no horizontal overflow, no nested banner scrolling and FAQ spacing/colors.

The GitHub workflow produces screenshots of the home and FAQ CTA at 390px and 1440px, and writes a `report.json` artifact. Passing CI validates its implemented checks but is not a replacement for Safari/Firefox and physical-device QA.
