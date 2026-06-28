import crypto from 'crypto';
import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SEARCH_CONSOLE_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const DEFAULT_SITE_URL = 'sc-domain:sureimports.com';
const DEFAULT_ROW_LIMIT = 25000;

type SearchConsoleCredentials = {
  clientEmail: string;
  privateKey: string;
};

type SearchConsoleRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

type SearchConsoleQueryResponse = {
  rows?: SearchConsoleRow[];
};

type SearchConsoleStatRecord = {
  date: string;
  pageUrl: string;
  query: string;
  country: string | null;
  device: string | null;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

type ImportOptions = {
  startDate?: string;
  endDate?: string;
  days?: number;
  siteUrl?: string;
  rowLimit?: number;
};

type OpportunityCandidate = {
  pageUrl: string;
  blogSlug: string | null;
  opportunityType: string;
  primaryQuery: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  confidence: number;
  recommendedCta: string;
  recommendation: string;
};

function clean(value: unknown, max = 1000) {
  return String(value || '').trim().slice(0, max);
}

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function sqlDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

function randomPid(prefix: string) {
  return `${prefix}${crypto.randomBytes(12).toString('hex')}`;
}

function base64Url(input: string | Buffer) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function parseServiceAccountJson(value: string) {
  const raw = clean(value, 20000);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    try {
      return JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
    } catch {
      return null;
    }
  }
}

function getSearchConsoleCredentials(): SearchConsoleCredentials {
  const json =
    parseServiceAccountJson(process.env.GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON || '') ||
    parseServiceAccountJson(process.env.GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON_BASE64 || '');

  const clientEmail =
    clean(json?.client_email, 255) ||
    clean(process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL, 255);
  const privateKey =
    clean(json?.private_key, 5000) ||
    clean(process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY, 5000);

  if (!clientEmail || !privateKey) {
    throw new Error('Google Search Console service account credentials are not configured.');
  }

  return {
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n'),
  };
}

async function getSearchConsoleAccessToken() {
  const credentials = getSearchConsoleCredentials();
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };
  const payload = {
    iss: credentials.clientEmail,
    scope: SEARCH_CONSOLE_SCOPE,
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now,
  };

  const unsigned = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(credentials.privateKey);
  const assertion = `${unsigned}.${base64Url(signature)}`;

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.access_token) {
    throw new Error(body?.error_description || body?.error || 'Could not get Google access token.');
  }

  return clean(body.access_token, 2000);
}

async function querySearchConsole(input: {
  accessToken: string;
  siteUrl: string;
  startDate: string;
  endDate: string;
  rowLimit: number;
  startRow: number;
}) {
  const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    input.siteUrl,
  )}/searchAnalytics/query`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${input.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startDate: input.startDate,
      endDate: input.endDate,
      dimensions: ['date', 'page', 'query', 'country', 'device'],
      rowLimit: input.rowLimit,
      startRow: input.startRow,
    }),
  });

  const body = (await response.json().catch(() => null)) as SearchConsoleQueryResponse | null;
  if (!response.ok) {
    const message =
      (body as any)?.error?.message ||
      (body as any)?.error ||
      `Search Console query failed with status ${response.status}.`;
    throw new Error(message);
  }

  return body?.rows || [];
}

export async function ensureSearchConsoleTables() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS search_console_import_runs (
      id INT NOT NULL AUTO_INCREMENT,
      pidRun VARCHAR(80) NOT NULL,
      siteUrl VARCHAR(255) NOT NULL,
      startDate DATETIME NOT NULL,
      endDate DATETIME NOT NULL,
      dimensions VARCHAR(255) NOT NULL,
      rowCount INT NOT NULL DEFAULT 0,
      status VARCHAR(40) NOT NULL DEFAULT 'started',
      errorMessage TEXT NULL,
      startedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completedAt DATETIME NULL,
      createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NULL,
      PRIMARY KEY (id),
      UNIQUE KEY search_console_import_runs_pidRun_key (pidRun),
      KEY search_console_import_runs_siteUrl_idx (siteUrl),
      KEY search_console_import_runs_status_idx (status),
      KEY search_console_import_runs_startDate_endDate_idx (startDate, endDate)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS search_console_query_stats (
      id INT NOT NULL AUTO_INCREMENT,
      pidStat VARCHAR(80) NOT NULL,
      date DATETIME NOT NULL,
      siteUrl VARCHAR(255) NOT NULL,
      pageUrl TEXT NOT NULL,
      query VARCHAR(700) NOT NULL,
      country VARCHAR(20) NULL,
      device VARCHAR(40) NULL,
      clicks INT NOT NULL DEFAULT 0,
      impressions INT NOT NULL DEFAULT 0,
      ctr DECIMAL(12, 8) NOT NULL DEFAULT 0,
      position DECIMAL(12, 4) NOT NULL DEFAULT 0,
      runId VARCHAR(80) NULL,
      createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NULL,
      PRIMARY KEY (id),
      UNIQUE KEY search_console_query_stats_pidStat_key (pidStat),
      UNIQUE KEY uniq_gsc_daily_page_query (date, siteUrl, pageUrl(255), query(255), country, device),
      KEY search_console_query_stats_date_idx (date),
      KEY search_console_query_stats_siteUrl_idx (siteUrl),
      KEY search_console_query_stats_query_idx (query),
      KEY search_console_query_stats_country_idx (country),
      KEY search_console_query_stats_device_idx (device),
      KEY search_console_query_stats_runId_idx (runId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS seo_opportunities (
      id INT NOT NULL AUTO_INCREMENT,
      pidOpportunity VARCHAR(80) NOT NULL,
      pageUrl TEXT NOT NULL,
      blogSlug VARCHAR(500) NULL,
      opportunityType VARCHAR(80) NOT NULL,
      primaryQuery VARCHAR(700) NULL,
      queryCluster LONGTEXT NULL,
      clicks INT NOT NULL DEFAULT 0,
      impressions INT NOT NULL DEFAULT 0,
      ctr DECIMAL(12, 8) NOT NULL DEFAULT 0,
      position DECIMAL(12, 4) NOT NULL DEFAULT 0,
      confidence DECIMAL(5, 4) NOT NULL DEFAULT 0,
      status VARCHAR(40) NOT NULL DEFAULT 'open',
      recommendation LONGTEXT NULL,
      recommendedCta VARCHAR(120) NULL,
      sourceStartDate DATETIME NULL,
      sourceEndDate DATETIME NULL,
      createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NULL,
      PRIMARY KEY (id),
      UNIQUE KEY seo_opportunities_pidOpportunity_key (pidOpportunity),
      KEY seo_opportunities_blogSlug_idx (blogSlug),
      KEY seo_opportunities_opportunityType_idx (opportunityType),
      KEY seo_opportunities_status_idx (status),
      KEY seo_opportunities_createdAt_idx (createdAt)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS seo_content_change_logs (
      id INT NOT NULL AUTO_INCREMENT,
      pidChange VARCHAR(80) NOT NULL,
      pidOpportunity VARCHAR(80) NULL,
      pidBlog VARCHAR(80) NULL,
      changeType VARCHAR(80) NOT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'draft',
      beforeJson LONGTEXT NULL,
      afterJson LONGTEXT NULL,
      validationJson LONGTEXT NULL,
      publishedAt DATETIME NULL,
      createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NULL,
      PRIMARY KEY (id),
      UNIQUE KEY seo_content_change_logs_pidChange_key (pidChange),
      KEY seo_content_change_logs_pidOpportunity_idx (pidOpportunity),
      KEY seo_content_change_logs_pidBlog_idx (pidBlog),
      KEY seo_content_change_logs_changeType_idx (changeType),
      KEY seo_content_change_logs_status_idx (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

function resolveImportWindow(options: ImportOptions) {
  if (options.startDate && options.endDate) {
    return {
      startDate: options.startDate,
      endDate: options.endDate,
    };
  }

  const days = Math.min(30, Math.max(1, Number(options.days || 3)));
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 2);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));

  return {
    startDate: dateOnly(start),
    endDate: dateOnly(end),
  };
}

function getBlogSlugFromPageUrl(pageUrl: string) {
  try {
    const url = new URL(pageUrl);
    const match = url.pathname.match(/^\/blog\/([^/?#]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    const match = pageUrl.match(/\/blog\/([^/?#]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
}

function inferCtaIntent(query: string, pageUrl: string) {
  const text = `${query} ${pageUrl}`.toLowerCase();
  if (/\b(machine|machines|machinery|equipment|industrial|production line|factory equipment|packaging machine)\b/.test(text)) {
    return 'linescout';
  }
  if (/\b(verify|verification|scam|supplier check|fake supplier|trusted supplier)\b/.test(text)) {
    return 'corporate_sourcing';
  }
  if (/\b(ship|shipping|freight|air freight|sea freight|customs|clearing|delivery)\b/.test(text)) {
    return 'ship_with_us';
  }
  if (/\b(pay|payment|rmb|yuan|alipay|wechat|supplier payment)\b/.test(text)) {
    return 'corporate_sourcing';
  }
  if (/\b(phone|phones|iphone|android|samsung|pixel)\b/.test(text)) {
    return 'phone_sourcing';
  }
  if (/\b(laptop|laptops|macbook|computer)\b/.test(text)) {
    return 'laptop_sourcing';
  }
  if (/\b(corporate|gift|gifts|company|school|church|ngo|bulk)\b/.test(text)) {
    return 'corporate_sourcing';
  }
  if (/\b(landed cost|cost calculator|duty|duties|profit|margin|manufacturer|manufacturers|moq|supplier comparison|custom product|quality check|quality control|sourcing strategy)\b/.test(text)) {
    return 'corporate_sourcing';
  }
  return 'buy_from_chinese_websites';
}

function buildRecommendation(candidate: OpportunityCandidate) {
  if (candidate.opportunityType === 'low_ctr') {
    return `Improve the title and meta description for "${candidate.primaryQuery}". The page has strong impressions but weak CTR.`;
  }
  if (candidate.opportunityType === 'ranking_push') {
    return `Expand the article around "${candidate.primaryQuery}" and add an FAQ/internal link section. The page is close to page-one gains.`;
  }
  return `Review "${candidate.primaryQuery}" for a possible content refresh or new supporting article.`;
}

async function saveSearchConsoleStatRecords(
  records: SearchConsoleStatRecord[],
  input: {
    siteUrl: string;
    runId: string;
  },
) {
  const chunks: SearchConsoleStatRecord[][] = [];
  for (let index = 0; index < records.length; index += 100) {
    chunks.push(records.slice(index, index + 100));
  }

  for (const chunk of chunks) {
    const now = new Date();
    const values = chunk.map((record) =>
      Prisma.sql`(
        ${randomPid('GSCSTAT')},
        ${sqlDate(record.date)},
        ${input.siteUrl},
        ${clean(record.pageUrl, 2000)},
        ${clean(record.query, 700)},
        ${record.country},
        ${record.device},
        ${record.clicks},
        ${record.impressions},
        ${record.ctr},
        ${record.position},
        ${input.runId},
        ${now},
        ${now}
      )`,
    );

    await prisma.$executeRaw(
      Prisma.sql`
        INSERT INTO search_console_query_stats (
          pidStat, date, siteUrl, pageUrl, query, country, device,
          clicks, impressions, ctr, position, runId, createdAt, updatedAt
        ) VALUES ${Prisma.join(values)}
        ON DUPLICATE KEY UPDATE
          clicks = VALUES(clicks),
          impressions = VALUES(impressions),
          ctr = VALUES(ctr),
          position = VALUES(position),
          runId = VALUES(runId),
          updatedAt = VALUES(updatedAt)
      `,
    );
  }
}

async function createOrRefreshOpportunity(
  candidate: OpportunityCandidate,
  startDate: string,
  endDate: string,
) {
  const [existing] = await prisma.$queryRaw<Array<{ pidOpportunity: string }>>(
    Prisma.sql`
      SELECT pidOpportunity
      FROM seo_opportunities
      WHERE status = 'open'
        AND blogSlug <=> ${candidate.blogSlug}
        AND opportunityType = ${candidate.opportunityType}
        AND primaryQuery = ${candidate.primaryQuery}
      LIMIT 1
    `,
  );

  if (existing?.pidOpportunity) {
    await prisma.$executeRaw(
      Prisma.sql`
        UPDATE seo_opportunities
        SET pageUrl = ${candidate.pageUrl},
            clicks = ${candidate.clicks},
            impressions = ${candidate.impressions},
            ctr = ${candidate.ctr},
            position = ${candidate.position},
            confidence = ${candidate.confidence},
            recommendation = ${buildRecommendation(candidate)},
            recommendedCta = ${candidate.recommendedCta},
            sourceStartDate = ${sqlDate(startDate)},
            sourceEndDate = ${sqlDate(endDate)},
            updatedAt = ${new Date()}
        WHERE pidOpportunity = ${existing.pidOpportunity}
      `,
    );
    return existing.pidOpportunity;
  }

  const pidOpportunity = randomPid('SEOOPP');
  await prisma.$executeRaw(
    Prisma.sql`
      INSERT INTO seo_opportunities (
        pidOpportunity, pageUrl, blogSlug, opportunityType, primaryQuery, queryCluster,
        clicks, impressions, ctr, position, confidence, status, recommendation,
        recommendedCta, sourceStartDate, sourceEndDate, createdAt, updatedAt
      ) VALUES (
        ${pidOpportunity}, ${candidate.pageUrl}, ${candidate.blogSlug}, ${candidate.opportunityType},
        ${candidate.primaryQuery}, ${JSON.stringify([candidate.primaryQuery])}, ${candidate.clicks},
        ${candidate.impressions}, ${candidate.ctr}, ${candidate.position}, ${candidate.confidence},
        'open', ${buildRecommendation(candidate)}, ${candidate.recommendedCta},
        ${sqlDate(startDate)}, ${sqlDate(endDate)}, ${new Date()}, ${new Date()}
      )
    `,
  );
  return pidOpportunity;
}

export async function generateSearchConsoleOpportunities(input: {
  startDate: string;
  endDate: string;
  minImpressions?: number;
}) {
  await ensureSearchConsoleTables();

  const minImpressions = Math.max(10, Number(input.minImpressions || 50));
  const rows = await prisma.$queryRaw<
    Array<{
      pageUrl: string;
      query: string;
      clicks: number;
      impressions: number;
      ctr: any;
      position: any;
    }>
  >(
    Prisma.sql`
      SELECT
        pageUrl,
        query,
        SUM(clicks) AS clicks,
        SUM(impressions) AS impressions,
        CASE WHEN SUM(impressions) > 0 THEN SUM(clicks) / SUM(impressions) ELSE 0 END AS ctr,
        AVG(position) AS position
      FROM search_console_query_stats
      WHERE date >= ${sqlDate(input.startDate)}
        AND date <= ${sqlDate(input.endDate)}
        AND pageUrl LIKE '%/blog/%'
      GROUP BY pageUrl, query
      HAVING impressions >= ${minImpressions}
      ORDER BY impressions DESC
      LIMIT 200
    `,
  );

  const candidates: OpportunityCandidate[] = rows
    .map((row) => {
      const ctr = Number(row.ctr || 0);
      const position = Number(row.position || 0);
      const impressions = Number(row.impressions || 0);
      let opportunityType = '';
      let confidence = 0;

      if (impressions >= minImpressions && ctr < 0.015 && position <= 12) {
        opportunityType = 'low_ctr';
        confidence = Math.min(0.95, 0.82 + impressions / 10000);
      } else if (impressions >= minImpressions && position >= 5 && position <= 20) {
        opportunityType = 'ranking_push';
        confidence = Math.min(0.93, 0.78 + impressions / 12000);
      }

      if (!opportunityType) return null;

      return {
        pageUrl: clean(row.pageUrl, 2000),
        blogSlug: getBlogSlugFromPageUrl(row.pageUrl),
        opportunityType,
        primaryQuery: clean(row.query, 700),
        clicks: Number(row.clicks || 0),
        impressions,
        ctr,
        position,
        confidence,
        recommendedCta: inferCtaIntent(row.query, row.pageUrl),
        recommendation: '',
      };
    })
    .filter((candidate): candidate is OpportunityCandidate => Boolean(candidate));

  const saved: string[] = [];
  for (const candidate of candidates.slice(0, 50)) {
    saved.push(await createOrRefreshOpportunity(candidate, input.startDate, input.endDate));
  }

  return {
    candidates: candidates.length,
    saved: saved.length,
    opportunityIds: saved,
  };
}

export async function importSearchConsolePerformance(options: ImportOptions = {}) {
  await ensureSearchConsoleTables();

  const siteUrl =
    clean(options.siteUrl, 255) ||
    clean(process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL, 255) ||
    DEFAULT_SITE_URL;
  const { startDate, endDate } = resolveImportWindow(options);
  const rowLimit = Math.min(
    DEFAULT_ROW_LIMIT,
    Math.max(1000, Number(options.rowLimit || DEFAULT_ROW_LIMIT)),
  );
  const pidRun = randomPid('GSCRUN');
  const dimensions = 'date,page,query,country,device';

  await prisma.$executeRaw(
    Prisma.sql`
      INSERT INTO search_console_import_runs (
        pidRun, siteUrl, startDate, endDate, dimensions, rowCount, status, startedAt, createdAt, updatedAt
      ) VALUES (
        ${pidRun}, ${siteUrl}, ${sqlDate(startDate)}, ${sqlDate(endDate)}, ${dimensions}, 0, 'started',
        ${new Date()}, ${new Date()}, ${new Date()}
      )
    `,
  );

  try {
    const accessToken = await getSearchConsoleAccessToken();
    let startRow = 0;
    let totalRows = 0;

    while (true) {
      const rows = await querySearchConsole({
        accessToken,
        siteUrl,
        startDate,
        endDate,
        rowLimit,
        startRow,
      });

      if (!rows.length) break;

      const records: SearchConsoleStatRecord[] = [];
      for (const row of rows) {
        const [date, pageUrl, query, country, device] = row.keys || [];
        if (!date || !pageUrl || !query) continue;

        records.push({
          date,
          pageUrl,
          query,
          country: clean(country, 20) || null,
          device: clean(device, 40) || null,
          clicks: Math.round(Number(row.clicks || 0)),
          impressions: Math.round(Number(row.impressions || 0)),
          ctr: Number(row.ctr || 0),
          position: Number(row.position || 0),
        });
      }

      await saveSearchConsoleStatRecords(records, { siteUrl, runId: pidRun });
      totalRows += records.length;

      if (rows.length < rowLimit) break;
      startRow += rowLimit;
      if (startRow >= 100000) break;
    }

    const opportunities = await generateSearchConsoleOpportunities({
      startDate,
      endDate,
      minImpressions: Number(process.env.SEO_MIN_GSC_IMPRESSIONS || 50),
    });

    await prisma.$executeRaw(
      Prisma.sql`
        UPDATE search_console_import_runs
        SET rowCount = ${totalRows},
            status = 'completed',
            completedAt = ${new Date()},
            updatedAt = ${new Date()}
        WHERE pidRun = ${pidRun}
      `,
    );

    return {
      ok: true,
      pidRun,
      siteUrl,
      startDate,
      endDate,
      rows: totalRows,
      opportunities,
    };
  } catch (error) {
    await prisma.$executeRaw(
      Prisma.sql`
        UPDATE search_console_import_runs
        SET status = 'failed',
            errorMessage = ${error instanceof Error ? error.message : 'Search Console import failed.'},
            completedAt = ${new Date()},
            updatedAt = ${new Date()}
        WHERE pidRun = ${pidRun}
      `,
    );
    throw error;
  }
}
