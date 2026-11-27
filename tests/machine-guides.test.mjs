import test from 'node:test';
import assert from 'node:assert/strict';
import {
  selectMachineGuides,
  legacyMachineGuides,
} from '../lib/machines/guides.ts';
const now = new Date('2026-11-27T12:00:00Z');
const sample = (overrides) => ({
  blogTitle: 'A new machine guide',
  blogSlug: 'new-machine-guide',
  blogPublished: true,
  xStaus: 'active',
  createdAt: now,
  blogExt2: JSON.stringify({ productionLine: { topicId: 'PL-140' } }),
  ...overrides,
});
test('future series joins at its publication timestamp without changing the catalogue', () => {
  const scheduled = sample({ createdAt: '2026-11-30T08:00:00Z' });
  assert.equal(selectMachineGuides([scheduled], now).length, 0);
  assert.equal(
    selectMachineGuides([scheduled], new Date('2026-11-30T08:00:00Z')).length,
    1,
  );
});
test('drafts, inactive, malformed dates and excluded SEO records stay out', () => {
  for (const override of [
    { blogPublished: false },
    { xStaus: 'inactive' },
    { createdAt: 'bad' },
    { blogExt2: JSON.stringify({ machineGuide: true, noIndex: true }) },
    { blogExt2: '{broken' },
    { blogSlug: '../private' },
  ])
    assert.equal(selectMachineGuides([sample(override)], now).length, 0);
});
test('legacy specific guides, buying guides and explicitly tagged future guides enroll; unrelated articles do not', () => {
  for (const slug of Object.keys(legacyMachineGuides))
    assert.equal(
      selectMachineGuides([sample({ blogSlug: slug, blogExt2: null })], now)
        .length,
      1,
    );
  assert.equal(
    selectMachineGuides(
      [sample({ blogExt2: JSON.stringify({ machineGuide: true }) })],
      now,
    ).length,
    1,
  );
  assert.equal(
    selectMachineGuides(
      [sample({ blogTitle: 'Affiliate machine sourcing', blogExt2: '{}' })],
      now,
    ).length,
    0,
  );
});
test('canonical directory deduplicates and rejects redirected slugs', () => {
  assert.equal(selectMachineGuides([sample(), sample()], now).length, 1);
  assert.equal(selectMachineGuides([sample()], now, () => true).length, 0);
});
