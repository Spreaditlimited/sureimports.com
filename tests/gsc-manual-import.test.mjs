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

test('the importer rejects overlapping active jobs and saves row progress', () => {
  assert.match(importerSource, /WHERE status = 'started'/);
  assert.match(importerSource, /FOR UPDATE/);
  assert.match(importerSource, /SET rowCount = \$\{totalRows\}/);
});

test('GSC import and opportunity generation never invoke OpenAI', () => {
  assert.doesNotMatch(importerSource, /openai|responses\.create|chat\.completions/i);
  assert.doesNotMatch(manualRouteSource, /openai|responses\.create|chat\.completions/i);
});
