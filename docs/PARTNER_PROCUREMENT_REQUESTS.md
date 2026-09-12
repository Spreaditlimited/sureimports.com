# Partner procurement intake — 2026-09-12

**Retired after product clarification.** Partners do not create requests. The API is closed and the form/admin intake queue have been removed from navigation. Existing records are preserved. Follow [PARTNER_CUSTOMER_ORDER_FLOW.md](PARTNER_CUSTOMER_ORDER_FLOW.md) instead; the remainder is historical implementation documentation.

## Available now

- Partner dashboard → Procurement requests (`/partners/dashboard#requests`).
- Authenticated owner `GET/POST /api/partners/procurement-requests`.
- Admin → Partner Requests (`/dashboard/partners/requests`), superadmin-only using the same partner review access boundary.
- Links, quantities, specifications, shipping preference and an internal reference. No customer accounts, names, email addresses or payment information are requested here.

The existing procurement checkout requires product prices and shipping measurements. This intake deliberately creates an immutable **quotation request**, not a legacy payable order with guessed prices. It does not initiate sourcing, payment collection, invoice creation, affiliate attribution or earnings. Sure Imports' client remains the partner, whose receiving address is captured from server-controlled business settings.

## Ownership and safety

Submission derives the partner from the owner session, then rechecks ownership, active/approved NG/NGN status, VERIFIED KYC and exclusive commercial membership inside the transaction. The parent row lock serializes submissions for that partner. No client-supplied partner ID, customer delivery address, rates, prices or affiliate code is accepted.

The normalized request has a keyed hash and partner-scoped unique reference/retry key. Identical retries return the original request; changed content or conflicting references return 409. New submissions are limited to 30 per partner per hour, with at most 20 products and a 96 KB body. Read pages return at most 20 records and are owner-scoped. URLs are HTTPS marketplace links; the server never fetches them.

Input, receiving-address snapshot and configured rate/version snapshot are encrypted using the existing partner envelope with request-specific authenticated context (`procurement-request:<partner>:<request>`). No changes to existing encryption formats or secrets. Rates are context for future quotation review, not booked earnings or an accepted price. Ownership and source data have no update endpoint.

## Testing and migrations

Migration `20260912160000_partner_procurement_requests` was applied using Prisma migrate deploy to the shared database on 2026-09-12. It adds one table with restrictive partner foreign key and unique reference/retry constraints. No existing application/order/payment rows were changed. No deployment was performed.

Five new synthetic policy/service tests exercise validation, encryption, retries/conflicts, read projection, authorization gates and throttling. The complete partner test suite has 53 passing tests. These mocked transactions are not a real concurrent-MySQL pilot. Browser-only practice submission was checked on a 390 px mobile viewport, with 16 px inputs and no horizontal overflow; desktop and dark-theme checks also passed. No live request was submitted.

The existing localhost sample dashboard shows a browser-memory-only practice form. It does not call the submission API, persists nothing after leaving the section, and grants no server permission. Real activation remains disabled by the existing rollout gate. The practice workspace's existing localhost/email restrictions have not been expanded to LAN access.

## Still required before completing procurement ordering

1. Admin quotation authoring, verified supplier prices, shipping-plan measurements, taxes/charges, expiry and revision control.
2. Partner quote acceptance and atomic/idempotent conversion into the shared procurement orders/products with immutable partner ownership and receiving address.
3. Guard every legacy order mutation/merge/payment path and affiliate commission writer before creating partner-bound legacy orders.
4. Quotation and request notifications, cancellation/correction policy and full audit lifecycle.
5. The partner-branded customer storefront and its separate customer authentication/data boundary. The current intake is owner-submitted, not a public customer endpoint.
6. Signed-in owner/admin and two-partner concurrency pilot. Payment/settlement policies and collection gate remain separate.

Do not describe this milestone as completed white-label storefronts, approved quotations, payable procurement orders or settled earnings.
