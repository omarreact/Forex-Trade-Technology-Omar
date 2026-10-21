# Leverate Inspired — Design System

Reference for independent inspiration: https://leverate.com/

## Design intent

Luminous lavender and violet, gradient hero, rounded floating cards and conversion-oriented hierarchy.

## Exact tokens

| Property | Value |
|---|---|
| Primary | #432387 |
| Accent | #d98afc |
| Background | #f8f4ff |
| Foreground | #2b1f58 |
| Border | #e0d3f8 |
| Font | Arial, Helvetica, sans-serif |
| Radius | 26px |
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
