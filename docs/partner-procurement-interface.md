# Partner procurement interface

## Source interfaces

The partner review page copies the admin procurement order cards, search, status filters, detail dialog, product table and cost panels from `admin.sureimports.com/app/(dashboard)/dashboard/procurement/components`. The copies live in `app/partners/procurement`. Administrative claim, cleanup and unrestricted update actions are intentionally not imported. Partners can approve only their own paid customer orders.

The customer storefront reuses the actual Sure Imports dashboard shell, header, sidebar, procurement status tabs, order cards, create-order modal/form and add-product form. Optional tenant adapters preserve the existing direct-customer behavior. Tenant order counts and writes use partner-scoped endpoints, never the direct Sure Imports procurement endpoints. The manifest follows the existing customer product table and financial breakdown layout.

## Local test flow

Sign in as the email configured in the ignored `.local-partner-test.json` file, then visit:

- Customer: `http://localhost:3001/partners/dashboard#customer-preview`
- Partner review: `http://localhost:3001/partners/dashboard#requests`
- Storefront editor: `http://localhost:3001/partners/dashboard#storefront`
- Landing-page preview: `http://localhost:3001/partners/dashboard#landing-preview`

Create an order, choose the sample Nigeria shipping plan, add products, expand the order and use the explicitly labelled simulated payment button. Return to partner review, open that order and approve it. Returning to the customer order shows the partner approval.

These records are in-memory fixtures, restricted to the configured email on localhost in development. They do not create database orders, payment ledger entries, gateway charges or emails. Restarting the server clears the customer fixtures. This preview is unavailable in production.

## Live flow

Published, active and verified partner storefronts use `/partners/storefront/[slug]` for their public landing page and `/partners/storefront/[slug]/dashboard` for customer accounts. After sign-in, customers see the same Shop from China welcome component, store cards and video guide as Sure Imports. My Orders opens the shared tracker frame and empty-state component. Customers create saved drafts, add products and pay through the partner checkout. Only verified payment for the current order revision makes the order eligible for partner review. Partner approval releases the order into Sure Imports procurement under the partner's identity and receiving address. The customer's final delivery address remains separate.

Migration `20260912210000_partner_storefront_content` adds a nullable JSON column for validated storefront copy. It has been applied to the shared database. Category and customer delivery address still use the existing encrypted draft payload. Deployment is a separate step requiring explicit approval.

## Customization boundaries

The landing-page editor now supports centered/split heroes, optional hero images, button labels, footer copy, and editable steps, benefits, FAQ and closing sections. Each section can be reordered or hidden; repeatable items can be added or removed (up to six). The public page and editor preview share the renderer. Desktop/mobile preview uses container-responsive layout, and preview account links cannot accidentally navigate away. Section changes use the existing content JSON column; legacy copy retains its headline and gains default sections. Saving does not grant publication or collection permissions.

Only active, approved, KYC-verified owners with matching commercial membership may save live settings. The owner is resolved from the session; a client-supplied partner ID is never accepted. Name, Cloudinary logo, accent colour, public contact information, landing copy and dashboard welcome text are editable. Internal receiving address, fees, payment configuration, domain verification and publication are not.

Logo upload accepts PNG, JPEG and WebP up to 2 MB, validates signatures and re-encodes to PNG on Cloudinary. Logos are public assets, never private KYC evidence. Even a local-preview logo upload creates a public Cloudinary asset; sample order/payment simulation does not. Saving local preview settings remains memory-only.

## Hosting and domains

The current implementation lives in the Sure Imports Next.js application. It is one multi-tenant application, not cloned deployments per business. After deployment and publication, the default URLs are `https://www.sureimports.com/partners/storefront/<slug>` and its `/dashboard` child. The partner owner portal remains separate from this customer storefront.

Recommended custom-domain launch sequence:

1. Partner supplies the exact hostname (prefer `shop.partner-business.com`).
2. Sure Imports adds it to the storefront Vercel project and issues ownership-verification instructions. A domain must have one verified tenant owner.
3. Partner adds the exact DNS records returned for that project; do not hardcode an assumed Vercel DNS target.
4. Verify DNS, HTTPS and the verified-host-to-partner mapping before serving tenant content. Unknown, suspended and unpublished hosts fail closed.
5. Complete and test tenant-host routing, authentication return paths, host-only cookies, checkout callbacks, email links and cross-tenant API isolation. Never share a parent-domain authentication cookie with arbitrary partner domains.
6. Test the whole sign-in → order → payment → partner approval journey through the hostname, then activate it.

Custom-domain records and an internal verified-domain resolver exist, but automatic domain provisioning, public hostname routing and custom-domain authentication are NOT implemented. The editor clearly labels this as assisted setup. Do not point a partner's domain at production and assume it works. There were no DNS changes or deployments in this implementation.

Vercel references: https://vercel.com/kb/guide/nextjs-multi-tenant-application and https://vercel.com/docs/domains/set-up-custom-domain.

## Remaining procurement parity

The partner customer interface intentionally does not call the direct Sure Imports wallet, bank-transfer, draft-merge or admin-assistance endpoints. Those are not tenant scoped. Direct admin assistance also conflicts with the rule that Sure Imports does not support a partner's customers. Any partner equivalents require separately scoped workflow work. Subsequent shipping invoices and adjustments must also use a partner-owned payment flow before their payment controls can be enabled; the existing initial-payment summary is not a replacement for a later invoice.
