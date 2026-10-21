# Saved reference websites: measured source audit — 2026-10-22

**Evidence:** User-supplied five `*.html` files and `compleate-refarance.zip` (403 ZIP entries; 17.7 MB compressed). Saved HTML was parsed with BeautifulSoup; CSS rule properties were extracted from the companion downloaded `.css` resources. The figures below are *observable in these files*, not invented colors. Some rules belong to WordPress plugins, consent banners or shared libraries and do **not** necessarily represent primary site colors; therefore refer to both recurrence and relevant class usage before implementation. Viewport screenshots are supplied separately (compressed 283–400 px wide), so browser-level exact geometry still needs screenshots at equal viewport sizes.

| Reference | Homepage structure, source evidence | Font family observed in saved CSS | Observed brand palette | Stylesheet resources and recurring breakpoints |
|---|---|---|---|---|
| Match-Trade — `https://match-trade.com/` | 83 images, native menu with Products, White Label, CRM, Liquidity; hero product devices, Our Products / What We Offer / Platform Integrations / FAQ | `Exo`, with `Helvetica Neue` fallbacks | `#0A1326` navy, `#3FC5E9` cyan | 20+ CSS resources; breakpoints concentrated at 767px, 991px |
| B2Broker — `https://b2broker.com/` | 219 images, promotional masthead, one-stop fintech ecosystem, products, testimonials, thought leadership, Get Started | `Inter` | `#01A263` green, `#F9F9F9` surface, `#191C1F` text | Compiled `PageHead.BTt-kMB1.css`, utility-based responsive classes |
| Leverate — `https://leverate.com/` | 103 images, CFDs/Prop mega-navigation, turnkey hero, tabs, broker journey, product suite, integration and events | `Inter`, `Plus Jakarta Sans`, `Factor A` (preloaded font references) | `#F16856` coral, `#282C34` charcoal, `#FFFCFA` light surface | 52+ companion CSS stylesheets; 767px/1024px frequent |
| Soft-FX — `https://www.soft-fx.com/` | 69 images, dark software-first intro, product matrix, ecosystem, partners, recent posts, project brief | `Montserrat-Regular`, `Montserrat-Medium`, `Montserrat-SemiBold` | `#121212` near-black, `#89DD65` neon green, `#2A342A` raised surface | `main.built.css`, `home.built.css`, Swiper CSS; prominent 576/767/991/1200px breakpoints |
| UpTrader — `https://uptrader.io/en/` | 50 images, `index-hero`, `index-crm`, `index-what_we_suggest`, `index-app`, `index-social_trading`, `index-liquidity` | `Poppins` | `#0AA1E2` blue, `#F4F5F9` pale background, `#595959` text | `bundle.min.css`, `index.min.css`; responsive 600/768/1000/1024/1280/1440px |

## Faithful architectural translation without copying third-party code or art

Each proposal shares only the 13 source-approved page documents, route mapping and contact logic. Design-specific headers, homepages, interface previews, section flows, CTAs and footer components live under `components/designs/design-N-*/`.

1. **Design 1:** retain original homepage/brand, reduce hero to 460–620px desktop (535–670px mobile) with actual `.ftt-full-slide-hero` selectors; compress service sections, replace oversized figures with capped inline photographs and focusable lightbox. Remove blank article rail and preserve useful content width.
2. **Design 2:** use navy trading product hierarchy and a cyan interface panel, original interactive three-tab `TradingDesk` with real navigation states and conceptual data labels; preserve product carousel and integrations.
3. **Design 3:** blue institutional hero with central light content, original `EcosystemView` toggling Solutions and Operations; preserve light ecosystem cards and green CTA.
4. **Design 4:** white/coral dual-column trading solutions, original `BrokerageWorkbench` toggling Launch / Operate / Connect; preserve modules/tabs and comparison sections.
5. **Design 5:** dark and neon-green technical matrix; original `InfrastructureTerminal` toggling Execution / Connectivity / Operations; retain engineering-grained directory and CTA.
6. **Design 6:** white/blue CRM-led product story, original `CRMWorkflow` toggling Onboarding / Operations / Integrations; retain alternating CRM software sections.

All interaction panels explicitly say they are **illustrative**, use no fabricated financial prices/statistics, and copy no competitor trademarks, scripts, proprietary screenshots or artwork. User-requested Inter/Manrope fonts supersede third-party site fonts; exact font-derived pixel equality is intentionally not promised.

## Test contract

- GitHub Actions: four Node structural suites, `npx tsc --noEmit`, ESLint, `next build`, and browser checks across 6 designs × 13 approved pages × 6 viewports.
- Browser checks cover existence of CTA, footer and route selection, overflow, and capture 24 desktop screenshots. The software interface tabs should additionally be checked for keyboard navigation and visible state changes.
- CSS identifiers are under `.rpN-*`, `.cN-*`, and `.rN-*` to prevent leakage. Design 1 is separated into `.ftt-home` / `.ftt-interior-layout` rules.

## Scope boundaries

The saved reference files may contain analytics trackers, proprietary JavaScript, competitor-owned images, trademarks, and contact forms. They remain analysis-only. None are copied to production. This reconstruction is as close as possible while preserving legitimate Forex Trade Technology branding and user-provided typography, but final visual acceptance requires matching screenshots under the same viewport and asset-loading environment.
