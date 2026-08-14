# SureImports SEO Auto-Publish Rules

Auto-publishing is allowed only when every rule in this document passes. If any rule fails, the system must create a draft or recommendation instead of publishing.

## Global Safety

- Auto-publish must be disabled unless `SEO_AUTOPUBLISH_ENABLED=true`.
- Every automated change must keep a before/after snapshot.
- Every automated change must record the source Search Console query set that triggered it.
- Any failed validation must stop publishing and leave a reviewable draft.
- The system must never invent case studies, customer names, testimonials, prices, exchange rates, customs rates, delivery timelines, or government requirements.
- Any claim about current rules, customs, SONCAP, NAFDAC, exchange rates, platform policies, or shipping timelines must be marked for review unless the value comes from an approved internal source.

## Allowed Auto-Publish Changes

These changes can publish automatically after validation:

- Meta title improvements.
- Meta description improvements.
- FAQ section additions based on Search Console queries.
- Internal link additions to existing SureImports pages.
- Minor content refreshes that clarify existing advice without changing the article promise.
- CTA and lead-magnet intent assignment.

## Restricted Changes

These changes require a draft first unless a future admin setting explicitly allows them:

- New blog posts.
- Full article rewrites.
- New service claims.
- New pricing or rate information.
- New legal, customs, compliance, tax, or regulatory explanations.
- Any content that mentions a competitor by name.
- Any content that could materially change a buyer's payment, supplier, freight, customs, or compliance decision.

## SEO Quality Rules

- The target keyword must match the article topic.
- The revised title must be under 65 characters.
- The revised meta description must be between 120 and 160 characters.
- The content must not keyword-stuff repeated phrases.
- The system must prefer useful importer language over generic SEO language.
- The article must keep its existing canonical URL unless an admin approves a slug change.
- Internal links must point only to existing live SureImports routes.
- Newly introduced internal links must exist in the active linkable-page registry or receive an explicit one-change administrator approval.
- Link validation must compare the source and rewritten documents so preserved legacy links are not misreported as AI-inferred links.
- New FAQ answers must be concise and directly answer the query.

## Offer Rules

- Every blog post may have one primary CTA intent and up to three backup offers.
- The primary CTA must be inferred from the visitor's entry context or manually overridden in admin.
- Payment, supplier verification, shipping, and procurement CTAs must route to existing SureImports service flows.
- Consultation CTAs must require payment before a booking slot is confirmed.
- If intent confidence is low, route to a general procurement quote or importer consultation offer.

## Search Console Trigger Rules

- High impressions and low CTR may trigger title/meta improvements.
- Average position 5-20 with meaningful impressions may trigger content expansion.
- Repeated query themes across posts may trigger a new article draft.
- Queries with transactional intent may trigger lead magnet and CTA recommendations.
- A page with declining clicks for at least 14 days may trigger a refresh recommendation.

## Publish Thresholds

- Intent confidence must be at least 0.8 for CTA auto-assignment.
- SEO recommendation confidence must be at least 0.85 for meta-only auto-publish.
- Content additions must pass HTML sanitization and route validation.
- Search Console sample size must include at least 50 impressions for the target page/query group unless manually approved.

## Rollback

- Every auto-published update must be reversible from the stored before snapshot.
- A generated rewrite must be saved before link review or final database application so a failed later stage can resume without regenerating content.
- The system must store the automated job id, changed fields, trigger reason, and validation result.
- If an update causes indexing, rendering, or build errors, auto-publish must disable itself until an admin re-enables it.

## Rewrite Research and Citation Policy

- Nigeria remains the primary audience and market context, but every rewrite must explain local context and deliver transferable value to readers outside Nigeria.
- Existing useful external links are editorial assets. Rewrites must retain them or replace them only with a researched, more authoritative and relevant source.
- Replacements must be explicitly recorded, and the replacement URL must appear in the rewritten article.
- New official or primary external sources should be linked when they materially help readers verify claims, use an official service, or continue their research.
- External-link continuity is enforced during generation and again before application. An older rewrite artifact cannot be applied unless it was generated under the current quality policy.
- Article rewrites use `gpt-5.6-sol` with high reasoning, bounded web search and output limits unless `SEO_CONTENT_REWRITE_MODEL` explicitly selects a different model.
- Long-running rewrite requests run in OpenAI background mode. The response ID is saved immediately, and later status checks retrieve that same response instead of creating another billable generation.
