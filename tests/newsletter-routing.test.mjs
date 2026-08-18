import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const footerSource = await readFile(
  new URL('../app/(home)/components/FooterNewsletterForm.tsx', import.meta.url),
  'utf8',
);
const popupSource = await readFile(
  new URL('../components/lead-capture/LeadCapturePopup.tsx', import.meta.url),
  'utf8',
);
const subscribeRouteSource = await readFile(
  new URL('../app/api/subscribe/route.ts', import.meta.url),
  'utf8',
);

test('Sure Imports footer and popup share the marketing lead endpoint', () => {
  assert.match(footerSource, /fetch\('\/api\/subscribe'/);
  assert.match(popupSource, /fetch\('\/api\/subscribe'/);
  assert.match(footerSource, /source: 'footer_newsletter'/);
  assert.match(popupSource, /source: 'lead_capture_popup'/);
});

test('the shared endpoint permits email-only footer submissions', () => {
  assert.match(subscribeRouteSource, /source\.includes\('footer_newsletter'\)/);
  assert.match(subscribeRouteSource, /firstName: firstName \|\| null/);
  assert.match(subscribeRouteSource, /INSERT INTO marketing_leads/);
  assert.match(subscribeRouteSource, /requestMarketingOptIn/);
});
