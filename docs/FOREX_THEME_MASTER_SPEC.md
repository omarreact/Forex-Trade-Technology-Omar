# Forex Trade Technology — Master UI Design System & Cross-Stack Specification

**Status:** canonical design reference for the production Next.js website and future WordPress Gutenberg/FSE parity  
**Design system ID:** `ftt-editorial-v1`  
**Last revised:** 2026-10-20  
**Project:** `omarreact/Forex-Trade-Technology-Omar`  
**Production:** `https://forextrade.pincodeit.com/`  
**Implementation paths:** `app/`, `components/`, `lib/`, `public/theme-assets/`  
**Original WP block theme:** `public/theme-extracted/forex-trade-technology/`  
**Authoritative content:** `public/theme-assets/content/pages/*.html` + `page-manifest.json`

> This is the design contract, not a claim of automatically pixel-perfect conversion. A WordPress port must implement these same tokens and components, then be visually compared at the specified breakpoints. Never overwrite or silently paraphrase the Google Doc–derived editorial content.

## 1. Brand and design principles

- **Positioning:** premium, engineering-led brokerage technology and financial infrastructure for businesses. Enterprise-credible rather than a retail trading app or a speculative investment/returns landing page.
- **Visual language:** charcoal/deep forest, off-white/stone, restrained lime, photographic realism, large readable headings, clear service CTAs, careful alignment and generous-but-controlled whitespace.
- **Photos:** real licensed editorial images only, currently externally served from Pexels URLs defined in `lib/pexels-photos.ts`; no AI-generated photography. Photos illustrate categories, **not** purported company staff, actual customers, platforms operated by us, real client performance, or certified facilities.
- **Do not display stock-platform branding, attribution buttons, supplier links or external-photo redirects on the customer-facing UI.** Keep source/licence traceability in code and the asset register. Do not remove a provider-required attribution if licences change.
- **No schematic diagrams in page banners.** Technical diagrams may remain in explanatory body sections if genuinely informative.
- **Content:** preserve all original headings, text, FAQs, URLs, SEO metadata, Gutenberg body semantics and actual contact details. Do not invent metrics, customers, regulatory authorizations, endorsements or case studies.
- **Effects:** restrained hover, crossfades, soft glass blur and optional desktop-only parallax. No loud kinetic effects, zoom that obstructs content, or autoplay when reduced-motion applies.

## 2. Color tokens

| Role | Token / equivalent | Hex / value | Usage |
|---|---|---|---|
| Brand dark | `--bs-dark` | `#141613` | WP base surfaces, footer ancestry |
| Brand ink | `--bs-ink` | `#161816` | Primary WordPress body text |
| Brand forest | `--ftt-brand-forest` | `#17251A` | Marketing deep green sections |
| Heading ink | `--ftt-brand-ink` | `#1B2B1E` | Dark body/heading text |
| Hero background | component | `#111F16` | Image loading fallback for full-width hero |
| Lime primary | `--bs-lime`, `--ftt-brand-lime` | `#D9F17A` | CTA emphasis, selected indicators |
| Lime hover | `--bs-lime-strong` | `#CDE760` | WordPress hover / primary action |
| White | `--bs-white` | `#FFFFFF` | Cards and text on dark surfaces |
| WP stone | `--bs-stone` | `#F4F5F0` | Theme FSE background |
| Editorial cream | `--ftt-brand-cream` | `#F6F8F2` | Next.js content background |
| Muted forest-gray | `--ftt-brand-muted` | `#5E6E60` | Supporting content |
| Subtle border | `--ftt-brand-border` | `#DFE8DA` | Panels and dividers |
| Editorial light | section | `#F5F8F0` | Light content sections |
| Link on cream | components | `#3D6D30` | Links / navigation |
| Dark overlay | full hero | `rgba(8,20,12,.98)` → `rgba(11,21,14,.35)` | WCAG-supporting image scrim |

**Gutenberg mapping:** `ink`, `dark`, `lime`, `stone`, `white` already exist in source `theme.json`. When porting, add separate `forest`, `cream`, `muted`, `border` colors with exactly these values; do not replace the original palette slugs or existing client branding without an explicit redesign approval.

**Contrast:** body text on cream must maintain at least WCAG AA 4.5:1; large headings 3:1. A photographic banner must have a resilient gradient behind copy even if the image changes. Test contrast on the actual image, not a blank frame.

## 3. Typography

- **Current production font stack:** `Arial, Helvetica, sans-serif` for Next.js marketing surfaces and WordPress theme; **no external hosted font dependency**.
- **Fallback:** browser/system sans-serif, matching typography metrics as closely as feasible.
- **Heading weights:** H1 800; H2 750–800; H3 700–800. CSS `font-weight:750` requires a font face that can resolve or approximate it; WordPress can use 700.
- **Body weights:** regular 400, emphasized 600, links/actions 700–800.
- **Desktop H1:** `clamp(44px, 5.8vw, 82px)` in full-width homepage hero; interior `clamp(36px, 4.4vw, 63px)`.
- **Mobile H1:** homepage `clamp(34px, 9vw, 46px)`, interior `clamp(33px, 8.5vw, 44px)`.
- **H2:** home editorial `clamp(33px, 3.8vw, 53px)`; interiors `clamp(30px, 3.6vw, 48px)`.
- **H3 / card:** typically 20–29px depending on density.
- **Body text:** 15–17px on editorial content; line-height 1.65–1.75.
- **Intro/deck:** 17–21px, line-height 1.5–1.7.
- **Eyebrow:** 10–11px, bold, uppercase and .10–.17em tracking.
- **Button label:** 12–14px, semibold/bold; mobile keep tap size >= 44px.
- **Headings:** negative letter-spacing around `-.04em` to `-.065em` and `text-wrap:balance` where supported.
- **Never bake text into photos**; visible text is semantic HTML/Gutenberg blocks so localization and accessibility remain possible.

## 4. Layout, grid, radius, density

| Element | Design contract |
|---|---|
| Content width | `860px` (native WordPress `theme.json` reading size) |
| Wide width | `1210px` (`theme.json` and React shared shell) |
| Edge gutters | desktop 36–44px; mobile 18–24px |
| Wide marketing hero | full-bleed 100% viewport width; maximum visual height ~870px; no diagrams |
| Standard section vertical padding | desktop 45–75px; mobile ~38–45px, with exceptions for full-bleed photos |
| Editorial inset photo | 35–45% width on wide screens with 20–28px text gap, 100% stacked on mobile |
| Center image | max 1020–1140px, responsive 16:9 to 4:3 as needed |
| Parallax | full-bleed photo, ~220–340px height; fixed background desktop, scroll mobile/reduced-motion |
| Blur background | image-size cover; 18–23px blur; 0.12–0.18 opacity; solid/light scrim behind text |
| Cards | 13–22px radius; soft forest-tinted borders; subtle shallow shadow |
| CTA/buttons | pill radius ~999px; minimum 44–54px height; primary forest or lime |
| Photography panels | 17–22px radius, `object-fit:cover`, meaningful alt text, natural crop |
| Footer | compact ~44px top and 19px bottom desktop; mobile ~37px; 3→2→1 column layout |
| Header | sticky / translucent white, dropdowns, mobile menu; no public admin/login controls |
| Breadcrumb | small 12px navigation above interior H1 |
| Related navigation | discreet dark panel after service content; should not crowd the conversion CTA |

**Responsive breakpoints:** 380px, 580/600/640/660px, 850/900/950/960px and 1024px are used across current CSS. For WordPress, consolidate to canonical bands: mobile `<= 640px`, tablet `641–960px`, desktop `>= 961px`, with layout-specific overrides for the navigation.

## 5. Reusable UI catalog

| System component | Production implementation | Gutenberg/FSE equivalent |
|---|---|---|
| Global header + dropdowns | `components/SiteHeader.tsx` | `parts/header.html` + core/navigation, or accessible block extension for menus |
| Full-width home slider | `components/home/HomeHero.tsx`, `app/home-fullwidth.css` | custom registered carousel block/pattern with per-slide media, Heading/Paragraph/Buttons, ARIA controls |
| Home service rail | `components/home/HomeCapabilityStrip.tsx` | core/group + core/columns + core/icon-compatible SVG or static inline SVG |
| Homepage editorial sections | `public/theme-assets/content/pages/home.html` + `lib/home-media.ts` | native core/group/heading/paragraph/image/cover, source content preserved |
| Interior chapter hero | `components/InteriorPageShell.tsx`, `lib/theme-media.ts` | core/group + core/columns + core/image or core/cover + responsive style variation |
| Interior media flow | `components/InteriorEditorialFlow.tsx`, `app/editorial-flow.css` | locked section patterns for image-left/right/center/background/parallax |
| Content feature/compare/timeline | `ftt-rd-section--*` source classes | keep original Gutenberg group/columns/details/list/card patterns; class and token parity |
| FAQ | native `<details>` via Gutenberg export | core/details in modern WordPress |
| Consultation | embedded form HTML | real WordPress form handler + anti-spam and consent; **not** a cosmetic port of a nonworking form |
| Footer | `components/SiteFooter.tsx`, `app/site-compact.css` | `parts/footer.html` and core/columns/navigation/paragraph |
| SEO | Next Metadata and page manifest | WP core title + explicit SEO extension mapping/field migration |
| Blog | `app/blog/`, WPGraphQL fallback currently exists | Query Loop + Post Template + author/date terms; connect to real WordPress before declaring complete |

### UI element checklist

- Navigation: logo wordmark, site links, dropdowns, keyboard focus, hamburger with overlay, active states, no authentication CTAs.
- Hero: H1, eyebrow, lead, supporting description, two CTAs, background photo, gradient/scrim, 3 slides, dots, arrows, swipe support, reduced-motion pauses, visibility pause.
- Cards: icon, category eyebrow, heading, description, single relevant link, hover/focus feedback.
- Images: natural crop/alt, optional contextual figcaption, no stock-provider promotional watermark or source link in public UI.
- Banners: photographic only, heading must be readable; do not insert diagrams into hero.
- Internal page: breadcrumb, page H1, chapter navigation, distinct body blocks, inserted editorial media patterns, FAQ, CTA, related links.
- Accessibility: keyboard/touch parity, logical heading order, alt text, reduced-motion support, focus outlines, responsive 320px+.
- Integrity: **never lose source copy** when styling. Never imply photos represent real customer projects.

## 6. Five editorial photo layouts (do not group all photos)

| Layout | Production CSS | Gutenberg build |
|---|---|---|
| Image on left of content | `.ftt-flow-inline--left` (floated figure, mobile stacked) | Group/Columns with reverse-order option |
| Image on right of content | `.ftt-flow-inline--right` (floated figure, mobile stacked) | Group/Columns 58/42 with media right |
| Center between topics | `.ftt-flow-standalone--center` | alignwide core/image + caption |
| Soft blurred image behind content | `.ftt-flow-with-backdrop`; CSS custom property and low-opacity ::before | Group background style or Cover block with appropriate overlay/blur CSS |
| Parallax editorial break | `.ftt-flow-parallax` with fixed bg on desktop, scroll fallback | core/cover fixed-background style or custom lightweight block, respecting reduced motion |

**Composition rules:** a page uses one photographic hero and up to five supporting images, distributed across separate chapter sections. Choice is content-dependent; do not force all five into irrelevant FAQs or dense forms. Preserve architecture diagrams only inside technical explanations. Avoid two adjacent photo-only blocks without content between. Text/photo alignment must become single column on narrow mobile. No external-host photos should be eagerly loaded except the first hero.

**Sources of truth:** `lib/pexels-photos.ts` contains 43 named Pexels photo IDs, descriptions, source photo pages and credits, and per-page selections. The source links are *internal metadata only*, never public navigational CTAs.

## 7. Motion specification

- Hero crossfade approximately **900ms** between real-photo slides, auto-advance **7 seconds** when appropriate.
- Pause on pointer hover, keyboard focus, hidden tab, offscreen hero; respect `prefers-reduced-motion:reduce`.
- Hover: card/image translate ~3–4px; transition 200–350ms, only where interactive.
- Glass backdrop blur ~10–18px for compact icons and navigation.
- Blurred photo backgrounds ~18–23px CSS `filter: blur()` with subtle opacity, not unfiltered text-over-image.
- Parallax is CSS `background-attachment:fixed` on desktop only, scroll fallback on mobile and reduced motion. No heavy JS scroll handlers.
- No flashing, auto-playing audio/video or aggressive attention effects.

## 8. Required content, URLs and metadata

The complete **23-page content manifest** is `public/theme-assets/content/page-manifest.json`; every page resolves its corresponding compiled native Gutenberg HTML via `lib/theme-pages.ts`.

**Service pages (9):**
`/solutions/forex-broker-hosting/`, `/solutions/forex-liquidity-connectivity/`, `/solutions/forex-turnkey-solution/`, `/solutions/forex-white-label/`, `/solutions/mt4-grey-label/`, `/solutions/mt4-white-label/`, `/solutions/mt5-grey-label/`, `/solutions/mt5-white-label/`, `/solutions/start-a-forex-brokerage/`.

**Products (8):**
`/products/forex-broker-website/`, `/products/forex-crm/`, `/products/forex-manager-api/`, `/products/mobile-trading-app/`, `/products/pamm-mam/`, `/products/payment-gateway-integration/`, `/products/prop-firm-crm-api/`, `/products/web-trading-platform/`.

**General:** `/`, `/about-us/`, `/contact/`, `/faq/`, `/portfolio/`, `/technology/`.

**Additional routes:** `/blog/` and individual article URLs are WPGraphQL-integrated surfaces with potential mock fallback; validate actual posts before final release.

**Invariant for porting:** same permalink path, canonical URL, metadata, H1, original paragraph wording and exact heading order. Never double-import pages or silently lose lists, tables, media alt text, FAQs and contact forms.

## 9. Source map / files to transfer

| Source | Contents | Migration ownership |
|---|---|---|
| `app/theme.css` | Original WP style layer loaded on Next.js | Audit/merge into new WordPress `style.css` |
| `app/interior-polish.css` | Interior section presentation | Put in WordPress theme stylesheet, namespaced |
| `app/editorial-flow.css` | Dispersed photo layouts | Register 5 reusable native patterns/styles |
| `app/site-compact.css` | Compact density and footer | Port to WordPress global styles |
| `app/home-polish.css` | Homepage card and section styles | Port; remove dead old-hero selectors after parity QA |
| `app/home-fullwidth.css` | Full-width carousel and hero | Port and match breakpoints |
| `app/home-editorial-media.css` | Home scattered photo layouts | Port to patterns |
| `app/brand-consistency.css` | Shared palette/font/image styling | Port into theme.json and consolidated CSS |
| `lib/pexels-photos.ts` | Photo URL/alt/license register and selections | Export URLs + alt metadata to WP Media/patterns |
| `lib/theme-media.ts` | Server-only hero photography substitutions | Materialize as native Image/Cover blocks |
| `components/InteriorEditorialFlow.tsx` | Content-aware placement rules | Convert each composed page to serialized Gutenberg block structure |
| `components/SiteHeader.tsx` | Interactive navigation | Native Navigation block or small accessible custom block |
| `components/SiteFooter.tsx` | Compact footer | Native template part |
| `components/home/HomeHero.tsx` | Accessible slider | Custom lightweight block for exact controls |
| `public/theme-extracted/forex-trade-technology/theme.json` | Current WordPress 6.6+ theme baseline | Extend, don't discard |
| `public/theme-assets/content/pages/*.html` | Editorial source of truth | Import with original Gutenberg comments |
| `public/theme-assets/content/page-manifest.json` | Page metadata and route map | Map to WordPress pages and SEO fields |

## 10. Pixel-parity Gutenberg/FSE conversion plan

1. **Create port branch** (do not overwrite production Next.js): e.g. `feature/wp-fse-parity`; snapshot current screenshots and manifest checksums before migration.
2. **Freeze design contract** by reviewing this file and `design/forex-theme-tokens.json`, including precise breakpoints, target widths, CSS class names and linked media.
3. **Start with the existing WordPress FSE theme** in `public/theme-extracted/forex-trade-technology`; do not use classic PHP page templates, page builders, remote UI kit CSS, or HTML-only fake Gutenberg blocks.
4. **Implement theme.json v3** with documented colors, typographic and layout presets, block-specific defaults. Scope theme styles under `.ftt-*` and `.bs-*`, ensure native editor/front parity.
5. **Build reusable native patterns:** hero cover, alternate left/right media, centered photo, blurred cover, parallax cover, icon card grid, process/timeline, FAQ/details, related services, compact footer.
6. **Use custom Gutenberg block only where native blocks lack reliable functionality:** the multi-slide accessible photo carousel, and possibly mobile mega navigation. Custom block markup and JS must be self-hosted and gracefully degrade without JS. Serialize slide content as editable InnerBlocks, never bake text into images.
7. **Import all 23 source pages** from their original block HTML. Transfer all headings/paragraphs/links exactly and convert the JS-only composition into literal Gutenberg blocks/pattern instances at the appropriate positions; retain original section anchor IDs. Avoid raw `wp:html` stand-ins for what core blocks support.
8. **Update Header/Footer template parts** and matching breakpoint styles; remove public admin/login controls. Maintain WordPress admin access via its own backend URL, not a visible site button.
9. **Media:** reference the source-photo URLs initially if owner requests URL-only. Maintain `alt`, photographer/source/usage record internally. For long-term production use, independently verify each URL and licensing; if the owner later approves, import approved images into WordPress Media Library and handle responsive `srcset`.
10. **SEO/schema:** migrate meta descriptions and primary/secondary keywords, article schema and canonical URLs; check no extra H1s. Do not imply WPGraphQL mock blog is production content.
11. **Forms:** connect a real server-side contact handler with validation, CSRF protection, spam protection, consent, delivery verification and honest success/error states. Styling alone does not make a form functional.
12. **QA pixel comparison:** capture paired Next.js vs WP screenshots at 1440×900, 1280×800, 1024×768, 768×1024, 390×844 and 360×800; align fonts, gutters, grid tracks, image crops, shadows, page heights and footer spacing. Manually inspect every document section, navigation submenu, accordion, CTA and mobile overflow.
13. **Technical QA:** keyboard and screen-reader audit, no console errors, no 404 images, no horizontal overflow, Core Web Vitals/LCP/CLS, no WordPress editor invalid block warnings.
14. **Ship only after approval** and preserve GitHub commit hashes, theme archive, environment notes and documented rollback path.

## 11. Acceptance checklist (no false production claims)

- [ ] All 23 pages have correct source copy and metadata.
- [ ] All 22 interior pages show a real photo hero and dispersed contextual photos; no single photo wall.
- [ ] No diagrams in hero banners. Keep useful tech diagrams in content where necessary.
- [ ] Full-width homepage slider preserves contrast, readable H1, CTAs, dot/arrow/swap control.
- [ ] Images are real, relevant, accessible, not misleading and traceable internally.
- [ ] No public third-party photo attribution UI/link, admin button or login button.
- [ ] Images appear left, right, center, subtle background and on a desktop parallax section where applicable.
- [ ] Fonts, colors, buttons, cards, footer and density align with tokens.
- [ ] Reduced motion, keyboard, alt text and tablet/mobile verified.
- [ ] Build passes; browser-based desktop/mobile screenshot comparison completed (not just Vercel READY).
- [ ] Contact forms and actual WordPress connectivity function, if claimed.
- [ ] Gutenberg parity: all blocks editable, templates/parts/styles match, no invalid block warnings.

## 12. Update protocol

Every major theme change must update:
1. `docs/FOREX_THEME_MASTER_SPEC.md` (human design language + migration implications).
2. `design/forex-theme-tokens.json` (design tokens machine-readably).
3. Linked React/CSS source files or the new WordPress theme equivalents.
4. Image source register `lib/pexels-photos.ts` for all asset changes.
5. QA results and known gaps.

**Known gaps at writing:** recent Next.js visual changes were build-verified, not tested with full paired browser screenshots; URL-only third-party photos can fail if remote hosts change; Gutenberg FSE does **not** automatically render React-side media composition; contact backend and live WordPress editing integration must be verified separately. Pixel-perfect parity requires an explicit implementation and review, not simply copying this specification.

## 13. Header breakpoint correction (2026-10-21)

- Inline desktop primary navigation, including Home, Solutions, Products, Technology, Portfolio, About, FAQs and Market Intel, begins at **1024px**. The former 1280px cutoff caused the hamburger to appear on desktop/laptop displays.
- Navigation dropdown menus stay within the current screen height and are keyboard-focusable.
- At widths **0–1023px**, the hamburger and expandable mobile drawer remain, with its own contact CTA. At widths **>=1024px** the drawer/hamburger must be hidden and desktop inline navigation visible, including the contact CTA.
- The header should retain a maximum content width of **1320px** and 20px or greater desktop side gutters. Responsive logo and link sizing at the compact desktop edge must never cause nav wrapping or horizontal page overflow.
- WordPress Gutenberg parity: maintain this precise breakpoint, inline links and mobile drawer behavior in the `header` template part; use real navigation block semantics, preserve labels and URLs, and do not surface a public WordPress admin/login button.

## 14. Complete homepage slide transitions (2026-10-21)

The photographic homepage carousel now transitions **the complete slide panel**, not the image alone. Every panel holds a photograph, background scrim, eyebrow, headline, lead/description, both CTA buttons and slide number. The first panel retains the original verified homepage H1 and intro; subsequent panels use H2 headings and source-verified featured solution titles, summaries and supporting CRM/Hosting paragraphs. Preserve one H1. Manual arrows, dots, touch swipe, keyboard arrow keys, cyclic wrapping, 7-second autoplay and reduced-motion behavior remain. Autoplay pauses on hover/focus, when hidden/offscreen, or when reduced-motion applies. Inactive panels are `aria-hidden` and `inert`. Gutenberg parity requires each full panel to be serialized together inside its slide block rather than floating text outside a photo slider.

Source of truth: `components/home/HomeHero.tsx`, `lib/home-hero.ts`, `app/home-fullwidth.css`.
