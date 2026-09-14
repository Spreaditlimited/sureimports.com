import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const exports = {};
vm.runInNewContext(
  ts.transpileModule(
    readFileSync(
      new URL('../lib/partners/country-policy.ts', import.meta.url),
      'utf8',
    ),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText,
  { exports, require },
);
const { countryPolicySchema, permittedApplicantTypes } = exports;
const uk = {
  code: 'GB',
  name: 'United Kingdom',
  status: 'OPEN',
  verificationProfile: 'UK_STANDARD',
  allowIndividuals: true,
  allowCompanies: true,
  billingCurrency: 'GBP',
  settlementCurrency: 'GBP',
  monthlyFeeMinor: 2500,
  trialDays: 14,
  minimumAge: 18,
  addressEvidenceMonths: 3,
  requireIdentityMeeting: true,
  requireOwnNamePayout: true,
  extraDocuments: [],
  revision: 1,
};
test('UK policy accepts individuals and bills explicitly in GBP', () => {
  assert.equal(countryPolicySchema.parse(uk).billingCurrency, 'GBP');
  assert.ok(permittedApplicantTypes(uk).includes('UK_INDIVIDUAL'));
});
test('Nigeria cannot enable individual applications or GBP billing', () => {
  assert.equal(
    countryPolicySchema.safeParse({
      ...uk,
      code: 'NG',
      verificationProfile: 'NG_BUSINESS',
    }).success,
    false,
  );
});
test('UK age, evidence and manual check safeguards cannot be weakened', () => {
  for (const change of [
    { minimumAge: 17 },
    { addressEvidenceMonths: 4 },
    { requireIdentityMeeting: false },
    { requireOwnNamePayout: false },
  ])
    assert.equal(
      countryPolicySchema.safeParse({ ...uk, ...change }).success,
      false,
    );
});
test('New country can be configured as a draft without frontend country enums', () => {
  assert.equal(
    countryPolicySchema.parse({
      ...uk,
      code: 'CA',
      name: 'Canada',
      status: 'DRAFT',
      billingCurrency: 'CAD',
    }).status,
    'DRAFT',
  );
});
test('Fractional minor-unit fees, negative trials and duplicate requirements fail', () => {
  for (const change of [
    { monthlyFeeMinor: 1.2 },
    { trialDays: -1 },
    {
      extraDocuments: [
        { key: 'EVIDENCE', label: 'Evidence document' },
        { key: 'EVIDENCE', label: 'Duplicate evidence' },
      ],
    },
  ])
    assert.equal(
      countryPolicySchema.safeParse({ ...uk, ...change }).success,
      false,
    );
});
