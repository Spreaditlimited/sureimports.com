# Vehicle commerce implementation and rollout

## Architecture and customer experience

Use `sureimports.com/cars`: the existing brand, navigation, footer, account and dashboard are shared. Vehicles get dedicated browsing, configuration, comparison and galleries without another account or website. Purple remains the primary brand colour; green accents identify electric vehicles. The catalogue supports other powertrains, passenger vehicles and commercial vehicles.

The initial catalogue comes from `Downloads/瑞驰 Ruichi V2609`. Source references are retained privately in `lib/vehicles/catalogue.json` and `source-manifest.json`. Only selected optimised photographs are published. Manufacturer costs and source documents are excluded from public model data. YouTube links can be entered in admin; no manufacturer videos have been uploaded to a public service.

Customers select a model/configuration/quantity, sign in and request a quotation. Staff confirm availability and commercial details, then issue a Naira invoice. The customer uses the existing active Nigerian NGN bank accounts and uploads transfer proof in their vehicle dashboard. Finance approves or rejects each claim through the existing invoice payment system. A fully paid invoice confirms the order. Subsequent movements appear in the dashboard and enqueue email plus WhatsApp when the customer opts in.

## Pricing

- Vehicle price = manufacturer RMB × 1.2 × `exchange_rate.exNairaToYuan`.
- Exterior CBM = length mm × width mm × height mm ÷ 1,000,000,000. Cargo capacity is a separate specification and is not used for shipping.
- Estimated shipping = exterior CBM × `exchange_rate.quotationSeaRateNgnPerCbm`.
- Estimated landed price = vehicle price + estimated shipping. Shipping includes clearing, duties and taxes; no additional procurement fee is applied.

Amounts are rounded to kobo per unit before multiplying by quantity. Unknown prices/specifications remain enquiry-only. Issuing a quotation snapshots the rates, configuration and amounts, so later catalogue/rate changes cannot alter an existing invoice. Quotes expire and can be extended by finance without silently repricing an invoice. Staff must confirm availability, charging compatibility, warranty and delivery arrangements before issuing the quote.

## Central admin

`admin.sureimports.com/dashboard/vehicles` contains catalogue management, manufacturer prices/specification confirmation, photographs, YouTube links, enquiries, quotations, proof review, fulfilment updates and notification retry controls. Vehicle access reuses `store_mgt`; financial actions additionally require invoicing edit access. Existing superadmin/L1 access rules apply.

Proofs are private database attachments (JPEG/PNG/PDF, maximum 3 MB) accessible to the owning customer and authorised finance staff. Uploading proof does not confirm payment. Claim approval reuses invoice payments, ledger entries, receipts and audit records. Generic invoice editing/payment entry is blocked for vehicle invoices to preserve the vehicle workflow and quote snapshot.

## Deployment sequence

1. Review both repositories together. They contain the identical migration `20260928120000_add_vehicle_commerce`. Apply it once to the shared database using the normal migration process. Do not execute duplicate SQL manually from both repositories. Generate each repository's Prisma client for its installed Prisma version.
2. Deploy the public and admin code together. The public catalogue has a read-only seed fallback before migration; submitting orders requires the tables. Do not announce ordering until the complete flow has passed staging verification.
3. In Vehicles in admin, import the starter catalogue. Import creates missing entries and preserves existing admin edits. Review each configuration and publish only the appropriate offerings. Local `/vehicles/` seed images are served by the public website; new admin image uploads use the existing Cloudinary integration.
4. Confirm the existing RMB and inclusive sea-CBM rates, active Nigerian NGN bank accounts, email transport and Cloudinary configuration.
5. Configure admin `CRON_SECRET`, existing `N8N_WHATSAPP_WEBHOOK_URL` and optional `N8N_WHATSAPP_WEBHOOK_TOKEN`, plus `VEHICLE_WHATSAPP_TEMPLATE_KEY` for an approved vehicle-update template. The existing cron configuration calls `/api/cron/vehicle-notifications` every five minutes.
6. Map the webhook payload (`templateKey`, `eventId`, `requestId`, `contactPersonFullName`, `whatsappNumber`, `status`, `message`, `orderUrl`) in n8n. Deduplicate by `eventId`/`Idempotency-Key`. Verify both delivery channels using designated staging recipients before launch.

The outbox retries failures with backoff, recovers expired worker leases, and marks exhausted jobs failed for staff retry. `SENT` means the downstream transport accepted the request, not confirmed recipient delivery. Delivery is at least once: a crash after sending but before recording success can repeat a message. The worker currently processes eight jobs per cron run; monitor backlog and increase worker throughput before scaling order volume.

## Verification and remaining launch work

Automated checks cover pricing, incomplete data, quantity limits, fulfilment transitions, safe login returns, notification retries/concurrency and existing invoice payment reconciliation. Run `npm run test:vehicles` in the public repository and `npm run test:vehicle-notifications` in admin, alongside the existing manual bank payment and reconciliation tests. Both repositories must pass TypeScript and targeted lint checks.

The public catalogue has been browser-checked on desktop and mobile, in light/dark themes, including comparison, filtering, configuration selection and protected endpoints. Authenticated database-backed end-to-end verification is still required in staging: enquiry → quote → partial transfer proof → rejection/resubmission → approval → full payment → each fulfilment stage → customer timeline → email and WhatsApp. Also verify wrong-customer access, duplicate approvals, concurrent claims, quote expiry, failed notifications, receipts and cancellation rules.

No production migration, deployment or live customer notification was performed as part of implementation. The manufacturer still needs to supply missing prices/details, and the exact configurations of the three ordered cargo buses must be confirmed before presenting stock or delivery commitments. This first release tracks each order as a whole and requires full payment before supplier ordering; per-VIN tracking, split fleet shipments and deposit/financing schedules are not implemented.


### Ownership content and search visibility (28 September 2026)

Nine original EV guides are published through the existing blog, using Cloudinary feature images and authoritative citations. Local article sources and the idempotent publication script live in `content/vehicle-guides` and `scripts/blog/publish-vehicle-guides.mjs`. Electricity examples identify the September 2026 IE Ogun jurisdiction and tariff class; fuel examples use NBS May 2026 averages. Consumption and solar-yield assumptions are explicitly separate from measured manufacturer performance. Model-specific parts prices remain quote-based.

Vehicle pages now include unique model buying guidance, server-rendered tables for every configuration, charging and import information, related models and internal article links. Canonical URLs omit configuration queries. Vehicle and BreadcrumbList structured data describe the published model without asserting stock, guaranteed range, reviews or binding offers. The catalogue includes CollectionPage/ItemList data and links to all nine guides. TypeScript and scoped ESLint passed; mobile model and catalogue checks showed no document overflow or browser errors. These application changes still require the normal deployment; publishing articles does not deploy vehicle commerce or apply its database migration.


### Public request and authentication handoff

Vehicle requests follow the existing shipping/procurement pattern: complete the public form, check `/api/auth/me`, save a pending draft and use the shared login/signup flow when needed, then submit through `/checkout/resume-vehicle` and continue into the dashboard. Drafts preserve the idempotency key, configuration, quantity, customer fields and WhatsApp consent. Failed submissions retain the draft for recovery. The shared auth context now hydrates on cars, shipping, procurement and checkout routes so the public navbar reflects the session.

Verification: TypeScript and scoped lint passed; 12 vehicle policy tests passed. Browser checks covered signed-out handoff, signup return URL, form restoration, signed-in navigation and failed submission recovery. Authenticated API results were mocked to avoid creating real orders; a live account-to-order test still depends on the vehicle database migration.


### Catalogue initialization repair

Imported all 10 supplied models into the shared database using insert-only upserts after discovering that the storefront fallback had allowed a request before catalogue initialization. Existing models are preserved. Verified that the saved EC35 request resolves to its configuration and passes the quotation pricing checks. No invoice was issued by the repair. New request creation now persists a fallback model transactionally before saving its order; existing admin data wins. Missing models in admin quotation handling now produce a clear recovery message instead of a raw Prisma record-not-found error.


### Local invoice proxy configuration

The local customer site runs on port 3000 and the local admin on port 3001. `ADMIN_INVOICING_API_BASE_URL` in the customer site's `.env.local` must point to `http://localhost:3001`, not the customer site itself. All invoice/receipt proxy routes now reject self-routing (including localhost aliases). Verified the issued invoice loads through the customer endpoint after correcting this configuration. Invoice dashboard links are relative so local testing stays on the local application.
