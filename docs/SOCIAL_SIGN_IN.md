# Apple and Google sign-in

Apple Services ID: `com.sureimports.web`. Credentials are server-only SURE_IMPORTS_APPLE_AUTH_CLIENT_ID, TEAM_ID, KEY_ID, and PRIVATE_KEY. Google uses GOOGLE_CLIENT_ID (the same client as NEXT_PUBLIC_GOOGLE_CLIENT_ID).

Each website registers its canonical origin with Google. The Google Identity Services popup uses a nonce-bound JavaScript callback; no Google redirect URI is required.
Apple return URLs (each must be registered in the Services ID):
- https://www.sureimports.com/api/auth/callback/apple
- https://affiliate.sureimports.com/api/auth/callback/apple
- https://partner.sureimports.com/api/auth/callback/apple
- https://linescout.sureimports.com/api/auth/callback/apple

## Existing accounts
Same-email sign-in does not silently merge. Sign in using an existing method, open `/connect-social` within ten minutes, explicitly choose a provider, and confirm the link. Provider email must match. Apple Hide My Email is supported for new accounts; existing-account linking requires the same email (usually Share My Email). Legacy Google-only customers without a stored provider identity can set a password using the existing recovery flow, then connect Google. No existing provider identity is guessed from an email address.

Sure Imports and Partner share the customer identity namespace and existing user accounts. Affiliate and LineScout are isolated. Browser sessions remain host-only; social authentication does not grant partner approval, affiliate membership in another programme, or staff permissions.

## Database
Apply `scripts/apple-auth-schema.sql` to the application's configured database. The migration only creates three social identity, short-lived attempt and rate-limit tables. It does not change existing user records. Identity writes and account creation are transactional. Expired attempts/rate buckets are pruned in bounded batches on sign-in starts.

## Environments and verification
Apple production credentials never enable development authentication. Apple local testing requires a registered HTTPS test domain and separate SURE_IMPORTS_APPLE_AUTH_TEST_CLIENT_ID, TEAM_ID, KEY_ID, PRIVATE_KEY and ORIGIN values.

Google development uses GOOGLE_CLIENT_ID (or NEXT_PUBLIC_GOOGLE_CLIENT_ID) and defaults to http://localhost:3000. Register http://localhost and http://localhost:3000 as authorized JavaScript origins in Google Cloud. Optional SURE_IMPORTS_GOOGLE_TEST_CLIENT_ID and SURE_IMPORTS_GOOGLE_TEST_ORIGIN select a separate development client/origin. HTTP is accepted only for loopback development origins; other origins require HTTPS. Preview deployments keep both providers disabled.

Run `npm run test:social-auth` and TypeScript/build checks before deployment. Tests cover mocked provider flows and signing primitives. Real Google and Apple consent must still be completed in a browser on each configured HTTPS origin, including returning login, signup, cancel, matching-email linking, mismatched-email rejection and private-relay email delivery.

## Scope
This implementation adds provider login and linking. Provider access/refresh tokens are not stored. Apple grant revocation and server-to-server account event notifications are not implemented here. No production deployment is performed by these local code changes.

Local HTTP development uses separate host-only social-flow/setup cookies with SameSite=Lax and no Secure flag, restricted to loopback and NODE_ENV=development outside Vercel. This supports Safari on localhost. HTTPS and production keep Secure __Host- cookies. Start a new sign-in attempt after changing cookie configuration.
