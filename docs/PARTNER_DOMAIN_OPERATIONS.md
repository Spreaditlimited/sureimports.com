# Partner storefront and domain operations

Plan reference: **PARTNER-STOREFRONT-9**. This runbook supports the locked plan;
it does not mark its live acceptance criteria complete.

## Deployment boundary

One partner application (`../partner.sureimports.com`) serves all storefronts. No cloned repositories or
per-business deployments. Domain registration/billing stays in the existing
`tochukwunkwocha-next` service. The admin application reads the shared Sure Imports
domain state. Deployments require explicit approval and must go through GitHub.

Private preview: `/partners/storefront-preview`. Editor:
`/partners/dashboard#storefront`. On a verified business domain: `/`,
`/auth/login`, `/auth/signup`, `/dashboard`. Shared-host storefront paths are not
public production websites. Owner fixture previews remain separate from real
customer credentials, DNS, billing and publication.

## Server-only configuration

Partner application (not the main Sure Imports hosting project):

- `PARTNER_VERCEL_TOKEN`: scoped to domain management on the designated project/team.
- `PARTNER_VERCEL_PROJECT_ID`, `PARTNER_VERCEL_TEAM_ID`: the shared storefront project.
- `PARTNER_DOMAIN_SERVICE_URL`: HTTPS origin of the existing domain service.
- `SUREIMPORTS_DOMAIN_SERVICE_SECRET`: at least 32 characters, shared only with
  that service. Never expose it as NEXT_PUBLIC or in client requests.
- Existing `JWT_SECRET` (at least 32 characters), `SMTP_EMAIL`, `SMTP_PASSWORD`.
- `CRON_SECRET` for authenticated scheduled checks and notifications.

Domain service:

- The same `SUREIMPORTS_DOMAIN_SERVICE_SECRET`.
- Existing live Paystack configuration and ResellerClub configuration, including
  verified NGN pricing, product mappings and supported nameservers.
- Existing Paystack webhook is reused; no second webhook URL is required.

The bridge secret also derives the registrant-encryption key using a separate
context. Back it up securely. Do not rotate it without migrating encrypted
registrant records and coordinating both services. Never reuse a browser or CLI
session token as an application credential.

Local configuration checks print presence/length only. Do not pull environment
files over existing local overrides or display secret values. Local bridge settings
are now configured; local hosting-token/cron availability is separate from Vercel.
Production/Preview hosting token, project/team IDs, bridge URL/secret and cron
configuration are present. Token permissions must still be exercised by the deployed
application. Registrar
configuration can also come from the domain service's existing admin settings;
missing shell variables alone do not prove those admin settings are absent.

## Existing-domain connection

1. Add the domain in the editor. It remains private/unpublished until ready.
2. Set the displayed `_sureimports` TXT record at its DNS provider.
3. Check connection. Vercel ownership challenges and exact hosting records appear.
4. Apply the appropriate A **or** CNAME recommendation, not both at one name.
5. Check again after propagation. Ownership, Vercel DNS state and actual HTTPS
   routing must all pass. The HTTPS probe is pinned to public IPv4, validates the
   certificate and never follows redirects.
6. Make the ready domain primary, then explicitly publish the saved draft.

No nameserver changes are made automatically. Preserve MX, SPF, DKIM, DMARC and
unrelated DNS records. External-domain expiry/renewal remains with its registrar.

## Purchased domains

Supported purchase extensions initially reuse the existing service: .com, .net,
.org, .co and .io. An existing Nigerian domain can still be connected; .ng domain
purchasing is not enabled by the existing service.

Quotes expire after 15 minutes and require explicit accepted price/confirmation.
The business legal name is supplied by the approved Sure Imports partner record,
not an editable browser ownership field. The registrant's address/contact details
are encrypted. Checkout links remain available when the page is reloaded.

Payment verification checks live mode, reference, exact NGN amount and operation
metadata. A durable state change permits one registrar attempt. A timeout leaves
the operation in reconciliation, where subsequent checks inspect registrar state
without submitting another purchase. Provider failures must not be “fixed” by
resetting REGISTERING/RECONCILIATION_REQUIRED back to CHECKOUT_PENDING.

After registration confirmation, check the order in the dashboard to attach the
domain to Sure Imports. “Configure hosting records” adds only platform TXT and
hosting records. Existing conflicting records cause manual review; no zone is
replaced. Custom nameservers may require manual DNS entry at the actual provider.

If checkout initialization times out before the URL is saved, reconcile the
persisted Paystack reference. Do not create a second reference or charge. If
registration cannot be confirmed, an operator must review the registrar order and
payment and arrange a refund where appropriate; there is no automatic refund or
unrestricted force-registration button.

## Customer authentication and isolation

Customer passwords/verification are business-scoped, separate from Sure Imports
and partner-owner credentials. The same email can belong to multiple business
accounts without exposing either business's orders or changing its main-site
password. Host-only cookies additionally bind the token audience to the verified
hostname and the partner ID. Reset invalidates prior business sessions.

Email links use a verified mapped hostname. One-time random tokens are stored as
hashes, expire after 15 minutes and are carried in the URL fragment. Link scanners
cannot consume them through a GET: the customer confirms through a same-origin
POST. Authentication endpoints have durable per-business/per-email rate limits.
Email branding and Reply-To use the business; SMTP still uses the platform's
authenticated sending address. Custom sender-domain email verification is not
implemented and must not be advertised as available.

All customer APIs independently require a session matching both the current host
and route slug. Proxy routing is not the sole authorization control. Only verified
payment plus partner approval releases an order into Sure Imports procurement.
The existing Sure Imports procurement UI and empty-state components are reused.

## Admin recovery and lifecycle

Super admins use `/dashboard/partners/domains`. Suspension blocks serving/access
immediately. Reset creates a fresh challenge and clears readiness; it cannot force
a domain ready. Every action requires an audit reason. Owners cannot undo an admin
suspension through reconnect, check or disconnect.

Disconnection stops serving and attempts to detach Vercel hosting. It does not
cancel registration or delete email DNS. Keep old domains connected while pending
checkouts still use their frozen return URLs. Changing hostname requires a new
login; cookies are intentionally not shared between domains.

The cron route `/api/cron/partner-domains` runs every 15 minutes after an approved
production deployment. It handles a bounded oldest-first batch, refreshes managed
expiry, rechecks DNS/HTTPS, and sends owner reminders at 30-day, 7-day, 1-day and
expired bands. Failed reminders are visible in admin history for operator follow-up.
Expired token/limiter rows are pruned; customer, order and domain histories remain.
SMTP delivery is at-least-once around a worker crash, not guaranteed exactly once.

Renewal quotes use the registrar's **renewdomain** prices. A verified payment is
not renewal completion: the registrar's matching order must show at least the
requested new expiry. Ambiguous calls are inspected, never automatically repeated.
Expired/restoration cases require registrar review rather than ordinary renewal
pricing. Historical renewals previously marked locally complete need an operator
audit before any additional registrar charge.

### Ownership transfer — controlled manual procedure

There is no self-service ownership transfer or direct reassignment by an affiliate.
Require super-admin review, documented consent from both verified businesses,
registrant evidence and resolution of pending payments/renewals first. Preserve
original payment and customer-order ownership permanently.

Before transferring a platform-purchased asset, coordinate with the registrar and
freeze its domain-service record and pending operations so the former owner cannot
continue DNS or renewal actions. Registration transfer and billing ownership are
not accomplished by merely changing `partnerId` in Sure Imports. The receiving
business must prove fresh DNS ownership and pass all hosting/HTTPS checks. Keep
the storefront suspended throughout the transfer. Record external registrar
references and both approvals in the audit trail.

Provider ownership transfer and a safely coordinated multi-service reassignment
remain a manual release procedure, not an implemented automated workflow.

## Verification / release gates

Automated commands:

```sh
# Sure Imports
node --test tests/partner-*.test.mjs
npx tsc --noEmit --incremental false

# Domain-service repository
node --test tests/domain-platform.test.mjs tests/domain-renewal-confirmation.test.mjs
npx tsc --noEmit --incremental false

# Admin repository
npx tsc --noEmit --incremental false
```

The scoped hosting token and bridge configuration are present on Vercel, and the
domain-service dependency audit now reports zero advisories. Obtain express build/
deployment approval. As requested by the user, nominate two real business-owned
test domains for post-deployment acceptance. Verify both existing-domain and paid-domain paths, actual email delivery,
customer signup/reset/sign-in, payment return, partner approval, Sure Imports
processing, desktop/mobile themes and cross-business isolation. Record real
registration/renewal evidence separately from mocked tests. Nothing in the locked
plan is declared end-to-end complete merely because TypeScript or unit tests pass.

Security note: legacy commented SMTP credentials were removed from source during
review. Rotate any still-active credential; deleting the comment does not erase
repository history. No credential values belong in this runbook.

## Latest pre-deployment verification — 2026-09-12

- Sure Imports: 93 partner tests passed; domain service: 8 tests passed.
- TypeScript checks passed in Sure Imports, admin and domain service.
- 15 real localhost HTTP checks passed: private APIs/cron reject unauthenticated
  requests, unknown/lookalike hostnames return uncached 404s, public pages render.
- Isolated preview browser fixture passed at 390px and 1440px: saved branding,
  no horizontal overflow, both themes, disabled live customer actions, no reported
  browser errors. This does not prove authenticated live tenant navigation.
- SMTP TLS connection and authentication passed without sending mail. Inbox
  delivery is not yet verified.
- Migration status was checked: 78 main-app and 37 domain-service migrations are
  applied. No reset or fabricated payment was used.
- Domain service full npm audit: zero vulnerabilities. Next 15.5.25, Tiptap 3.31.3
  and Nodemailer 9.1.1 installed; editor API compatibility was adjusted. Production
  compilation and a signed-in editor interaction remain separate release checks.
- Bridge secret is Sensitive for Production/Preview in both Vercel projects;
  Development uses a separate encrypted entry because Sensitive does not support
  Development. The existing value was preserved, not rotated. Both local secret
  files are ignored by Git, and setup refuses to write an unignored secret file.
- PARTNER_VERCEL_TOKEN is present as Sensitive for Production/Preview. Presence is
  not proof of domain-management permission; validate during deployed activation.
- No production build, deployment, real domain purchase, registrar renewal or
  real payment was performed by these checks.

Remaining acceptance: production builds; real two-business publication and
restoration; existing/purchased domains with DNS and HTTPS; actual email delivery,
signup/reset/login and checkout return on those domains; paid customer order,
partner approval and Sure Imports processing; registrar renewal/recovery evidence;
authenticated partner/admin domain-management visual checks. Keep these distinct
from the passing isolated tests. Do not declare all nine points complete yet.
