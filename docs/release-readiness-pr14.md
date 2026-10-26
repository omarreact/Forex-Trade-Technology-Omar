# PR #14 — Phase A release checklist and implementation guide

**Target:** `main`, Vercel production, Next.js 15 (no WordPress runtime).
**Release decision: HOLD** until an authorized Vercel preview and human visual/process sign-off. Never merge because CI alone is green.
**Branch:** `refactor/wp-block-theme-ready-20261026`
**PR:** https://github.com/omarreact/Forex-Trade-Technology-Omar/pull/14

## Verified automated evidence (October 26, 2026)

| Gate | Result | Evidence |
|---|---|---|
| Content validation (13 pages, 87 sections, 42 FAQs, 26 images, 5 slides) | PASS | GitHub Actions run 40257361887 |
| TypeScript and Next production build | PASS | GitHub Actions run 40257361887 |
| XML export and block manifest | PASS | GitHub Actions run 40257361887 |
| Responsive Chromium smoke, 13 routes × 8 viewports | **104/104 PASS** | GitHub Actions run 40257361887 |
| Local-only contact API validation/CORS/honeypot | **7/7 PASS** | GitHub Actions run 40257361887 |
| Production-versus-refactor screenshot diff, 13 routes × 3 viewports plus key sections | **49/49 within 5% threshold; 0 structural mismatches** | GitHub Actions run 40257361905; `visual-parity-evidence` artifact |
| Visual sign-off in Vercel preview | PENDING | Authorization blocker below |
| Real Resend provider delivery in staging | PENDING | Requires approved staging secrets + recipient; do not send test mail in CI |

Compare screenshots using the artifact attached to https://github.com/omarreact/Forex-Trade-Technology-Omar/actions/runs/40257361905.

The screenshot audit reported 0.00% pixel mismatch at its two-decimal console precision across all 49 captured regions. This is strong automated regression evidence, **not a substitute for human visual review** and not proof of WordPress editor parity.

## Windows / local workflow

```powershell
git fetch origin
git switch refactor/wp-block-theme-ready-20261026
git pull --ff-only origin refactor/wp-block-theme-ready-20261026
npm install --no-audit --no-fund
npm run validate:content
npx tsc --noEmit
npm run build
npm run dev
```

**Use `npm install`, not `npm ci`, until a committed `package-lock.json` exists.** CI installs dependencies with `npm install`. Do not put Resend keys into source files, JSON or screenshots.

## All canonical routes — manual sign-off

Automatic Chromium tests pass all the following at eight viewport sizes. The human reviewer must still inspect layout, current nav state, links, CTA, image cropping, and browser console for each.

| Route | Automated smoke | Manual approval |
|---|---|---|
| `/` | PASS | [ ] Slider, trust strip, trading stack, audience, final CTA visuals |
| `/solutions/brokerage-setup` | PASS | [ ] |
| `/solutions/mt5-white-label` | PASS | [ ] |
| `/solutions/forex-broker-hosting` | PASS | [ ] |
| `/solutions/forex-liquidity-connectivity` | PASS | [ ] |
| `/products/forex-crm` | PASS | [ ] |
| `/technology/kyc-aml-integration` | PASS | [ ] |
| `/products/payment-gateway-integration` | PASS | [ ] |
| `/products/prop-firm-crm-api` | PASS | [ ] |
| `/how-it-works` | PASS | [ ] |
| `/about-us` | PASS | [ ] |
| `/faq` | PASS | [ ] 42-item accordion / open state |
| `/contact` | PASS | [ ] Form UI and provider-backed staging send |

Also verify on 320/768/1440 px: mobile menu, Solutions submenu, skip link, scroll-to-top, review feedback, footer links, keyboard focus, no horizontal overflow, no JS console errors, and reduced motion. Compare PR screenshots with https://forextrade.pincodeit.com/ for fonts, color, spacing, section order and media.

### Preserved behavior that must not change

- Five home slides; their current images, CTA destinations and autoplay behavior.
- `mediaBand` appears only on home.
- JSON `ctaBand` suppressed; one global `parts/FinalCta` (richer on home).
- TradingStackFlow / FeatureFlex / AudienceCarousel / contact overrides.
- Existing routes and SEO. `app/api/contact/route.ts` stays a **Next.js API** and is a future **WordPress plugin** concern, never a theme file.

## Vercel preview blocker and recovery

**Current blocker:** Vercel returned 403 when creating a branch preview via the connected account, and project lookup in the explicitly scoped team returned 404/not found. The Git deployment connection inventory did not list this Forex project among linked accessible projects. This is an authorization/project-scope problem in the connected account; do not assume the Next.js build is faulty.

An authorized **project/team owner** should:
1. Open Vercel dashboard for project `forex-trade-technology-omar` in team `omarreacts-projects`.
2. Check Project Settings → Git: connected repo is `omarreact/Forex-Trade-Technology-Omar`, PR deployments enabled, GitHub app authorized for this repository.
3. Check team membership and project permissions for the connected Vercel account; explicitly grant deployment access to the intended project/team. Check Deployment Protection and whether preview URLs are shareable with stakeholders.
4. In an authorized CLI session: `vercel whoami`, `vercel teams ls`, `vercel project inspect forex-trade-technology-omar --scope omarreacts-projects`.
5. Trigger a branch preview and verify **the preview's Git SHA matches the PR HEAD**. Record the preview URL, inspector URL and build outcome. Do not promote it to production.

A previously listed preview in READY state referred to an **early refactor commit**, not the final branch; do not use it for sign-off.

## Merge / release once outstanding items are signed off

1. Review screenshot artifacts and complete every manual approval checkbox above.
2. Verify a current-SHA preview and test the contact form through an authorized staging provider configuration. Confirm feedback fallback with missing Resend credentials.
3. Confirm all required PR checks green, no open high-priority regression, and stable production baseline.
4. Mark PR #14 ready for review; obtain human approval. Then squash/merge through GitHub (do not force-push to main).
5. Verify the production deployment SHA and homepage/13 routes, monitor contact submissions and errors, then create the release tag **`arch-block-theme-v1`** pointing at the verified production commit.
6. Rollback: revert the merge (merge commit: `git revert -m 1 <merge-sha>`; squash commit: `git revert <squash-sha>`) and/or promote the last known-good Vercel production deployment. Verify DNS, form API and runtime health.

## Phase B — only after Phase A landing

Do contract hardening on a follow-up PR without changing WordPress runtime status:
- `content/schema/section.ts`: layout discriminated union and immutable enum.
- `content/schema/page.ts`: validate SEO, pageTop, section arrays, notes and fullBlocks at runtime.
- `lib/render-sections.tsx`: keep the single layout-to-module map; export a testable lookup function.
- `blocks/*/types.ts`: complete, serializable attributes; never import page JSON directly.
- `patterns/*.tsx`: typed props and data-only marketing copy.
- `scripts/export-block-manifest.mjs`: emit versioned machine-readable mappings, not just raw TypeScript text.
- `README.md`: set architecture contract version and section authoring guide; update automated tests.

## Phase C — **not started**

When Phase A has merged **and** its UI has been accepted, create a **separate installable WP block theme and contact plugin**. Port tokens/editor styles first, then global parts, static patterns, interactive blocks, content serialization, and test editor versus frontend at 320/768/1440 px. Keep PHP/WordPress out of this Next.js runtime repository until separately approved.

## Risk register

| Risk | Severity | Owner / mitigation |
|---|---|---|
| Preview 403 / team scope 404 | Blocking | Vercel project owner connects authorized account + verifies current SHA preview |
| Pixel parity / alternate browsers | Release gate | Human sign-off on screenshot artifacts and preview across browsers |
| Resend delivery & DNS | Release gate | Secrets only in server environment, verify staging sender domain and mail success; do not change DNS casually |
| Next.js to Gutenberg future fidelity | Future | Separate Phase C build and editor-canvas screenshot tests |
