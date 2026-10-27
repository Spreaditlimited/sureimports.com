# AdSense quality and search repair — 27 October 2026

The release replaces repetitive article passages, corrects discovery and structured-data defects, and strengthens the publication workflow. Final public content for the 66 corrected articles is versioned in `content/blog-repairs/2026-10-27.json`. Private database snapshots, account exports and rollback evidence remain in the ignored repair deliverables directory.

## Preserving previous deployments

The production deployment before this repair originated from Git commit `90a09bccd98376d740a2475fd5c7b6bc6af0e86e`. Earlier CLI deployments included public-form security, consent-based advertising conversion tracking and the Estimated Landed Cost label that were absent from that Git commit. This release commits those existing local implementations together with the repairs. The corresponding admin release preserves its existing login protections.

The owner now requires every Sure Imports and subdomain deployment to originate from committed and pushed Git code. Read `AGENTS.md` before any release. Direct CLI deployments, redeployments and promotions are prohibited. Verify the production deployment source and exact commit after pushing; inspect and reconcile any historical CLI-only changes before subsequent releases.

## Changes

- Held 26 incomplete scheduled articles as drafts, retaining existing published URLs.
- Replaced repeated body text with topic-specific guidance and corrected unsupported growth and margin claims in the older product shortlist. Moved the main product guide's comparison table and numbered list above supporting detail.
- Generated six article-specific feature images with the built-in image-generation tool, uploaded them through the existing Cloudinary workflow and preserved existing owner images. Article text was written directly; no OpenAI API generation was used for this work.
- Added publication checks for new-article completeness, repeated paragraphs, author/category records, image delivery, metadata and live internal destinations; added concurrent-edit protection and preserved existing slugs.
- Protected article creation, updates, deletion and image generation using the existing admin `blog_management` edit permission.
- Fixed blog filtering before pagination, pagination canonicals, empty-page responses, malformed social-image URLs, broken internal tool links and matching breadcrumb identifiers.
- Server-rendered initial shop/phone content, removed global Flutterwave loading, reduced article data duplicated into client props and deferred embedded video loading.
- Followed the mobile performance trace: optional Google, Facebook and TikTok scripts now require an affirmative cookie choice; withdrawal updates their consent state. Blog dates use UTC consistently to prevent time-zone hydration mismatches, small author portraits request appropriate image sizes, and the mobile menu has an accessible name.
- Added AdSense code on article/privacy pages, Google privacy disclosures and advertising privacy controls. Published a Sure Imports-specific European consent message in the existing AdSense account.
- Refreshed Search Console data through 24 October, stored property/page/device/country totals separately from query rows and added stale-data visibility. Imports remain manual.

## Verification

Production builds and TypeScript checks passed for the website and admin. Focused tests cover publication quality, image URLs, listing parameters, manual Search Console imports, public-form protections, conversion consent/deduplication and denied admin publishing access. The final live crawl and Google review outcomes are recorded in the local repair report; passing technical checks does not guarantee AdSense approval or search recovery.
