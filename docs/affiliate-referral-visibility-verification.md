# Affiliate referral visibility — 14 September 2026

## Customer boundary

- A referral is a record with a non-null, permanent `customerReference`.
- Admin lists, counts and customer detail routes exclude anonymous visits. Commission, payout and shipping records remain available independently.
- Affiliate dashboards show **Link visits** separately from **Referrals**. Imported LineScout customer claims are not counted as website link visits. Existing repeat-visit grouping still applies; this is not a raw pageview count or a precise count of individual people.
- Referral CSV exports use the same customer boundary.
- Conversion rate is purchasing customer referrals divided by registered customer referrals. Repeat purchases and renewals cannot inflate it above 100%.

## Attribution

The tracking endpoint resolves an existing customer from a verified session and the actual user record. Signed-in customers can now claim attribution without signing out and in again. An existing permanent owner takes precedence over new links or stale cookies. Self-referrals are rejected; concurrent claims converge on the unique permanent owner. Tracking input cannot supply customer identity.

## Schema repair

Admin now maps the existing `procurement_partner_customer_orders` table, including the inverse adjustment and payment-fee relations. Prisma validation and client generation passed. This repairs a missing schema model; no database migration or data alteration was needed.

## Verification completed

- Sure Imports attribution/reversal tests: 16 passed.
- Affiliate referral metrics and refund-earnings tests: 6 passed.
- Admin affiliate visibility and access-control tests: 26 passed.
- TypeScript checks passed for all three affected apps. Targeted lint checks passed in Sure Imports and Admin; Affiliate has no installed ESLint setup, so its verification used TypeScript, regression tests and the production build.
- Clean isolated production builds passed for Sure Imports, Affiliate and Admin. The main app skips build-time type validation, so its separate TypeScript check was run explicitly.
- Read-only Admin rendering checks passed across 10 populated screens and 6 empty native-customer screens, using 85 database reads and zero writes.
- Browser checks of synthetic Admin screens covered the desktop empty state and mobile dark theme, with no page overflow or browser errors. These checks are not a substitute for signed-in human acceptance testing.
- The reported affiliate (internal ID 31) has 5 tracked link visits, 0 registered referrals and 0 Admin referral rows. No identities were invented or records backfilled.

No deployment, commit or push was performed. Existing local server caches were preserved by building in temporary directories.
