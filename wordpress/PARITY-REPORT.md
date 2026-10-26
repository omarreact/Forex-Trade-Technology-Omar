# XML-native WordPress Theme — QA and parity report

**Source verified:** repository root `website.xml`, 13 pages, 87 sections, 42 FAQs, 26 curated image keys, 17 ordered visual stylesheets.

**Architecture checks:** PHP 8.1+ block theme; true core Gutenberg page markup; editable template parts; 12 reusable patterns; only five dynamic interactive blocks. No JSX or Next.js runtime. Contact transport separately packaged.

## Verification matrix (evidence status)

| Route | 1440 | 1280 | 1024 | 768 | 390 | 360 |
|---|---|---|---|---|---|---|
| `/` | Not run | Not run | Not run | Not run | Not run | Not run |
| `/solutions/brokerage-setup` | Not run | Not run | Not run | Not run | Not run | Not run |
| `/faq` | Not run | Not run | Not run | Not run | Not run | Not run |
| `/contact` | Not run | Not run | Not run | Not run | Not run | Not run |

**Result:** XML/static-code validation passes when the automated script succeeds, but front/editor screenshot parity remains **unverified**. The current container does not include a running WordPress + database + wp-env Docker stack, so screenshot-based WordPress QA and Elementor-style absolute positioning are NOT claimed. The WordPress-native blocks prioritize real editability over 1:1 custom PHP component markup. The original CSS cascade is preserved but structural differences may require visual adjustments.

**Recommended next gate:** run `npx @wordpress/env start` on a Docker-enabled machine, complete the theme import, and capture screenshots at each requested width. Compare against production screenshots, fix layout and focus states, then rerun. Keep production WordPress theme untouched until the staging comparison is approved.
