# LineScout affiliate consolidation

## Activation order

1. Apply `20260911120000_consolidate_linescout_affiliate` to the shared Sure Imports database.
2. Apply `migrations/20260911120000_central_affiliate_outbox.sql` to the LineScout database with `npm run affiliate:migrate-outbox`.
3. Configure the same strong `LINESCOUT_LEDGER_SECRET` in Sure Imports and LineScout. Configure `SUREIMPORTS_LEDGER_ENDPOINT` only when testing against a non-production Sure Imports host.
   The shared secret also signs and verifies the short-lived `sure_linescout_attribution` cookie used to preserve general Sure Imports referrals when the customer continues on LineScout.
4. Set `AFFILIATE_DATABASE_URL` and the existing `AFFILIATE_SECURITY_KEY` for the one-time migration process, then run `npm run affiliate:migrate-accounts` from LineScout.
5. Verify the migration totals, legacy referral aliases, and permanent `linescout:user:<id>` customer references before enabling delivery.
6. Deploy Sure Imports first, then Admin and Affiliate, and finally LineScout through GitHub.
7. Invoke the LineScout affiliate-ledger cron once. Confirm all historical payment states appear in `payment_ledger_entries` and the outbox has no failed records.
8. Configure Paystack’s single account webhook as `https://www.sureimports.com/api/webhooks/paystack`. LineScout references (`LS_`, `LSQ_`, and `LSSQ_`) are routed to LineScout after provider signature verification.

## Reconciliation invariants

- `payment_ledger_entries` is unique by source system, source payment table, and source payment ID.
- A permanent referral is unique by `customerReference`; a later code can never replace its owner.
- LineScout commitment fees use the configured `COMMITMENT_FEE` event percentage.
- LineScout product/project payments use the configured `PROJECT_PAYMENT` event percentage and exclude processing fees.
- LineScout shipping payments never use a percentage. They use the active `SHIP_WITH_US` KG or CBM rule and the final quoted quantity.
- NGN payments earn NGN commission. Foreign payments retain their original currency in the ledger and require a payment-time USD settlement snapshot for USD commission.
- Handoff payment rows are projections of quote payments and are not imported again. This avoids double-counting.
- Refund, reversal, dispute, and chargeback states void their linked conversion idempotently.

## Rollback

The migration is additive. If delivery must be paused, remove or disable the LineScout ledger cron while retaining the outbox. Do not delete delivered events or migrated ownership. Restore delivery after correcting the issue; the outbox and central unique keys make replay safe.
