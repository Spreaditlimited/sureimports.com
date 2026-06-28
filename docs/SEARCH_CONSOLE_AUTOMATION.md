# Search Console Automation Setup

The Search Console importer is implemented in `sureimports.com` and stores performance data in SureImports-owned tables.

## Required Environment Variables

Set one of these credential options:

```txt
GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON=
```

or:

```txt
GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON_BASE64=
```

or the split fields:

```txt
GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL=
GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY=
```

Also set:

```txt
GOOGLE_SEARCH_CONSOLE_SITE_URL=sc-domain:sureimports.com
GOOGLE_SEARCH_CONSOLE_CRON_SECRET=
SEO_INTERNAL_API_SECRET=
SEO_AUTOPUBLISH_ENABLED=false
SEO_MIN_GSC_IMPRESSIONS=50
```

If `GOOGLE_SEARCH_CONSOLE_CRON_SECRET` or `SEO_INTERNAL_API_SECRET` are omitted, the code falls back to `CRON_SECRET`.

## Cron Endpoint

```txt
GET /api/cron/search-console
Authorization: Bearer <GOOGLE_SEARCH_CONSOLE_CRON_SECRET>
```

Optional query params:

```txt
days=3
startDate=2026-06-01
endDate=2026-06-26
siteUrl=sc-domain:sureimports.com
```

The importer queries Search Console by:

```txt
date, page, query, country, device
```

It stores rows in `search_console_query_stats`, logs runs in `search_console_import_runs`, and creates first-pass SEO opportunities in `seo_opportunities`.

## Internal Admin API

```txt
GET /api/internal/seo/opportunities?status=open&limit=50
Authorization: Bearer <SEO_INTERNAL_API_SECRET>
```

This endpoint is intended for `admin.sureimports.com` to show the SEO opportunity dashboard.

## Auto-Publish

Auto-publishing must stay disabled until the strict rules in `docs/SEO_AUTOPUBLISH_RULES.md` are approved and wired into the admin workflow.
