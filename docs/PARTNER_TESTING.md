# Test the partner website

Start at **http://localhost:3003/partners** in `../partner.sureimports.com`. Main Sure Imports runs separately on port 3001 and redirects legacy partner links here. No partner production deployment has been made.

## New owner journey

1. Click **Start your application** on the landing page.
2. Create an owner account with an email address you control. If you already have a Sure Imports account, use **Sign in** instead. This is not an affiliate account.
3. Check your email for verification. After verifying, return to the partner verification screen and click **Continue to sign in**. The email link currently uses the existing configured Sure Imports root URL; because the database is shared, verification applies to your local sign-in too.
4. Sign in. You should land on the **partner dashboard**, not the general procurement dashboard.
5. Click **Apply as a partner**, complete business details and create the application.
6. Complete the verification form and required document uploads. Save before uploading, then submit for review.
7. Click **Workspace overview** to see the current review status and next step.
8. In the admin app at **http://localhost:3000/dashboard/partners**, an authorized reviewer can view the application and request corrections, accept KYC evidence or reject the submission.
9. Return to the partner dashboard and refresh. A correction request is actionable from the verification page. Accepted KYC remains distinct from business activation.

## Important test boundaries

- Local and production share the database. Accounts, applications and uploaded documents you submit are real records. Use details you are authorized to submit; don't upload another person's identity documents for testing.
- Browser verification performed during implementation used synthetic intercepted responses for successful registration/login/application entry. It did not create users, upload KYC documents or send emails. Real inbox delivery and the complete signed-in review journey still need your controlled pilot.
- Captcha follows the existing auth behaviour: localhost bypass, configured verification in production.
- Activation is deliberately blocked pending membership-protection rollout. Storefront launch, procurement ordering and live collection/settlement are not testable as completed features yet. There are no fake balances or dummy active accounts.
- No additional migrations or deployments were performed for this connected website milestone.

## Page map

### Local sample customer review (12 September 2026)

Sign in locally as `sureimporters@gmail.com` and open `/partners/dashboard`, then choose **Customer order review**. The existing ignored `.local-partner-test.json` enables the fixtures for this account only.

- Four clearly labelled sample orders: three simulated paid orders awaiting review and one already approved.
- Expand an order to inspect quantity, price, specifications and the sample partner receiving address.
- Tick the review confirmation and approve processing. Only the in-memory sample status changes; no operational order, ledger entry, earnings or notification is written.
- **Reset sample orders** restores the starting state. Restarting the development server also clears sample changes.
- **View real account** (`?records=live`) disables fixtures in both overview and customer review.
- Available only on localhost in development, never on Vercel or production. The existing overview's eight sample records are a separate static display, not the ledger for these four scenarios.

This is a UI/workflow simulation, not proof of a real Paystack payment or end-to-end fulfilment. Real collection still requires an eligible approved partner and verified bank/subaccount configuration. See `PARTNER_CUSTOMER_ORDER_FLOW.md` for current implementation and migration status.

- `/partners`: landing page
- `/partners/sign-up`: owner account registration
- `/partners/check-email`: email verification instructions and resend
- `/partners/sign-in`: existing Sure Imports authentication with partner-specific presentation
- `/partners/dashboard`: owner workspace
- `/partners/onboarding`: application and KYC

General password recovery remains the shared Sure Imports recovery flow. After recovering your password, return through Partner Sign in.
