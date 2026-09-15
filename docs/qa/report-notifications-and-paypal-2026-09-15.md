# Supplier report notifications and PayPal checkout audit

## Notification defect and correction

Public Research Radar votes are aggregated into a research request with
`pidUser = MARKET_DEMAND`. The queue uses the internal Sure Imports inbox;
it is not a customer account. The previous research-approval handler sent
the customer-style result email to this internal address before PDF publication.

The admin now skips customer research-decision emails for that queue identity.
After the PDF edition is published, the actual voters are selected from
`intelligence_report_request_votes`, not from the internal research request.
Each email links to the published report product page, with purchase information.

The additive `20260915120000_report_voter_notifications` migration provides a
durable queue shared by Admin and Sure Imports. Publication sends immediately;
the existing 15-minute report reconciliation schedule retries outstanding sends.
The weekly Research Radar route uses the same implementation. No runtime DDL
was added.

Emails are deduplicated by report slug and normalized recipient address.
Conditional claims prevent concurrent workers from ordinarily sending twice.
Failed sends remain pending with backoff. A sent timestamp means SMTP accepted
the email, not proof of inbox delivery. SMTP is not exactly-once: a process crash
after SMTP acceptance but before saving the timestamp can produce a retry.
Previously published requests without delivery records are not blindly re-sent.

The two copies of `reportDemandNotifications.ts` and
`reportNotificationPolicy.ts` must remain synchronized between repositories.

## PayPal verification

Supplier report checkout calls `createPayPalOrder` in `lib/paypal.ts`, the same
helper used by procurement. It uses the Sure Imports app and returns a signed
`/checkout/paypal` session. The existing hosted `CardFields` UI does not require
a PayPal account for an eligible card payment.

Confirmed by code inspection:

- Reports, procurement, supplier verification, corporate sourcing and special
  sourcing use the shared order helper and Expanded Checkout page.
- Public invoice checkout uses the Admin invoice payment API and wraps its
  provider order in the same signed Expanded Checkout page.
- Amounts and currencies come from saved service records, not client totals.
- Report verification checks saved provider reference, amount, currency and
  custom order identity before capture; completed capture is required before
  report delivery. Callbacks, verified webhooks and scheduled reconciliation
  support recovery. Sandbox payments do not fulfil the shared live database.
- Intelligence subscriptions and extra search credits are currently NGN-only
  Paystack routes; they are not foreign-currency PayPal subscription routes.

Live, non-charging browser checks:

- Sure Imports live SDK returned `CardFields.isEligible() = true`.
- The production Expanded Checkout page rendered hosted cardholder-name,
  card-number, expiry and CVV inputs, plus billing address fields.
- A short-lived display-only session was used. No provider order was created,
  no card details were entered and no charge was submitted.

Automated checks passed: 33 targeted main-site tests, 10 Admin tests, separate
TypeScript checks, both Prisma schema validations and isolated production builds
for both applications. The main build skips type checking by existing config;
the separate `tsc --noEmit --incremental false` run passed.

A real card purchase including any issuer authentication, capture and delivery
has not been performed in this audit. Eligibility and rendering are not a claim
that every issuer/card will approve a transaction.

Reference: [PayPal Advanced Checkout](https://developer.paypal.com/docs/checkout/advanced/integrate).
[PayPal documents SCA_WHEN_REQUIRED as the default when no parameter is passed](https://developer.paypal.com/platforms/checkout/advanced/customize/3d-secure/api/).

## Release boundary

## Medical-scrubs publication

- Added Qingdao E-Song Apparel & Accessories Co., Ltd. using its official company,
  scrub catalogue and contact pages; the consolidated category has ten suppliers.
- The normal research approval, PDF generation, preview and publication routes
  were used. Existing publication quality gates passed.
- Cover review passed at 9.4/10 without lowering the 8.5 threshold. The original
  generated candidates repeatedly failed typography-zone composition checks.
- Visual inspection caught a cover email spilling onto a second page. Corrected
  its position and comparison rows' cumulative cursor drift in Admin reportPdf.ts.
- Regenerated PDF: 16 pages, 1,719,782 bytes; every page rendered for inspection,
  no empty pages, no prohibited phrases, consistent page dimensions. Admin's
  isolated production build was repeated successfully after the renderer change.
- Published current version: SIVMU2TJB279ZWVWI4. The public demand now points to
  `medical-scrubs` and has status `published`.
- One notification was SMTP-accepted at 2026-09-15T15:22:43.984Z on its first
  attempt. Database verification confirms its recipient matches the original
  vote and is not hello@sureimports.com. Inbox placement is not asserted.
- Public URL: https://www.sureimports.com/supplier-intelligence/reports/medical-scrubs

### Cover asset provenance

Built-in image generation was used for the replacement. Its unchanged source is
saved in the Admin repository at
`docs/qa/assets/medical-scrubs-cover-september-2026.png`, and the approved image
is stored in Cloudinary for the published report.

Final prompt:

> Create a portrait 2:3 photorealistic editorial cover BACKGROUND for a Medical Scrubs supplier intelligence report. No text whatsoever. Dark midnight navy seamless studio backdrop. A SMALL compact horizontal still-life of just two neatly folded medical scrub tops with visible V-neck stitching, one teal and one muted blue, and folded matching trousers. Actual realistic woven fabric and seam detail, premium restrained warm amber rim light. Entire still life occupies ONLY the band between 50% and 74% of image height, centered horizontally, with generous empty side margins. Top HALF entirely empty dark navy; bottom QUARTER entirely empty dark navy. No pedestal, no hanging clothes, no people, no labels, no logos, no watermarks, no borders. Shadows tightly confined to the small product arrangement. Understated executive publication photography. This is intentionally mostly negative space for typography which will be added separately.

## Deployment status

The notification migration has been applied to the shared database. Application
changes are local and require the usual GitHub deployment before future
production publications and scheduled retries use the corrected code.
