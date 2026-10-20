const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function load(path, deps = {}) {
  const module = { exports: {} };
  new Function('require', 'module', 'exports', ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(id => { if (id in deps) return deps[id]; throw new Error(`Unexpected dependency: ${id}`); }, module, module.exports);
  return module.exports;
}
const policy = load('lib/procurement/shippingEligibility.ts');
test('batteries and battery goods allow only Special, Express and Sea', () => {
  for (const category of ['Goods with Battery', 'Raw Batteries', 'Liquids, Gases, Powder']) {
    for (const plan of ['SPECIAL_SHIPPING', 'EXPRESS_SHIPPING', 'SEA_SHIPPING']) assert.equal(policy.isShippingPlanAllowed(category, plan), true);
    for (const plan of ['NORMAL_SHIPPING', 'UNKNOWN', null]) assert.equal(policy.isShippingPlanAllowed(category, plan), false);
  }
  assert.equal(policy.isShippingPlanAllowed('Other Goods', 'NORMAL_SHIPPING'), true);
});
test('server rejects incompatible plans and plans not offered by the destination', async () => {
  let plans = [{ shippingPlanName: 'NORMAL_SHIPPING', shippingPlanRate: 10 }];
  const { resolveNewProcurementShippingPricing: resolve } = load('lib/procurement/shippingPricing.ts', {
    './shippingEligibility': policy,
    './shippingMath': { isNigeriaSeaShipping: () => false },
    './deviceShippingSettings': { getDeviceShippingSettings: async () => ({ phoneNgn: 25000, laptopNgn: 50000 }) },
    '@/lib/prisma': { prisma: { country: { findUnique: async () => ({ countryName: 'Nigeria', shippingPlans: plans }) } } },
  });
  await assert.rejects(resolve('NG', 'normal', 'Goods with Battery'), /Special, Express or Sea/);
  await assert.rejects(resolve('NG', 'normal', 'unknown category'), /valid goods category/);
  plans = [];
  await assert.rejects(resolve('NG', 'foreign-plan', 'Other Goods'), /not available/);
  plans = [{ shippingPlanName: 'EXPRESS_SHIPPING', shippingPlanRate: 10 }];
  const result = await resolve('NG', 'express', 'Goods with Battery');
  assert.equal(result.devicePhoneRateNgn, 25000);
  assert.equal(result.measurementUnit, 'KG');
});
