# Nigeria RMB product pricing

- Nigeria-bound CNY/RMB product prices use `exchange_rate.exNairaToYuan` (NGN per RMB) directly. An absent/invalid rate blocks the estimate; there is no silent USD cross-rate fallback.
- USD and NGN input prices and non-Nigeria destinations retain their existing pricing basis. Shipping-plan rates and shipping rules are unchanged.
- The USD fields in the legacy order schema remain reporting/storage equivalents of the directly calculated NGN product value. They do not determine the RMB-to-NGN rate.
- Service charge, VAT and partner earnings use that product value. Partner allocations remain integer kobo. No shipping commission is introduced for partners.
- Editable Sure Imports estimates (`saved`, `on-hold`) use the current admin rates. Other statuses retain their frozen rates and totals. New snapshots write `productPricingVersion = 2`; NULL/1 retain historical cross-rate pricing.
- Partner initialized/paid checkout snapshots are retained. New checkout snapshots include the direct rate/version, copied into operational orders on partner approval.
- Customer manifests and the partner/admin order views show the direct rate beside existing rates. Nigeria customer financial breakdowns are shown in NGN.

Migration: `20260913170000_procurement_direct_rmb` adds one nullable column; it does not rewrite existing orders. Apply before code deployment. Schema updated in Sure Imports, Partners and Admin; migration owned by Sure Imports.

Verification: `tests/procurement-product-pricing.test.mjs`, `tests/procurement-paystack.test.mjs`, `tests/paystack-routing.test.mjs`, and existing partner checkout/wallet and procurement shipping tests. Run Node tests with `--experimental-transform-types` for the wallet parameter properties.
