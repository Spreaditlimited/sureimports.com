# Nigeria Search campaign: owner review

Status on 3 November 2026: **Google Ads draft; not published or serving.** Account 599-961-8474, draft ID 10221411796, provisional campaign ID 281499402161523. Do not publish until the owner reviews the details and the negative keywords are configured.

## Campaign settings

- Name: `SI | Nigeria | China Buying Agents | Signups | Search`
- Objective and type: Leads, Google Search.
- Conversion goal: Sign-ups; primary action `Sure Imports - Completed signup (event)`.
- Landing page: `https://www.sureimports.com/buy-from-chinese-websites`.
- Location: Nigeria, people in or regularly in Nigeria. Language: English.
- Google Search Partners: off. Google Display Network: off. AI Max, text customisation, and final URL expansion: off.
- Bidding: Maximise clicks with a US$1.00 maximum CPC bid limit for the initial measurement phase. Reassess after enough verified signup events are recorded.
- Budget: US$10 average daily budget. Google may spend up to twice the average daily budget on a given day while observing its monthly spending limit.
- Ad group: `Ad group 1` in the draft. Rename to `China buying agents` after publication if Google Ads does not expose renaming in the draft editor.

## Keyword Planner research

Planner scope: Nigeria, English, Google, October 2025–September 2026. Values are approximate monthly search averages and advertiser competition, not forecast clicks or conversions. The most specific phrases had no bid estimate.

| Search term | Average monthly searches | Competition | Selected in draft |
| --- | ---: | --- | --- |
| 1688 agent nigeria | 10 | Medium | Exact and phrase |
| taobao agent nigeria | 10 | Unavailable | Exact and phrase |
| china sourcing agent in nigeria | 10 | Low | Exact |
| china buying agent | 10 | Low | Phrase |
| 1688 purchasing agent | 10 | Unavailable | Exact |
| china purchasing agent | 10 | Low | Phrase |
| chinese buying agent | 10 | Unavailable | Phrase |
| buy from china | 70 | Medium | Excluded for broad intent |
| order from china | 50 | High | Excluded for broad intent |

The planner returned no reliable volume for some Nigeria-specific long-tail terms, but they remain in the draft because their wording signals a buyer who wants the service.

## Draft keywords

Square brackets are exact match; quotation marks are phrase match. There are no broad-match keywords.

```text
[1688 agent nigeria]
"1688 agent nigeria"
[taobao agent nigeria]
"taobao agent nigeria"
[china sourcing agent in nigeria]
"china sourcing agent nigeria"
[china buying agent nigeria]
"china buying agent"
[1688 purchasing agent]
"1688 buying agent nigeria"
"buy from 1688 to nigeria"
"buy from chinese websites nigeria"
"china purchasing agent"
"chinese buying agent"
```

## Negative keywords to add before publication

The creation draft does not expose a negative-keyword editor. Add these at campaign level before enabling: `jobs`, `job`, `vacancy`, `salary`, `course`, `training`, `tutorial`, `pdf`, `apk`, `app download`, `free agent`, `customer care`, `tracking number`, `temu`, `shein`, `amazon`, `ebay`. Review actual search terms weekly for the first month; do not broadly exclude `how to` until its intent is evaluated because some queries may be close to purchase.

## Responsive Search ad

Display path: `China Buying / Nigeria` (display text only). Business name submitted for approval: `Sure Imports`. Final URL is the landing page above.

Headlines (Google rotates and combines them):

1. Buy From 1688 In Nigeria
2. China Buying Agent Nigeria
3. Order From Taobao & 1688
4. Submit Your Product Links
5. Sure Imports Buying Support
6. Source From China To Nigeria
7. China Purchasing Support
8. Start Your Order Online

Descriptions:

1. Send 1688 or Taobao product links. We help with buying, product checks and shipping.
2. Start your order in Nigeria. Review costs and track progress in your account.
3. Buy from Chinese websites through one order flow for products, payment and delivery.
4. Create a free account, add product links and get support from the Sure Imports team.

Image: an imagegen-created, unbranded sourcing workspace, uploaded to Google Ads as square and 1.91:1 crops. Source asset: `assets/ads/nigeria-search/sourcing-workspace.png`. The image is attached to the draft, but whether Google serves it depends on its image-asset approval and account eligibility.

Sitelinks:

| Text | Destination | Description lines |
| --- | --- | --- |
| Create Free Account | `/auth/signup` | Start your Sure Imports order; Save links and track progress |
| Watch Buying Guide | `/buy-from-chinese-websites/video` | See how Chinese orders work; Prepare links before you buy |
| Check Shipping Rates | `/shipping-rate` | View China shipping estimates; Plan costs before placing an order |
| Contact Sure Imports | `/contact-us` | Ask about your China order; Get help before you commit |

## Conversion investigation and fix

The paused UK Search campaign spent US$73.23 for 61 clicks and recorded zero conversions. The existing `Sure Imports Sign up` action has recorded 55 conversions historically, so a completely broken Google tag is not established. Its trigger is a page load at `/auth/account-creation-success`; the Next.js signup flows reach that URL via client navigation, creating a measurement gap. The site now sends the new Ads event with its unique registration event ID only after the registration API succeeds and optional marketing consent is present, including the active sourcing signup path. The former page-load action is secondary to prevent it from counting alongside the new event in the primary Conversions column. No test signup has been attributed to a paid click yet, so live attribution still needs validation before the campaign runs.

## Release gate

1. Publish the website code through Git and verify its Git-sourced production deployment. The initial WhatsApp and conversion change is live from Git commit `565b18475849b09ab44e3959fbdbd914995f6ae9`; the sourcing-path follow-up must pass the same gate.
2. Validate the new signup event in Google Tag Assistant with a real consented test registration. Avoid interpreting a zero-conversion campaign as a tag failure until an actual attributed signup has occurred.
3. Add the campaign negative keywords and inspect the ad and image approval status.
4. Show the owner this review. Publish or enable the campaign only after explicit approval.
