# WhatsApp performance

## Admin use

Open **Marketing → WhatsApp Performance** (`/dashboard/whatsapp`). Grant staff the
**WhatsApp Performance & Leads** permission: view for reporting, edit for recording
or changing confirmed enquiries. Super admins already have access.

- Today, this week, this month and this year use Africa/Lagos calendar boundaries.
- The selected period controls breakdowns, click history, enquiry history and CSV.
- Choose a website (including LineScout) and sales versus customer support.
- Record a lead only after receiving the enquiry. Use an international WhatsApp
  number. The same number cannot create a second lead for the same website.
- Search existing leads by name/number across all dates and statuses, then edit.
- `SUPPORT` does not count as a sales lead. `INVALID` removes an erroneous entry
  from lead totals without destructive deletion; find it again through search.
- Add the optional `WA-<uuid>` reference from a received message for attributable
  enquiries. Phone links receive an editable prefilled reference; WhatsApp business
  short links may not support prefilled text. Do not guess attribution.
- The attributed rate is linked enquiries divided by clicks in the chosen click
  period. Unlinked leads are included in lead counts, not in that conversion rate.
- `WON` is a staff-reported outcome, not proof of a payment in the payment ledger.

## Collection

The shared script is served by Sure Imports and included in Sure Imports,
LineScout, Affiliate and Partner layouts. Only explicit owned hostnames and
registered business contact destinations are accepted. Custom partner storefront
domains, supplier contacts and WhatsApp share links are deliberately excluded.

Opening the floating menu is not a click. Only trusted outbound click/keyboard
activation or middle-click events are recorded. Rapid double taps are suppressed.
The server enforces event-ID idempotency, exact origin checks, size/schema limits,
known-contact checks, bot filtering and a hashed-IP rate limit. This reduces abuse;
public analytics can never guarantee that all traffic is human or all clicks arrive.

Tracking never waits for a server response before opening WhatsApp. A failure
does not prevent contact. Local and preview traffic is excluded on both sides.
Counting starts after deployment; no historical numbers are manufactured.

Clicks do **not** confirm receipt of a message. There is no automatic WhatsApp
inbox integration in this release. Actual leads are manually confirmed by staff.

## Privacy and data

Click events contain no customer name, email, phone, message body or URL query.
The destination is the business contact, not the customer's number. Without
analytics consent no persistent visitor/session identifier or marketing source is
stored by this tracker. Consented sessions are per-browser-tab, expire after 30
minutes of inactivity, and are not cross-device or cross-domain unique people.
Rate-limit IP hashes rotate daily and old rate-limit rows are incrementally pruned.
No separate GA4 event is emitted (avoids duplicating existing outbound tracking).

Lead names, numbers and notes are access-controlled operational records. Enquiry
recording does not subscribe a person to marketing emails. Created/updated staff
IDs and timestamps are retained. No automatic messages are sent.

## Deployment and verification

Migration: `20260923120000_whatsapp_performance`; creates only three new tables.
Apply with `node --env-file=.env --env-file=.env.local scripts/apply-whatsapp-migration.mjs --apply`.
No runtime table creation. Main and admin schemas/migration files must stay aligned.

Deploy through GitHub when approved: Sure Imports first (script + endpoint), then
Admin, LineScout, Affiliate and Partner. The receiver requires existing `CRON_SECRET`
and `VERCEL_ENV=production`; it fails closed if the secret is absent. Affiliate CSP
allows only the shared tracking script and click endpoint in addition to its prior rules.

Tests:

- `node --test tests/whatsapp-tracking.test.cjs` (requires sibling admin checkout)
- `node --env-file=.env --env-file=.env.local scripts/test-whatsapp-database.cjs`
  uses an interactive transaction and rolls back all fixture records.

On production, validate one real permitted click from Sure Imports and LineScout,
confirm its correct website/placement and check that a menu-only interaction does
not increment counts. Do not force local tests into the live reporting dataset.
