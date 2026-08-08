import assert from 'node:assert/strict';
import test from 'node:test';

import {
  assessSupplierSearchQuery,
  supplierCategoryMatchScore,
} from '../lib/intelligence/searchQueryPolicy.ts';

test('vague market intent cannot become a supermarket shelves search', () => {
  const assessment = assessSupplierSearchQuery(
    'Supermarket target for my area',
  );
  assert.notEqual(assessment.status, 'valid');
  assert.equal(assessment.canonicalQuery, null);
  assert.equal(
    supplierCategoryMatchScore(
      'Supermarket target for my area',
      'Supermarket shelves',
    ),
    0,
  );
});

test('clear physical products are accepted and cleaned for confirmation', () => {
  assert.deepEqual(
    assessSupplierSearchQuery('Gas generators for my target market'),
    {
      status: 'valid',
      originalQuery: 'Gas generators for my target market',
      canonicalQuery: 'Gas generators',
      message: 'Confirm the product before Sure Imports uses a search credit.',
      suggestions: [],
    },
  );
  assert.equal(
    assessSupplierSearchQuery('Commercial supermarket shelves').status,
    'valid',
  );
});

test('business and customer research questions are out of scope', () => {
  for (const query of [
    'How do I find customers in my area?',
    'Where to sell supermarket products',
    'What profitable business should I start?',
  ]) {
    assert.equal(assessSupplierSearchQuery(query).status, 'out_of_scope');
  }
});

test('category matching requires strong product agreement in both directions', () => {
  assert.ok(
    supplierCategoryMatchScore(
      'commercial supermarket shelving manufacturers',
      'Supermarket shelves',
    ) > 0,
  );
  assert.equal(supplierCategoryMatchScore('Shelves', 'Supermarket shelves'), 0);
  assert.equal(
    supplierCategoryMatchScore('Rice suppliers', 'Rice manufacturers'),
    100,
  );
});
