# Original — Design System

Reference for independent inspiration: https://forextrade.pincodeit.com/

## Design intent

Preserve existing forest-green, charcoal, lime, original whole-panel carousel, nav, footer and content.

## Exact tokens

| Property | Value |
|---|---|
| Primary | #17251a |
| Accent | #b4d184 |
| Background | #f6f8f2 |
| Foreground | #17251a |
| Border | #dfe8da |
| Font | Arial, Helvetica, sans-serif |
| Radius | 16px |
| Content width | 1420px |
| Display title | clamp(38px, 5.2vw, 78px) |
| Section title | clamp(26px, 3.1vw, 49px) |
| Body line-height | 1.72 |

## Composition and reusable parts

Original reuses current header, footer, slider, cards and editorial source unchanged. Other variations scope separate design tokens and substantial responsive presentation overrides to the single 13-page content source in app/showroom.css. Interactive controls retain original behavior. No reference logos, copied imagery or proprietary code.

## Mobile and accessibility

Breakpoint checks at 900px and 768px; validate 390px and 360px mobile. Keyboard focus and reduced-motion support must be tested. Respect paragraph wrapping and minimum contrast; no claims of pixel-perfect fidelity until screenshots verified.

## WordPress handoff

Translate this exact palette/font/spacing/radius into the chosen native Gutenberg theme.json after client approval. Include header/footer template parts, native Group, Columns, Cover, Buttons, Details and photo patterns. The client preview toolbar and comments do not belong in the final theme.

## Open QA gates

The current showroom build is an implementation preview, not a final design signoff. Capture 78 x viewport visual regressions, verify image sources and implement shared authenticated feedback storage before calling it client-ready.
