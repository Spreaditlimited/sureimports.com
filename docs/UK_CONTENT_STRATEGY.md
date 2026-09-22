# UK importing and white-label content rollout

## Editorial direction

Use `/import-from-china-to-uk` as the UK service hub. Preserve Nigeria-focused titles, URLs, examples and canonicals. Expand existing content only where the UK addition answers a real reader question. Do not add UK keywords indiscriminately or create competing versions of the same article.

White-label discovery and project-start links go to `https://linescout.sureimports.com/white-label`. Product-specific sourcing guides may keep their product URLs. Estimated landed costs are research inputs, not quotes or profit promises.

## First publication batch

1. `how-to-build-your-own-white-label-products-in-china-for-the-nigerian-market`: add a clearly separated UK sourcing brief near the introduction; link the UK hub, catalogue and official import checklist; replace legacy generic white-label project-entry links. Retain Nigeria title and metadata.
2. `how-to-build-a-china-import-budget-before-you-contact-any-supplier`: add a GBP budgeting worksheet approach, destination-specific assumptions and separate purchasing/selling budgets. Retain the original Nigeria guidance and metadata.

Implementation: `scripts/seo/publish-uk-content-batch-one.mjs`. Dry-run is the default; `--apply` uses the owner's explicit publication approval. Both articles receive stored before/after snapshots and validation evidence. No automatic publishing setting is changed. The batch is idempotent and checks concurrent edits before writing.

## Second publication batch

Four existing guides receive distinct UK sections, placed after the introduction and before the original first section:

- `product-samples-from-china-to-nigeria-when-they-are-worth-paying-for`: sample versions, UK delivery quote, acceptance criteria and a recorded production reference.
- `china-supplier-verification-checklist-for-nigerian-importers`: separate supplier identity, production capability and product evidence; check beneficiary changes and document relevance.
- `how-to-compare-china-supplier-quotes-like-a-serious-nigerian-buyer`: comparable GBP assumptions, delivery scope, carton data, quote validity and explicit unknown costs.
- `private-label-packaging-from-china-for-nigerian-brands-what-to-decide-before-production`: UK-specific artwork brief, packaging layers, channel requirements, approval reference and complete packing cost.

Run `node --env-file=.env.local scripts/seo/publish-uk-content-batch-one.mjs --batch-two` to validate; add `--apply` for the approved publication. Draft content is versioned in `scripts/seo/uk-content-batch-two.mjs`. The shared runner checks every added link, restricted HTML tags/attributes, balanced markup, original-content preservation, publication eligibility and concurrent edits. It retains draft and applied change records with rollback snapshots. The UK search rows are cluster context, not asserted page-specific search demand.

Official reference checked: https://www.gov.uk/guidance/product-safety-advice-for-businesses. Additions link to the guidance without inventing a universal certificate, marking rule or tax rate. Existing external sources and Nigeria content remain intact.

## Third publication batch

- Hanging toiletry bags: UK use-case selection, bottle capacity, hook/seam checks, cleaning claims and delivered cost.
- Microfiber cloths: UK task selection, fibre/GSM specification, wash testing, support for marketing claims and retail-pack costing.
- Travel packing cubes: UK customer/use case, complete set dimensions, compression-versus-weight clarification, hardware checks and complete-set costing.

Drafts and exact corrections: `scripts/seo/uk-content-batch-three.mjs`. Run the shared runner with `--batch-three` (dry run) and then `--batch-three --apply` to publish. Existing titles, URLs and metadata stay intact. Targeted corrections remove unsupported specific profit, freight, timeline and compliance assurances and the false claim that packing cubes lower the weight of unchanged contents. Each correction must match exactly once and is recorded in the audit log; other original content is preserved. This is not a complete fact-check of every older marketing claim in the archive.

The new UK sections link the existing UK hub and white-label catalogue; product-specific links already in the guides remain. No new posts or new site routes are introduced.

## Fourth publication batch

- `the-profit-blueprint-how-to-turn-your-landed-cost-into-a-confident-selling-price`: clarify markup versus margin, profit after selling expenses, the retail builder's limited fee model, and the effect of discounts. Remove unsupported safe-margin and guaranteed-profit assurances. Add an explicitly hypothetical GBP example and links to the existing LineScout marketplace calculator and Amazon/TikTok guides.
- `the-ultimate-guide-to-mastering-your-profit-margins-how-to-use-the-landed-cost-estimator-for-china-imports`: clarify the actual product-plus-shipping formula, destination-specific quote inclusions and UK cost allocation. Remove unsupported fixed cost proportions, profit promises and the claim that all registered users are successful merchants.

Drafts: `scripts/seo/uk-content-batch-four.mjs`. Shared runner option: `--batch-four`, with `--apply` for publication after validation. Arithmetic examples checked: £10 difference on £10 cost is 100% markup; on £20 revenue it is 50% margin; subtracting £6 selling expenses leaves £4 or 20%; £1,200 divided by 100 saleable units is £12.

Implementation evidence: main-site Retail Price Builder models buffered landed-plus-marketing cost divided by one minus fee and target margin; promo/reseller discounts reduce that calculated price without preserving profit. Landed Cost Estimator adds unit product cost times quantity to rate times chargeable weight/volume. LineScout's existing calculator has Amazon/TikTok selection and UK market support; it is not a live fee lookup. This batch changes explanatory content only, not calculator code or payment calculations.

## Fifth stage: contextual reading paths

Implemented in the UK landing page and Import Hub using the shared server component `components/home/ImportReadingPath.tsx`. Three stages guide readers through budgeting, supplier checks and sample approval. The UK page adds relevant follow-up links for selling prices, quote comparison and packaging. The Import Hub keeps a shorter three-link selection after destination choice. Both explain the guides contain separate UK guidance alongside existing Nigeria examples.

Uses existing theme and width tokens, with three desktop columns and a single mobile column. No new routes, database queries or client-side state. These page-code changes require a GitHub deployment and are not automatically live with the article updates.

## Ongoing follow-up

| Priority    | Existing content            | Useful improvement                                                                                                             |
| ----------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Measurement | UK hub and revised articles | Review 28/56-day UK and Nigeria performance. Create new posts only when existing content cannot satisfy an evidenced UK query. |

## Measurement

Store the publication date and URL from the change logs. Compare UK-filtered Search Console impressions, clicks, CTR and query/page pairs over the next 28 and 56 days, alongside Nigeria performance for the edited URLs. Do not attribute ranking changes solely to these edits or promise a ranking date.

Stored UK query evidence reviewed for this batch includes `white label products china` (122 impressions, zero clicks) and `china concierge service private label process` (82 impressions, zero clicks). These are sums of stored rows, not live monthly totals. The exact dated query/page rows are retained in each change log.

Track UK hub visits and downstream catalogue/project starts where existing analytics supports it. A successful strategy should produce relevant enquiries and paid projects, not only more impressions.

## Publication safeguards

- No URL, canonical, publication-date or Nigeria keyword changes in batch one.
- Preserve original body content except recorded targeted editorial corrections and legacy CTA URL replacement.
- Check added links return HTTP 200 and the expected path.
- No invented rates, delivery promises, product approvals or sales guarantees.
- Regulatory details should use current official sources and receive review before publication.
- Do not deploy unrelated code as part of a content publication.
