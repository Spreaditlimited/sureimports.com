# China to Nigeria search-intent map

This map keeps the main commercial and information pages distinct. Do not create another page targeting the same primary intent without first checking Search Console query-to-page data.

| Query family | Primary URL | Purpose | Supporting URL |
| --- | --- | --- | --- |
| import from China to Nigeria; buy from China and ship to Nigeria | `/import-from-china-to-nigeria` | Overview, service choice and next steps | Detailed blog pillar, `/buy-from-chinese-websites`, `/ship-with-us` |
| China sourcing agent for Nigerian businesses; source wholesale products from China for Nigeria | `/china-sourcing-agent-nigeria` | Commercial sourcing route for individuals and smaller businesses, leading to LineScout | `linescout.sureimports.com`, `/corporate-sourcing` for formal institutional procurement |
| how to pay Chinese suppliers from Nigeria; payment methods and safety | `/blog/how-to-pay-chinese-suppliers-from-nigeria-safely-in-2026` | Informational comparison and risk checks | `/china-supplier-payment-service-nigeria` |
| China supplier payment support Nigeria; Pay Supplier Sure Imports | `/china-supplier-payment-service-nigeria` | Commercial path for a buyer with a confirmed supplier and invoice | Existing payment guide, dashboard Pay Supplier flow |
| CBM calculator China Nigeria shipping; China to Nigeria volumetric weight | `/tools/cbm-volumetric-weight-calculator` | Calculator, worked measurement example and quote next step | `/shipping-rate`, `/ship-with-us` |

`/corporate-sourcing` retains its institutional procurement scope. `/import-hub` retains the country-selection scope. Existing articles remain supporting material rather than duplicate service landing pages. Internal link text should describe the destination task; avoid using the same exact keyword as every anchor.

The blog renderer adds a relevant next-step panel only to six existing guides: both broad import guides point to the import hub; the procurement-agent guide points to the sourcing service; the general payment guide points to Pay Supplier; the RMB-specific guide points to the broader payment guide and Pay Supplier; and the shipping/cost pillar points to the CBM calculator. The published article bodies and metadata remain intact.

## Search Console baseline, 26 November 2026

Chrome browser access was unavailable, so these figures came from the site's configured read-only Search Console service account for `sc-domain:sureimports.com`, Google web search, final data.

| Window | Clicks | Impressions |
| --- | ---: | ---: |
| 28 October–24 November 2026 | 1,016 | 41,201 |
| 30 September–27 October 2026 | 948 | 35,399 |

In the 26 August–24 November query/page sample, `how to import from china to nigeria` showed both the detailed blog guide (69 impressions, position 6.0) and the import hub (65 impressions, position 8.2). The exact `import from china to nigeria` query also showed a product-list article (54 impressions) and the hub (13). That is why the hub now focuses on choosing a buying, sourcing, payment or shipping route while the detailed article remains an instructional guide.

The `sourcing agent nigeria` sample primarily showed the procurement-agent article (17 impressions, position 8.4); the corporate page had only 3 impressions at position 86.3. The new sourcing page is explicitly commercial and aimed at smaller Nigerian businesses, while Corporate Sourcing retains the institutional brief.

For `how to pay chinese suppliers from nigeria`, the RMB-control article had 44 impressions and the general payment guide 7. The new payment service page addresses the *ready supplier and invoice* transaction stage. These articles should remain educational; do not retitle the service page as a generic payment-method guide.

CBM query volume was small: the calculator had 7 impressions for `cbm to volumetric weight` and 2 for `cbm shipping calculator`. The calculator now explains China-to-Nigeria use and a worked measurement example without claiming to quote freight prices.

Search Console can show more than one URL for a query without proving harmful cannibalization. Recheck query-to-page distribution, impressions, clicks, CTR and average position after indexing. Inspect the new URLs in Search Console to confirm Google selected their declared canonicals. Search results alone are not a reliable baseline because they vary by user, location and time.

## Indexing check and release gate, 26 November 2026

The read-only Search Console URL Inspection API returned:

| URL | Google index state | Google-selected canonical | Last crawl |
| --- | --- | --- | --- |
| `/import-from-china-to-nigeria` | Submitted and indexed | Declared canonical | 22 November 2026 |
| `/china-sourcing-agent-nigeria` | URL is unknown to Google | None yet | None |
| `/china-supplier-payment-service-nigeria` | URL is unknown to Google | None yet | None |
| `/tools/cbm-volumetric-weight-calculator` | Submitted and indexed | Declared canonical | 1 November 2026 |

The two unknown URLs return HTTP 200, permit indexing, declare self-canonicals and appear in the live sitemap. They are new and have not yet been crawled/indexed. Search Console last downloaded the main sitemap on 24 November 2026, before these URLs were added; it reports zero errors and two warnings. The local review release strengthens contextual links from six existing guides and the footer. After the owner approves the Git release, recheck URL Inspection, request indexing in the Search Console UI if still unknown, and monitor Google's selected canonical. The current service account is read-only and cannot request indexing; Chrome's browser-access host was unavailable during this audit.

## Ranking work, not just page creation

The hub answers the broad import question and routes readers by their stage. The sourcing page answers the commercial agent query with a written-brief and supplier-comparison workflow. The Pay Supplier page addresses the defined-invoice transaction and links to the broader payment-method article. The CBM page owns the measurement/calculator query with an actual working calculator. These targets should not be merged or duplicated merely to repeat keywords.

Before release, check that each page's title, description, H1, canonical, indexability, internal links, and JSON-LD appear in server-rendered HTML. Keep the existing articles as instructional supporting content. Do not claim unpublished customer outcomes, guaranteed delivery, automatic supplier verification, or a particular FX rate. If the owner later provides a more detailed, approved project example, add its verified facts as first-hand evidence instead of inventing a case study.

The owner confirmed that Sure Imports has worked with network-marketing companies, paying Chinese suppliers across several products and sourcing many of those products end to end. The sourcing and payment pages use only that high-level experience; no product names, quantities, client identities, savings or outcomes have been invented.

After release, compare these query families weekly in Search Console, with page as a second dimension: `import from china to nigeria`, `china sourcing agent` / `sourcing agent nigeria`, `pay chinese suppliers from nigeria` / `supplier payment`, and `cbm calculator` / `volumetric weight china nigeria`. Record indexed status, impressions, clicks, CTR and average position for the intended page and competing site pages at day 0, 14, 30 and 60. If the wrong page gains most impressions for a query, improve links and intent distinction based on those results; do not automatically create another URL. If the intended page is still unknown or excluded after the release, resolve indexing first.

Google's guidance is to prioritize useful, original, first-hand information and crawlable content; schema is descriptive metadata rather than a ranking shortcut. General SEO best practices also apply to Google's AI search features. Sources: https://developers.google.com/search/docs/fundamentals/creating-helpful-content and https://developers.google.com/search/docs/appearance/ai-features.
