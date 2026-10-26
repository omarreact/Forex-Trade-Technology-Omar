# Forex Trade Technology — Next.js with a Block-Theme-Aligned Architecture

This is a **Next.js 15 App Router + React 19** production marketing website, deployed to Vercel. **It is not a WordPress site.** There is no PHP, Gutenberg runtime, `wp-admin`, or WP dependency.

## Run the site

```bash
npm install
npm run validate:content
npm run dev
npm run build
npm run start
npm run export:block-manifest
```

Use Node.js 20.9 or later. `app/api/contact/route.ts` remains server-side Next.js and requires configured Resend credentials in the Vercel environment; no secrets belong in public JSON. GitHub Pages export remains optional and must omit the API route.

## Migration philosophy: parity through shared contracts

The folders deliberately resemble a WordPress **Full Site Editing block theme**, without adding a WP runtime. The existing class names, markup, theme variables and current ordered CSS layers are preserved. Token and content sources are platform-independent.

| Next.js folder | Future WordPress equivalent | Responsibility |
|---|---|---|
| `theme/theme.json`, `theme/styles` | `theme.json`, `style.css`, `assets/css/editor.css` | Design tokens, editor/front styles |
| `parts/` | `parts/*.html` | Shared header/footer, CTA, site controls |
| `templates/` | `templates/front-page.html`, `templates/page.html` | Composition (no marketing copy) |
| `patterns/` | `patterns/*.php` (registered block patterns) | Mostly static section arrangements |
| `blocks/*/types.ts` | `blocks/*/block.json` attributes | Interactive custom block contracts |
| `content/pages/*.json` | Page `post_content` block markup | Copy, SEO, sections and attributes |
| `lib/render-sections.tsx` | Gutenberg markup/block mapping | Layout dispatch & special overrides |
| `app/api/contact/route.ts` | **Plugin**, not a theme | Secure contact mail transport |

**Do not migrate existing JSX into template PHP.** In WordPress, convert it to block markup for static patterns, implement interactive blocks with `block.json` and frontend scripts, and attach the same visual tokens to editor and frontend surfaces.

## Data and routing

`content/pages/` contains 13 individual, complete page documents (including `fullBlocks`, SEO, IDs, sections and footer notes). `content/site.config.json` owns navigation, footer, canonical routes and features. `theme/theme.json` is the canonical token + image source, derived losslessly from the old `site-data/theme.styles.json`.

`content/index.ts` exports `allPages`, `getPage`, `getImage`, `siteConfig`, and route utilities. `lib/site-data.ts` is a temporary compatibility facade for unchanged components; new code should import directly from `@/content`.

## Add or change a section

1. Edit the relevant `content/pages/<page>.json`, preserving section IDs and canonical route.
2. Use an existing typed `patterns/*` component for static sections, or a `blocks/*` folder with an explicit `types.ts` attribute contract for interactions.
3. Register/adjust the section layout mapping **only** in `lib/render-sections.tsx`.
4. Keep all copy out of the template shell; style changes belong under `theme/styles` and should use `theme/theme.json` tokens.
5. Run `npm run validate:content && npm run build`, then visually compare all routes at desktop/tablet/mobile widths.

### Preserved special behavior

- Home uses exactly five slider images and the existing autoplay, captions, transitions and links.
- `mediaBand` renders **on home only**; interior page media bands remain suppressed.
- Page `ctaBand` sections are suppressed: one shared `parts/FinalCta` appears before the footer, with its richer home variant.
- `How Your Trading Stack Connects` → `blocks/trading-stack-flow`.
- `Platform & Infrastructure Under One Roof` and `Why Brokers Work With Us` → `patterns/FeatureFlex`.
- `Who We Work With` with H3 subsections → `blocks/audience-carousel`.
- Contact `Request a Consultation` + `splitContent` → `blocks/contact-form`.
- The 13 canonical paths, SEO intent, static metadata, FAQ source copy and contact API contract remain unchanged.

## Exact WordPress editor canvas parity — future implementation

1. Adapt `theme/theme.json` into WordPress `settings.color`, `settings.typography`, `settings.spacing`, `styles`, and custom CSS variables, using **identical** colors, typefaces, scales, breakpoints and container widths.
2. Convert `parts` into `parts/*.html` block template parts. Convert `templates` into `templates/*.html`; make the footer/CTA global.
3. Convert each static `patterns` export to a registered WordPress block pattern; maintain class naming and semantic DOM structure.
4. Implement each interactive `blocks` module as a custom block with the same attributes (`types.ts` → `block.json`) and frontend `view.js` where required.
5. Transform `content/pages/*.json` into Gutenberg block serialization, keeping section IDs, attributes and editorial hierarchy. Import SEO metadata separately through the destination SEO integration.
6. Supply `assets/css/editor.css` alongside frontend CSS, and scope editor resets so the **editor content canvas matches the front view**. Visual parity also requires identical remote images, font loading, media-query behavior, animation states and DOM wrapper normalization.
7. Reimplement `app/api/contact/route.ts` in a **WordPress plugin** with nonce/rate limiting and server-side Resend transport; never place credentials in the theme or Gutenberg block attributes.
8. Validate editor iframe and frontend screenshots at 1440, 1280, 1024, 768, 390 and 360 px before claiming pixel-level parity.

Use `npm run export:block-manifest` to generate a handoff manifest with layout mapping and attribute schema locations. This repository only prepares for the migration; **it does not yet supply Gutenberg editor code or prove visual parity in WordPress.**

## CSS architecture

`theme/styles/index.css` is an ordered import list, retaining the current production cascade instead of merging all CSS into an unmaintainable file. Existing selectors remain intact until screenshot baselines permit further moves. `theme/css-variables.ts` injects token values into `body`, as before.

## Validation and deployment

`npm run validate:content` preserves the existing 13-page / 87-section / 42-FAQ / 11-media-band / 26-image invariants. `npm run export:xml` exports a portable XML reference from the new content and theme modules. Vercel remains the authoritative Next.js deployment; optional GitHub Pages export is a static preview only. Review build and responsive-smoke workflow results before merging the migration branch.
