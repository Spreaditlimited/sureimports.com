# Domain pricing and report-cover verification — 15 September 2026

## Changes

- Admin report-cover generation now places generated artwork within a fixed safe area rather than relying on the model to leave exact percentage-based typography margins. The existing quality gate remains unchanged. Existing published covers were not replaced.
- Partner domain navigation and quote loading no longer emit generic success toasts. Errors remain visible. UK quotes, purchase confirmations and renewal records display GBP; checkout currency comes from the partner's saved country, not a client-supplied country.
- The external domain service in `tochukwunkwocha-next` fetches ResellerClub account cost for each new registration/renewal quote. UK quotes fetch the latest available daily USD/GBP reference rate, then apply markup, existing tax settings and configured card-processing fees. Missing or stale pricing fails closed.
- GBP uses the domain service's existing Stripe checkout. NGN retains Paystack. Payment verification checks the saved currency, amount, ownership and provider evidence before registrar fulfillment.
- `DOMAIN_PLATFORM_MARKUP_PERCENT` is available in the domain service admin settings. Its fallback is the existing target-margin environment setting, then 20%. This is markup on cost, not gross margin.

## Migration

Applied and recorded `20260915170000_platform_domain_currencies` in the domain-service database. Additive country, currency, payment-provider and pricing-snapshot columns preserve legacy NGN/Paystack records. No other migration was applied for this task.

## Evidence

- Domain pricing/order/renewal regression tests: 15 passed.
- Partner domain lifecycle/concurrency/security tests: 12 passed.
- Cover safe-area pixel regression: 1 passed.
- Fresh image generated through the actual image pipeline and assessed by the unchanged reviewer: approved on the first attempt, 9.1/10, no issues. This does not guarantee that future provider requests cannot fail.
- Browser fixture checks at 1440px and 390px: domain tab and quote loading produce no irrelevant toast, GBP price displays correctly, no horizontal overflow. The fixture blocks purchase mutations.
- Isolated production builds, including TypeScript checks: Admin, Partner and the external domain service all passed. Development servers were not replaced.
- `git diff --check` passed in all three changed repositories.

## Read-only provider price check

On 15 September 2026, account-specific ResellerClub `.com` costs were USD 13.49 for one-year registration and USD 13.99 for renewal. The fetched daily USD/GBP rate was 0.74069. With the current 20% markup, tax and checkout-fee settings, sample totals were GBP 14.82 and GBP 15.37 respectively. These are dated sample quotes, not fixed advertised prices. Quotes expire after 15 minutes.

Sources: [ResellerClub cost-price API](https://manage.resellerclub.com/kb/answer/1029), [Frankfurter reference rates](https://frankfurter.dev/).

## Release boundary

Source changes are not deployed. No live customer charge, registrar purchase or renewal was executed. Real checkout/registrar fulfillment remains a live acceptance test after deployment. Deploy the external domain service and Partner changes together; the migration is already applied.
