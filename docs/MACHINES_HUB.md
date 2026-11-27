# Machines hub

Route: `/machines`. Primary keyword: **machine sourcing from China to Nigeria**. Supporting intent: import machines from China to Nigeria, production lines from China, industrial machinery sourcing, and food-processing machine sourcing. Research date: 27 November 2026.

The hub serves commercial investigation and routes buyers to detailed process guides. Existing individual blog URLs and canonicals remain unchanged. The older general machine-sourcing blog stays a supporting resource rather than being redirected.

## Evidence and limits

Google Search Console final web data, 28 October–24 November 2026, returned 603 impressions and zero clicks across 34 machine-related query/page rows. The query “food processing machinery sourcing china buyers guide” accounted for 412 impressions at average position 10.12. The 90-day comparison, 27 August–24 November, returned 841 impressions and zero clicks across 60 rows. These are site observations, not market search volumes. There was no observed exact-primary-keyword demand in this sample; the primary phrase is selected for service relevance and clear origin/destination intent, with the observed food-processing phrase supporting that direction. Public search results showed a mix of sourcing services and purchasing guides. No ranking or traffic promise is implied.

Search Console method: [Search Analytics query API](https://developers.google.com/webmaster-tools/v1/searchanalytics/query), final web data, query/page dimensions, includingRegex machine|machinery|production line|processing line|dryer|milling. Raw account exports stay private and outside Git.

## Automatic membership

The server reads active, published blog records on each request and excludes future `createdAt` timestamps. React `cache` only deduplicates within a request; the route is force-dynamic. No deployment is needed when a scheduled guide becomes public.

- All production-line series records with valid `blogExt2.productionLine.topicId` (`PL-001` style) enroll automatically.
- Other future machinery guides can enroll with `blogExt2.machineGuide: true`.
- Existing specific and supporting guides are curated in `lib/machines/guides.ts` so broad title matching cannot accidentally include affiliate or consumer-electronics articles.
- Draft/inactive, redirected, invalid-slug and explicitly noindex/nofollow records are excluded. Duplicate canonical slugs collapse.
- Directory search runs locally; the complete initial list is server-rendered and crawlable. Search does not generate indexable query URLs.
- A database failure shows an explicit unavailable state instead of a misleading empty catalogue.

The shared footer links Machines under Shop. `/machines` appears in the sitemap. CollectionPage, ItemList and breadcrumbs describe the current public directory. Public page content contains no Chinese manufacturer or marketplace links.

## Verification

Run `node --test --experimental-strip-types tests/machine-guides.test.mjs`. Check `/machines`, footer entry, canonical/social metadata, JSON-LD, guide links, empty search and scheduled visibility. Release only committed Git changes through the hosting Git integration.
