import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
const require = createRequire(import.meta.url),
  base = resolve(process.cwd(), '../partner.sureimports.com/lib/partners');
const cache = new Map();
function load(path) {
  if (cache.has(path)) return cache.get(path);
  const exports = {};
  cache.set(path, exports);
  vm.runInNewContext(
    ts.transpileModule(readFileSync(path, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    {
      exports,
      Date,
      require: (id) =>
        id.startsWith('.')
          ? load(resolve(dirname(path), id + '.ts'))
          : require(id),
    },
  );
  return exports;
}
const { kycDetailsSchema, kycDocumentSlots } = load(
  resolve(base, 'kyc-policy.ts'),
);
const today = new Date().toISOString().slice(0, 10);
const person = {
  id: '11111111-1111-4111-8111-111111111111',
  fullName: 'Example Person',
  email: 'example@example.com',
  phone: '+447700900123',
  role: 'PROPRIETOR',
  founder: true,
  ownershipPercent: 100,
  idType: 'PASSPORT',
  dateOfBirth: '1990-01-01',
  idExpiresAt: '2090-01-01',
  addressEvidenceIssuedAt: today,
};
const details = {
  country: 'GB',
  businessType: 'UK_INDIVIDUAL',
  companyEra: 'CURRENT',
  taxId: '',
  registeredAddress: '33 Example Street, Warrington, England',
  people: [person],
  informationAccurate: true,
  authorisedToSubmit: true,
  privacyAcknowledged: true,
};
test('UK individual does not require company registration or CAC documents', () => {
  assert.ok(kycDetailsSchema.safeParse(details).success);
  const slots = kycDocumentSlots(details);
  assert.equal(slots.length, 2);
  assert.ok(slots.some((s) => s.key.startsWith('UK_ADDRESS:')));
  assert.ok(!slots.some((s) => s.key.startsWith('CAC')));
});
test('UK rejects underage applicant, expired ID, old address evidence and Nigerian identity types', () => {
  for (const change of [
    { dateOfBirth: today },
    { dateOfBirth: '2026-02-30' },
    { idExpiresAt: '2001-01-01' },
    { addressEvidenceIssuedAt: '2001-01-01' },
    { idType: 'NIN_SLIP' },
  ])
    assert.equal(
      kycDetailsSchema.safeParse({
        ...details,
        people: [{ ...person, ...change }],
      }).success,
      false,
    );
});
test('UK individual requires exactly one applicant', () =>
  assert.equal(
    kycDetailsSchema.safeParse({
      ...details,
      people: [
        person,
        { ...person, id: '22222222-2222-4222-8222-222222222222' },
      ],
    }).success,
    false,
  ));
test('Existing Nigerian business details remain valid and retain CAC requirements', () => {
  const { dateOfBirth, idExpiresAt, addressEvidenceIssuedAt, ...oldPerson } =
    person;
  const nigeria = {
    ...details,
    country: 'NG',
    businessType: 'BUSINESS_NAME',
    people: [oldPerson],
  };
  assert.ok(kycDetailsSchema.safeParse(nigeria).success);
  assert.ok(kycDocumentSlots(nigeria).some((s) => s.key === 'CAC_CERTIFICATE'));
});
test('Cross-country verification type is rejected', () =>
  assert.equal(
    kycDetailsSchema.safeParse({ ...details, country: 'NG' }).success,
    false,
  ));
