# Corrected partner ordering model

This supersedes the owner-created quotation intake described in PARTNER_PROCUREMENT_REQUESTS.md. The business owner is not the order creator. The customer creates the order; the partner reviews and approves paid orders for processing.

## Existing Sure Imports behaviour inspected

- Create an order with destination, supplier currency and shipping plan; add product name/link, unit price, quantity, per-item KG/CBM measurement and specifications.
- `saved`: editable order, current financial estimates.
- Verified initial payment: `saved → pending`, with exchange rates, service charge, VAT and estimated shipping snapshotted.
- Operational approval: `pending → approved`.
- Actual shipping reconciliation: `pay-for-shipping → in-transit` once additional payment/adjustment is resolved.
- `ready-for-pickup → completed`, with `on-hold` and cancellation paths.
- Existing direct-customer payment options include bank, wallet and Flutterwave. These are **not** automatically copied into the partner programme: its agreed collection channel remains Paystack.

Sources: `lib/procurement/orderLifecycle.ts`, `shippingPricing.ts`, `shippingMath.ts`, customer procurement creation/product forms, `app/api/paystack-payment/procurement/route.ts`, customer status processing route and dashboard status constants.

## Partner difference

Customer saved order → server-verified payment → partner review → partner approval → SI processing (`pending`) → existing SI fulfilment stages.

Partner approval is a separate field, not the existing procurement `approved` status. Saved drafts and paid-but-unapproved orders must not enter the Sure Imports operational orders table. SI deals with the partner; the receiving address comes from the business, not the customer. No affiliate stacking.

## Implemented in this correction

- Partner dashboard creation form replaced with Customer order review, product detail, confirmation and transactional approval/release.
- Old owner-intake API returns 410 for GET/POST. Old admin request queue removed and its URL redirects to Partner Applications. Previously applied table/history remains intact, not relabelled as customer orders.
- Additive customer-order model separates customer identity, permanent tenant ownership, saved state, payment status, paid revision, partner review and eventual released order ID.
- Customer-scoped draft API at `/api/partner-storefronts/[slug]/orders` reuses Sure Imports sessions; strict input validation, bounded bodies, same-origin writes, encrypted storage, retry identity, throttling and partner receiving/rate snapshots.
- Actual supplier prices/quantities/measurements are collected; this is not a quotation request. Shared shipping configuration supplies Nigeria KG/CBM plans.
- Initial customer order form at `/partners/storefront/[slug]` is accessible only for an active, verified, published business. No business was published to test this.
- Partner list reads only paid/current-revision pending orders. The signed Paystack webhook and authenticated check-payment action use server-to-server verification before writing the payment ledger.
- Customer workspace lists and edits drafts, displays server-priced totals and processing fees, checks the minimum, freezes checkout and resumes the same payment reference. A changed total requires customer review again.
- Release locks the customer order, validates owner/membership/KYC and reconciles its paid revision with the payment ledger, then atomically inserts orders, products and partner earnings snapshots. The SI order belongs to the partner, not their customer. Duplicate callbacks/approval cannot duplicate the ledger or operational order.
- Refund/dispute events mark the customer payment for review and place a released order on hold; dispute resolution never automatically resumes fulfilment.
- Legacy customer mutation/payment routes reject partner orders. Both SI and admin affiliate conversion writers exclude partner procurement.

## Collection decision and setup

On 12 September 2026 the owner explicitly authorised collection now, deferring hold/release. Supported settlement is `PAYSTACK_AUTO_SPLIT`: **not escrow, not held until delivery**. Partner approval gates operational release only, not Paystack settlement.

The initializer uses the partner's verified subaccount and a flat main-account allocation equal to gross checkout minus partner product-cost earnings. Customer processing fees are grossed up using the published Nigerian local tariff. Current channels are `bank` and `ussd`; do not enable international cards against that tariff. Main account bears the provider fee, funded by the customer surcharge. Provider fee differences/settlement reconciliation remain separate from order payment confirmation. Sources: https://paystack.com/docs/payments/split-payments/ and https://paystack.com/pricing.

`node --env-file=.env scripts/partners/enable-standard-collection.mjs` is a dry-run; `--apply` enables only active approved NG/NGN partners with verified KYC, matching membership and verified live Paystack subaccounts. It never activates businesses, publishes stores, creates bank accounts or initiates charges. The authorised apply run found **zero eligible candidates**, so no business flags changed. New approved partners still need verified bank/subaccount provisioning before running this enablement step. A full admin bank setup/collection-control interface is not yet implemented.

Migration `20260912190000_partner_order_checkout` was applied to the shared database on 12 September 2026. It adds unique checkout references, encrypted intent snapshots and event history, and widens legacy product link/specification columns without deleting records. No live charge was made and nothing was deployed.

## Verification and remaining work — not a production sign-off

The partner suite passes 60 tests, including a synthetic checkout → verified payment → partner approval → SI handoff test, duplicate handling, amount/domain/owner/revision rejection and transaction rollback. These use mocked database/provider boundaries, not real charges. Main TypeScript passes.

The actual approved/published-storefront browser journey and Paystack settlement reconciliation still require integration testing. A lost initialize response preserves the same reference rather than creating a second charge; a provider duplicate-reference error may require support reconciliation. Current auth reuses SI sessions and redirects to the storefront; fully white-labelled identity is still pending. Later-stage price/shipping adjustments and payment/refund reconciliation, transactional notifications, and customer-delivery/settlement controls still need completion. The separate activation rollout safeguard remains intact.
