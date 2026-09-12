# Locked partner storefront implementation plan

Approved by the user on 2026-09-12. Plan ID: PARTNER-STOREFRONT-9.

## Execution contract

This is the authoritative nine-point implementation checklist for the partner
storefront and custom-domain build. Read it before continuing this work and update
the progress record as work is verified. Keep the numbering and scope unchanged.
Do not substitute unrelated work or mark existing partial implementations complete.
Any necessary deviation requires the user's approval and a recorded amendment.

Implement in the sequence below. Supporting work must map to one of these points.
Mark a point complete only when its acceptance criteria have been verified, recording
the code, tests, results and any external verification. Mocked checks are not proof
of real domain registration, HTTPS readiness, payment collection or renewal.
Do not call the overall plan complete until all nine points work end to end.

All production businesses must use their own domain. They may connect an existing
domain or purchase one through the integrated service. Shared Sure Imports paths
are private previews, not a replacement production domain.

Preserve the established Sure Imports design and procurement workflow. Customer
orders are created by customers, paid, reviewed by their partner, then processed
by Sure Imports. Sure Imports supports partners, not their customers.

No deployment without express user instruction; all deployments go through GitHub.
Purchases and material external changes require appropriate authorization. Local
and production share a database: never treat local operation as permission for
destructive resets or fabricated production payments. Apply reviewed migrations
during implementation; do not create tables in runtime request paths.

## Baseline findings

- The dashboard hash preview is gated by `data.testMode` and otherwise falls back
  to the owner dashboard. It is not a reliable landing-page preview route.
- A storefront renderer, customization controls and domain data model exist.
- The hostname resolver is not wired into incoming request routing.
- The domain service in `tochukwunkwocha-next` includes registrar adapters,
  availability, pricing, registration, checkout and DNS management, but its public
  management endpoints are tied to student authentication.
- Its inspected renewal completion path updates a local expiry date without a
  registrar renewal call. This must be corrected before treating renewal as working.

## 1. Fix the landing-page preview first

Status: Preview confirmed working by user; full customer authentication and ordering remain assigned to points 6 and 9. Real non-fixture partner verification remains part of the final acceptance checks.

- Introduce a dedicated owner-authenticated preview route, proposed as
  `/partners/storefront-preview`, without the partner dashboard shell.
- Render the signed-in partner's saved draft with the same renderer as production.
- Remove dependence on local test mode; enforce authorization and no indexing.
- Provide distinct Preview landing page, Preview customer dashboard and Visit live
  website actions. Never silently fall back to the owner dashboard.

Acceptance: an authorized real partner can open the landing preview directly and
through navigation; unauthorized access is rejected; local fixture behavior is
tested separately; mobile and desktop previews show the actual storefront.

## 2. Complete the website editor

Status: IN PROGRESS — draft separation, explicit publish/restore commands and revision protection implemented. Real publication verification awaits domain provisioning.

- Organize branding, hero, how it works, benefits, FAQs, contacts and footer.
- Implement draft saving, desktop/mobile preview, explicit publishing and restoring
  the previous published version.
- Keep pricing, payment disclosures and procurement rules centrally controlled.

Acceptance: saving edits does not change a published site; publish and restoration
  are authorized, validated and atomic; preview and public rendering stay consistent.

## 3. Make a domain mandatory for publication

Status: IMPLEMENTED, awaiting real-domain acceptance — primary READY domain is required by publishing, customer order creation and checkout. Shared paths no longer act as public storefronts.

- Offer Connect a domain I already own and Buy a domain.
- Allow onboarding and customization before domain readiness, but block publication
  and acceptance of customer orders until the domain is ready.
- Keep shared-host previews private; do not offer a shared URL as the live storefront.

Acceptance: both UI and server enforce readiness; direct API calls cannot bypass
  the gate; an existing verified domain qualifies without buying another domain.

## 4. Connect the existing domain service securely

Status: IMPLEMENTED, provider verification pending — signed/replay-protected domain-service bridge, encrypted business registrant, quotes, persistent checkout, registration reconciliation and scoped DNS/renewal APIs are in place.

- Reuse the registrar service in `tochukwunkwocha-next`; keep registrar credentials
  and registration operations there.
- Add scoped server-to-server APIs for availability, quotes, registration status,
  DNS operations and renewal, with immutable partner references and replay protection.
- Require accepted pricing and purchase confirmation; verify payment and implement
  idempotency, retries and reconciliation without duplicate charges or registrations.
- Check registration status after an ambiguous timeout before retrying a purchase.
- Record the partner business as registrant; do not require a student account.

Acceptance: authorized partner purchase lifecycle is traceable; cross-partner access,
  stale quotes, forged payment evidence and replay are rejected; ambiguous provider
  responses and paid-but-unregistered cases have safe recovery paths.

## 5. Automate Vercel connection

Status: IMPLEMENTED, provider verification pending — Vercel attachment, ownership challenges, exact DNS recommendations and pinned HTTPS proof checks; purchased-domain DNS adds individual records and refuses conflicts.

- Attach hostnames to the designated shared storefront project through Vercel APIs.
- Obtain ownership challenges and exact DNS requirements from the provider.
- Apply records where the domain service controls DNS; otherwise show instructions.
- Verify ownership, DNS configuration and HTTPS separately before activation.
- Preserve unrelated DNS and email records; avoid unnecessary nameserver changes.

Acceptance: purchased and existing domains both progress to a verified HTTPS site;
  conflicts, propagation delays and retries are handled; API credentials remain
  server-side; account access verification alone is never treated as DNS readiness.

## 6. Implement domain-aware storefront routing and authentication

Status: IMPLEMENTED, full browser/provider acceptance pending — hostname allowlist/rewrites, tenant-bound credentials and sessions, verification/reset links, branded auth pages and verified payment callback hosts are in place.

- Serve businesses through one shared storefront application, not cloned websites.
- Resolve each verified hostname to exactly one partner: `/` for landing,
  `/auth/login` for branded authentication, `/dashboard` for that business's customers.
- Reject unknown/inactive hosts without falling back to the Sure Imports website.
- Scope sessions, API authorization, customer records and caches to the partner.
- Use verified domains for verification/reset links and payment return URLs; replace
  the hardcoded Sure Imports checkout return URL.

Acceptance: two businesses cannot access each other's records or sessions; login,
  verification, reset, checkout return and navigation work on the correct domain;
  forged hosts and unsafe redirects are rejected.

## 7. Add domain management to the partner dashboard

Status: IMPLEMENTED, authenticated visual/recovery acceptance pending — partner domain/purchase/renewal controls and super-admin domain history, suspension and re-verification controls are in place.

- Show Payment pending, Registering, DNS required, HTTPS preparing and Ready states.
- Include connection instructions, retry checks, primary-domain selection, renewal
  dates and actionable errors.
- Provide admin provisioning history, failure alerts and controlled recovery.

Acceptance: displayed status reflects authoritative operation state; partner/admin
  permissions are enforced; retries do not duplicate operations; secrets are not
  returned to the browser.

## 8. Complete renewal and domain lifecycle management

Status: IMPLEMENTED IN PART — registrar-confirmed renewals, expiry gating, reminders and disconnect/reconnect are implemented. Ownership-transfer operations require the controlled manual procedure and provider confirmation described in the runbook; they are not an automatic transfer UI.

- Execute registrar renewal and confirm the authoritative expiry date before marking
  renewal complete; implement reminders and failure handling.
- Cover replacement, expiration, disconnection and ownership transfer.
- Do not cancel registration merely because a storefront is disconnected.

Acceptance: payment alone cannot mark a domain renewed; retries are safe; expiry
  and replacement behave correctly; business ownership and unrelated DNS survive
  disconnection; transfer procedures are documented and access-controlled.

## 9. Verify the complete customer journey

Status: IN PROGRESS — automated checks pass; no claim of live registration, real DNS/HTTPS activation, SMTP delivery or a two-business production customer journey. See runbook release gates.

- Verify two isolated businesses through customization, preview and publication.
- Cover existing-domain and purchased-domain connection.
- Verify signup, email verification, login and password reset.
- Verify customer order, payment, partner approval and Sure Imports processing.
- Exercise duplicate callbacks, registration timeouts, DNS failures and renewals.
- Check mobile/desktop layouts, themes, empty states and branding throughout.
- Apply required migrations safely and record the results.

Acceptance: record reproducible end-to-end evidence, distinguishing automated/mock
  tests from real provider checks. Document unresolved external prerequisites; do
  not report completion while required checks remain unperformed.

## Progress record

| Date | Point | Action and evidence | Result |
| --- | --- | --- | --- |
| 2026-09-12 | All | User approved and locked the nine-point plan; repository checklist created. | All points remain open pending implementation and verification. |
| 2026-09-12 | 1 | Added `/partners/storefront-preview`, using the authenticated owner-scoped settings API and shared landing renderer. Legacy hash redirects preserve `records=live`; login return path is allowlisted; page is noindex. Editor distinguishes saved preview from unsaved inline preview. Customer preview no longer silently falls back to the owner dashboard. | Implementation in progress; no deployment or database writes. |
| 2026-09-12 | 1 | 12 storefront/fixture tests pass, including non-test-mode owner reads and denied access. TypeScript passed. Browser confirmed actual signed-out login redirect; isolated response fixture with `testMode:false` confirmed standalone desktop/mobile landing, no console errors, 390px viewport/390px document width and legacy-link redirect. | Browser fixture is not real partner authentication. Verify an approved partner's actual saved content and navigation before marking point 1 complete. |
| 2026-09-12 | 1 | User confirmed the preview works after sign-in and acknowledged read-only account/order buttons. | Continue the agreed editor step; no claim that customer authentication is complete. |
| 2026-09-12 | 2 | Added draftSettings, previousSettings and revision without changing existing published fields. Saves only change drafts. Owner-scoped transactional publish/restore uses revision checks; restoration preserves the draft. Domain readyAt is a prerequisite marker, with no activation setter exposed. | Migration 20260913010000_partner_storefront_versions applied successfully to shared DB; no published sites changed. |
| 2026-09-12 | 2 | TypeScript and 71 partner tests passed, including server-side publication denial. Browser-only fixtures verified Save draft is enabled and publish/restore are disabled without readiness; mobile publishing controls visually checked. | Live publication and rollback are not provider-verified; intentionally unavailable until domain provisioning passes. |

## Approved amendments

2026-09-12: User requires an independent `partner.sureimports.com` folder/project.
Finish the existing implementation, extract and reuse it, then thoroughly test
links and features. User additionally requires a final repository-boundary audit
of Sure Imports and admin: remove misplaced partner-only code without breaking
central procurement, payments, authentication or administration. See
`docs/PARTNER_REPOSITORY_BOUNDARIES.md`. Extraction is not complete merely because
the new project compiles; duplicate workers, legacy links and ownership of shared
modules must also be resolved before release.

2026-09-12: User requested real business-domain testing after deployment to simulate
the actual business journey. Complete safe local implementation/smoke checks first,
then build and deploy only when instructed. This defers provider acceptance, not
its requirements: points involving real domains/payments remain pending until
post-deployment evidence is recorded. No scope or numbering change.

## Latest verification checkpoint — 2026-09-12

93 main-app partner tests and 8 domain-service tests pass. TypeScript passes in
all three involved repositories. Fifteen unauthenticated localhost HTTP checks
and isolated mobile/desktop preview/theme checks pass. SMTP TLS/authentication
passes (no email sent). Domain-service dependency audit is now clean. Required
migrations are applied. Vercel hosting token and shared bridge configuration are
present; deployed bridge secrets are Sensitive, and local credential files are
Git-ignored. No credentials were rotated and no deployment occurred.

See `docs/PARTNER_DOMAIN_OPERATIONS.md`, latest verification, for exact limits and
remaining acceptance. This checkpoint does not mark all nine points complete;
production builds and real provider/customer journey checks remain outstanding.

## Continued implementation evidence (2026-09-12)

- Points 3–7: added owner-scoped domain management, server-only Vercel integration,
  a separately authenticated domain-service bridge in `tochukwunkwocha-next`,
  bounded requests and registrar calls, durable quote/payment references, business
  registrant encryption, and no repeated registration after ambiguous responses.
- Point 6: custom hostnames expose only the business storefront, customer auth and
  its own order APIs. Credentials are independent per business, while internal
  user identities can be reused without changing main-site passwords. Cookies are
  host-only, Secure, HttpOnly, and signed with a separate derived key/audience.
  Password reset increments the business credential version and invalidates old
  sessions. Sure Imports advertising/chat/JSON-LD is excluded from tenant hosts.
- Point 7: admin UI `/dashboard/partners/domains` inherits the existing dashboard
  shell, surfaces errors/history, and restricts audited recovery to super admins.
  Recovery cannot skip ownership, DNS or HTTPS; owners cannot override suspension.
- Point 8: paid renewal requires the registrar's renewal pricing and confirmed
  expiry. Both new platform renewals and the legacy domain-service completion path
  use the guarded registrar operation. Historical local-only “renewed” records
  require review, not a new registrar charge. Scheduled checks and owner reminders
  are configured but have not run in production.
- Migrations applied: Sure Imports `20260913020000_partner_domain_operations` and
  `20260913030000_storefront_customer_auth`; domain service
  `20260913020000_domain_platform_bridge` and
  `20260913040000_domain_platform_renewals`. The auth migration initially hit MySQL's
  index-name length limit; verified the one created table, shortened the index,
  applied only the remaining SQL and marked the corrected migration applied.
  No tables or user/payment records were removed.
- Tests: 81 Sure Imports partner tests and 6 domain-service tests passed, including
  cross-tenant sessions, token replay/expiry, HMAC replay, forged payment evidence,
  and no duplicate registrar attempt after registration/renewal timeouts.
  These provider tests use isolated in-memory doubles, not live purchases.
- TypeScript passed in Sure Imports, admin and domain service before final cleanup;
  rerun after subsequent edits. The existing local Next server retained an old
  Prisma client; restarted only the verified Sure Imports process on port 3001.
  Browser: partner landing renders without error overlay; real HTTP checks returned
  404 for an unknown host, 404 for tenant auth on the main host, and 200 for the main
  homepage after restart. Authenticated tenant visual checks remain open.
- Historical release gates at this checkpoint (superseded by the latest verification below): local Vercel/domain-service credentials and CRON_SECRET are absent;
  real business domains have not been nominated for the final tests. No deployment
  or domain purchase was performed. Domain-service dependency audit reports existing
  advisories (including Next.js critical); remediation is required before release.
  Removed legacy commented SMTP credentials from source; rotate any still-active
  credential and audit repository history separately.
- Operational details and remaining release checks:
  `docs/PARTNER_DOMAIN_OPERATIONS.md`.

### Additional verification and hardening (2026-09-12)

- Added bounded DNS resolution and total HTTPS probe deadlines so slow providers
  cannot occupy a verification worker indefinitely.
- Added isolated concurrency tests for cross-partner checks, competing workers,
  suspension during verification and disconnect during verification. Old workers
  cannot restore a cancelled domain lease or overwrite suspended/disconnected state.
- Fixed renewal reminder batch starvation: handled reminder events are excluded
  before the batch limit. Tests cover more than twenty businesses, duplicate claims,
  failed delivery visibility and stale-worker recovery. SQL selection still needs
  a database-backed acceptance check; the regression suite uses a selection double.
- Added business-owned metadata for landing, auth and customer dashboard, replacing
  inherited platform canonical/publisher/social identity and favicon fallback.
  Public storefront rendering reuses the request-scoped verified tenant snapshot.
- The private preview now removes live action URLs instead of relying solely on
  click prevention (which allowed open-in-new-tab). Browser response fixtures passed
  at 390px and 1440px with theme switching, saved non-test-mode branding, no horizontal
  overflow and disabled customer actions. No real partner settings were modified.
  Reproduce with `node --experimental-strip-types scripts/partners/verify-storefront-preview.mjs`.
- Domain service frozen registration/renewal states cannot restart provider work;
  its isolated suite now has eight passing tests. This does not replace the manual
  coordinated registrar transfer acceptance requirement.
- Final real HTTP checks return 404 for an unknown hostname and for tenant auth on
  the main localhost hostname. No domain purchase, DNS mutation or deployment occurred.
- Final local TypeScript check and all 89 partner tests passed. The read-only
  `verify-domain-reminder-sql.mjs` diagnostic confirmed MySQL/JavaScript reminder
  identity parity at eight millisecond/expiry-band boundaries against the configured
  database. It uses synthetic SELECT values, not real business records. No email sent.
