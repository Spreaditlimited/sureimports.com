# Partner international rollout — 14 September 2026

## Implemented

UK activation, GBP earnings/withdrawals and native platform subscriptions are implemented. No deployment was performed. Automated provider responses were mocked: no live charges, subscriptions, refunds or payouts were created.

- Nigeria: registered businesses, NGN billing and Paystack settlement.
- UK: approved individuals/companies, GBP billing and PayPal settlement.
- UK agreement acceptance requires verified KYC, approved business fit, address evidence, manual identity/video confirmation, own-name payout review, an immutable UK application policy, configured GBP pricing and the Sure Imports PayPal credentials.
- Valid agreement acceptance atomically records the signed version, activates collection, queues notification and freezes platform terms. Repeated acceptance cannot duplicate activation or reset a trial.
- Customer payment, partner approval, shipping adjustments, refunds and customer receipt remain separate stages. Delivery to the partner alone does not release earnings.
- GBP withdrawals reserve funds, freeze destinations and verify individual payout outcomes. Unknown outcomes remain reserved; returned payouts reverse settlement; stale success cannot undo a reversal.

## Platform subscriptions

Admin configuration: `/dashboard/partners/countries`. Partner controls: `/partners/dashboard#billing`.

Monthly fee and trial length are configurable per country and frozen at first activation. Later policy edits do not silently reprice an existing account. A zero fee means a free plan; no price was invented or enabled in this implementation. Configure the intended fee before activating paid-plan businesses.

After the trial, the partner explicitly consents to the displayed recurring price and approves a native monthly Paystack (NGN) or PayPal (GBP) subscription. No payment is collected during the trial.

Signed webhook events and the scheduled worker reconcile provider-confirmed receipts, renewals, cancellations and reversals. Browser return parameters never grant access. Unknown setup outcomes cannot start a second payable attempt; refresh/reconciliation or support must resolve the original reference.

Cancellation preserves paid access. Expiry blocks new checkout and publishing/restoring the storefront only. Existing paid orders, refunds and legitimate withdrawals remain accessible. Billing and payout notifications use the branded email queue.

## Shared database migrations

Applied: `20260914060000_partner_country_policies`, `20260914070000_partner_country_settlement`, and `20260914160000_partner_international_billing`.

The international billing migration adds three independent tables for account terms, provider agreements and receipts; existing financial records are unchanged. The older NGN-only `20260914050000_partner_platform_billing` scaffold is not the active implementation and must not be blindly applied.

## Verification

- Sure Imports: 276 automated tests, separate TypeScript check and production build passed.
- Partner: 164 automated tests and production build including TypeScript passed.
- Admin: 94 automated tests and production build including TypeScript passed.
- `scripts/partner-billing-database-smoke.mjs`: rolled-back real database transactions covering UK manual safeguards, atomic activation/replay, frozen trial, consent, ownership, canonical currency, receipts, cancellation, reversal and lost-response recovery.
- `scripts/partner-gbp-journey-smoke.mjs`: rolled-back real database transactions covering payment, approval, shipping top-up, partial refund/recovery, customer-only receipt, processing-fee deductions, frozen payout destination, confirmation/return and replay.
- Billing browser checks: desktop light and mobile dark; no overflow or console errors; submission disabled until consent. No payment submitted.

Run tests with `node --test --experimental-transform-types tests/*.test.mjs`. Strip-only mode cannot handle existing constructor parameter properties.

## Production acceptance

Deploy only through the authorized GitHub workflow. Main-site webhook forwarding and partner handlers must be deployed together. Confirm live Sure Imports PayPal credentials, webhook ID, security key and worker secrets on the serving projects. PayPal webhook subscriptions must include subscription lifecycle and sale payment/refund events.

Then follow `docs/partner-uk-human-testing.md`. Automated mocks and OAuth scope checks are not proof of a successful live payment or payout.
