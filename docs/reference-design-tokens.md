# Reference Design Tokens

Source: the attached `Forex Trade Technology-main.html` and full-page screenshot. The HTML export identifies `Manrope, sans-serif` and `Inter, sans-serif`; the screenshot helps confirm the green/mint, white, and slate visual balance.

## Measured typography

- Display / H1: `clamp(28.836px, calc(22.752px + 1.89vw), 50px)`; Manrope 600; line-height `1.04`; letter spacing `-0.055em`.
- H2: 30px to 46px responsive; Manrope 600; line-height `1.1` at large sizes; tracking `-0.045em`. Some sections in the source use alternate fluid H2 caps between 40px and 46px.
- H3 cards: 20px; Manrope 600; line-height `1.25`; tracking `-0.025em`.
- H4/H5/H6 normalized from 18/16/14px text utilities; weight 600.
- Body: `clamp(14px, calc(13.427px + 0.179vw), 16px)`; Inter 400; line-height `1.65`.
- Small: 14px; caption/badges: 10–12px, commonly bold uppercase with `0.12em`–`0.19em` tracking.

## Measured layout and spacing

- WordPress content width: 1180px; wide width: 1440px; repeated inner wrapper: 1320px.
- WordPress default block gap: 24px; card gaps are usually 12–16px; section padding commonly 80px desktop and 48px mobile.
- WordPress spacing preset values: 10px, 14px, 16px, 24px, 32px, 48px, 54px, and 81px.
- The page also uses Tailwind-like 4px utility spacing. Treat the named WordPress preset scale and utility scale as two complementary systems, rather than replacing either with a generic geometric scale.

## Repo integration

The Next.js repository currently uses a hand-authored global stylesheet rather than Tailwind. `app/new-theme.css` applies these typography and spacing tokens directly; `site-data/theme.styles.json` stores the matching editable token values. The packaged FSE theme and vanilla site use the same token values.
