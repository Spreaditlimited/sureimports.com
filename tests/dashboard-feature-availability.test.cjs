const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function load(file, dependencies = {}) {
 const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React } }).outputText;
 const module = { exports: {} };
 new Function('require','module','exports',code)(name => dependencies[name] || require(name),module,module.exports);
 return module.exports;
}
const policy = load('lib/features/catalog.ts');
const countries = load('lib/data/countries.tsx');
const { normalizeAccountCountry } = load('lib/features/country.ts', { '@/lib/data/countries': countries });
test('only the requested services default to Nigeria-only', () => {
 assert.deepEqual(Object.entries(policy.defaultFeatureRules).filter(([,v]) => v).map(([k]) => k).sort(), ['instalments','orders','pay_supplier','shop','wallet']);
 for (const key of ['wallet','orders','shop','instalments','pay_supplier']) {
  assert.equal(policy.canSeeFeature(key,'Nigeria',policy.defaultFeatureRules),true);
  for (const country of ['United Kingdom','Ghana',null]) assert.equal(policy.canSeeFeature(key,country,policy.defaultFeatureRules),false);
 }
 assert.equal(policy.canSeeFeature('shipping','United Kingdom',policy.defaultFeatureRules),true);
});
test('admin can restrict or open each service without a code change', () => {
 for (const feature of policy.dashboardFeatures) {
  assert.equal(policy.canSeeFeature(feature.key,'United Kingdom',{...policy.defaultFeatureRules,[feature.key]:false}),true);
  assert.equal(policy.canSeeFeature(feature.key,'United Kingdom',{...policy.defaultFeatureRules,[feature.key]:true}),false);
 }
});
test('deep links and query strings map to exact services without prefix collisions', () => {
 assert.equal(policy.featureForPath('/dashboard/pay-small-small?status=SAVED'),'instalments');
 assert.equal(policy.featureForPath('/dashboard/shop/checkout'),'shop');
 assert.equal(policy.featureForPath('/dashboard/wallet/create-customer'),'wallet');
 assert.equal(policy.featureForPath('/dashboard/procurement/view-orders/saved'),'procurement');
 assert.equal(policy.featureForPath('/dashboard/orders-other'),undefined);
 assert.equal(policy.featureForPath('/dashboard/profile-update'),undefined);
});
test('country normalization requires a real choice and accepts legacy Nigeria/UK codes', () => {
 for (const value of ['Nigeria',' ng ','NGA']) assert.equal(normalizeAccountCountry(value),'Nigeria');
 for (const value of ['uk','GB','United Kingdom']) assert.equal(normalizeAccountCountry(value),'United Kingdom');
 for (const value of ['',null,'Mars',{},'nigerian']) assert.equal(normalizeAccountCountry(value),null);
});
test('malformed or partial admin rules cannot broaden access', () => {
 assert.equal(policy.validateFeatureRules(policy.defaultFeatureRules),true);
 for (const value of [null,[],{}, {...policy.defaultFeatureRules, wallet:'false'}, {...policy.defaultFeatureRules, unknown:false}]) assert.equal(policy.validateFeatureRules(value),false);
});
test('onboarding saves only the signed-in customer and rejects invalid countries/origins', async () => {
 let saved;
 let session = {pidUser:'customer-1'};
 const api = load('app/api/account/country/route.ts', {
  '@/lib/auth/current-user': {currentUser:async()=>session},
  '@/lib/prisma': {prisma:{users:{update:async args=>{saved=args;}}}},
  '@/lib/features/country': {normalizeAccountCountry},
 });
 const request = (body,origin='https://sureimports.com') => new Request('https://sureimports.com/api/account/country',{method:'PUT',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
 assert.equal((await api.PUT(request({country:'GB',pidUser:'someone-else'}))).status,200);
 assert.equal(saved.where.pidUser,'customer-1'); assert.equal(saved.data.country,'United Kingdom');
 saved=undefined;
 assert.equal((await api.PUT(request({country:'Mars'}))).status,400);
 assert.equal((await api.PUT(request({country:'Nigeria'},'https://evil.example'))).status,403);
 session=null; assert.equal((await api.PUT(request({country:'Nigeria'}))).status,401);
 assert.equal(saved,undefined);
});
test('admin settings require permissions, exact rules and current revision', async () => {
 let allowed=true, writes=0, affected=1;
 const api=load('../admin.sureimports.com/app/api/dashboard-features/route.ts',{
  '@/app/api/_lib/adminAccess':{requireAdminServiceAccess:async()=>allowed ? {ok:true,admin:{pidUser:'admin-1'}} : {ok:false,response:Response.json({}, {status:403})}},
  '@/lib/prisma':{prisma:{$executeRaw:async()=>{writes++;return affected;}}},
  '@/lib/features/catalog':policy,
 });
 const request=(body,origin='https://admin.sureimports.com')=>new Request('https://admin.sureimports.com/api/dashboard-features',{method:'PUT',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
 const valid={rules:policy.defaultFeatureRules,revision:0};
 allowed=false;assert.equal((await api.PUT(request(valid))).status,403);
 allowed=true;assert.equal((await api.PUT(request(valid,'https://evil.example'))).status,403);
 assert.equal((await api.PUT(request({rules:{wallet:false},revision:0}))).status,400);
 assert.equal(writes,0);
 assert.equal((await api.PUT(request(valid))).status,200);
 affected=0;assert.equal((await api.PUT(request(valid))).status,409);
});
test('Pay Supplier API access checks verified account country and configured rules', async () => {
 let session={pidUser:'owner-1',userEmail:'owner@example.test'}, country='United Kingdom';
 let rules=policy.defaultFeatureRules;
 const api=load('lib/features/request-access.ts',{
  '@/lib/auth/current-user':{currentUser:async()=>session},
  './server':{getAccountCountry:async id=>{assert.equal(id,'owner-1');return country;},getFeatureRules:async()=>rules},
  './catalog':policy,
 });
 assert.equal((await api.featureRequestAccess('pay_supplier')).response.status,403);
 country='Nigeria';assert.equal((await api.featureRequestAccess('pay_supplier')).user.pidUser,'owner-1');
 country='United Kingdom';rules={...rules,pay_supplier:false};assert.equal((await api.featureRequestAccess('pay_supplier')).user.pidUser,'owner-1');
 session=null;assert.equal((await api.featureRequestAccess('pay_supplier')).response.status,401);
});
