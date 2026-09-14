# Sure Imports Expanded Checkout rollout

Status: implementation in progress. Not deployed; do not describe this as complete coverage yet.

## September 14 continuation

- UI-only GitHub releases are production READY: main b7b16cf, admin 6e1a332, affiliate 7d5f9a0, partner 1a20620. LineScout a41d517 was already READY. Payment work remains uncommitted locally.
- Main PayPal transport has timeouts, canonical post-capture reads, approval checks and timeout recovery. 16 regression tests pass.
- Main special-sourcing USD 20 legacy flow now has an owned, server-priced PayPal checkout, deterministic payment reference, receipt delivery markers, webhook and reconciliation. Uses existing payments.paymentExt2 JSON text. Needs regression/browser checks. Legacy supplier-verification routes redirect to the current implementation; unused components are not active payment paths.
- LineScout now has /checkout/paypal signed sessions + shared card fields using its own existing app credentials. Its shared creator returns Expanded Checkout for sourcing and both quote types. Capture retries, saved-price checks, sourcing ownership checks and quote row locks added. Webhook now routes quotes/shipping correctly and propagates failures for retries. Needs reversal handling, comprehensive tests and local/browser checks. No production deployment of these changes.
- Partner checkout now supports PayPal USD with the existing NGN cost snapshot and earnings. Frozen exchange rate and charge amount recorded in encrypted checkout; central ledger stores actual USD capture, partner approval reconciles the correct currency. Custom-domain checkout/return routes, verified callbacks, webhook forwarding from main, recovery, refund/dispute wallet holds added. Existing 4 Paystack workflow tests + new PayPal integration test all pass. Needs environment provisioning, browser verification, receipts and full failure-path audit.
- Partner platform subscriptions/configurable trial and fee are not implemented yet. Nigeria-focused platform billing should use existing Paystack subscription support, with explicit recurring consent and a free period before collecting any fee. No unapproved charges or automatic enrolment of existing businesses.
- Latest user also requests affiliate profile image display fix AFTER PayPal. Root cause found: affiliate next.config.mjs CSP img-src permits only self/data/recaptcha, blocking Cloudinary secure_url. Upload itself succeeds. Compare Sure Imports image delivery; add narrow Cloudinary image allowlist and verify actual image display. Not fixed yet.

Live-test approval: the user approved a USD 1 live test with the user entering their own card. Prepare the link only when the implementation is ready. No live charge has been made. This supersedes the previous sandbox-only test restriction below; sandbox fulfilment of live records remains prohibited.

## Implemented

- New Sure Imports app credentials, separate sandbox credentials, legacy-app lookup/capture compatibility for in-flight payments.
- Shared `/checkout/paypal` card fields and PayPal wallet option; light/dark styling, mobile layout, billing address, signed expiring links, error handling.
- Existing supplier report, supplier verification (including physical-visit payments), and corporate sourcing checkout creators now return this shared checkout.
- Amount/currency/custom reference checked before capture as well as after capture.
- USD procurement checkout with authenticated ownership, server pricing, persisted checkout intent, capture idempotency, order-state comparison, legacy payment-ledger record and affiliate conversion.
- NGN procurement remains on Paystack. The new USD PayPal path removes the former USD 1,000 bank-only cap; minimum USD 200 / 10kg initial-order rules remain.
- Additive migration `20260914010000_paypal_procurement_checkout` applied and recorded in the shared database. No existing order/payment records changed.
- New live-app webhook configured at `/api/intelligence/paypal-webhook`, with its ID saved locally and to Vercel Production. Existing legacy webhook configuration retained.
- Approved-event recovery for the existing PayPal services, and procurement capture/reversal handling.
- Admin-owned USD/GBP/EUR invoice checkout, server amount/capture validation, duplicate protection, central payment ledger, invoice payment and receipt creation, shipping/corporate-gift status updates, and shipping commission recording.
- Branded invoice receipts, signature-verified webhook forwarding to admin, existing hourly invoice-job recovery, and reversal/dispute review with commission reversal. Reversal allocation is deliberately manual: original invoice/receipt records are retained for audit.
- Admin migration `20260914020000_paypal_invoice_checkout` applied to the shared database; checksum verified. No test invoice, payment or checkout records were created. Existing invoices currently use NGN, which remains unchanged.
- Admin PayPal credentials added locally; the live app ID, secret and webhook ID added as Sensitive Production variables in the admin Vercel project. No deployment performed.
- Main local `ADMIN_INVOICING_API_BASE_URL=http://localhost:3000` points invoice testing at local admin rather than production.

## Still required before declaring all non-NGN payments complete

1. Complete card/capture/3DS verification. Sandbox credentials authenticate, but `CardFields.isEligible()` returned false. The approved USD 1 live test must be completed by the user entering their card, when the implementation is ready; the assistant must not submit a live charge.
2. Procurement receipts and scheduled recovery are implemented. Verify the customer/admin delivery markers and leases with mocked failure/retry tests. They reuse the existing Sure Imports email template and retry missed captures and receipt deliveries (including manual-review alerts). No real receipt has been sent during development.
3. Invoice integration is implemented; finish browser and real-payment verification of receipt delivery and shipping commissions. Six admin regression tests cover validation, repeat callbacks, changed invoices, recorded captured funds requiring review, and sandbox isolation. Both local public endpoints reject invalid invoice tokens. These are not substitutes for a completed live financial test. Existing bank-payment claims remain available and now have concurrent invoice-change protection.
4. Replace remaining legacy dashboard Flutterwave paths for special sourcing/legacy supplier verification using authoritative pricing and the proper service fulfilment. Some legacy components incorrectly label special-sourcing requests as procurement; do not trust those client service labels.
5. Complete a route-by-route audit of non-NGN collection, including any other legacy components. Shop checkout and intelligence credit checkout inspected so far are NGN-only and remain on Paystack.
6. Recheck declines, cancellation, duplicate submission, webhook retries/reversals, receipts and commissions across every connected service before GitHub deployment is requested.

## Configuration

Production:

- `SUREIMPORTS_PAYPAL_CLIENT_ID`
- `SUREIMPORTS_PAYPAL_SECRET`
- `SUREIMPORTS_PAYPAL_WEBHOOK_ID`
- `SUREIMPORTS_PAYPAL_ENV=live` (production default)

Local development defaults to sandbox:

- `SUREIMPORTS_PAYPAL_SANDBOX_CLIENT_ID`
- `SUREIMPORTS_PAYPAL_SANDBOX_SECRET`
- `SUREIMPORTS_PAYPAL_SANDBOX_WEBHOOK_ID` if using a sandbox webhook/tunnel
- `SUREIMPORTS_PAYPAL_ENV=sandbox`

The existing `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV`, `PAYPAL_WEBHOOK_ID` remain for legacy in-flight payments/payout notifications. New orders never fall back to the legacy credentials.

Local and production share the database. Sandbox confirmations must not fulfil live orders, record live payments or issue live commissions. New procurement stage keys include environment so sandbox and live checkout attempts cannot be reused across environments. Other service checkout initiation still creates pending service records; run testing only against dedicated test records, not real customer purchases.

## Checks

- `node --test tests/paypal-expanded-checkout.test.mjs`
- `npx tsc --noEmit`
- `git diff --check`
- Browser inspection with a diagnostic (nonexistent) order confirmed the new live app's card fields render; no order or charge was created for that inspection.

The PayPal credential/webhook configuration command is `node --env-file=.env.local scripts/paypal/configure-expanded-webhook.mjs`; add `--apply` only to register the new app webhook. This is configuration, not deployment.
