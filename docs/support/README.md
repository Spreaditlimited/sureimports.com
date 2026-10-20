# Customer support pilot

Status: signed-in and guest customer / agent workflows implemented locally. Not deployed or enabled. The production Overview redirect was released separately on 17 October 2026.

## Implemented

- Sure Imports customer page: `/dashboard/support`; customer conversation/list/message APIs under `/api/support/conversations`.
- Admin page: `/dashboard/support`; inbox, public replies, internal notes, status changes and initial analytics. `customer_support` view/edit permissions are registered in the existing admin permission catalogue. No staff permissions are automatically granted.
- Additive MySQL migration: `20261018010000_support_pilot`. Sure Imports owns this migration; admin shares the tables and schema projection.
- Server-resolved customer ownership, verified/active account check, brand separation, per-request agent authorization, same-origin mutation checks, bounded JSON body and field validation.
- Database-backed per-actor limits and transactional idempotency for conversation creation and message retries. Exact retries retain their request key; changed payloads using an old key fail with 409.
- A public agent reply records the first human-response time and sets Waiting for customer. An internal note does neither. Customer follow-ups reopen resolved conversations.
- Assignment to the first responding/handling agent; arbitrary reassignment is not yet exposed.
- Light/dark responsive UI, mobile list/thread navigation, WhatsApp secondary link, readable plain-text messages (no HTML execution).
- Incremental message fetches every five seconds only while the page is visible. Inbox/analytics refresh every fifteen seconds. No anonymous/global background polling or new real-time provider dependency.

## Runtime gate

`SUPPORT_CHAT_ENABLED=true` is required on both applications. It is deliberately absent by default. Disabled pages/API endpoints return 404 and do not query support tables. This is a release gate, not a per-customer allowlist. When enabled, a lazy public launcher replaces LiveChat and floating WhatsApp; inline WhatsApp buttons and the launcher backup link remain. Closing the launcher stops polling. With the gate off, the existing site remains unchanged.

The prototype UI harnesses at localhost:3400 (customer) and localhost:3401 (agent) use synthetic identities and an isolated MySQL instance on port 13317. They do **not** exercise production login/permissions and must never be deployed. Production application routes use the existing authenticated accounts and admin permissions.

## Analytics definitions

All initial metrics use conversations created in the last 30 days:

- Conversations: count created in that window.
- Awaiting first reply: unresolved conversations with no public agent reply.
- Resolved: those currently resolved, not a count of resolution events.
- Average first human reply: elapsed seconds from creation to first public agent reply, excluding unanswered conversations and including nights/weekends. Internal notes do not count.

These are not yet business-hours SLA metrics, a complete historic backlog report, or CSAT analytics. Customer history lists retain the latest 100 conversations. The admin inbox now has server-side search, filters and 25-item pages; see the management update below.

## Validation

- `node --test tests/support-pilot.test.cjs`: ownership, brand boundaries, notes privacy, validation, retries, reopened conversations, limits, CSRF, disabled flag and bounded streaming body.
- `SUPPORT_TEST_DATABASE_URL=mysql://root@127.0.0.1:13317/support_pilot node --test tests/support-mysql.integration.cjs`: refuses any other host/port/database; verifies concurrent retries against real MySQL, message privacy, status transitions, metrics and persistence from a new client.
- Migration was applied only to that disposable local database. No production support schema/data was changed.
- Customer and agent browser round trip checked using the isolated harness, including refresh persistence, internal note exclusion, and 393px mobile layouts in light and dark themes.

## Guest chat, order context and notifications (18 October)

- Guest credentials are random, host-only HttpOnly cookies (Secure in production, SameSite=Lax), hashed in the database, and expire after 30 days. Session allocation is capped globally at 60/minute; messages are limited to 20/minute per actor. No email address is collected from guests.
- After sign-in, the visitor explicitly chooses “Save guest conversations to my account”. Claiming locks the guest record, transfers only that guest's conversations and revokes its credential. No email-based cross-product merging.
- Customers can attach a procurement order selected from their latest 100 orders. The server verifies ownership again on creation. The order detail page has a gated “Get help with this order” link. References are visible to staff; prices, addresses and payment details are not copied into chat.
- Public messages atomically create/coalesce an email outbox entry. Internal notes never enqueue email. Team notifications default to **hello@sureimports.com** (override with `SUPPORT_TEAM_EMAIL`). Customer notifications resolve the active, verified account email immediately before delivery; guests do not receive email.
- `/api/cron/support-notifications` requires `CRON_SECRET`, `SUPPORT_CHAT_ENABLED=true` and `SUPPORT_NOTIFICATIONS_ENABLED=true`. Scheduled every five minutes, with a one-minute quiet period, transactional leases and five retry attempts with backoff. Messages contain only a safe conversation link, not chat or order contents. SMTP delivery is at least once; a stable Message-ID reduces duplicates but does not guarantee exactly-once email. Exhausted rows remain for operational review. Read-state suppression and notification preferences are not yet implemented.
- Apply the additive `20261018020000_support_guest_notifications` after the pilot migration, once from Sure Imports, before enabling either app. No production migrations or support flags have been changed.
- Guest integration test: `SUPPORT_TEST_DATABASE_URL=mysql://root@127.0.0.1:13317/support_pilot node --test tests/support-guest.integration.cjs`. It refuses other databases and uses a fake delivery function: no real email.

## Remaining before broad public rollout

1. Administrative audit-event history and customer-list pagination beyond the latest 100 conversations (admin pagination, reassignment and unread cursors are implemented).
2. Production-authenticated staging checks for customer and restricted admin roles; tune abuse limits with traffic, then enable the public gate.
3. Operating hours, retention/export/deletion policy, satisfaction survey and business-hours analytics.
4. Private attachments and real-time transport if needed; stored messages remain the source of truth.
5. LineScout identity adapter and branding, then other sites. Keep separate product identities and never merge histories by matching emails.

The legacy `chats` and `messages` tables remain untouched because existing workflows use them.

## Shared code and build checks

Sure Imports is currently the canonical source for `lib/support/{policy,http,store}.ts` and `components/support/{SupportWorkspace.tsx,support.module.css}`. Admin uses identical copies with its own authenticated identity adapter. Run `node scripts/support/check-shared.mjs` before releasing either app. These can move into a versioned workspace package when repository boundaries are consolidated; do not independently edit the copies.

Final checks on 17 October: both complete production builds passed using isolated build snapshots; both applications type-checked; 38 focused support/authentication tests passed, plus the real MySQL integration test. The support migration has not been applied outside the disposable local database.

Checks on 18 October: both application builds passed, Sure Imports passed an explicit TypeScript check, 20 support/login unit tests passed, and both real-MySQL suites passed (including guest claiming, order ownership and fake notification delivery). The guest launcher was checked on desktop and at 393px in light/dark themes, with message persistence after refresh. Production authentication/permissions and live SMTP delivery remain staging rollout checks; no real notification emails were sent.

## Admin browser push (18 October)

Implemented locally; push is not configured or enabled in production.

- Admins with `customer_support` view access can opt in separately on each device from the support inbox. The browser permission prompt occurs only after clicking Enable notifications. Turning notifications off removes that device's server subscription. Logging out also removes the current device subscription; logout still succeeds if notification cleanup is unavailable.
- iPhone/iPad users must add the admin dashboard to their Home Screen and enable notifications from the installed web app (iOS/iPadOS 16.4+). The admin manifest and service worker are included. Other supported browsers require HTTPS (localhost is allowed for development). Physical-device installation and delivery remain release checks.
- Apply `20261018030000_support_admin_push` once from Sure Imports after the other support migrations. Configure admin-only `SUPPORT_PUSH_ENABLED=true`, `SUPPORT_VAPID_PUBLIC_KEY`, `SUPPORT_VAPID_PRIVATE_KEY`, and `CRON_SECRET`; `SUPPORT_CHAT_ENABLED=true` is also required. Generate and store one stable VAPID key pair securely; never expose the private key to the client. The client receives only the public key. Both applications must have the new schema before chat is enabled because customer messages enqueue push deliveries transactionally.
- The admin cron `/api/cron/support-push` runs every minute. Notifications are queued on customer/guest messages, not internal notes or staff replies. Deliveries coalesce by conversation/device, use transactional leases, retry transient failures up to five attempts, and remove expired provider subscriptions (404/410). Delivery is at least once; the conversation tag replaces an existing browser notification where supported. Alerts are not immediate real-time delivery and currently are not suppressed when the inbox is open.
- The dispatcher rechecks current admin permissions, subscription expiry and active state. Subscriptions expire after 90 days and must be re-enabled; each admin can register up to ten active devices. Recognized browser push endpoints are allowlisted to prevent arbitrary server-side network requests.
- Lock-screen alerts contain only a generic customer-message notice and a validated link to the conversation. Customer message text, names, order details and payment details are not included. Opening the notification still requires the normal admin session and permissions.
- Shared canonical files also include `lib/support/push-policy.ts` and `lib/support/push-store.ts`; `node scripts/support/check-shared.mjs` checks them against admin.
- Verification: 25 support/login tests passed, including real isolated MySQL checks for push coalescing, ownership, revoked permissions, retries and expired subscriptions, plus service-worker payload/link checks. Delivery uses a fake sender; no real Web Push or email was sent. Both apps passed TypeScript checks. Browser checks exercised the customer launcher and admin thread at 320×568, including a reply round trip, scrolling, picker spacing, full-width buttons and internal-note alignment. Earlier 393px light/dark checks also passed. These harnesses do not replace authenticated staging or physical-phone/keyboard checks.

Final push/mobile build verification: both complete production builds passed from isolated snapshots after the push changes. Shared support source checks passed. Deployment, production migration/keys, authenticated staging and a real-device notification test remain outstanding; all production support gates remain unchanged.

## Private chat attachments and retention (18 October)

- Customers, guests and staff can send one JPG, PNG, WebP or PDF per attachment message, up to 3 MiB. Start a conversation with text first, then use its attachment control. File selection is removable, sending is explicit, and retries use a stable request key. Internal-note attachments remain agent-only. Text and files send separately.
- Byte signatures and streamed size limits are checked on the server; filenames are sanitized. Files are downloaded as attachments with `nosniff` and a sandbox policy, never executed or embedded as HTML. This is format validation, not antivirus scanning. Add malware scanning before expanding to arbitrary documents or archives.
- Files use Cloudinary `raw` / `authenticated` storage with random identifiers. No public or signed storage URL is returned to the browser: every download rechecks current conversation ownership (including guest/account claims), admin permissions and internal-note visibility, then streams through the application. Both apps must use the same Cloudinary account.
- Default retention is **30 days**, configurable for new uploads with `SUPPORT_ATTACHMENT_RETENTION_DAYS` (1–90). The chosen expiration is persisted and displayed beside each sent file. Changing the setting does not extend existing uploads. Downloads are denied immediately at expiry; expired conversations retain the filename and an “Attachment expired” label, not file content.
- Sure Imports runs `/api/cron/support-attachments` hourly, authenticated by `CRON_SECRET`. It deletes up to 50 expired assets per run using Cloudinary destroy with invalidation, then clears the file reference. Failed deletions remain queued for subsequent runs. Monitor failures/backlogs and increase throughput if usage grows. Cleanup deliberately continues when the public chat gate is disabled. Deploy the cleanup schedule and migrate the database together.
- Each upload is reserved in the database **before** Cloudinary upload. Reservations expire after one day until a message is committed; successful sends atomically extend retention. This allows failed/abandoned uploads to be deleted too. Duplicate retries remove their extra object immediately. Deletion cannot remove copies recipients have already downloaded.
- Additive migration `20261018040000_support_attachments` is owned by Sure Imports. Applied only to the disposable local test database. The authenticated app deployment, production migration and scheduler activation remain pending.
- Validation: 27 support/authentication tests passed including real MySQL attachment ownership, internal-note privacy, duplicate retries, expiry denial, deletion failure retries and retained expired labels. Both schemas/type checks and production builds are release checks. A live Cloudinary smoke test uploaded one synthetic file, confirmed protected download and denial of unsigned access, then deleted it immediately. No real customer attachment was used.

Attachment final verification: both isolated production builds passed; Sure Imports also passed an explicit TypeScript check against generated route types. Prisma validation and shared-source checks passed. The attachment picker was visually checked at 320×568. The local migration is applied; production migration, deployment and scheduler activation have not been performed.


## Admin management and notification recipients (18 October)

### Access change applied to the existing admin database

At the owner’s request, `customer_support` view/edit permissions were granted to **Tochukwu Nkwocha, Favour Okorie and Francis Uzonze**. **Eric Asamoah was excluded**; his existing permissions and role were not modified. All other service permissions remain unchanged. The script checked the four-account roster and rejected concurrent permission edits before applying the grant. Before/after permission snapshots are stored locally in `/private/tmp/support-admin-permissions-before.json` and `/private/tmp/support-admin-permissions-after.json`. This one-time grant does not automatically grant access to future admins.

### Implemented locally

- Server-side inbox search across subject, customer identifier and order reference; status, assigned-to-me, unassigned, named-admin and unread-only filters; 25-item pagination with total counts. Search values are bound parameters, not SQL fragments. The selected conversation remains available while filtered results change.
- Manual assignment/reassignment and unassignment require support edit permission. Assignees must currently have both view/edit access or be superadmins. Names shown in the picker come from the existing admin roster. Existing first-response auto-assignment is preserved when no one has been assigned.
- Unread counts are individual to each admin and count public customer/guest messages. Visible conversations acknowledge only the cursor actually loaded, and only while following the latest messages; stale acknowledgments cannot mark newer arrivals as read. Read-only staff may acknowledge their own reads. Writes occur only when the cursor advances or the selected conversation changes.
- Reporting periods of 7, 30 and 90 days; new conversations, current resolution status, first-reply and resolution averages, daily volumes, overdue first replies and current team workload. Expandable detail tables and CSV export keep the default screen compact. Period-cohort, all-date backlog and UTC daily definitions are explained in the interface. CSV output escapes cells and neutralizes leading spreadsheet formulas. These are elapsed-time metrics, not business-hour SLAs or historical resolution-event counts.
- The admin support page maps shared support styles onto the existing admin theme variables and uses its heading sizing, spacing and card/button treatment. Desktop and 320px mobile preview checks covered search, assignment, unread badges and light/dark contrast. The isolated preview uses synthetic admins and does not authenticate as real staff.
- Team notifications now resolve all current support editors and superadmins at delivery, plus `SUPPORT_TEAM_EMAIL` (default `hello@sureimports.com`). Recipient addresses are deduplicated and sent individually. Eric has no support grant and is therefore excluded from the current recipient group. Revoked editors drop out automatically. This applies to new conversations and customer follow-ups; internal notes do not trigger emails.
- Successful recipients receive a delivery receipt per notice revision. Partial failures retry only recipients without a confirmed receipt and do not prevent other recipients from being attempted. Delivery remains at least once: a crash between SMTP acceptance and saving a receipt can still duplicate an email. Email subjects/links contain no conversation contents. No real notification emails were sent during tests.
- Additive migration `20261018050000_support_management` adds read cursors, receipt records and an assignment index. It is applied only to the isolated test database. Deploy both applications with all support migrations before enabling the chat and notification gates; grants alone do not enable the live chat.
- Validation: 28 support/authentication tests passed, including real MySQL pagination, unread isolation, stale-cursor behavior, permission-checked assignment, report serialization, excluded recipients and partial email failures. Shared-source and Prisma validation checks passed; both isolated production builds passed. The React review covered conditional agent rendering, aborted polling, stable dependencies, accessible labels and mobile controls.

## Production release — 18 October 2026

- Promoted verified production builds: customer `dpl_8w4XQGMW7kki7ckNfw6S4jvxDVLe` (`sureimports-gaz1tse25-tochukwu-nkwochas-projects.vercel.app`), admin `dpl_5KyjsTwDeWWJgvxCao1WNTwUNkqw` (`admin-sureimports-pzzpss7jp-tochukwu-nkwochas-projects.vercel.app`). Release source: `/private/tmp/support-release-1018/`. Baseline source hashes matched both preceding live deployments; only support files and integration points were overlaid.
- Applied all five support migrations to the shared production database, with checksums recorded in `_prisma_migrations`. Enabled chat on both projects, customer notification email and 30-day attachment retention, and admin push with a stable private VAPID key pair stored as production configuration.
- Existing floating WhatsApp and legacy live-chat widgets are suppressed when support is enabled. The support launcher's inline managed WhatsApp picker remains available. Corrected its placement value from the unsupported `contact-page` to the existing analytics category `page`.
- Both production builds passed. Twenty support/login checks and fourteen WhatsApp regression checks passed. Staged guest creation, conversation creation/history and unauthorized-history denial passed. The disposable QA conversation and queued notices were removed before promotion.
- On the live domain, the support launcher loaded the guest workspace and existing WhatsApp contacts. A real browser click from the backup picker generated a reference and the matching `whatsapp_clicks` record (site, page, destination, placement and service verified). No WhatsApp message was sent.
- Live email and attachment cron endpoints returned HTTP 200 with zero failures. Production SMTP authentication succeeded without sending a test email. The release-time error-log scan found no runtime errors. Staff must enable push on each device; physical-device push delivery and authenticated production admin interaction were not verified during this release.
- The release explicitly uses `npm run build` for admin because the project-level `vercel-build` override references a nonexistent script. Include `lib/procurement/browserDraftId.ts` in future admin support release manifests.

Final admin navigation follow-up: added permission-filtered **Customer Support** to the existing sidebar; build `dpl_DDCqWvnL7XCE7vpUye4pMyad5SR4` (`admin-sureimports-jxi8792z7-tochukwu-nkwochas-projects.vercel.app`) supersedes the admin build above. Automatic Vercel `/api/cron/support-push` requests returned HTTP 200. A manual request with the local development credential correctly returned 401; production cron credentials were left unchanged. The verified synthetic WhatsApp event was removed from live analytics after recording evidence, so it does not inflate reports.

## Ecosystem launcher rollout — 18 October 2026

- Support launcher and desktop panel now anchor to the bottom-right. Both legacy back-to-top component exports render nothing, so every existing consumer loses the arrow and its scroll listeners. No equivalent back-to-top control was found in the LineScout, Affiliate, Partner or Admin app sources.
- LineScout, Affiliate and Partner use the shared `EcosystemSupportLauncher` component. It opens a native modal and mounts the central `/support/embed` workspace only while open. Chat identity remains on Sure Imports: other app accounts are never interpreted as Sure Imports accounts. The guest chat can persist across these subdomains in the same browser. Sure Imports sign-in opens separately. Existing LineScout operational chat is unchanged.
- The central embed route allows framing only by itself and the three named HTTPS subdomains. Affiliate's CSP permits that exact route; its routing guard permits only the new public `/api/support-contacts` endpoint. No authentication guard was relaxed for private APIs. Partner customer storefront paths and custom domains do not display the central launcher.
- Each parent site renders the centrally managed WhatsApp contacts in its own DOM, preserving the existing tracker’s site/path/service attribution and accepted `page` placement. API proxies expose only the public contact data and provide a fallback contact. Legacy LineScout and Partner floating WhatsApp controls were removed from their active shells.
- Release snapshots: `/private/tmp/support-ecosystem-release-1018`. Promoted customer `dpl_7YGd6uDC7fwmi2RaVrdMtfU4D4Mc`, LineScout `dpl_9wnkeiHNg1BkXwYHsDecrHYGXVpb`, Affiliate `dpl_DqWDFs4EVt2ZX8ZGUcEXqvfPCoCz`, Partner `dpl_3pKMquMKivArFqtVn1hQJ8TWZEc2`. Baselines matched preceding live sources before scoped overlays.
- All four production builds, the explicit main-site TypeScript check, shared-source checks, and 34 support/login/WhatsApp regression checks passed. All three contact proxies returned four managed contacts. The embed route returned HTTP 200 with the expected framing policy. Live browser checks loaded the guest workspace on all three subdomains; Affiliate was also checked at 320px with the new-conversation form. Release-time runtime error scans were empty. No customer message was sent during these UI checks.

## Sign-in overlay fix — 18 October 2026

The root-mounted support dialog persisted across client navigation and obscured the login page. `PublicSupport` now invokes the launcher's close callback on sign-in; `SupportLauncher` also closes whenever the pathname changes. The `/auth/login?next=/dashboard/support` return destination and embedded new-tab sign-in behavior are preserved. Promoted `dpl_6ijBnbvfHujUCwGWnqQHoKkQdnbL` (`sureimports-kh9xqpm74-tochukwu-nkwochas-projects.vercel.app`) from `/private/tmp/support-signin-release-1018/sureimports.com`. Explicit TypeScript, 20 support/login checks and the production build passed. Reproduced the old overlay problem in Chrome and verified the same click on the promoted build navigates to login with visible email/password fields and no open support dialog. Release error scan was empty.

## Chat participant names — 18 October 2026

Conversation reads now resolve the current registered owner's first and last name from `users`; the admin inbox, conversation heading and customer message labels use that name. This also covers earlier guest messages after the existing claim transaction transfers ownership, without rewriting historical authorship. Unclaimed conversations remain labelled Guest. Agent replies resolve only the replying admin's `userFirstname`, for both guest and account history; the client receives neither staff surnames nor contact details. Missing names fall back to Customer/Guest/Support. Private notes retain their staff-only visibility and show their author's first name to admins.

Validation: explicit TypeScript checks passed for both applications, shared-source parity passed, 20 policy/login checks and three real MySQL integration checks passed. The new isolated test covers guest-to-account claiming, inbox identity, public replies before/after claiming, private-note isolation, inaccessible conversations and missing names. No schema migration is required. Scoped release snapshots are in `/private/tmp/support-names-release-1018`, containing only the four changed shared support files over the preceding production snapshots.

Both production builds passed and were promoted: admin `dpl_2NFRWgP1GV2JZu6qznCtTGwRLfrA`, customer `dpl_AJRcv7gnHET7BR6g6aJ7x5j5eaR1`. Staged session returned HTTP 200 and unauthenticated admin history returned HTTP 403. Authenticated name/claim verification used the isolated MySQL test environment rather than modifying live customer conversations.

## Support recovery and notification routing — 18 October 2026

The participant-name release failed for signed-in customers because the production `users.pidUser` column uses `latin1`; applying an `utf8mb4` collation directly caused MySQL error 1253. Restored the preceding customer and admin deployments while preparing the combined correction. Customer-name joins now explicitly convert the legacy ID to utf8mb4 before comparison. Read-only production checks passed for the actual list, inbox and history store queries. The isolated name test now uses a latin1 customer ID column to prevent recurrence.

Admin email and push alerts now wait five minutes after the latest customer message. At delivery, unassigned chats notify eligible support admins; assigned chats notify only the current assignee. Each recipient's read cursor suppresses alerts for messages already read, including messages read by the visible chat's existing polling/read acknowledgement. The shared hello mailbox receives only unassigned chats that no admin has read. Push opt-in and permission checks remain in place, and customer reply email timing is unchanged. Email cron checks every minute. New messages also refresh the delivery deadline when a prior revision is leased, preventing immediate delivery of the newer revision.

Validation: 27 targeted tests passed, including actual MySQL routing/assignment/read checks, five-minute eligibility, reassign/unassign, legacy charset, ownership, push retries/revocation and policy/login checks. Both apps passed explicit TypeScript checks. No production messages or test emails were sent by these tests. Combined scoped snapshots: `/private/tmp/support-combined-release-1018`.

The iPhone/iPad browser-tab state now shows numbered Home Screen setup instructions instead of an unusable grey Enable button; standalone installations retain the explicit permission button. No browser restriction is bypassed. The staged customer session and conversation-list endpoints both returned HTTP 200 using an empty guest session (no chat message created).

Released customer `dpl_HEUAEu8Zn6cgtt7A13LX1Af4Lzkb` and admin `dpl_6jx8xmigDqyoC1MowNYKHebGcuYk` after successful production builds. Live empty-guest session and conversation-list requests returned HTTP 200; unauthenticated admin access remained HTTP 403. No chat message was sent during this smoke check. Physical iPhone push delivery still requires the user's Home Screen installation, permission grant and a qualifying unread customer message.
