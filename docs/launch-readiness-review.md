# Launch Readiness Review Tracker

**Site:** https://ficcc.org
**Initial review:** 2026-08-20
**Last updated:** 2026-08-20
**Overall status:** High-priority code fixes and the fellowship CMS migration are live and verified; staff decisions and medium-priority work remain.

**Release safety:** The pre-remediation baseline is commit `044a4c4a53a57f9e53635eca10b1254087c4b2f4`. The production tip immediately before this deployment is tagged `pre-launch-deploy-20260820`; the reviewed remediation commit is tagged `launch-readiness-remediation-20260820`. Application and CMS rollback procedures are documented in `docs/launch-runbook.md`.

This is the durable tracker for findings from the post-launch code, CMS, and live-site review. Update the status, owner, notes, and verification evidence as work is completed.

## Status Legend

- [ ] Open
- [~] In progress
- [x] Verified complete
- [!] Accepted risk or staff-owned decision; document the decision in Notes

## Immediate Actions

- [!] Public email and Zoom credentials are intentionally retained for now and will move from the long card copy into the corresponding detail page.
- [x] Deploy and verify the Chinese fellowship link fix. The six-document CMS migration and production code deployment were verified on 2026-08-20.
- [x] Remove the unsafe `set:html` uses for CMS-authored giving descriptions and addresses in both languages.
- [x] Repair `package-lock.json` so `npm ci` succeeds from a clean checkout.
- [x] Upgrade/remediate production dependency advisories; unit tests and build pass.

## High-Priority Findings

### H1 — Stored XSS path through Give-page CMS fields

- **Status:** [x] Verified complete and deployed
- **Owner:** Site maintainer
- **Risk:** High
- **Evidence:**
  - `src/pages/en/give.astro` renders `method.description` and `method.address` with `set:html`.
  - `src/pages/zh/give.astro` repeats the same pattern.
  - These values come from plain Sanity `text` fields in `sanity/schemas/singletons/givePage.ts`.
  - The production CSP currently allows `'unsafe-inline'` scripts.
- **Impact:** A malicious or compromised CMS editor can publish HTML that executes in visitors' browsers. This is also an accidental-markup risk for ordinary editors.
- **Recommended remediation:** Render descriptions as normal escaped Astro text. Render multiline addresses as text with `white-space: pre-line`, or split escaped lines into `<br>` elements. Keep `set:html` only for hardcoded SVGs and output from the escaping Portable Text renderer.
- **Verification:**
  - Add a regression test with `<img src=x onerror=...>` and confirm it appears as text or is absent, never as an element.
  - Confirm ordinary punctuation, Chinese text, and multiline mailing addresses render correctly.
  - Run `npm test`, `npm run build`, and the Give-page E2E smoke checks.
- **Notes:** Both fields now use Astro's escaped text rendering. `white-space: pre-line` preserves staff-entered line breaks without interpreting markup. `src/lib/give-security.test.ts` guards both language routes. Verified with `npm test` (56/56) and `npm run build` on 2026-08-20.

### H2 — Dependency lockfile is not reproducible

- **Status:** [x] Verified complete
- **Owner:** Site maintainer
- **Risk:** High
- **Evidence:** `npm ci` fails because the committed lockfile is missing `@emnapi/core@1.11.1` and `@emnapi/runtime@1.11.1` required by the declared graph.
- **Impact:** Clean developer installs and both GitHub Actions workflows fail before build/test execution. The review also found a stale local `node_modules` tree using Astro 5/Sanity 5 while the manifest and lockfile declare Astro 7/Sanity 6.
- **Affected automation:** `.github/workflows/playwright.yml` and `.github/workflows/lighthouse.yml` both run `npm ci`.
- **Recommended remediation:** On Node 24 with the repository's npm version, regenerate the lockfile from `package.json`, perform a clean `npm ci`, and commit only the intentional manifest/lock changes. Do not validate against a pre-existing `node_modules` directory.
- **Verification:**
  - `npm ci` succeeds in a fresh checkout.
  - `npm ls` reports no `invalid` direct dependencies.
  - Both GitHub Actions workflows reach and pass their test steps.
- **Notes:** Regenerated with Node 24 and npm 11.17.0, recorded the package manager in `package.json`, and proved the result with a clean `npm ci` on 2026-08-20.

### H3 — Production dependency advisories

- **Status:** [x] Verified complete
- **Owner:** Site maintainer
- **Risk:** High, with mixed exploitability
- **Evidence:** `npm audit --omit=dev --audit-level=moderate` reported **19 production findings: 15 high and 4 moderate** on 2026-08-20.
- **Notable findings:**
  - Astro 7.0.9 reflected-XSS advisory affecting View Transition animation properties. The repository did not appear to use Astro View Transitions, which lowers immediate exploitability but does not remove the need to upgrade.
  - Sanity/admin and CLI transitive findings involving `adm-zip`, `undici`, `js-yaml`, module federation packages, and `nanoid`.
  - Build/media tooling findings involving `sharp`, `svgo`, `postcss`, and `tar`.
- **Impact:** The findings span the public SSR framework, embedded admin surface, and build pipeline. Some require attacker-controlled build/admin inputs, while others have broader runtime implications.
- **Recommended remediation:** Repair the lockfile first, then upgrade direct packages in controlled groups: Astro/Vercel integration, Sanity packages, and remaining transitive overrides. Avoid `npm audit fix --force` because it proposes incompatible Sanity downgrades. Review each residual advisory after every group.
- **Verification:**
  - `npm audit --omit=dev --audit-level=moderate` returns zero, or every residual finding has a documented, time-bounded risk acceptance.
  - `npm ci`, `npm run build`, `npm test`, `npm run test:e2e`, and `npm run test:a11y` pass.
  - `/admin`, preview mode, forms, and representative English/Chinese routes pass live smoke tests after deployment.
- **Notes:** Updated Astro to 7.2.4, Sanity to 6.10.1, their integrations, and affected transitive packages. Removed the unused `@sanity/vision` dependency. The old `@vercel/frameworks`/`js-yaml` overrides were advanced to patched versions. `@sanity/sdk-react` is temporarily pinned to 2.19.0 because its 2.20.0 published `.js` bundle contains untransformed JSX and fails under Vite 8; retain this pin until upstream publishes a compatible bundle. Final `npm audit --omit=dev` result: 0 vulnerabilities.

### H4 — Public CMS content contains operational credentials and a bad fallback link

- **Status:** [!] Link/detail remediation verified complete; public credentials accepted temporarily by staff
- **Owner:** Church staff / site administrator; site maintainer for deployment
- **Risk:** High if the credentials were not intentionally public
- **Evidence from `https://ficcc.org/zh/grow/chinese`:**
  - A personal email address and Zoom meeting ID/passcode are rendered in a public listing card.
  - The `学生团契/CCCF` card links to `/zh/fellowships/senior-fellowship`, which is the wrong detail document.
  - A direct query of the published Sanity document confirmed the card has no `detail` reference. `src/lib/grow-pages.ts` was incorrectly borrowing fallback links by array position; the fifth current card inherited the fifth fallback card's Senior Fellowship URL.
  - A 2026-08-20 published-dataset audit found no Chinese `ministry` detail documents and no explicit detail references on any of the six current cards. All live detail links were therefore supplied by legacy code fallbacks, not by staff-selected CMS relationships.
- **Impact:** Public meeting credentials can enable unwanted meeting access, and personal addresses can be harvested. The incorrect reference sends visitors to unrelated content.
- **Recommended remediation:** Confirm the intended privacy policy with staff. If the credentials should not be public, remove them and rotate the passcode. If CCCF should have a detail page, staff must explicitly select the correct `Fellowship Detail Page` in Sanity; otherwise the card should remain unlinked.
- **Verification:** After deployment, open the listing in a private browser and confirm CCCF no longer links to Senior Fellowship. Confirm the intended sensitive-content policy and click every remaining detail card to ensure each title matches its destination.
- **Notes:** Positional fallback links were removed and regression-tested on 2026-08-20. A CMS card now receives a detail link only from an explicit, visible Chinese Ministry reference. Studio validation now rejects two cards that select the same detail document. The guarded migration was applied to the production dataset on 2026-08-20: it created six detail documents, attached six explicit references, copied the complete current text (including the accepted email and Zoom details) into the corresponding detail pages, and installed shorter verbatim excerpts on the four long cards. A post-apply dry run reported `0 detail documents and 0 missing references`, confirming the migration is idempotent and no further CMS writes are pending. Live verification confirmed six distinct card routes whose destination headings match their source cards; CCCF now resolves to `/zh/fellowships/cccf`. The listing exposes no email, meeting-ID label, or passcode label, while the relevant detail page retains the accepted operational information.

### M9 — Fallback content does not reflect the populated CMS

- **Status:** [ ] Proposed
- **Owner:** Site maintainer / church staff reviewer
- **Evidence:** The built-in fallbacks predate substantial staff edits and use older group names and summaries. This mismatch caused the positional fellowship-link bug and can show stale content during a Sanity outage.
- **Recommended remediation:** Add a read-only, explicitly invoked snapshot command that exports published CMS content into a versioned fallback artifact. Review the diff before committing it, exclude drafts and Sanity metadata, and redact or deliberately approve operational credentials. Public loaders should prefer live published Sanity content and use the snapshot only when the CMS is unavailable.
- **Safety:** The snapshot flow must be one-way (`Sanity → repository`) and must never call a Sanity mutation API. It must not run automatically on every deployment because an outage could replace a good snapshot with incomplete data.
- **Sequence:** Implement only after the fellowship documents/references are applied. Before committing a snapshot, separately confirm whether credentials that are acceptable on the live CMS should also be stored in repository history.
- **Verification:** With Sanity available, staff edits win over the snapshot. During a controlled Sanity failure, representative English and Chinese routes render the reviewed snapshot. Running the snapshot command produces repository changes only and no Sanity mutations.

## Medium-Priority Findings

### M1 — Form request bodies and fields have no upper bounds

- **Status:** [ ] Open
- **Owner:** Unassigned
- **Evidence:** `src/pages/api/contact.ts` and `src/pages/api/ride-request.ts` call `request.json()` before any size check and validate only minimum field lengths.
- **Risk:** Oversized valid requests can consume function memory and create oversized/costly emails. Turnstile reduces automated abuse but is not application rate limiting.
- **Recommended remediation:** Reject large `Content-Length` values before parsing, cap every field server-side, validate dates and telephone lengths, and add an edge/platform rate limit keyed by IP plus endpoint. Return `413` for oversized bodies and `429` for throttling.
- **Verification:** Add boundary tests for maximum accepted sizes, one-byte-over limits, malformed JSON, repeated requests, and missing/invalid Turnstile tokens.

### M2 — Grow listing descriptions lack editorial guardrails

- **Status:** [~] Interim remediation complete; staff editorial review remains
- **Owner:** Site maintainer / church staff
- **Evidence:** `sanity/schemas/singletons/growPage.ts` requires `groups[].description` but sets no maximum; `src/components/GrowPage.astro` renders the entire value on the index card.
- **Risk:** Staff can unintentionally paste full detail content or sensitive information into a summary, producing extremely long, hard-to-scan cards.
- **Recommended remediation:** Rename/describe the field as a short public summary, add a reasonable hard maximum, and keep long copy in the referenced Ministry detail document.
- **Verification:** Sanity blocks over-limit summaries and the live listing remains concise at all responsive breakpoints.
- **Notes:** The Studio field is now labeled `Card Summary`, explains what belongs on the detail page, and warns above 360 characters. The fellowship setup migration preserves each complete current description in its detail document before installing a shorter verbatim excerpt from the same staff-authored text as the interim card summary. No new Chinese summary copy is introduced. Staff can revise those excerpts after migration. The limit remains a warning rather than a publishing block until staff have reviewed the workflow.

### M3 — E2E test is coupled to mutable production CMS content

- **Status:** [x] Verified complete
- **Owner:** Site maintainer
- **Evidence:** `e2e/smoke.spec.ts` requires an exact `福音組` card and `/zh/fellowships/gospel-group` URL. Staff replaced or detached that entry, causing four viewport failures.
- **Risk:** Legitimate staff edits break CI, while the test does not detect the actual bad student-fellowship reference.
- **Recommended remediation:** Use controlled CMS fixtures for deterministic tests, or assert generically that every rendered detail link returns 200 and that the destination heading matches the source card. Keep production-content monitoring separate from PR E2E tests.
- **Verification:** `npm run test:e2e` passes after normal staff content changes and fails when a card points at an unrelated document.
- **Notes:** Removed the retired fellowship document from the critical-route list. The browser test now discovers current CMS detail links and verifies their route shape and HTTP status. Link-resolution behavior is covered separately by `src/lib/grow-pages.test.ts`. Full result: 186 passed, 42 intentionally skipped, 0 failed.

### M4 — Chinese Contact page has an accessibility landmark violation

- **Status:** [x] Verified complete
- **Owner:** Site maintainer
- **Evidence:** Axe reports `landmark-complementary-is-top-level` for the nested `<aside>` at `src/pages/zh/contact.astro`.
- **Recommended remediation:** Match the English route's pattern by using a labeled `<div role="region">`, or move the aside to a valid top-level complementary position.
- **Verification:** `npm run test:a11y` reports zero violations on all configured pages.
- **Notes:** Replaced the nested `aside` with a labeled `div role="region"`. Axe reported zero violations across all eight configured routes on 2026-08-20.

### M5 — Detached fellowship detail documents remain public and indexable

- **Status:** [ ] Open
- **Owner:** Church staff / site administrator
- **Evidence:** `/zh/fellowships/gospel-group` is no longer linked from the listing but still returns a public page with a canonical URL and no `noindex` directive.
- **Risk:** Retired or stale CMS content remains discoverable by direct URL and search engines.
- **Recommended remediation:** Staff should turn `Publicly Visible` off for retired Ministry documents. Consider distinguishing `listed` from `public-by-link` only if that is an intentional workflow.
- **Verification:** Retired documents return a real 404/noindex response and are absent from internal links and sitemaps.

### M6 — Hidden and missing CMS pages create soft 404s

- **Status:** [ ] Open
- **Owner:** Unassigned
- **Evidence:** Dynamic routes use `Astro.redirect('/404')`; the resulting flow redirects to a normal rendered page instead of returning a direct `404` status.
- **Risk:** Search engines and monitoring can treat missing content as successful navigation, weakening indexing and error reporting.
- **Recommended remediation:** Return/render the 404 page with status 404 rather than redirecting, while preserving `noindex`.
- **Verification:** `curl -I` against an unknown event/fellowship slug returns `404` with no redirect chain.

### M7 — CMS publishing documentation is outdated

- **Status:** [ ] Open
- **Owner:** Unassigned
- **Evidence:** Staff guides repeatedly say changes require a 2–3 minute rebuild, but public content routes are server-rendered with `useCdn: false`; published changes are normally visible immediately. The deploy webhook is not required to refresh those SSR responses.
- **Risk:** Staff may wait unnecessarily, diagnose the wrong system, or expect a deployment to be the source of truth.
- **Recommended remediation:** Update staff guides to say published content is normally immediate, explain when a webhook deployment is still expected, and provide a short cache/private-browser troubleshooting flow.
- **Verification:** Publish and revert a harmless value, record observed timing, and confirm the documented workflow matches production.

### M8 — Public pages are uncached and depend on live Sanity queries

- **Status:** [ ] Open
- **Owner:** Unassigned
- **Evidence:** Production responses showed `x-vercel-cache: MISS` and `cache-control: public, max-age=0, must-revalidate`; most pages make several Sanity requests with `useCdn: false`.
- **Risk:** Higher latency, extra Sanity/Vercel usage, and greater exposure to upstream outages. Code generally falls back safely, but fallback content can be stale or inconsistent with current staff content.
- **Recommended remediation:** Establish an explicit freshness policy, such as short CDN caching with stale-while-revalidate for public responses while keeping preview responses private/no-store. Add monitoring for fallback activation and Sanity failures.
- **Verification:** Confirm cache headers/hit behavior, staff-update latency, preview isolation, and correct fallback behavior during a controlled Sanity failure.

## Lower-Priority / Operational Gaps

### L1 — CSP relies on `'unsafe-inline'`

- **Status:** [ ] Open
- **Risk:** Defense in depth is reduced, especially when combined with any HTML injection bug.
- **Recommended remediation:** After H1 is fixed, inventory inline scripts/styles and move toward hashed/nonced scripts where practical. Do not break Sanity Studio, Turnstile, analytics, or existing SSR pages while tightening the policy.

### L2 — Legacy redirect documentation says 301, production returns 308

- **Status:** [ ] Open
- **Risk:** Low; 308 is a valid permanent redirect, but the runbook's expected status is inaccurate.
- **Recommended remediation:** Either update the runbook to accept 308 or explicitly configure the intended status if downstream systems require 301.

### L3 — External operational controls remain unverified

- **Status:** [ ] Open
- **Owner:** Site administrator
- **Items requiring dashboard/manual verification:**
  - Real delivery and Reply-To behavior for all four forms.
  - Resend SPF/DKIM/domain health and recipient confirmation.
  - Sanity editor membership, least-privilege roles, MFA/account security, and recovery ownership.
  - Vercel project access, environment-variable scoping, deployment protection, and webhook secrecy.
  - Backup/export and content recovery procedures.
  - Uptime/error monitoring and alerts for form failures and Sanity fallback activation.
  - Human Safari/VoiceOver launch check.

## Positive Findings to Preserve

- [x] Sanity preview read token remains server-only.
- [x] Preview requests validate Sanity's secret and use HTTP-only cookies.
- [x] Preview redirects are constrained to the site's origin.
- [x] Public Sanity queries use the published perspective.
- [x] Public live pages showed no draft-editing controls.
- [x] `/admin` loads and requires Sanity authentication.
- [x] Turnstile is configured on the four public forms.
- [x] Form email bodies escape visitor-provided HTML.
- [x] HSTS, CSP, Referrer-Policy, Permissions-Policy, and MIME-sniffing protections are live.
- [x] Representative English and Chinese routes loaded without broken images.
- [x] Canonical and hreflang tags, privacy pages, robots.txt, and sitemap are present.
- [x] Bilingual navigation and legacy-domain redirects work.
- [x] Sanity failures are generally caught and fall back to built-in public content.

## Baseline Validation Results

| Check | Result on 2026-08-20 | Notes |
|---|---|---|
| Git worktree before review | Pass | Clean |
| `npm test` | Pass | 51/51 tests |
| `npm run build` | Qualified pass | Completed using a stale local install; not proof of the committed dependency graph |
| `npm ci` | Fail | Lockfile missing required `@emnapi` packages |
| `npm run test:e2e` | Fail | 186 passed, 4 failed, 42 skipped; all failures are the stale `福音組` assertion across viewports |
| `npm run test:a11y` | Fail | One Chinese Contact landmark violation |
| `npm audit --omit=dev` | Fail | 15 high, 4 moderate |
| Live public-route smoke check | Pass with content findings | EN/ZH pages, forms, sermons, and Studio login loaded; no broken images observed |
| Real email delivery | Not tested | Avoided sending messages during a read-only review |
| Sanity/Vercel account configuration | Not tested | Requires authorized dashboard review |

## Remediation Validation Results

| Check | Result on 2026-08-20 | Notes |
|---|---|---|
| Give-page security regression | Pass | Both EN/ZH CMS descriptions and addresses render as escaped text |
| Chinese fellowship link regression | Pass | Missing CMS detail references no longer inherit a link by array position |
| Clean `npm ci` | Pass | Completed from the repaired npm 11.17.0 lockfile |
| `npm audit --omit=dev` | Pass | 0 known production vulnerabilities |
| `npm test` | Pass | 7 files, 56 tests |
| `npm run build` | Pass | Astro 7.2.4 and Sanity 6.10.1 production build completed |
| `npm run test:e2e` | Pass | 186 passed, 42 intentionally skipped, 0 failed across four viewport projects |
| `npm run test:a11y` | Pass | 0 violations across all eight configured routes |
| Live post-deploy smoke test | Pending | Local changes have not yet been deployed |

## Recommended Remediation Order

1. Deploy and verify H1-H4's completed code fixes; confirm/rotate public credentials as needed.
2. Fix M4 and M3 so the full validation suite becomes trustworthy.
3. Add M1 form limits/rate controls.
4. Add M2 editorial guardrails and clean up detached CMS documents.
5. Correct 404 behavior, publishing documentation, caching, and operational monitoring.

## Completion Gate

Do not mark this review complete until:

- [ ] All high-priority findings are verified complete or explicitly accepted by an accountable owner.
- [x] `npm ci` succeeds in a fresh checkout.
- [x] Production dependency audit passes or has documented, time-bounded exceptions.
- [x] Build, unit, E2E, and axe checks all pass.
- [ ] Every public form completes a confirmed real-delivery test.
- [ ] A staff CMS publish/edit/hide workflow is verified in both languages.
- [ ] Sanity and Vercel access/security settings have been manually reviewed.
- [ ] The live deployment has been smoke-tested after remediation.
