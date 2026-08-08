import { prisma } from '@/lib/prisma';
import { refundReservedSearchCredit } from '@/lib/intelligence/credits';
import {
  normalizeSupplierResearchCandidate,
  supplierPassesResearchRules,
  supplierResearchJsonShape,
  SUPPLIER_RESEARCH_RULES,
} from '@/lib/intelligence/supplierResearchRules';

type SearchRequestRow = {
  pidSearch: string;
  pidUser: string;
  email: string;
  query: string;
  targetSupplierCount: number;
  notes: string | null;
  status: string;
  relatedPidJob: string | null;
};

type ResearchSupplierDraft = {
  supplierName: string;
  productFit: string;
  productsMade?: string[];
  suggestedCategories?: string[];
  officialWebsite: string;
  officialContactPage?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  whatsappUrl?: string;
  address?: string;
  countryRegion?: string;
  supplierType?: string;
  manufacturerEvidence?: string;
  chinaRegistryCheck?: string;
  sourceType: string;
  verifiedFrom: string;
  buyerNotes: string;
  verificationStatus: string;
};

type ResearchDraft = {
  nicheName: string;
  summary: string;
  suppliers: ResearchSupplierDraft[];
};

function clean(value: unknown, max = 4000) {
  return String(value || '')
    .trim()
    .slice(0, max);
}

function randomId(prefix: string) {
  return `${prefix}${Date.now().toString(36).toUpperCase()}${Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase()}`;
}

function extractJson(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith('{')) return trimmed;
  const match = trimmed.match(/\{[\s\S]*\}/);
  return match?.[0] || '';
}

export async function ensureUserResearchTables() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS intelligence_research_jobs (
      id INT NOT NULL AUTO_INCREMENT,
      pidJob VARCHAR(80) NOT NULL,
      nicheName VARCHAR(180) NOT NULL,
      targetSupplierCount INT NOT NULL DEFAULT 3,
      status VARCHAR(40) NOT NULL DEFAULT 'draft',
      requestNotes LONGTEXT NULL,
      draftJson LONGTEXT NULL,
      errorMessage LONGTEXT NULL,
      sourceSearchRequestId VARCHAR(80) NULL,
      requestedByPidUser VARCHAR(80) NULL,
      requestedByEmail VARCHAR(255) NULL,
      createdByPidUser VARCHAR(191) NULL,
      approvedByPidUser VARCHAR(191) NULL,
      approvedAt DATETIME(3) NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      UNIQUE KEY intelligence_research_jobs_pidJob_key (pidJob),
      KEY intelligence_research_jobs_status_idx (status),
      KEY intelligence_research_jobs_nicheName_idx (nicheName),
      KEY intelligence_research_jobs_search_request_idx (sourceSearchRequestId),
      PRIMARY KEY (id)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS intelligence_search_requests (
      id INT NOT NULL AUTO_INCREMENT,
      pidSearch VARCHAR(80) NOT NULL,
      pidUser VARCHAR(80) NOT NULL,
      email VARCHAR(255) NOT NULL,
      query VARCHAR(220) NOT NULL,
      targetSupplierCount INT NOT NULL DEFAULT 3,
      notes LONGTEXT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'awaiting_admin',
      creditCost INT NOT NULL DEFAULT 1,
      creditReserved TINYINT(1) NOT NULL DEFAULT 1,
      relatedPidJob VARCHAR(80) NULL,
      adminNotes LONGTEXT NULL,
      progressStage VARCHAR(180) NULL,
      progressPercent INT NOT NULL DEFAULT 0,
      resultSlug VARCHAR(180) NULL,
      creditSource VARCHAR(40) NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NULL,
      UNIQUE KEY intelligence_search_requests_pid_key (pidSearch),
      KEY intelligence_search_requests_user_idx (pidUser),
      KEY intelligence_search_requests_status_idx (status),
      KEY intelligence_search_requests_job_idx (relatedPidJob),
      PRIMARY KEY (id)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);

  for (const statement of [
    'ALTER TABLE intelligence_search_requests ADD COLUMN progressStage VARCHAR(180) NULL',
    'ALTER TABLE intelligence_search_requests ADD COLUMN progressPercent INT NOT NULL DEFAULT 0',
    'ALTER TABLE intelligence_search_requests ADD COLUMN resultSlug VARCHAR(180) NULL',
    'ALTER TABLE intelligence_search_requests ADD COLUMN creditSource VARCHAR(40) NULL',
    'ALTER TABLE intelligence_research_jobs ADD COLUMN sourceSearchRequestId VARCHAR(80) NULL',
    'ALTER TABLE intelligence_research_jobs ADD COLUMN requestedByPidUser VARCHAR(80) NULL',
    'ALTER TABLE intelligence_research_jobs ADD COLUMN requestedByEmail VARCHAR(255) NULL',
  ]) {
    try {
      await prisma.$executeRawUnsafe(statement);
    } catch {
      // Existing databases may already have these columns.
    }
  }
}

async function setProgress(
  pidSearch: string,
  status: string,
  stage: string,
  percent: number,
  adminNotes?: string | null,
) {
  await prisma.$executeRaw`
    UPDATE intelligence_search_requests
    SET
      status = ${status},
      progressStage = ${stage},
      progressPercent = ${Math.max(0, Math.min(100, Math.round(percent)))},
      adminNotes = COALESCE(${adminNotes || null}, adminNotes),
      updatedAt = ${new Date()}
    WHERE pidSearch = ${pidSearch}
  `;
}

async function runSupplierResearch(input: {
  nicheName: string;
  targetSupplierCount: number;
  requestNotes: string;
  onProgress: (stage: string, percent: number) => Promise<void>;
}) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured.');

  await input.onProgress('Preparing the supplier research query', 18);

  const prompt = [
    'You are a supplier research analyst for Sure Imports, a China sourcing and shipping company serving importers worldwide.',
    `Research the niche: ${input.nicheName}.`,
    `Return ${input.targetSupplierCount} solid supplier candidates.`,
    input.requestNotes ? `Customer notes: ${input.requestNotes}` : '',
    ...SUPPLIER_RESEARCH_RULES,
    'Return only JSON with this exact shape:',
    JSON.stringify(supplierResearchJsonShape(input.nicheName)),
  ]
    .filter(Boolean)
    .join('\n\n');

  await input.onProgress(
    'Searching official supplier and manufacturer sources',
    34,
  );

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model:
        process.env.SUPPLIER_RESEARCH_MODEL ||
        process.env.SEO_AUTOMATION_MODEL ||
        process.env.OPENAI_MODEL ||
        'gpt-5.5',
      tools: [{ type: 'web_search_preview' }],
      input: prompt,
    }),
  });

  await input.onProgress('Checking contact routes and company evidence', 62);

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `OpenAI research failed: ${response.status} ${clean(errorText, 500)}`,
    );
  }

  const data = await response.json();
  const outputText =
    data.output_text ||
    data.output
      ?.flatMap((item: any) => item.content || [])
      ?.map((content: any) => content.text || '')
      ?.join('\n') ||
    '';
  const jsonText = extractJson(outputText);
  const draft = JSON.parse(jsonText) as ResearchDraft;

  if (!Array.isArray(draft.suppliers) || draft.suppliers.length === 0) {
    throw new Error('Research returned no supplier candidates.');
  }

  await input.onProgress('Building supplier shortlist and buyer notes', 82);

  const result = {
    nicheName: clean(draft.nicheName || input.nicheName, 180),
    summary: clean(draft.summary, 1200),
    suppliers: draft.suppliers
      .slice(0, input.targetSupplierCount)
      .map(normalizeSupplierResearchCandidate)
      .filter(supplierPassesResearchRules),
  };

  if (result.suppliers.length === 0) {
    throw new Error(
      'Research returned no manufacturer suppliers with public WhatsApp evidence.',
    );
  }

  return result;
}

export async function startUserSupplierResearch(input: {
  pidSearch: string;
  pidUser: string;
}) {
  await ensureUserResearchTables();

  const rows = await prisma.$queryRaw<SearchRequestRow[]>`
    SELECT pidSearch, pidUser, email, query, targetSupplierCount, notes, status, relatedPidJob
    FROM intelligence_search_requests
    WHERE pidSearch = ${input.pidSearch}
      AND pidUser = ${input.pidUser}
    LIMIT 1
  `;
  const search = rows[0];
  if (!search) throw new Error('Search request was not found.');

  if (search.status !== 'approved_to_run') {
    throw new Error(
      'This supplier search is waiting for Sure Imports approval before research can begin.',
    );
  }

  if (
    search.relatedPidJob &&
    ['running', 'awaiting_approval', 'approved'].includes(search.status)
  ) {
    return { pidJob: search.relatedPidJob, alreadyStarted: true };
  }

  const pidJob = search.relatedPidJob || randomId('INTRES');

  if (!search.relatedPidJob) {
    await prisma.$executeRaw`
      INSERT INTO intelligence_research_jobs (
        pidJob,
        nicheName,
        targetSupplierCount,
        status,
        requestNotes,
        sourceSearchRequestId,
        requestedByPidUser,
        requestedByEmail,
        createdByPidUser,
        createdAt,
        updatedAt
      ) VALUES (
        ${pidJob},
        ${clean(search.query, 180)},
        ${Math.min(10, Math.max(3, Math.round(search.targetSupplierCount || 3)))},
        'running',
        ${clean(search.notes, 4000) || null},
        ${search.pidSearch},
        ${search.pidUser},
        ${search.email},
        ${search.pidUser},
        ${new Date()},
        ${new Date()}
      )
    `;
  }

  await prisma.$executeRaw`
    UPDATE intelligence_search_requests
    SET
      status = 'running',
      relatedPidJob = ${pidJob},
      progressStage = 'Starting supplier research',
      progressPercent = 10,
      updatedAt = ${new Date()}
    WHERE pidSearch = ${search.pidSearch}
  `;

  try {
    const draft = await runSupplierResearch({
      nicheName: search.query,
      targetSupplierCount: search.targetSupplierCount,
      requestNotes: search.notes || '',
      onProgress: (stage, percent) =>
        setProgress(search.pidSearch, 'running', stage, percent),
    });

    await prisma.$executeRaw`
      UPDATE intelligence_research_jobs
      SET
        status = 'awaiting_approval',
        draftJson = ${JSON.stringify(draft)},
        errorMessage = NULL,
        updatedAt = ${new Date()}
      WHERE pidJob = ${pidJob}
    `;

    await setProgress(
      search.pidSearch,
      'awaiting_approval',
      'Research complete. Now being manually checked by Sure Imports specialists.',
      100,
      'Now being manually checked by Sure Imports specialists.',
    );

    return { pidJob, alreadyStarted: false };
  } catch (error: any) {
    const message = error?.message || 'Research failed.';

    await prisma.$executeRaw`
      UPDATE intelligence_research_jobs
      SET
        status = 'failed',
        errorMessage = ${message},
        updatedAt = ${new Date()}
      WHERE pidJob = ${pidJob}
    `;

    await setProgress(
      search.pidSearch,
      'failed',
      'Research could not be completed',
      100,
      message,
    );
    await refundReservedSearchCredit(
      search.pidSearch,
      'Research failed before a usable result was produced. Your search credit has been returned.',
    );
    throw error;
  }
}

export async function getUserSupplierResearchStatus(input: {
  pidSearch: string;
  pidUser: string;
}) {
  await ensureUserResearchTables();

  const rows = await prisma.$queryRaw<
    Array<{
      pidSearch: string;
      query: string;
      targetSupplierCount: number;
      status: string;
      relatedPidJob: string | null;
      adminNotes: string | null;
      progressStage: string | null;
      progressPercent: number;
      draftJson: string | null;
      jobStatus: string | null;
      errorMessage: string | null;
      createdAt: Date;
      updatedAt: Date | null;
    }>
  >`
    SELECT
      s.pidSearch,
      s.query,
      s.targetSupplierCount,
      s.status,
      s.relatedPidJob,
      s.adminNotes,
      s.progressStage,
      s.progressPercent,
      s.createdAt,
      s.updatedAt,
      j.draftJson,
      j.status AS jobStatus,
      j.errorMessage
    FROM intelligence_search_requests s
    LEFT JOIN intelligence_research_jobs j ON j.pidJob = s.relatedPidJob
    WHERE s.pidSearch = ${input.pidSearch}
      AND s.pidUser = ${input.pidUser}
    LIMIT 1
  `;

  const row = rows[0];
  if (!row) return null;

  let draft: ResearchDraft | null = null;
  if (row.draftJson) {
    try {
      draft = JSON.parse(row.draftJson);
    } catch {
      draft = null;
    }
  }

  return {
    ...row,
    draft,
  };
}
