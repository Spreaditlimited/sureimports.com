# Affiliate commission ledger

Verified eligible payments are recorded in `affiliate_conversions`. The active
service and rate records in `affiliate_program_services` and
`affiliate_service_commission_rates` are the source of truth; payment routes do
not contain commission amounts.

## Rules

- `BUY_FROM_CHINESE_WEBSITES`: percentage of product cost only. Shipping, VAT,
  service charges, duties, and shipping-only top-ups are excluded.
- `SUPPLIER_REPORTS`: fixed commission per paid report.
- `PHONES_AND_LAPTOPS`: fixed commission once per qualifying shop purchase or
  completed Pay Small Small claim. Product category is checked in the database.
- `SUPPLIER_INTELLIGENCE`: percentage of every successful subscription charge,
  including renewals.
- `SUPPLIER_VERIFICATION`: fixed commission on the main verification payment.
  A physical-visit transport payment is never commissionable.

The payment currency determines the commission currency. NGN payments create
NGN commissions; USD payments create USD commissions. Unsupported currencies
are rejected by the ledger.

## Safety properties

- Attribution is resolved from the customer's permanent referral claim first.
- Anonymous Supplier Report checkout stores the signed referral identifier on
  the order and permanently claims it when the buyer account is connected.
- A unique payment reference and a unique service/order pair prevent duplicate
  commissions when callbacks or webhooks are retried.
- Refund, cancellation, dispute, reversal, and chargeback events void related
  ledger entries and retain the original status, reason, and provider/admin
  reference for audit.
- If a requested payout contains a commission that is reversed before provider
  processing begins, the payout is cancelled automatically and its unaffected
  commissions return to the available balance.
- A late payout-success webhook cannot change a voided commission back to paid.
- New commissions start as `PENDING`; approval and payout are separate flows.
