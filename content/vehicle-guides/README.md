# Vehicle ownership guides

Nine original articles for the existing database-backed blog. HTML files are the reviewed publication source; after publication, normal editing is available in the central admin blog.

Price sources verified 28 September 2026:

- NERC IE September 2026 order, page 7, Table 3: A–Non-MD 209.50 NGN/kWh and B–Non-MD 62.48 NGN/kWh. End-user scope is IE yet-to-be-transitioned franchise area in Ogun, not all Lagos/Nigeria. Published energy rates used before separately applied billing taxes/charges.
- NBS May 2026 PMS report and workbook: national average 1596.25 NGN/litre; Lagos 1561.22. Articles use national average.
- NBS May 2026 AGO report and workbook: national average 3277.47 NGN/litre; Lagos 3150.45. Articles use national average.
- Cat DE22E3 manufacturer sheet LEHE2064-03, 03/22, hosted by Avesco: 50 Hz prime rating 16 kW; 50/75/100% fuel use 2.9/3.9/5.3 L/hour.

Consumption, charging efficiency and solar yield examples are declared assumptions. No claimed measured Ruichi consumption, blanket generator approval, charger integration features, local parts prices, installation quote or battery warranty is invented. The tariff and fuel series use different dates, stated in articles. The generator table is an energy-cost calculation, not equipment sizing or a single-phase compatibility recommendation.

Cloudinary catalogue photographs are reused as article feature images. No source-provider images are copied.

Run `node --experimental-strip-types scripts/blog/publish-vehicle-guides.mjs` for validation and a dry run. `--publish` creates only missing articles with deterministic IDs and refuses collisions. It does not overwrite admin edits. All article-to-article links are validated before the transaction and against public blog records inside it. No distribution emails are sent.
