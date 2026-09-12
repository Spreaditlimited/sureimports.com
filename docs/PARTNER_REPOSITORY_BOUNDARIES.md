# Required repository-boundary audit

User requirement, 2026-09-12. Release gate for PARTNER-STOREFRONT-9.

## Intended ownership

| Repository | Must own | Must not independently duplicate |
| --- | --- | --- |
| partner.sureimports.com | Partner marketing, owner account interface, KYC submission, owner dashboard, website editor, tenant storefront/authentication, customer ordering, domain provisioning | A separate financial ledger, a second Paystack webhook, an independent migration history for shared tables |
| sureimports.com | Main customer site/authentication, procurement and fulfilment, authoritative payment webhook/ledger, shared database migration history, required partner payment integration | Active partner marketing/dashboard/editor routes or custom-domain hosting after cutover |
| admin.sureimports.com | Partner review, KYC evidence review, business-fit decisions, activation, domain supervision, central procurement/payment administration | Customer storefronts, partner-owner dashboard, customer account/authentication pages |
| tochukwunkwocha-next | Registrar integration, domain purchase/renewal billing, signed domain-service bridge | Partner portal hosting or direct access to another business's domain operations |

Shared partner-aware server modules are not automatically misplaced. For example,
Sure Imports' payment webhook imports `lib/partners/paystack-order-events.ts`;
deleting all files named "partner" would break confirmed-payment processing.
The admin partner review routes also belong in admin and must be retained.

## Completed local extraction and cleanup

- Independent local Git repository and Vercel project created. No GitHub push,
  deployment or hostname cutover has been performed.
- Partner app compiles with TypeScript validation and production build passing.
- Fifteen public/account/dashboard entry links return expected pages or policy
  redirects on localhost:3003. These are not proof of authenticated workflows.
- Production/Preview configuration is present on the partner Vercel project.
- Partner-only routes, tenant hosting, workers, modules and scripts moved to
  `../partner.sureimports.com`. Recovery copies are in
  `/private/tmp/partner-extraction-backup-uxCS5h`.
- Nine central-payment dependency modules remain in main, alongside their tests
  and the authoritative shared migration history. Admin retains its review,
  procurement and domain-supervision features.
- The partner repository's `docs/REPOSITORY_MOVE_MANIFEST.json` and
  `docs/MAIN_MODULE_CLEANUP.json` record the exact moved and retained files.
- Legacy `/partners/*` links redirect to port 3003 locally and the partner
  hostname in production. Removed partner APIs return 404, not cross-host redirects.
- Production builds passed for main, partner and admin. Main's stale development
  cache was moved aside; homepage and authentication routes return 200 again.

## Mandatory checks before declaring extraction complete

1. Inventory imported modules, dynamic imports, string-based API URLs, static
   assets, email links, callback URLs, cron jobs and provider project IDs.
2. Assign every partner feature to one serving project. In particular, the
   current main-app domain worker must not keep managing domains against the old
   Vercel project once storefronts attach to the new partner project. Move/scope
   workers and preserve their authentication, queue claims and scheduling.
3. Move partner-only tests, setup scripts and operational documentation with their
   implementation; retain central payment/shared-data contract tests in main.
4. Update main-site partner links and safe legacy redirects. Do not redirect
   customer tenant authentication to owner authentication. Preserve query/hash
   intent where relevant and reject unsafe redirect destinations.
5. Remove copied-but-unneeded storefront-only branches from main's root layout,
   proxy and main customer components only after tracing their consumers. Preserve
   fixes which benefit Sure Imports' own procurement interface.
6. Preserve unrelated dirty-worktree changes, all applied migrations and existing
   records. Never run a reset or delete an original merely because it was copied.
7. Audit admin navigation, top bar, empty states, permissions and reviewer actions.
   Partner review and domain supervision correctly remain in admin.
8. Verify secret files are ignored in every repository. No generated credentials,
   build artefacts, local fixture state or test customer data belong in Git.
9. Re-run all affected builds, type checks, cross-repository payment/approval and
   isolation tests, link checks and browser checks after cleanup—not only before.
10. Record a final retained/moved/removed manifest with verification evidence.
    Real domain/payment acceptance remains deferred until approved deployment,
    as requested by the user. Never describe fixture checks as live acceptance.

Live domain provisioning, provider checkout and settlement acceptance must still
be tested after approved deployment. Local fixtures do not establish those results.

## Final local verification evidence

The subsequent expanded verification supersedes the smaller suite counts below:
**120 main + 107 partner + 55 admin tests**, each suite run twice successfully.
**583 route patterns** checked twice against the final code, with zero unexpected
responses. See the full scope, corrections and remaining live acceptance gates in
`../partner.sureimports.com/docs/PREDEPLOYMENT_VERIFICATION.md`.

- Partner suite: 107 passing tests, including four repository-boundary checks.
- Main retained payment suite: 17 passing tests; additional TikTok bootstrap
  regression: one passing test. Main TypeScript check passes.
- Main, partner and admin production builds pass after extraction; the domain
  service production build also passed during the preceding integration audit.
- Partner HTTP smoke: 15 checks pass. Browser fixture checks pass at 390px and
  1440px for the preview, five owner-dashboard sections and theme switching.
- Main home/sign-in/sign-up: HTTP 200; removed partner API/worker endpoints: 404;
  legacy dashboard link: 307 to localhost:3003. Fresh homepage browser reports
  no uncaught errors after correcting the existing TikTok bootstrap.
- Admin private domain page redirects signed-out users to login. An
  unauthenticated domain-control POST is rejected with 403 before mutation.
- Main, partner and admin whitespace checks pass and environment files are
  Git-ignored. No data reset, live purchase or provider transaction was performed.

These checks do not claim every existing page was manually exercised with a real
authenticated account. Provider/token permissions, real-domain DNS/HTTPS,
customer checkout and settlement remain post-deployment acceptance checks.
