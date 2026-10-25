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

## Resend sending and development feedback

- Verified Resend sending subdomain: `forextrade.pincodeit.com` (region `ap-northeast-1`; DNS managed by Vercel).
- Production `CONTACT_FROM_EMAIL`: `Forex Trade Technology <notifications@forextrade.pincodeit.com>`.
- Production `CONTACT_TO_EMAIL`: a real owner Gmail inbox, stored privately as a Vercel sensitive environment variable; **never embed the private recipient address in public JSON**.
- `RESEND_API_KEY`: required, must be created from [Resend API Keys](https://resend.com/api-keys) with Sending access limited to this verified subdomain and stored as a Vercel production secret.
- Do not commit an API key, paste it into public comments or use a `NEXT_PUBLIC_` prefix.
- Vercel Contact and Suggest a Change both POST to `/api/contact` and forward through Resend **only once all three keys are configured**; before that the endpoint returns HTTP 503 and explicitly confirms nothing was sent.
- The verified sending subdomain does **not** itself create a receiving mailbox. The old `business@forextradetechnology.com` address is not owned and is intentionally removed from public fallbacks.
- GitHub Pages now uses the **same private Vercel Contact API** at `https://forex-trade-technology.vercel.app/api/contact` (CORS allowlisted for `https://omarreact.github.io`). Both forms remain on the GitHub Pages site. This direct delivery works only when the production hostname resolves and Resend is configured.
- On failure (including DNS NXDOMAIN), both forms offer a **public prefilled GitHub issue**. The URL intentionally excludes the visitor's name, email, phone, company and country fields; the entered message itself is public and should not contain secrets. The visitor must be signed in and click **Submit new issue** to actually post. Github issues are visible in the repository's Issues tab/notifications. No failed form submission is reported as delivered.
- A real private form submission from either hosting origin requires a server-side email backend plus valid credentials; it cannot be implemented in GitHub Pages alone. Resend API tokens must **never** be exposed in the static bundle.
- The production site currently has a DNS issue: Vercel confirms the hostname is configured as a project domain but the DNS configuration has no published A or CNAME value. Add an `A` record: hostname `forextrade` → `76.76.21.21` in the authoritative `pincodeit.com` zone. An A record is preferable here because the Resend-provided CAA/TXT records may already exist at the sending subdomain; a CNAME cannot coexist with other records at the same hostname. The connected Vercel account does not own that DNS zone, so this record must be created from the authoritative DNS account, not this app's project configuration.
- The floating right-middle feedback control captures current page, section, category, and description. Only a successful response from the server should be shown as accepted by the email provider.
- New Vercel environment variable values apply to new deployments. Test in production after the API key is configured.

## Deployment

Each push to `main` runs the independently hosted GitHub Pages static build. Vercel also builds from `main` subject to Vercel account limits. **GitHub Pages does not automatically take over the `forextrade.pincodeit.com` DNS hostname**; this requires separate DNS/load-balancer failover.

When GitHub Pages builds, its release manifest `/release.json` reports the exact deployed commit.

## QA and cleanup

Use the responsive Actions workflow to run Chromium checks at 320, 360, 390, 430, 768, 1024, 1440 and 1920px. The tests do not replace iOS Safari, Firefox, email-delivery QA or full pixel-by-pixel approval.

Only active application code, configuration, scripts, workflows, **this README**, and the portable `website.xml` are retained. Older theme archives, duplicate example sites and obsolete markdown reports remain recoverable through Git history.
