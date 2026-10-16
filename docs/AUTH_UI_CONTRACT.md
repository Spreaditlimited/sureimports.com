# Shared authentication UI

The four Sure Imports applications use identical AuthFrame, AuthHeading, AuthSignIn, AuthDivider and AuthUI.module.css files in components/auth-ui. Only brand.ts contains product-specific copy and asset paths. Keep common files synchronized when changing any site.

- Form width: 400px maximum; mobile gutters: 20px.
- Breakpoint: 1024px. Mobile logo: 194 by 32; mobile padding: 48px.
- Typeface: Inter. Headings: 30px desktop / 26px mobile.
- Fields and submit: 50px high, 8px corners; visible 1px field borders.
- Social providers: 40px high, 4px corners to match Google's native large button, full form width.
- Sign-in checkbox: 18px square, zero corner radius; consent checkbox: 22px square.
- Remember me is unchecked by default. Explicit true creates a 30-day cookie; false creates a browser-session cookie. Server session validity remains capped at 30 days. Browsers may restore session cookies when restoring a session.
- The choice travels in the server-stored OAuth attempt through callback and profile completion. Linking an account preserves its current session.
- Preserve each application's registration requirements and authentication handlers.
- Validate login, signup, connect, and completion at mobile/desktop widths in both themes. Compare fields, provider buttons, connection card and submit edges, heights, corners and computed styles, not only overflow.
- Run npm run test:social-auth and the production build in every application.
