# Forex Trade Technology — Screenshot-corrected six-design comparison

**Updated:** 2026-10-22. Grounded in five full-page desktop screenshots supplied by the project owner. Colors below are implementation values, not verified competitor computed CSS. Typography is the user-requested Inter/Manrope on all websites, superseding earlier assumptions about competitors' fonts.

| Component | Design 1 (Original) | Design 2 (Match-Trade) | Design 3 (B2Broker) | Design 4 (Leverate) | Design 5 (Soft-FX) | Design 6 (UpTrader) |
|---|---|---|---|---|---|---|
| Font family | Inter + Manrope | Inter + Manrope | Inter + Manrope | Inter + Manrope | Inter + Manrope | Inter + Manrope |
| Primary palette | Deep green #17241A, lime #D9F17A | Navy #0A1325, cyan #32BDDD | Blue #063252, white, green #009D64 | White, charcoal #2C313A, coral #F16451 | Black #111315, neon green #7CDB4C | White, ice #EAF2FA, blue #00A7DC |
| Header | Original established navbar | Slim dark trading tech navbar | Light corporate navbar plus institutional utility strip | Minimal white navbar with subtle CTA | Dark compact engineering navigation | Light simple SaaS navigation |
| Hero | Preserved full-panel slider, compact height | Two overlapping original trading phone interfaces on navy | Centered cinematic blue skyline/cloud composition | Pastel split hero, original desktop + phone UI | Full-width dark trading-terminal interface | Software/CRM desktop dashboard with smaller app panel |
| Section layout | Tight editorial blocks, full-width readable content | Company summary, swipeable product card track, technical catalogue | Overlapping white ecosystem panel, flat products and solution tiles | Solution tabs, interface gallery and comparison cards | Product terminal matrix and infrastructure topology | Process walkthrough and alternating CRM product views |
| Cards | Compact original outlined interactive cards | Thin-bordered white interface cards | Dense white institutional grids | Coral-edged clean comparison cards | Flat square dark software modules | Pale, lightly bordered software demonstrations |
| Image/UI style | Short relevant photos, click-to-expand | Original CSS trading phones and miniature interfaces | Original CSS skyline/blue background, light UI blocks | Original desktop + mobile brokerage UI illustration | Original CSS trading terminal graphic and neon diagrams | Original dashboard/process interface illustrations |
| CTA | Original dark green compact banner | Dark teal split CTA | Green enterprise conversion band | Dark charcoal conversion band | Image/green technical callout | Deep blue photographic CTA |
| Footer | Original preserved footer | Dark navy corporate links | Black institutional directory | Light white corporate directory | Charcoal technical directory | Pale blue SaaS directory |
| Responsive | No reserved empty column, compact images and hero | Phone duo scales and product cards scroll | Eco panel stacks beneath blue hero | Solution cards become stacked and desktop/mobile UI scales | Dark matrix reflows and terminal shrinks | CRM walkthrough becomes single-column |
| Own homepage code | app/page.tsx | design-2-matchtrade/HomeSpotlight.tsx | design-3-b2broker/HomeSpotlight.tsx | design-4-leverate/HomeSpotlight.tsx | design-5-softfx/HomeSpotlight.tsx | design-6-uptrader/HomeSpotlight.tsx |

## Architecture and approved content

- Each of Designs 2–6 has an independent Header/Hero/Body/CTA/Footer implementation in its `Page.tsx` and a new screenshot-specific `HomeSpotlight.tsx` with its own `app/reference-N.css`.
- All six use the same 13 approved content documents from the existing page manifest. They have 78 site-page combinations with the permanent design switcher outside the variation's header.
- Images inside the original site display compactly and can open an on-demand lightbox, rather than consuming whole-page blocks.
- Product mockups are **new CSS/React illustrations**, labeled as such and not copied third-party images or allegedly functional live trading systems.
- User fonts: the same Google Fonts WOFF2 Inter/Manrope file URLs supplied in the prompt. `font-display:swap` avoids invisible text while loading.
- Detailed descriptions and approximate reference observations are in the individual six `docs/designs/design-*.md` files; token definitions are in `design/tokens/`.

## Verification contract

Run the existing GitHub Actions workflow for the Next.js TypeScript compilation, ESLint and production build, plus structural source tests and 78 routes at six widths (468 browser checks). Collect 24 full-page comparison screenshots. Browser test success does not assert exact visual pixel equivalence to the third-party reference screenshots. The source screenshot images remain conversation-provided and are not committed in binary form.
