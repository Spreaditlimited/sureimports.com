# Shop checkout integrity

Public `/shop/checkout` and `/dashboard/shop/checkout` use the same payment hook and server checkout service. No live charges were used during implementation tests.

## Authoritative data

- `shop_checkouts` stores customer ownership, a unique customer/request key, payment method, integer minor-unit total, catalogue-priced item snapshot and delivery address before payment initialization.
- Names, prices, availability and minimum quantities are resolved from `store`. A visible legacy product with a null status remains available; an explicit unavailable status is rejected.
- Changing the submitted total does not change the price. A mismatch returns an updated quote for customer review.
- Wallet checkout requires a verified customer session. Card checkout also accepts guest name, email and address; it is rate limited and same-origin. Browser-supplied customer IDs are ignored.

## Payment-first guest checkout

- Guests receive a server-priced pending checkout, not an account. Only verified successful payment permits account resolution and order creation.
- The existing Corporate Sourcing public-account helper creates new accounts with a secure password-setup email. Existing email accounts receive the order without changing credentials, starting a session or revealing account information.
- A random browser-held token authorizes access to that guest checkout. Only its hash is stored in the database; the token is sent in a header, never a URL. An order reference or email alone cannot open the receipt.
- Permanent affiliate attribution is claimed from the saved server-resolved referral before commission work.
- Account-setup email delivery has a persisted retry flag. Wallet and account-private APIs remain sign-in-only.
- Migration `20260922210000_shop_guest_checkout` adds guest access, attribution and setup-email tracking fields. Apply with `node --env-file=.env.local scripts/apply-shop-checkout-migration.mjs --guest --apply`.

## Payment lifecycle

- Paystack checkout redirects to the authorization URL created on the server. The client never initializes a second transaction.
- Callback verification and the existing signed account webhook call the same finalizer. It locks the checkout row and validates provider, reference, customer, metadata, currency and amount before creating records.
- Wallet settlement locks the wallet and rechecks funds inside the same transaction as the debit and order creation. A repeat request for the same checkout returns the original paid result.
- Receipts and commission work have persistent retry flags and run after payment commit. Failures do not turn a paid order into an apparent failed payment.
- `/api/cron/shop-checkouts` reconciles recent pending Paystack attempts and retries incomplete post-payment work every 15 minutes. It requires the existing `CRON_SECRET`. The schedule starts only after deployment.
- An uncertain provider initialization retains its original reference. It must not silently generate a second payment. The customer can check that reference or contact support.

## Compatibility and rollout

- Applied migration: `20260922190000_shop_checkout_integrity`. It only adds a table. Existing payments, orders, products and balances were not modified.
- Already-paid legacy shop orders remain accessible via the confirmation endpoint. An old in-flight transaction without a server-priced snapshot must be reconciled manually, rather than trusting legacy browser metadata to create an order.
- Retired unused shop routes return 410: `/api/pay-from-wallet`, `/api/paystack-payment/create-record`, `/api/paystack-payment/verify-payment`.
- Existing procurement, corporate and savings wallet callers invoke the protected wallet-reader in the current request context instead of making an unauthenticated internal HTTP request.
- SMTP is at-least-once: a process crash after provider acceptance but before recording the receipt flag can cause a duplicate receipt, never a duplicate charge/order.

## Verification

Run `node --test tests/shop-checkout.test.cjs`, `npx tsc --noEmit`, and `npm run build`.
Admin bank edit tests: `node --test tests/bank-account-edit.test.cjs` in the admin repository.
Browser payment responses are mocked; real Paystack authorization/capture and webhook delivery should receive a controlled live/sandbox smoke test after deployment.
