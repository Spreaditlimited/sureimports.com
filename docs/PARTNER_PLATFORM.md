# White-label procurement platform

## Agreed product boundaries

- `partner.sureimports.com`: partner onboarding, operations, earnings, settings and developer portal.
- Partner-owned verified domains: branded customer storefronts. First template: `procurement-v1`.
- `admin.sureimports.com`: business approval, operational support and fulfilment management.
- Sure Imports backend: shared procurement, pricing, payment integration and ledger.
- Nigeria only; settlement and customer checkout in NGN. Supplier product pricing may originate in CNY and must be converted by the existing pricing service before allocation.
- Sure Imports delivers to the partner. The partner serves and delivers to their customers.
- Partner and affiliate programme membership must be exclusive; no stacked commission.
- Service charge defaults to 15% of product cost. Partner share defaults to the last firm agreement of 5%, configurable to 10%; Sure Imports retains the difference.
- Shipping creates no partner or affiliate shipping commission on a partner order.
- Customer bears processing fees, excluded from earnings.
- One Sure Imports Paystack integration; verified partner subaccounts; Sure Imports payment branding.

## Implemented foundation

1. Additive Prisma models and migration for business profiles, storefront settings, verified domain mappings and one partner ownership/pricing snapshot per existing procurement order.
2. Pure NGN allocation engine in `lib/partners/pricing.ts`, using integer kobo and BigInt intermediate calculations. Service charge and partner earnings round half up; Sure Imports retains the remainder so allocations conserve money.
3. Pure collection gate which fails closed until settlement policy support is explicitly implemented. A database toggle alone cannot enable collection.
4. Server-only verified storefront resolution and partner-scoped order reads. These are internal functions, not public authentication boundaries. Future callers must derive partner scope from an authenticated membership or credential.
5. Unit tests for pricing, rounding, fee exclusion, invalid inputs, hostname validation and collection gating.

Migration `20260911160000_partner_procurement_foundation` was applied to the shared database on 2026-09-11 using Prisma migrate deploy. No partner payment, domain provisioning, payout or live storefront is enabled. Existing procurement and affiliate flows are unchanged.

## Application API

`GET /api/partners/application` returns only the signed-in owner's application. `POST` creates an unpublished, pending application and storefront atomically. Both currently reuse the Sure Imports session; the eventual partner portal must integrate its authenticated session boundary before using these handlers.

Submission requires same-origin JSON, a maximum 16 KiB body and validated Nigerian business contact information. Ownership, status, commission rates, bank verification and collection flags cannot be supplied by applicants. Unique owner/registration/slug constraints prevent duplicate applications. Business registration is collected for subsequent review, not automatically verified.

Submitting an application does not grant partner membership. Race-safe affiliate exclusion belongs in approval and affiliate admission before either is opened for partners. The application and KYC submission interface is available at `/partners/onboarding`; approval operations and the dedicated portal domain are still pending.

## KYC submission milestone

Migration `20260911170000_partner_kyc` was applied to the shared database on 2026-09-11. It adds encrypted KYC details, document metadata and audit events. No production applicants or personal documents were created for testing.

The onboarding page uses solid surfaces, light-default/dark support and responsive form layouts. Business-name and private-company document checklists differ by registration era. Founder, proprietor, director and beneficial-owner information is collected with accuracy, submission-authority and privacy acknowledgements. Raw BVNs and selfies are not collected; uploading evidence is not identity verification.

Documents are limited to 3 MB PDF/JPEG/PNG with signature checks, encrypted with AES-256-GCM before authenticated Cloudinary raw upload, and downloaded only through an owner-authorized server route. Cloudinary URLs never reach the browser. Encryption keys are purpose-derived from `AFFILIATE_SECURITY_KEY`; key rotation requires a re-encryption/recovery plan. Browser responses are no-store and document downloads are audited. Public advertising/chat widgets are excluded from partner routes; transitions from an already-tracked page reload before loading personal information.

Draft updates use revision checks and invalidate prior document attachments, preventing stale identity evidence from silently carrying forward. Submission checks all required files and locks the case. No approval or payment capability follows submission.

Before opening onboarding publicly: complete authenticated end-to-end review testing, consent-based identity/BVN verification, malware scanning, retention/deletion and failed-upload storage cleanup, access reviews, final privacy notices and processor agreements. The application currently supports business names and private companies only. Do not describe this milestone as a complete regulatory-compliance system.

### Interrupted upload recovery

Upload attempts have a five-minute lease, longer than the 60-second Cloudinary timeout. The authenticated, same-origin `POST /api/partners/kyc/recover-uploads` acquires the draft case lock and marks only expired UPLOADING attempts FAILED, recording an UPLOAD_RECOVERED event for each. READY documents are untouched. Upload completion acquires the same parent lock and checks the attempt's status and lease before superseding any document, so expired/recovered callbacks cannot replace newer files or modify submitted cases.

Onboarding exposes recovery in a disclosure under Verification documents and highlights detected expired uploads. Recovery refreshes the full saved draft; it is disabled while there are unsaved edits to avoid silently discarding changes or overwriting concurrent edits. Failed attempts do not exhaust the permanent nonfailed-document limit; all attempts still count toward a 60-per-hour throttle. No new migration is needed. This is upload-state recovery, not retention cleanup: orphaned encrypted Cloudinary assets remain for a separately controlled cleanup implementation. Automated lease-policy checks pass; a real interrupted-network/concurrent-browser pilot remains required.

## Admin KYC review milestone

The admin repository now provides `/dashboard/partners`, linked as **Partner Applications**. Only existing superadmin/L1 identities may access the page, case APIs or document downloads. The queue is paginated (25 per page), prioritizes submitted cases and records personal-data access and downloads. It follows the existing solid-surface admin theme.

Reviews require the current revision and lock the case transactionally. Only SUBMITTED cases can move to VERIFIED, REJECTED, or back to DRAFT for corrections. Acceptance requires explicit registration/identity/ownership check acknowledgements and an internal evidence reference. This records human checks; it does not perform provider verification. Applicant-visible messages and internal evidence references are encrypted; only the message, decision and date are exposed by the applicant API. Every decision is retained in the encrypted event history. Requested corrections allow an applicant to edit, reupload and resubmit.

The additive migration `20260911200000_partner_kyc_review` was applied to the shared database on 2026-09-11. Sure Imports owns these migrations; the admin uses parameterized queries against those shared tables and does not create them at runtime. Both apps must use the same `AFFILIATE_SECURITY_KEY` and Cloudinary account; local configuration equality was checked without printing values.

KYC acceptance never changes procurement partner status, enables collection or publishes a storefront. A separately gated business activation workflow is described below; banking and a full signed-in review pilot remain pending. Automated tests cover review rules and bidirectional encryption compatibility; the authenticated review UI has not yet been exercised with a real admin session. No applicant records were changed by these checks.

## Partner email notifications

New SUBMITTED and ADMIN_REQUEST_CHANGES / ADMIN_VERIFIED / ADMIN_REJECTED events queue applicant emails in the same database transaction as the event. BUSINESS_ACTIVATED events also queue an email atomically with business activation once that separately gated operation is enabled. The activation message explicitly distinguishes business activation from storefront publication and payment collection. Existing events default to NONE and are not retroactively emailed. The applicant receives generic status copy and a sign-in link, never documents, identity information or internal/reviewer notes. The existing Sure Imports SMTP transport and `mailTemplate2` branding are reused, with a plain-text alternative. No new email provider is required.

`/api/cron/partner-notifications` requires the configured CRON_SECRET and processes up to five events per invocation. It is scheduled every five minutes in Sure Imports' vercel.json, taking effect only after an explicitly authorized deployment. Vercel schedules do not run automatically on localhost. The protected endpoint can be invoked intentionally for local delivery testing, but it sends real emails from the shared queue; do not call it casually.

Delivery uses conditional claims, a five-minute worker lease, eight maximum attempts, exponential retry backoff and fixed non-PII failure codes. SENT means SMTP accepted the message, not verified inbox delivery. SMTP cannot guarantee exactly-once delivery: a crash after acceptance but before the database update can produce a duplicate; deterministic Message-ID values help identification but are not a provider idempotency guarantee. FAILED / DELIVERY_UNCERTAIN cases require operator investigation before a deliberate retry. No automatic destructive queue cleanup is included.

Migration `20260911210000_partner_email_queue` adds only delivery bookkeeping columns and `partner_kyc_email_queue_idx`. The original long index name was rejected by MySQL after the columns were added; the index was completed with its shorter mapped name and the migration reconciled. Tests simulate SMTP and database claims; no real email was sent during implementation. A controlled inbox-delivery test and operational failure monitoring remain launch checks.

Run the optional two-repository contract check from Sure Imports with `node --test --experimental-strip-types scripts/partners/review-cross-repo.test.mjs`. It requires the admin repository checked out beside Sure Imports and uses only synthetic keys/data in memory.

Checklist reference: [Paystack Nigerian compliance requirements](https://support.paystack.com/en/articles/2123970). Storage reference: [Cloudinary access control](https://cloudinary.com/documentation/control_access_to_media). These inform implementation, not a legal determination of every partner's obligations.

## Commercial membership and guarded activation

`commercial_program_memberships` reserves one commercial programme per normalized email fingerprint. The additive migration backfills existing affiliates, including pending and suspended accounts, without modifying their records. Affiliate signup reserves membership in the same transaction as account creation; a conflicting reservation rolls back the signup. No tables are created on request paths.

Admin case details include a separate activation section after KYC acceptance, requiring an explicit agreement acknowledgement and reference. The endpoint checks reviewer authorization, same-origin requests, the current revision, VERIFIED KYC, PENDING business status and Nigeria/NGN eligibility. It reserves PARTNER membership under a transaction lock and additionally checks existing affiliate accounts. Activation records encrypted evidence and leaves live collection disabled and storefronts unpublished.

**Activation is deliberately disabled by `PARTNER_ACTIVATION_ROLLOUT_READY = false` in the admin repository.** This applies to localhost too because the database is shared. Migration alone does not update deployed signup code. Deploy the protected affiliate admission path through GitHub only with explicit authorization; audit imports, account creation and email-change paths in every writer, verify compatible fingerprint keys, and test concurrent signup/activation before enabling this gate in a subsequent reviewed change. Retain the gate if an older writer can bypass membership reservations. Old signup code may create accounts after the initial backfill; reconcile these reservations before activation rollout.

This is email-based account exclusion, not proof that two different email addresses belong to different people. Cross-email founder/business identity matching remains a KYC review and verification requirement. An affiliate-to-partner transfer needs its own reviewed procedure for outstanding earnings and membership changes; there is no automatic deletion or conversion. Activation notification emails use the existing event delivery queue; no additional migration is required. Deploy Sure Imports' support for BUSINESS_ACTIVATED notification copy before enabling admin activation. The optional `scripts/partners/activation-transaction.test.mjs` exercises the actual activation service with synthetic transactions and a test-only enabled policy, including rollback on queue failure and affiliate conflicts. The real rollout constant remains false. These tests never activate a real business or send real SMTP messages and do not substitute for a concurrent database pilot.

### Import protection and deployment-gap reconciliation

The LineScout `scripts/migrate-affiliates-to-sureimports.mjs` importer now reserves membership for both new and merged accounts in its existing transaction, before adding external identities or aliases. A conflict aborts and rolls back that affiliate's transaction; previously committed imports remain. The importer itself was not run during this change. Its helper has a synthetic cross-repository contract test in `scripts/partners/linescout-membership-contract.test.mjs`.

Run `node --env-file=.env scripts/partners/reconcile-memberships.mjs` for an aggregate-only audit of current affiliate reservations. It scans in batches of 100, rechecks each account under a transaction lock and exits nonzero on gaps or conflicts. With explicit operator authorization, `--apply` adds missing AFFILIATE reservations only. It never overwrites existing ownership or modifies accounts. Repairs commit per account, so partial progress can remain after an error; rerun the audit. Conflicting reservations require human review, not automatic reassignment. A clean audit is a point-in-time result, not proof that older deployed writers are protected.

The scanned affiliate signup and LineScout import were the discovered affiliate-account creation paths. Sure Imports' profile endpoint matches the submitted email in its lookup and update; it is not an email-change workflow. This source scan does not cover manual SQL or external integrations, and is not a security clearance for unrelated legacy profile endpoints. Keep activation disabled pending the signed-in/concurrent-flow pilot and deployed-writer verification.

Run `node --test --experimental-strip-types scripts/partners/membership-contract.test.mjs` with sibling admin/affiliate checkouts for policy/schema and mocked reservation checks. These tests do not establish real database race behaviour or signed-in UI correctness. `node --env-file=.env scripts/partners/check-membership-migration.mjs` reports only aggregate reservation counts; it never prints email addresses or fingerprints and does not change records.

## Important implementation constraints

- New `procurement_partner_orders` rows bind to existing orders; one order cannot have two partner ownership rows. No reassignment/update endpoint should be exposed. Ownership write protection and concurrent creation must be tested when the creation service is added.
- `ownerPidUser` references the existing user identity conceptually. The guarded activation workflow verifies the owner exists and reserves shared programme membership. Production-wide exclusion is not established until every admission/import/email-change path honors the reservation and the rollout is verified.
- BigInt database amounts must be serialized deliberately (decimal strings or checked safe integers), never passed directly to JSON responses.
- Current collection planning is arithmetic only, not a Paystack payload builder. Fee pass-through must be tested with split settlement to avoid double charging and incorrect main-account retention.
- Bank verification and subaccount creation must be done server-side after business approval. Never allow customer payloads to set these fields.
- Domain verification tokens are stored as hashes. Domain activation, challenge verification, TLS provisioning and trusted request-host handling remain to be implemented.
- Product cost allocated to Sure Imports is procurement funding, not all revenue. Earnings dashboards must distinguish orders, collections, service revenue and profit.
- Do not apply migration commands on request paths or during sign-in. Local and production share the database; review and explicitly schedule migration application.

## Next implementation milestones

### Partner procurement intake

**Superseded:** owner-created intake was the wrong business flow and its UI/API/admin queue are retired. Follow [PARTNER_CUSTOMER_ORDER_FLOW.md](PARTNER_CUSTOMER_ORDER_FLOW.md): customers create/pay, partners review/approve, then Sure Imports processes. Customer saved-order persistence is implemented; payment/approval/handoff are not complete. The paragraph below records the prior milestone only.

Owner-submitted link/specification requests and the admin read queue are now implemented. See [PARTNER_PROCUREMENT_REQUESTS.md](PARTNER_PROCUREMENT_REQUESTS.md). The additive request-table migration is applied. Requests do not yet convert to the legacy procurement orders/products; quotation authoring, acceptance, conversion and legacy-path protections remain next. This does not complete the procurement creation or storefront milestones below.

### Partner workspace milestone

The partner website starts at `/partners` in the main Sure Imports app (`http://localhost:3001/partners` locally), with its owner workspace at `/partners/dashboard`. It now has connected partner-specific sign-up, sign-in and check-email screens using the existing account backend. This is not yet a separate deployment at partner.sureimports.com. It reuses the existing Sure Imports session and login return-path handling. The onboarding page links back to the dashboard. Partner screens use a shared theme toggle, with the existing light-default theme preference, solid surfaces and real Sure Imports logo assets. See `docs/PARTNER_TESTING.md` for the full local journey and its current limits.

`GET /api/partners/dashboard` derives ownership from the authenticated session, not query parameters. It returns only the owner's application summary; registration documents, review notes, email fingerprints and Paystack account identifiers are excluded. Responses are no-store/noindex. Pending applicants can see verification progress and launch readiness. Order queries require ACTIVE/approved Nigeria-NGN status, VERIFIED KYC and a matching commercial membership for the owner's current email. They are scoped to that partner and NGN. Any inconsistent membership hides operational data; a failed query returns an error instead of misleading zero balances.

The overview shows recorded order count, recorded order earnings and the configured product-cost share. Recorded earnings are sums of order snapshots, **not paid revenue, net earnings, settlement eligibility or withdrawable balances**. Order creation and the settlement/adjustment ledger remain separate work. Only the ten most recent order summaries are shown; no customer contact details are exposed. Publication and payment collection remain separately gated, with collection still blocked by the unapproved settlement policy.

Verification includes synthetic policy/service tests for state gates, owner query scope, wrong membership, restricted response projection, exact BigInt formatting and safe login redirects. Browser checks cover the real signed-out API/page plus a browser-only synthetic submitted-application state on desktop and mobile, light/dark theme, menu/Escape behaviour and overflow. No real partner was activated, no application was created, and no mail was sent. A real signed-in owner pilot and concurrent permission-change testing are still required. Public analytics/chat/payment scripts were absent from the checked partner page. No schema migration was needed.

1. Partner portal repository/app shell, authenticated partner membership, application and admin approval, with race-safe affiliate/partner exclusivity.
2. Shared procurement creation service: trusted partner ownership, delivery-address snapshot, idempotency, pricing and affiliate suppression. Block legacy mutation/merge/payment paths from bypassing partner policies.
3. Hosted template and server-stored customer drafts, secure account claim, partner-scoped customer access, dashboard and order tracking.
4. Dedicated earnings/adjustment ledger and settlement reconciliation, refund accounting and evidence-based release eligibility.
5. Paystack checkout/subaccounts and approved release mechanism behind the collection gate; signed webhook processing and dispute escalation.
6. Partner API credentials, scopes, OpenAPI documentation, outbound signed webhooks and isolated test mode.
7. Domain onboarding, partner branding/notifications, fulfilment manifests, receiving proof and customer-delivery evidence.
8. Full two-partner isolation, payment retry/refund, migration and fulfilment pilot verification.

## Unresolved launch gates

- Written merchant-of-record/platform agreement alignment with Paystack.
- Supported selective/manual subaccount release mechanism, maximum hold duration and reconciliation events.
- Customer-delivery evidence, non-response handling, partial-delivery release and review periods.
- Refund/chargeback recovery, reserve policy, negative balances and cause-based liability.
- Effect of customer-fee pass-through on the existing shared Sure Imports integration.

Do not call the fund hold escrow or advertise guaranteed protection. Do not release live earnings until the approved provider mechanism exists.
