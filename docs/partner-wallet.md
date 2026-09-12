# Partner earnings wallet

The partner is the customer-facing merchant. Sure Imports collects an order's NGN payment through Paystack, without an automatic subaccount split or virtual account. Only the snapshotted partner share of product cost enters the earnings wallet. Shipping, taxes and processing fees do not earn a partner share.

## Customer and business flow

1. The customer pays the frozen order checkout. Server-to-server verification records the payment and one Pending earning in the same database transaction.
2. The partner reviews and approves the paid order. Sure Imports fulfils it to the partner. This does not unlock the earning.
3. After operational fulfilment is completed, the customer opens the order and confirms **I received my delivery** or **I collected my goods**. Only that authenticated storefront customer can confirm. The earning becomes Available.
4. The business opens **Wallet** (`/partners/dashboard#earnings`), verifies its Nigerian bank destination and requests a withdrawal using its account password. The amount is reserved immediately. The request freezes the bank destination and is idempotent.
5. A superadmin opens **Partner Wallets** (`/dashboard/partners/wallet`), reviews the request and authorizes its transfer. Sure Imports must fund its Paystack balance, including the provider transfer fee. If Paystack requires an OTP, the admin supplies it for that same transfer.
6. Only a verified Paystack success marks the withdrawal Paid. Provider initialization alone does not. The existing Sure Imports webhook (`/api/webhooks/paystack`) dispatches `pww_` transfer references to the wallet handler. The partner notification cron reconciles outstanding transfers as a fallback.

The business may cancel a REQUESTED withdrawal before transfer processing starts. Processing or uncertain withdrawals cannot be cancelled or spent again. On a network timeout, reconcile first; any retry uses the same reference, never a new manual transfer. Uncertain retries have a two-minute concurrency guard.

## Holds, reversals and review

- Disputed earnings are held. Refund/reversal events adjust the related earning. Already-paid money is never silently removed from payment history; a shortfall blocks further withdrawals.
- Admin hold/release/reverse decisions require written evidence and explicit confirmation. Reversed earnings are terminal and require a separate reviewed correction rather than silent reinstatement.
- Clearing a hold returns an earning to Pending if customer receipt is still missing, or Available if receipt was confirmed. Resolving a payment dispute does not automatically resume an operational order's fulfilment hold; the procurement team reviews that separately.
- Account balances are derived in integer kobo from credits and withdrawal reservations, not editable totals. Wallet reads use a consistent database snapshot. Audit events are immutable through the application.
- Bank destinations and review evidence are encrypted at rest. The browser receives only masked destinations, and each withdrawal shows its original destination even after the business changes bank details.
- Password-protected bank changes, withdrawal requests and cancellations share a five-checks-per-15-minutes security limit.

## Agreement and activation

Agreement version `partner-2026-09-12-v2` describes the wallet model. Both business-fit and KYC approval are required before acceptance. The business must scroll to the end and explicitly accept; admin then confirms the current acceptance. Final confirmation activates the business and collection with `settlementPolicy=EARNINGS_WALLET`. Storefront/domain publication remains required for checkout; a bank destination is required for withdrawal, not customer payment collection.

Old automatic-split checkouts are not credited to the wallet, to avoid paying a partner twice. Unpaid legacy checkouts are blocked from reuse and require support review.

## Notifications and credentials

The existing branded SMTP notification queue covers bank changes, pending earnings, customer receipt, withdrawal requests, payout outcomes, holds and adjustments. Wallet messages link to the Wallet view. No new SMTP provider or webhook account is needed.

Existing server secrets: `NEXT_SECRET_PAYSTACK_SECRET_KEY` (or wallet fallback `PAYSTACK_SECRET_KEY`), `AFFILIATE_SECURITY_KEY`, SMTP credentials, and the partner cron's `CRON_SECRET`. Payment collection continues to use `NEXT_SECRET_PAYSTACK_SECRET_KEY`. All participating production apps must use the same Paystack integration and encryption key.

Local test credentials are preserved. Test keys may read the bank catalogue, but may not create real stored payout destinations, collect into the shared live ledger or execute withdrawals. Real transfer verification requires live credentials. No credentials should be exposed to browser code or committed to Git.

## Migration and rollout

`20260913160000_partner_earnings_wallet` creates the four wallet tables. It has been applied to the shared database; no request creates tables. Canonical migrations live in Sure Imports, with matching partner Prisma models and shared service copies in all three apps.

Deploy only on express instruction, through GitHub. Deploy Sure Imports' backward-compatible shared webhook first, then the partner and admin changes. Do not enable customer use of new wallet checkouts against an old webhook deployment.

Regression tests run independently in each repository with `node --experimental-transform-types --test tests/partner-*.test.mjs`. Tests mock provider writes. Browser fixtures and rollback-only SQL checks do not create real agreements, approve businesses, send customer emails or move money. A funded live transfer remains an operator-controlled acceptance test.
