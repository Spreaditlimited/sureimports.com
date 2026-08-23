# Body Camera Solutions launch checklist

The solution centre is intentionally unpublished. `BODY_CAMERA_LAUNCH_READY` in `lib/bodyCameraSolutions/config.ts` controls indexing and sitemap inclusion. Keep it `false` until every launch item below is complete.

## Hytera authorisation and brand

- Confirm the exact public designation: authorised partner, dealer, distributor, or solution partner.
- Confirm the geographic territory and whether African cross-border sales are permitted.
- Add the partner verification/directory URL.
- Obtain written permission for Hytera name, logo, product images, software screenshots and document reproduction.
- Replace every visual marked `Hytera-approved asset pending` with approved photography or UI media.
- Validate every specification and accessory against current project datasheets.

## Pricing and commercial information

- Confirm dealer price, recommended resale price and minimum advertised price rules.
- Add USD prices and the approved NGN conversion/validity policy.
- State VAT, freight, clearing, installation, licensing and support inclusions clearly.
- Add price validity dates and product availability/lead times.
- Keep enterprise DEM and command projects quote-led unless Hytera approves standard bundles.

## Documents and proof

- Upload approved brochures and datasheets with accessible HTML landing pages.
- Keep the customer deployment module disabled until delivery is complete and written publication approval is received.
- Replace the anonymised deployment copy with an approved case study, or leave the section disabled.
- Add warranty, service-level and support-scope documents.

## Operations and compliance

- Test the assessment email route using the production SMTP configuration.
- Set `BODY_CAMERA_ADMIN_EMAIL` in every Vercel environment.
- Confirm privacy notice wording and the handling process for enterprise leads.
- Review claims about evidence integrity, legal admissibility, privacy, encryption and redaction with qualified advisers.
- Prepare pilot, implementation, training, acceptance and support templates.

## SEO and launch

- Add approved Open Graph images for the hub and priority product pages.
- Validate Product, Service, Breadcrumb and FAQ structured data in Google Rich Results Test.
- Confirm the launch flag has exposed the solution centre in the main navigation and footer.
- Add relevant links from Corporate Sourcing and supporting articles.
- Verify canonical URLs, status codes, Core Web Vitals and mobile accessibility.
- Switch `BODY_CAMERA_LAUNCH_READY` to `true` only after production review.
- Submit the refreshed sitemap and request indexing for the hub and priority pages.
