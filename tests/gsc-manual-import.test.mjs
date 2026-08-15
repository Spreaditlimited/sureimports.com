import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const importerSource = await readFile(
  new URL('../lib/search-console.ts', import.meta.url),
  'utf8',
);
const manualRouteSource = await readFile(
  new URL('../app/api/internal/seo/search-console-import/route.ts', import.meta.url),
  'utf8',
);
const vercelConfig = JSON.parse(
  await readFile(new URL('../vercel.json', import.meta.url), 'utf8'),
);
const opportunityDedupeMigration = await readFile(
  new URL('../prisma/migrations/20260814224500_dedupe_active_seo_opportunities_by_blog/migration.sql', import.meta.url),
  'utf8',
);

test('GSC imports remain manual and are not registered as a Vercel cron', () => {
  const cronPaths = (vercelConfig.crons || []).map((cron) => cron.path);
  assert.doesNotMatch(cronPaths.join('\n'), /search-console/);
});

test('manual imports save a job before background execution', () => {
  assert.match(manualRouteSource, /startSearchConsolePerformanceImport/);
  assert.match(manualRouteSource, /after\(async \(\) =>/);
  assert.match(manualRouteSource, /executeSearchConsolePerformanceImport\(reservation\.run\)/);
  assert.match(manualRouteSource, /pidRun: reservation\.run\.pidRun/);
});

test('cross-service authorization uses an expiring one-time database token', () => {
  assert.match(manualRouteSource, /seo_manual_gsc_dispatch_tokens/);
  assert.match(manualRouteSource, /t\.status = 'pending'/);
  assert.match(manualRouteSource, /t\.expiresAt >/);
  assert.match(manualRouteSource, /SET status = 'consumed'/);
  assert.doesNotMatch(manualRouteSource, /JWT_SECRET|jsonwebtoken/);
});

test('the importer rejects overlapping active jobs and saves row progress', () => {
  assert.match(importerSource, /WHERE status = 'started'/);
  assert.match(importerSource, /FOR UPDATE/);
  assert.match(importerSource, /SET rowCount = \$\{totalRows\}/);
});

test('GSC import and opportunity generation never invoke OpenAI', () => {
  assert.doesNotMatch(importerSource, /openai|responses\.create|chat\.completions/i);
  assert.doesNotMatch(manualRouteSource, /openai|responses\.create|chat\.completions/i);
});

test('actionable queries are reduced to one highest-impression opportunity per blog page', () => {
  assert.match(importerSource, /candidatesByPage/);
  assert.match(importerSource, /right\.impressions - left\.impressions/);
  assert.match(importerSource, /queryCluster: Array\.from\(new Set/);
  assert.match(importerSource, /for \(const candidate of pageCandidates\.slice\(0, 50\)\)/);
  assert.doesNotMatch(
    importerSource.split('async function createOrRefreshOpportunity')[1]
      .split('export async function generateSearchConsoleOpportunities')[0],
    /AND primaryQuery = \$\{candidate\.primaryQuery\}/,
  );
});

test('existing duplicate active opportunities are dismissed without replacing a review in progress', () => {
  assert.match(opportunityDedupeMigration, /PARTITION BY ranked\.blogSlug/);
  assert.match(opportunityDedupeMigration, /ranked\.status = 'reviewing'/);
  assert.match(opportunityDedupeMigration, /ranked\.impressions DESC/);
  assert.match(opportunityDedupeMigration, /SET opportunity\.status = 'dismissed'/);
});
