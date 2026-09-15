# Partner domain checkout refresh — 15 September 2026

Status: implemented locally; not deployed. No real payment, registrar contact creation, domain registration, or renewal was performed during verification.

## Customer journey

- Search for a domain and review its current price.
- Confirm prefilled contact details and supply any missing address fields.
- Continue directly to payment: UK partners use Sure Imports PayPal Expanded Checkout inside the partner dashboard; Nigerian partners use Sure Imports Paystack checkout.
- Verified payment triggers registration or renewal. Registration also starts domain connection setup; publication still requires the existing ownership, DNS, HTTPS and routing checks.
- Pending payment/registration outcomes remain recoverable. A missing response must not be treated as permission to charge or register again.

The ResellerClub integration remains in the domain-service repository. Its customer-facing Stripe checkout is no longer used for new partner domain orders. Existing Stripe payments remain verifiable; an unpaid old checkout must be safely expired before being replaced.

## Pricing decision

Upstream cost, currency conversion, configured markup and tax are retained. The old Stripe processing allowance is removed. PayPal processing fees currently come out of the domain markup; whether to add a separately configured allowance remains a business decision awaiting confirmation.

## Verification

- Partner payment and price tests: 9 passed.
- Domain ownership, payment, funding, legacy checkout, renewal, pricing and registrar-contract tests: 27 passed.
- Mocked browser journeys passed at 1440px and 390px: prefills, progress, no quote toast, inline PayPal, one capture action, registration feedback and no horizontal overflow.
- Partner production build passed, including TypeScript. Domain-service production build passed. Main-site production build passed; that repository's existing build configuration skips TypeScript checking.
- Unsigned payment-bridge requests returned HTTP 401.
- Diff whitespace checks passed across the three changed repositories.

Browser and provider tests used mock data. A human-assisted live card payment and actual domain registration/renewal still need testing after deployment. Other repositories were not changed for this task.

## Release notes

No database migration is required. Existing payment and domain-order tables are reused.

Deploy only with express authorization, through GitHub. Recommended sequence: partner app (payment bridge), domain service (new payment providers), main Sure Imports app (shared webhook forwarding).

The existing shared domain-service secret signs both directions of server communication. Sure Imports PayPal and Paystack credentials remain in the partner application, not copied to the registrar service. Optional origin overrides are `PARTNER_PAYMENT_ORIGIN` on the domain service and `PARTNER_PUBLIC_ORIGIN` on the partner app; production defaults point to `https://partner.sureimports.com`.
