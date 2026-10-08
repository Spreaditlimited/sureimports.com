<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Blog publishing

- Before creating or publishing articles, read `HOW_TO_ADD_BLOGS.md`, `docs/SEO_AUTOPUBLISH_RULES.md`, and the current admin blog creation, image and publication-validation workflows in the sibling `admin.sureimports.com` repository. Current application code takes precedence over stale examples in the older guides.
- Use the admin's `BLOG` + millisecond timestamp convention for new `pidBlog` values. All articles must use author **Tochukwu Nkwocha**, `publisherId: PUB1767167254459`, and `blogBy: Tochukwu Nkwocha`. Use that existing author profile and image, not an editorial-team byline. Link an active existing category and keep SEO category metadata consistent with it.
- Every new article must have at least 2,000 useful body words and an article-specific feature image generated according to the established blog image brief, uploaded through the Cloudinary blog-image workflow before publication. A generic social card is not a substitute. Preserve images the owner has already generated.
- Validate publication eligibility, internal links, canonical, SEO and social metadata, image availability, and author/category records before publishing. Keep before/after records and reject concurrent edits. Preserve existing slugs when correcting technical fields, and migrate dependent references when changing a blog ID.
