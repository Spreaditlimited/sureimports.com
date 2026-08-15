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

export type SearchConsoleImportReservation = {
  pidRun: string;
  siteUrl: string;
  startDate: string;
  endDate: string;
  rowLimit: number;
};

export type SearchConsoleImportStartResult =
  | { started: true; run: SearchConsoleImportReservation }
  | {
      started: false;
      run: SearchConsoleImportReservation & { startedAt: Date | null };
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
  queryCluster: string[];
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

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS seo_linkable_pages (
      id INT NOT NULL AUTO_INCREMENT,
      pidLink VARCHAR(80) NOT NULL,
      url VARCHAR(1000) NOT NULL,
      normalizedUrl VARCHAR(500) NOT NULL,
      label VARCHAR(180) NOT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'active',
      source VARCHAR(40) NOT NULL DEFAULT 'admin',
      approvedBy VARCHAR(80) NULL,
      approvedAt DATETIME(3) NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY seo_linkable_pages_pidLink_key (pidLink),
      UNIQUE KEY seo_linkable_pages_normalizedUrl_key (normalizedUrl),
      KEY seo_linkable_pages_status_idx (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS seo_change_rewrite_artifacts (
      id INT NOT NULL AUTO_INCREMENT,
      pidArtifact VARCHAR(80) NOT NULL,
      pidChange VARCHAR(80) NOT NULL,
      sourceContentHash CHAR(64) NOT NULL,
      rewrittenHtml LONGTEXT NULL,
      appliedChangesJson LONGTEXT NULL,
      discoveredLinksJson LONGTEXT NULL,
      pendingLinksJson LONGTEXT NULL,
      decisionsJson LONGTEXT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'rewriting',
      errorCode VARCHAR(80) NULL,
      errorMessage TEXT NULL,
      attemptCount INT NOT NULL DEFAULT 0,
      generatedAt DATETIME(3) NULL,
      reviewedAt DATETIME(3) NULL,
      appliedAt DATETIME(3) NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY seo_change_rewrite_artifacts_pidArtifact_key (pidArtifact),
      UNIQUE KEY seo_change_rewrite_artifacts_pidChange_key (pidChange),
      KEY seo_change_rewrite_artifacts_status_idx (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS seo_change_pipeline_attempts (
      id INT NOT NULL AUTO_INCREMENT,
      pidAttempt VARCHAR(80) NOT NULL,
      pidChange VARCHAR(80) NOT NULL,
      stage VARCHAR(40) NOT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'started',
      errorCode VARCHAR(80) NULL,
      errorMessage TEXT NULL,
      detailsJson LONGTEXT NULL,
      startedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      completedAt DATETIME(3) NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY seo_change_pipeline_attempts_pidAttempt_key (pidAttempt),
      KEY seo_change_pipeline_attempts_pidChange_stage_idx (pidChange, stage),
      KEY seo_change_pipeline_attempts_status_idx (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await prisma.$executeRawUnsafe(`
    INSERT IGNORE INTO seo_linkable_pages (
      pidLink, url, normalizedUrl, label, status, source, approvedAt, createdAt, updatedAt
    ) VALUES
      ('SEOLINK_SUPPLIER_INTELLIGENCE', '/supplier-intelligence', '/supplier-intelligence', 'Supplier Intelligence', 'active', 'system', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
      ('SEOLINK_CORPORATE_SOURCING', '/corporate-sourcing', '/corporate-sourcing', 'Corporate Sourcing', 'active', 'system', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
      ('SEOLINK_BUY_CHINESE_WEBSITES', '/buy-from-chinese-websites', '/buy-from-chinese-websites', 'Buy From Chinese Websites', 'active', 'system', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
      ('SEOLINK_LINESCOUT', 'https://linescout.sureimports.com/', 'https://linescout.sureimports.com/', 'LineScout', 'active', 'system', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
      ('SEOLINK_SHIP_WITH_US', '/ship-with-us', '/ship-with-us', 'Ship With Us', 'active', 'system', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
      ('SEOLINK_IMPORT_HUB', '/import-from-china-to-nigeria', '/import-from-china-to-nigeria', 'Import Hub', 'active', 'system', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
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
    return match ? decodeURIComponent(match[1]).trim().toLowerCase() : null;
  } catch {
    const match = pageUrl.match(/\/blog\/([^/?#]+)/);
    return match ? decodeURIComponent(match[1]).trim().toLowerCase() : null;
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
  const [existing] = await prisma.$queryRaw<Array<{
    pidOpportunity: string;
    status: string;
  }>>(
    Prisma.sql`
      SELECT pidOpportunity, status
      FROM seo_opportunities
      WHERE status IN ('open', 'reviewing')
        AND (
          blogSlug = ${candidate.blogSlug}
          OR (${candidate.blogSlug} IS NULL AND blogSlug IS NULL AND pageUrl = ${candidate.pageUrl})
        )
      ORDER BY
        CASE WHEN status = 'reviewing' THEN 0 ELSE 1 END,
        impressions DESC,
        updatedAt DESC
      LIMIT 1
    `,
  );

  if (existing?.pidOpportunity) {
    const updates = [
      prisma.$executeRaw(
        Prisma.sql`
          UPDATE seo_opportunities
          SET status = 'dismissed', updatedAt = ${new Date()}
          WHERE pidOpportunity <> ${existing.pidOpportunity}
            AND status IN ('open', 'reviewing')
            AND (
              blogSlug = ${candidate.blogSlug}
              OR (${candidate.blogSlug} IS NULL AND blogSlug IS NULL AND pageUrl = ${candidate.pageUrl})
            )
        `,
      ),
    ];

    if (existing.status === 'open') {
      updates.unshift(
        prisma.$executeRaw(
          Prisma.sql`
            UPDATE seo_opportunities
            SET pageUrl = ${candidate.pageUrl},
                opportunityType = ${candidate.opportunityType},
                primaryQuery = ${candidate.primaryQuery},
                queryCluster = ${JSON.stringify(candidate.queryCluster)},
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
              AND status = 'open'
          `,
        ),
      );
    }

    await prisma.$transaction(updates);
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
        ${candidate.primaryQuery}, ${JSON.stringify(candidate.queryCluster)}, ${candidate.clicks},
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
      LIMIT 2000
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
        queryCluster: [clean(row.query, 700)],
      };
    })
    .filter((candidate): candidate is OpportunityCandidate => Boolean(candidate));

  const candidatesByPage = new Map<string, OpportunityCandidate[]>();
  for (const candidate of candidates) {
    const pageKey = candidate.blogSlug || candidate.pageUrl.toLowerCase().replace(/[?#].*$/, '').replace(/\/$/, '');
    const pageCandidates = candidatesByPage.get(pageKey) || [];
    pageCandidates.push(candidate);
    candidatesByPage.set(pageKey, pageCandidates);
  }

  const pageCandidates = Array.from(candidatesByPage.values())
    .map((items) => {
      const ranked = [...items].sort((left, right) => right.impressions - left.impressions);
      const primary = ranked[0];
      return {
        ...primary,
        queryCluster: Array.from(new Set(ranked.map((item) => item.primaryQuery))),
      };
    })
    .sort((left, right) => right.impressions - left.impressions);

  const saved: string[] = [];
  for (const candidate of pageCandidates.slice(0, 50)) {
    saved.push(await createOrRefreshOpportunity(candidate, input.startDate, input.endDate));
  }

  return {
    actionableQueries: candidates.length,
    candidates: pageCandidates.length,
    saved: saved.length,
    opportunityIds: saved,
  };
}

export async function startSearchConsolePerformanceImport(
  options: ImportOptions = {},
): Promise<SearchConsoleImportStartResult> {
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
  const staleBefore = new Date(Date.now() - 60 * 60 * 1000);

  return prisma.$transaction(async (transaction) => {
    await transaction.$executeRaw(
      Prisma.sql`
        UPDATE search_console_import_runs
        SET status = 'failed',
            errorMessage = 'The import stopped before it could complete.',
            completedAt = ${new Date()},
            updatedAt = ${new Date()}
        WHERE status = 'started'
          AND startedAt < ${staleBefore}
      `,
    );

    const activeRuns = await transaction.$queryRaw<Array<{
      pidRun: string;
      siteUrl: string;
      startDate: Date;
      endDate: Date;
      startedAt: Date | null;
    }>>(
      Prisma.sql`
        SELECT pidRun, siteUrl, startDate, endDate, startedAt
        FROM search_console_import_runs
        WHERE status = 'started'
        ORDER BY startedAt DESC
        LIMIT 1
        FOR UPDATE
      `,
    );
    const active = activeRuns[0];
    if (active) {
      return {
        started: false as const,
        run: {
          pidRun: active.pidRun,
          siteUrl: active.siteUrl,
          startDate: dateOnly(active.startDate),
          endDate: dateOnly(active.endDate),
          rowLimit,
          startedAt: active.startedAt,
        },
      };
    }

    const now = new Date();
    await transaction.$executeRaw(
      Prisma.sql`
        INSERT INTO search_console_import_runs (
          pidRun, siteUrl, startDate, endDate, dimensions, rowCount, status, startedAt, createdAt, updatedAt
        ) VALUES (
          ${pidRun}, ${siteUrl}, ${sqlDate(startDate)}, ${sqlDate(endDate)}, ${dimensions}, 0, 'started',
          ${now}, ${now}, ${now}
        )
      `,
    );

    return {
      started: true as const,
      run: { pidRun, siteUrl, startDate, endDate, rowLimit },
    };
  });
}

export async function executeSearchConsolePerformanceImport(
  run: SearchConsoleImportReservation,
) {
  const { pidRun, siteUrl, startDate, endDate, rowLimit } = run;

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

      await prisma.$executeRaw(
        Prisma.sql`
          UPDATE search_console_import_runs
          SET rowCount = ${totalRows},
              updatedAt = ${new Date()}
          WHERE pidRun = ${pidRun}
            AND status = 'started'
        `,
      );

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

export async function importSearchConsolePerformance(options: ImportOptions = {}) {
  const reservation = await startSearchConsolePerformanceImport(options);
  if (!reservation.started) {
    throw new Error(`Search Console import ${reservation.run.pidRun} is already running.`);
  }
  return executeSearchConsolePerformanceImport(reservation.run);
}
