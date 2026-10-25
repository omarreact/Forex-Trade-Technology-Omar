# Forex Trade Technology

Production Next.js multi-page website for brokerage technology services.

**Live websites**
- Full Next.js application: https://forextrade.pincodeit.com/
- GitHub Pages static preview: https://omarreact.github.io/Forex-Trade-Technology-Omar/

## Scope
- **13 pages**, **87 source sections**, complete FAQ and original long-form content.
- Modern responsive design, global headings/cards, 5-slide hero, looping service carousel, connected trading-stack diagram, single final CTA and global footer.
- Accessible floating **Suggest a change** review form fixed at the right-middle of the screen.
- **website.xml** is a portable, machine-readable site package: all 13 pages, original content blocks, routes, SEO, media URLs, design tokens, CSS in import order, React component source snapshots and behavior contracts. It is a comprehensive implementation reference; cross-framework pixel parity still needs device QA.

## Run

Node.js 20.9+ (CI uses 22).

```bash
npm install
npm run validate:data
npm run dev
```

Open http://localhost:3000

```bash
npm run build
npm run start
npm run export:xml
```

**Keep the XML synchronized:** run `npm run export:xml` after altering copy, page structure, tokens, CSS or components, then commit the regenerated root `website.xml`.

## Architecture

```text
app/                           Next.js App Router, SEO metadata, styles and form API
components/new-theme/          Shared sections, heading, icon card, feedback, navigation and footer
lib/site-data.ts               Strongly typed JSON loader and canonical routing
site-data/
  pages.content.json           Complete authoritative content for all 13 pages
  site.config.json             Navigation, brand, CTA, footer and review controls
  theme.styles.json            Color, typography, sizing, image URLs and animation tokens
scripts/
  validate-data.mjs            Validates content/route invariants
  responsive-smoke.mjs         13 routes × 8 Chromium screen sizes
  export-website-xml.mjs       Regenerates portable full-site XML
website.xml                    Exported architecture-independent site specification
.github/workflows/             Production build/test and independent GitHub Pages publisher
```

### Site pages
Home; Brokerage Setup; MT5 White Label; Trading Server Hosting; Liquidity & Connectivity; Forex CRM; KYC & AML; Payment Gateway; Prop Firm Technology; How It Works; About Us; FAQ; Contact.

## Design tokens
Design variables are defined in `site-data/theme.styles.json`. See CSS files under `app/` for exact selectors, responsive breakpoints and animations.

Key values:
- Heading font: **Manrope**, body font: **Inter**.
- Primary ink `#161816`, body `#4c5c53`, soft lime `#d8e9a2`.
- Desktop section H2 up to **46px**, icon-card H3 up to **23px**, body **14px**, icon badge **46px × 46px**.
- Main content max-width **1210px**, section padding `clamp(48px, 5.5vw, 72px)`.
- Home slider copy **70% width × 70% height**, left and vertically centered on desktop; responsive full-width copy on mobile.

## Development feedback

The fixed right-middle feedback button opens a page/section-aware form. It collects name, reply-to email, issue category and requested change.

On **Vercel**, the server submits review feedback using the same Resend email integration as Contact. Configure these **server-only** environment variables in the Vercel project:
- `RESEND_API_KEY` — Resend API token.
- `CONTACT_TO_EMAIL` — the recipient email where *you* want suggestions delivered.
- `CONTACT_FROM_EMAIL` — a sender verified with Resend.

No API secrets are stored in this repo. Without these three keys, the API reports an explicit delivery failure and offers an email draft; **do not treat the message as sent automatically**.

On **GitHub Pages**, there is no server/API: submission opens a prefilled email draft to `business@forextradetechnology.com`. The reviewer must press Send in their email application. GitHub Pages cannot deliver email silently.

## Deployment

Each push to `main` runs the independently hosted GitHub Pages static build. Vercel also builds from `main` subject to Vercel account limits. **GitHub Pages does not automatically take over the `forextrade.pincodeit.com` DNS hostname**; this requires separate DNS/load-balancer failover.

When GitHub Pages builds, its release manifest `/release.json` reports the exact deployed commit.

## QA and cleanup

Use the responsive Actions workflow to run Chromium checks at 320, 360, 390, 430, 768, 1024, 1440 and 1920px. The tests do not replace iOS Safari, Firefox, email-delivery QA or full pixel-by-pixel approval.

Only active application code, configuration, scripts, workflows, **this README**, and the portable `website.xml` are retained. Older theme archives, duplicate example sites and obsolete markdown reports remain recoverable through Git history.
