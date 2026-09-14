# International refunds and partner adjustments

## Current handoff — 14 September 2026

The refund and partner-adjustment implementation is ready for human acceptance testing of the currently active programme. This section supersedes the historical checkpoints below; those checkpoints are retained as an audit trail, not as the current backlog.

Read [the human-testing checklist](refund-human-testing.md) for the roles, URLs, expected calculations and recovery cases.

- Main, admin, partner and affiliate production builds passed. Main TypeScript was also checked separately because its existing build configuration skips type validation.
- Final automated suites: main **276**, partner **157**, admin **94**, affiliate **5**; **532 passed**, zero failures. Node tests requiring TypeScript parameter properties use `--experimental-transform-types`.
- Final rollback-only database runs passed: currency snapshots/notification claims, affiliate payout guards, external PayPal refund recording, and the complete partner adjustment/settlement journey. Fixtures were rolled back; provider responses were mocked; no live payment, refund, withdrawal or email was sent.
- Partner database coverage includes wrong ownership, hidden unapproved changes, revision conflicts, approval/decline, supplemental payment, original-payment partial refunds, duplicate confirmation, provider fees, lost-response recovery, terminal-failure retry, external-refund recording and reviewed hold release after customer receipt.
- Mobile dark and desktop light admin adjustment controls were inspected in the browser with synthetic responses. No horizontal overflow or browser errors; status-check interaction produced clear confirmation. The diagnostic browser was closed.
- Main and admin refund APIs and both partner adjustment APIs returned 401 without authentication. Migration checksum rechecked: `20260914150000_partner_order_adjustments` is applied. Whitespace checks passed across all four repositories.
- Shared Paystack forwarding now sends partner collection, supplemental-payment and withdrawal events to `/api/integrations/paystack` in the partner application. The partner verifies the original signed bytes. Standard Sure Imports events continue through their existing handler; failed forwarding remains retryable.
- Failed refund attempts can only be replaced after canonical terminal failure is verified. Replacement preparation sends no money and requires separate approval. Superseded allocations remain in history without double-counting captured funds.
- Historical PayPal captures use their owning live app, with fallback only after an explicit not-found response. An outage or uncertain POST never initiates a second refund through another app.
- External partner refunds can be recorded against an approved price reduction without sending money again. Manual hold release verifies provider refund history and keeps customer receipt as a separate requirement.

**Not performed:** deployment, a real provider charge/refund/transfer, or actual email delivery. Live financial acceptance requires coordinated deployment of main, admin, partner and affiliate changes through GitHub; the currently deployed webhook must not be mixed with these local changes. Human acceptance is not replaced by mocked tests.

**Separate scope:** UK partner activation, GBP wallet withdrawals and platform subscriptions remain tracked in `partner-international-rollout.md`. GBP adjustment arithmetic and original-GBP PayPal refund tests do not mean that the entire UK partner programme is enabled.

## Locked execution plan — approved 14 September 2026

Work continuously through these gates, in order. Do not report overall completion until a fresh verification pass succeeds. Record actual evidence, not assumptions. Preserve unrelated changes. No deployment and no live payment/refund/payout during testing.

- [x] Main refund implementation: durable notifications, settlement accounting/reporting, NGN safeguards, historical currency audit, component-specific commission corrections, unknown PayPal outcome recovery.
- [x] Automated main verification: request, approval, provider confirmation, settlement and queued notifications; partial/multiple payments, failures, retries and duplicate events. Real provider/email acceptance remains a human test.
- [x] Partner adjustments: versioned shipping/product changes, partner review, supplemental payments and refunds within the original order.
- [x] Partner earnings: no shipping commissions, proportional product corrections, actual processing-fee deductions, partial-refund handling and release after customer receipt plus financial reconciliation.
- [x] Fresh automated/database pass and targeted browser checks; live-test boundary documented above.
- [x] Refund/adjustment customer communication audit: clear amounts, progress and next steps; controlled customer errors and protected technical diagnostics.

Only genuine missing authority or unresolved business policy should interrupt implementation. Do not mark unfinished gates complete.

## Agreed requirements

- Finish main-site refunds before extending the partner flow.
- Nigeria refunds remain NGN. Non-Naira refund entitlements are USD.
- UK bank settlements convert USD to GBP at a locked admin-configured rate.
- APPROVED: PayPal refunds return in the original capture currency. PayPal/the customer's bank controls any GBP conversion, not our bank-settlement rate.
- Partner customer refunds are separate from partner earnings.
- Partner shipping adjustments generate no product commission.
- Product adjustments must adjust the associated earnings and taxes only.
- Do not deploy without express instruction; deployments go through GitHub.

## Implemented, not deployed

- Pure decimal/BigInt currency calculation and six regression tests.
- Procurement shipping and on-hold refund creation records USD for foreign destinations.
- Existing on-hold deduction percentage preserved; requires separate policy review before international launch.
- Ownership and same-origin checks on refund-generating procurement transitions.
- On-hold refund and return mutations use POST, with customer callers updated.
- Refund listing API derives user identity from the session rather than query parameters.
- Additive `20260914100000_refund_settlements` migration APPLIED to shared DB; existing financial records untouched.
- Foreign bank settlement quote/request API; signed 30-minute quote; USD and settlement amounts retained independently.
- Destination details encrypted with a dedicated purpose-derived key and refund-bound authenticated encryption.
- Customer inline request/status form and separate international balance display.
- Admin bank settlement confirmation validates exact frozen amount/currency and unique bank reference under row locks.
- Admin view exposes destination only behind existing refunds permission. Email settlement amount/currency reflects the transfer, not the USD base.
- Foreign bank requests are blocked where payment linkage is missing or PayPal funded the order, pending original-payment refund support.

## Not complete — do not describe as end-to-end ready

### Progress after currency-policy approval

- Added original PayPal refund requests and explicit admin money-movement approval.
- Added capture allocation/reservation with original-currency validation and partial-refund records.
- Applied additive migration `20260914110000_refund_provider_legs`.
- Known refund webhooks reconcile the provider result before changing local settlement status; known partial refunds bypass the older full-reversal handler.
- Existing cron reconciles refunds with known provider references. Unknown outcomes are not automatically resent; webhook invoice IDs can recover a lost initial response.
- Added three provider-policy tests (nine refund tests total).
- Shared-DB transaction smoke verified USD/GBP persistence, allocation records and rollback: zero test rows persisted and no provider called.
- Remaining caveats: email/ledger/commission reconciliation, historical refunds, legacy NGN confirmation hardening, unknown-outcome manual recovery and full browser/provider tests are still outstanding. Partner adjustment implementation has not started; main refunds remain first.

1. Currency policy resolved by user approval: use original capture currency for PayPal; guarantee GBP only for bank settlements at the locked rate.
2. Implement original-payment refunds, capture allocation, provider idempotency, pending/retry reconciliation, and webhook linkage; prevent overlap with manual bank settlements.
3. Apply settlement locks and unique references to legacy NGN manual confirmations as well.
4. Audit existing foreign refunds mistakenly stored as NGN. Do not relabel historical records without payment/order evidence.
5. Correct component-specific affiliate reversals; shipping-only refunds must not reverse product commissions.
6. Durable retryable notifications and settlement ledger/report reconciliation (table is currently the manual settlement record).
7. Full authenticated browser and rollback-safe database smoke tests; only pure money tests and TypeScript have passed so far.
8. Extend partner orders with versioned shipping/product adjustments, partner review, supplemental checkout, partial refund allocations, fee deductions and final earnings reconciliation.
9. Fix partner partial-refund webhook behavior, currently reversing whole orders/credits.

## Provider reference

https://developer.paypal.com/checkout/refund-payment specifies that refunds use the original payment currency.

## Safety

### Verification checkpoint — 14 September 2026

- Applied additive `20260914120000_refund_notifications`; no existing financial records changed.
- Retryable branded notifications are derived from durable settlement rows; delayed request messages are superseded after settlement, with atomic delivery leases.
- New NGN bank requests freeze the destination and entitlement atomically. Wallet transfers now retain their adjustment classification and write a settlement snapshot.
- Shared-bank confirmation now accepts validated NGN snapshots as well as USD/GBP snapshots; admin displays both.
- PayPal unknown outcomes can recover by invoice identity; minimal initial responses persist the provider reference before fetching canonical details. Added `Prefer: return=representation` according to PayPal's capture-refund API.
- Twelve recovery/notification/bank-confirmation tests passed, plus ten currency/allocation/bank-quote tests. These are mocked-provider tests, not live refund proof.
- Rollback-only database smoke passed for currency snapshots, provider allocations and notification leasing. Zero test rows persisted; no email or provider call made.
- Read-only historical audit: five pending NGN refunds; thirteen pending USD refunds; five requested USD refunds. No NGN procurement refunds linked to foreign destinations were found. No settlement snapshots existed before this smoke test.
- The five historical requested USD refunds need an explicit reviewed recovery path. Do not silently reset or pay them.
- Main typecheck passed after request hardening. Admin typecheck found a nullable currency prop; fixed, fresh check still required.
- Still outstanding: proportional commission corrections, full settlement reporting, legacy request recovery, authenticated browser coverage and partner adjustment gates. No completion claimed.

No live payment, refund or payout has been executed for testing. No deployment has been performed.

### Partner adjustment implementation checkpoint — 14 September 2026

- Applied `20260914150000_partner_order_adjustments`: four additive tables for versioned changes, supplemental checkouts, original-payment refund allocations and actual payment fees. Existing financial records were not changed. Schema definitions and migration files synchronized across main, admin and partner.
- Admin procurement details now include proposals and refund controls. Partner order details include approval/decline; customer order details include approved price comparisons, supplemental checkout and refund progress. API handlers enforce role/tenant ownership, same-origin mutations and revision checks.
- Original quotes remain immutable. Settled changes update order totals; product reductions recalculate service charge, VAT and product earnings from the original rates. Shipping changes generate no earnings.
- Payment confirmations write supplemental payments to the existing `PARTNER_PROCUREMENT` ledger under the original customer order. Fees are recorded separately and deducted from earnings, excluding fees already collected from legacy customers.
- Refunds reserve against original captures and keep their payment currency. An interrupted first response is checked by immutable provider identity; no blind second refund POST. Unknown partner refunds now hold the order for review instead of reversing the whole payment automatically.
- Wallet withdrawal requests and execution check unresolved adjustments under the shared wallet lock. Proposals cannot race a provider transfer already in progress. Customer receipt and admin release require financial reconciliation.
- Partner operational shipping transitions are intercepted before the main-site billing code. A changed final shipping amount is sent for business review; settlement advances an awaiting-shipping order. Cancellation requires the paid amount to have been refunded first.
- Branded business notices are queued for proposals, decisions, settlement and fulfilment. Customers see their storefront order; Sure Imports does not send these operational notices directly to partner customers.
- The rollback-only database test passed ownership, hidden unapproved customer changes, partner approval, exact partial refund, duplicate confirmation, original ledger preservation, actual fee deductions, withdrawal guards, declined changes, supplemental checkout, wrong-currency rejection and recovery of a simulated lost refund response. All synthetic rows rolled back; providers mocked and no mail sent.
- Targeted suite passed 56 tests. Partner/admin TypeScript checks passed; main Prisma validation passed. These are checkpoints, not the required final whole-system pass.
- Still verifying: existing admin mutation paths, external-refund exception closure/classification, invoice handler accounting, full concurrency coverage, browser interactions and final rerun. UK activation/billing/GBP withdrawals remain a separate incomplete country-rollout dependency; GBP adjustment arithmetic tests do not prove UK storefront readiness.

### Customer-message audit checkpoint

- Removed raw Paystack activation errors from wallet customer responses.
- Refund dialogs use plain progress descriptions instead of internal settlement status labels; browser/JSON exceptions have controlled fallbacks.
- Network failures instruct customers to check the current refund/wallet status, rather than asserting that a transfer failed.
- Refund list responses and page props explicitly select public fields, excluding internal adjustment metadata.
- Thirty targeted refund tests passed, including four customer-copy regression checks. This is not yet a complete audit of every customer-facing route or the partner adjustment flow.

### Resumed implementation checkpoint — 14 September 2026

- Admin-only Refunds permission hotfix deployed separately through GitHub as `36d111c`. The financial work below remains local and uncommitted.
- Added source-refund guards before affiliate payout reservation; unresolved refunds (including a reconciliation backlog or manual-review cases) prevent withdrawal requests.
- Admin execution rechecks unresolved refunds and new, unreserved deductions before submitting to a provider. Existing requested payout amounts are not silently changed.
- Earnings and CSV exports now retain original commission, show refund deductions and report net commission. Payout progress uses actual payout requests rather than a nonexistent approval status.
- Added adjustment relations to the three Prisma schemas matching the already-applied SQL table; no new database migration was needed for these relations.
- Added an admin settlement report separating completed/outstanding amounts by actual currency and bank/PayPal/wallet method. The report explicitly covers all requests, independent of list filters.
- Added PayPal status-only checks and explicit lost-reference recovery. Recovery verifies the canonical refund and cannot initiate another provider refund.
- Corrected refund-event capture linkage: a refund resource ID must not be mistaken for its original capture ID. See the PayPal Payments v2 refund response `up` link: https://developer.paypal.com/api/payments/v2/captures-refund .
- Fresh targeted run: 41 main refund tests and 2 affiliate earnings tests passed. Rollback-only database guard test passed with a synthetic commission and refund; all fixture records were rolled back and no provider was called.
- Browser check used synthetic admin API responses and blocked settlement submissions. Report/recovery layout checked on desktop and 390px mobile in light/dark themes; no page overflow or browser errors. Fixed panel focus/scroll and removed repeat-approval controls for already-attempted refunds. Diagnostic browser closed.
- Still outstanding: out-of-band partial-refund accounting (existing generic reversal handlers remain too broad), concurrent payout/refund cut-off coverage, complete customer-to-admin browser mutation tests with mocked providers, full partner adjustment workflow and final whole-system verification. No end-to-end completion or deployment approval is implied.

### External PayPal refund checkpoint — 14 September 2026

- Main-site unrecognised refund events now verify canonical refund/capture details and persist a deduplicated review event instead of falling through to a full payment/commission reversal. Missing linkage or unavailable verification returns a retryable response rather than silently discarding the event.
- Admin displays the review queue. A completed external refund can be linked to an existing, unpaid procurement adjustment with an exact currency/amount/customer/order match and a recorded product-retention breakdown. This only records already-returned money; it never posts another PayPal refund.
- Linking creates the settlement, provider allocation, source refund update and resolved review event in one transaction. Existing settlement allocations, mismatched ownership, insufficient capture capacity and absent component classification are rejected. Repeat linking is idempotent.
- Affiliate request and admin execution guards include unresolved external refunds. Once linked, the original source-refund guard still holds earnings until commission reconciliation completes. Further automatic PayPal refunds on a capture with an unresolved external review are blocked.
- Fresh targeted suite: 48 tests passed. Fresh TypeScript checks passed for main, admin and affiliate. `git diff --check` passed for all three.
- Two shared-database rollback tests passed: payout holds/release after review, and duplicate external-event delivery plus exact settlement linking. All synthetic financial records were rolled back; provider responses were mocked and no email/payment/refund/payout was sent.
- Browser inspected synthetic review data on 390px mobile dark theme and 1440px desktop light theme, with settlement network calls blocked. No horizontal overflow or browser errors. Diagnostic browser closed.
- Remaining: unresolved external refunds without an existing classified entitlement (and failed/cancelled external-refund closure), partner/invoice provider handlers, paid-commission full-reversal clawbacks, concurrent payout cut-off tests, full customer-to-admin interaction tests, partner adjustments, and the final whole-system pass. The financial rollout is still not ready for deployment.
