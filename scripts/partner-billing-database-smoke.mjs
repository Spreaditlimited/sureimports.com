import {PrismaClient} from '@prisma/client';import fs from 'node:fs';import path from 'node:path';import ts from 'typescript';import assert from 'node:assert/strict';import{createRequire}from'node:module';import{randomUUID}from'node:crypto';
const require=createRequire(import.meta.url),db=new PrismaClient(),base=path.resolve('../partner.sureimports.com'),marker='BILL_SMOKE_'+randomUUID(),rollback=Error('ROLLBACK_ONLY');let tx;
const originalFetch=globalThis.fetch;const oldId=process.env.SUREIMPORTS_PAYPAL_CLIENT_ID,oldSecret=process.env.SUREIMPORTS_PAYPAL_SECRET;process.env.SUREIMPORTS_PAYPAL_CLIENT_ID='synthetic';process.env.SUREIMPORTS_PAYPAL_SECRET='synthetic';
const subscriptions=new Map(),plans=new Map(),charges=new Map();let subscriptionPosts=0,lose=false,wrongCurrency=false;
globalThis.fetch=async(url,options={})=>{
 const u=new URL(url);assert.equal(u.hostname,'api-m.paypal.com','NO REAL PROVIDER NETWORK ALLOWED');const body=options.body&&String(options.body).startsWith('{')?JSON.parse(options.body):null;
 if(u.pathname==='/v1/oauth2/token')return Response.json({access_token:'mock'});
 if(options.method==='POST'){
  assert.ok(options.headers['PayPal-Request-Id']?.length<=38||u.pathname.endsWith('/cancel'));
  if(u.pathname==='/v1/catalogs/products')return Response.json({id:'PROD-MOCK'});
  if(u.pathname==='/v1/billing/plans'){const id='P-MOCK'+(plans.size+1);plans.set(id,{id,...body});return Response.json({id});}
  if(u.pathname==='/v1/billing/subscriptions'){subscriptionPosts++;const id='I-MOCK'+subscriptionPosts;const value={id,...body,start_time:new Date().toISOString(),status:'APPROVAL_PENDING'};subscriptions.set(id,value);charges.set(id,[]);if(lose){lose=false;throw Error('MOCK_LOST_RESPONSE');}return Response.json({...value,links:[{rel:'approve',href:'https://www.paypal.com/approve?token='+id}]});}
  if(u.pathname.endsWith('/cancel')){subscriptions.get(u.pathname.split('/').at(-2)).status='CANCELLED';return new Response(null,{status:204});}
 }
 if(u.pathname.startsWith('/v1/billing/plans/'))return Response.json(plans.get(u.pathname.split('/').at(-1)));
 if(u.pathname.endsWith('/transactions')){const data=charges.get(u.pathname.split('/').at(-2)).map(c=>({...c,amount_with_breakdown:{gross_amount:{currency_code:wrongCurrency?'USD':'GBP',value:'25.00'}}}));return Response.json({transactions:data});}
 if(u.pathname.startsWith('/v1/billing/subscriptions/'))return Response.json(subscriptions.get(u.pathname.split('/').at(-1)));
 throw Error('UNEXPECTED_PROVIDER_REQUEST');
};
const modules=new Map();function load(relative){const file=path.resolve(base,relative);if(modules.has(file))return modules.get(file);const out={};modules.set(file,out);const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;new Function('exports','require',code)(out,name=>{
 if(name==='server-only')return{};
 if(name==='./kyc-server')return{KycError:class extends Error{constructor(m,status=400){super(m);this.status=status;}}};
 if(name==='@/lib/prisma')return{prisma:new Proxy({},{get:(_,key)=>key==='$transaction'?fn=>fn(tx):typeof tx[key]==='function'?tx[key].bind(tx):tx[key]})};
 if(name.startsWith('@/'))return load(name.slice(2)+'.ts');if(name.startsWith('.'))return load(path.relative(base,path.resolve(path.dirname(file),name+'.ts')));return require(name);
 });return out;}
try{
 const billing=load('lib/partners/billing.ts'),events=load('lib/partners/billing-events.ts'),policy=load('lib/partners/billing-policy.ts');
 assert.equal(policy.monthlyPeriodEnd(new Date('2026-01-31T12:00:00Z')).toISOString(),'2026-02-28T12:00:00.000Z');assert.throws(()=>policy.validatePlatformTerms({country:'GB',currency:'NGN',amountMinor:2500,policyRevision:1}));
 await db.$transaction(async transaction=>{tx=transaction;const owner=marker+'_owner',partner=marker+'_partner',actor={actorPid:owner,partnerId:partner};const activated=new Date(Date.now()-31*86400000);
  await tx.users.create({data:{pidUser:owner,userEmail:owner+'@example.invalid'}});
  const business=await tx.procurement_partners.create({data:{id:partner,slug:marker.toLowerCase(),legalName:'Rollback billing business',registrationNumber:marker,ownerPidUser:owner,status:'PENDING',country:'GB',settlementCurrency:'GBP',businessType:'UK_INDIVIDUAL'}});
  await tx.procurement_partner_kyc.create({data:{partnerId:partner,status:'VERIFIED'}});
  const country=(await tx.$queryRaw`SELECT policyJson,revision FROM partner_country_policies WHERE code='GB'`)[0];
  await tx.$executeRaw`INSERT INTO partner_application_country_policy (partnerId,countryCode,revision,policyJson) VALUES (${partner},'GB',${country.revision},${country.policyJson})`;
  const agreement=load('lib/partners/agreement.ts'),agreementPolicy=load('lib/partners/agreement-policy.ts'),crypto=load('lib/partners/kyc-crypto.ts');
  const review={businessFit:{decision:'PILOT_APPROVED',hardBlockersCleared:true},checkedAddressEvidence:true,checkedIdentityMeeting:true,checkedOwnNamePayout:true};
  const acceptance={hash:agreementPolicy.agreementOffer(business).hash,fullName:'Rollback Owner',role:'Owner',confirmed:true,reachedEnd:true};
  for(const flag of ['checkedAddressEvidence','checkedIdentityMeeting','checkedOwnNamePayout']){
   await tx.procurement_partner_kyc.update({where:{partnerId:partner},data:{reviewCiphertext:crypto.encryptKyc(Buffer.from(JSON.stringify({...review,[flag]:false})),partner).toString('base64')}});
   await assert.rejects(agreement.acceptAgreement(actor,acceptance),{status:409});
   assert.equal((await tx.procurement_partners.findUnique({where:{id:partner}})).status,'PENDING');
  }
  await tx.procurement_partner_kyc.update({where:{partnerId:partner},data:{reviewCiphertext:crypto.encryptKyc(Buffer.from(JSON.stringify(review)),partner).toString('base64')}});
  const accepted=await agreement.acceptAgreement(actor,acceptance);const replay=await agreement.acceptAgreement(actor,acceptance);assert.equal(accepted.reference,replay.reference);
  const active=await tx.procurement_partners.findUnique({where:{id:partner}});assert.equal(active.status,'ACTIVE');assert.equal(active.liveCollectionEnabled,true);
  assert.equal(await tx.procurement_partner_kyc_events.count({where:{partnerId:partner,action:'BUSINESS_ACTIVATED'}}),1);
  assert.equal((await tx.$queryRaw`SELECT * FROM partner_platform_accounts WHERE partnerId=${partner}`).length,1);
  console.log('PASS UK activation: each manual safeguard blocks acceptance; valid agreement activates collection and snapshots billing exactly once.');
  const original=await billing.ensurePlatformAccount(tx,partner,activated);const again=await billing.ensurePlatformAccount(tx,partner,new Date());assert.equal(original.trialEndsAt.getTime(),again.trialEndsAt.getTime());
  await tx.$executeRaw`UPDATE partner_platform_accounts SET amountMinor=2500,trialEndsAt=${activated} WHERE partnerId=${partner}`;
  let view=await billing.billingView(actor);assert.equal(view.currency,'GBP');assert.equal(view.state,'PAYMENT_REQUIRED');
  await assert.rejects(billing.billingView({...actor,actorPid:'other'}),{status:403});
  await assert.rejects(billing.requirePlatformAccess(tx,partner),{status:409});
  const consent={confirmed:true,amountMinor:2500,termsRevision:view.termsRevision};
  await assert.rejects(billing.beginPlatformSubscription(actor,{...consent,amountMinor:1}),{status:422});assert.equal(subscriptionPosts,0);
  const checkout=await billing.beginPlatformSubscription(actor,consent);assert.match(checkout.url,/paypal.com/);assert.equal(subscriptionPosts,1);
  const retry=await billing.beginPlatformSubscription(actor,consent);assert.equal(checkout.url,retry.url);assert.equal(subscriptionPosts,1);
  await billing.refreshPlatformBilling(actor);view=await billing.billingView(actor);assert.equal(view.state,'PAYMENT_REQUIRED');
  const sub=subscriptions.get('I-MOCK1');sub.status='ACTIVE';charges.get(sub.id).push({id:'BILL-CHARGE-1',status:'COMPLETED',time:new Date().toISOString()});
  wrongCurrency=true;await assert.rejects(billing.refreshPlatformBilling(actor),/mismatch/);assert.equal((await billing.billingView(actor)).receipts.length,0);wrongCurrency=false;
  await billing.refreshPlatformBilling(actor);await billing.refreshPlatformBilling(actor);view=await billing.billingView(actor);assert.equal(view.receipts.length,1);assert.equal(view.state,'PAID');await billing.requirePlatformAccess(tx,partner);assert.equal(subscriptionPosts,1);
  await assert.rejects(billing.beginPlatformSubscription(actor,consent),{status:409});
  await billing.cancelPlatformSubscription(actor);view=await billing.billingView(actor);assert.equal(view.agreement.status,'CANCELLED');assert.equal(view.state,'PAID');
  charges.get(sub.id)[0].status='REFUNDED';await billing.refreshPlatformBilling(actor);view=await billing.billingView(actor);assert.equal(view.state,'PAYMENT_REQUIRED');assert.equal(view.receipts[0].status,'REVERSED');
  charges.get(sub.id)[0].status='COMPLETED';await billing.refreshPlatformBilling(actor);assert.equal((await billing.billingView(actor)).state,'PAYMENT_REQUIRED','Stale proof must not resurrect reversed access');
  lose=true;await assert.rejects(billing.beginPlatformSubscription(actor,consent),{status:503});assert.equal(subscriptionPosts,2);await assert.rejects(billing.beginPlatformSubscription(actor,consent),{status:409});assert.equal(subscriptionPosts,2);
  const lost=subscriptions.get('I-MOCK2');lost.status='ACTIVE';charges.get(lost.id).push({id:'BILL-CHARGE-2',status:'COMPLETED',time:new Date().toISOString()});
  await events.platformBillingEvent('PAYPAL',{event_type:'BILLING.SUBSCRIPTION.ACTIVATED',resource:lost});view=await billing.billingView(actor);assert.equal(view.state,'PAID');assert.equal(view.receipts.length,2);assert.equal(subscriptionPosts,2);
  console.log('PASS GBP billing: frozen trial, price consent, owner isolation, approval, canonical currency validation, replay, cancellation, refunded access and lost-response recovery. All provider traffic mocked.');throw rollback;
 },{timeout:90000,maxWait:10000});
}catch(e){if(e!==rollback){console.error(e.code||e.message, e.meta?.code || '', e.meta?.message || '');process.exitCode=1;}}finally{globalThis.fetch=originalFetch;if(oldId===undefined)delete process.env.SUREIMPORTS_PAYPAL_CLIENT_ID;else process.env.SUREIMPORTS_PAYPAL_CLIENT_ID=oldId;if(oldSecret===undefined)delete process.env.SUREIMPORTS_PAYPAL_SECRET;else process.env.SUREIMPORTS_PAYPAL_SECRET=oldSecret;await db.$disconnect();}
if(!process.exitCode)console.log('PASS all billing fixture records rolled back; no charges, emails or live subscriptions created.');
