# Partner domain registration readiness

## Corrected in the domain-service repository

- Preserve the partner company through the client adapter and ResellerClub customer/contact creation.
- Verified externally paid partner registrations explicitly use `NoInvoice`; unrelated registrar callers retain their existing invoice setting. Renewal already uses `NoInvoice`.
- Check fresh available registrar balance against fresh upstream cost in a matching currency before returning/creating checkout and again before the first paid registration or renewal attempt.
- Insufficient or unverifiable funds block with customer-safe wording. A paid order remains `CHECKOUT_PENDING` and can be retried after funding; no registration claim or registrar mutation occurs at this point.
- Already attempted/ambiguous operations continue through reconciliation without resubmitting registration.

## Verification

23 targeted pricing, funding, registration and renewal tests passed, plus four Partner currency-display tests. The real registrar adapter was exercised with intercepted HTTP requests for GB and NG: company retained, contact IDs mapped, correct country/phone prefix, and `NoInvoice`. All mutations in that dry-run are simulated. Fresh isolated production builds for both applications, including TypeScript, and diff whitespace checks passed before the GitHub release.

The live read-only preflight confirms API authentication, availability lookup and .com account cost lookup. The initial GBP 0.01 interpretation was incorrect: that was the accounting conversion, not spendable funds. The available debit balance is USD 20.41, using the parent's selling currency (USD), while the response misleadingly echoes our retail currency NGN. The corrected guard compares this directly against upstream USD cost; it does not convert through retail/accounting currencies. No registrar customer, contact, domain or payment was created.

## Remaining operational requirement

USD 20.41 covers the currently fetched one-year .com cost of USD 13.49. A top-up is not required for that one purchase. No account top-up was initiated. A balance check is not a reservation: other purchases or price changes can affect available funds between checks. Registrar-confirmed active status and ownership remain required for completion. The corrected tests include the actual misleading currency-field fixture; 23 targeted tests pass.

Currency semantics: https://www.resellerclub.com/help/article/Currency-Behavior-in-the-Order-Management-Panel

No migration or secret change is required. GitHub release commits: domain service `c68f9bb`; Partner quote-feedback UI `efe5dc5`. Live paid registration remains a human acceptance test; no domain has been purchased during verification.
