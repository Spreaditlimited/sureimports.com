# Sure Imports shared foundation

Version 1.1.0 serves the main site, admin, affiliate, partner and LineScout web applications (including LineScout internal and agent web routes). Native Expo applications are not CSS consumers.

## Ownership

`design-system/tokens.css` and `components.css` in the main Sure Imports repository are canonical. Other applications carry identical local copies, so deployments remain independent. Each root layout loads these files after legacy global styles and declares `data-si-foundation="1"` on `html`.

- Tokens own brand colours, paired text/surface colours, semantic statuses, spacing, control sizes, radii and motion.
- Components own field appearance, native select arrows, focus states, buttons, cards, notices and workspace heading hierarchy.
- Product CSS owns layout, information density, navigation, artwork and specialized interactions. Do not duplicate palette values in product CSS.
- Existing legacy theme bridges remain for older screens. Their removal should accompany migration of their consumers, rather than delete working styles wholesale.

## Controls

Use the existing `components/ui` exports wherever available. Their public APIs, refs, form names, values, handlers and Radix semantics are unchanged. `input-with-dark-mode` is a compatibility export of `input`; there is only one input implementation.

Button classes live in `buttonVariants`, so both buttons and links rendered with those variants receive the same treatment. Use default, secondary, outline, ghost, link or destructive according to intent. Do not use a primary button style for navigation or status badges.

Plain native text fields participate automatically. Native select arrows sit 16px from the edge with 44px reserved for the arrow. Hidden native selects backing searchable pickers, multi-selects, file inputs, checkboxes and editor internals retain their specialized geometry. Native menus intentionally retain platform behaviour; Radix menus retain Radix keyboard and focus handling.

For a specialized field which genuinely requires different styling, use `data-si-unstyled` and document why in the component. Do not remove accessible labels, focus indicators or validation messages. Controls keep 16px text to avoid iPhone focus zoom.

Cards may use `data-si-card=""`. Notices may use `data-si-notice="info|warning|success|error"`; add appropriate accessible live-region semantics only when content changes dynamically. Status colours must not be substituted with brand purple.

## Changes and verification

1. Change the canonical CSS. For a new release, update the manifest version.
2. Run `node --test tests/design-foundation.test.mjs` in the main repository (text contrast, field-boundary contrast, select spacing and accessibility contracts).
3. Run `node scripts/design-system/sync.mjs --write` from the main repository to update the four sibling applications. This requires write access to those repositories and refuses to overwrite modified generated CSS.
4. Run `node scripts/design-system/sync.mjs --check` to compare all checked-out consumers.
5. Run `npm run design:check` within each repository. This works independently and verifies hashes and root integration.
6. Run type checks and relevant business-flow tests. Inspect representative public, authenticated and modal screens in light/dark themes and at mobile widths before deployment.

The root foundation reaches all routes; this is not a claim that every legacy page has received an individual layout redesign. Existing module styles can still override the foundation where they have greater specificity. Review such overrides when migrating a screen. Avoid adding `!important` to the shared layer to win a specificity contest.

## Public headlines

Public site wrappers (`public-site-theme` and LineScout’s `public-site`) inherit the approved 600-weight headline and -.045em tracking from shared tokens. Inline headline accents inherit that weight too. Page-specific sizes and layouts remain local; the homepage and service heroes retain their centred copy. Use the headline tokens in new hero components instead of hardcoded weights.
