import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {registerHooks} from 'node:module';
process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY='sk_live_synthetic';
const fixture={paymentStatus:'PAID',holds:[],paymentWrites:0};globalThis.__partnerEvents=fixture;
fixture.db={$transaction:fn=>fn(fixture.db),$queryRaw:async()=>[{id:'order',partnerId:'business',releasedOrderId:null,paymentStatus:fixture.paymentStatus}],$executeRaw:async(q,...v)=>{if(q.join('?').includes('SET paymentStatus'))fixture.paymentStatus=v[0];return 1;},payments:{updateMany:async()=>{fixture.paymentWrites++;}}};
const inline=s=>({url:'data:text/javascript,'+encodeURIComponent(s),shortCircuit:true});
const hook=registerHooks({resolve(s,c,n){if(s==='server-only')return inline('export{}');if(s==='@/lib/prisma')return inline('export const prisma=globalThis.__partnerEvents.db');if(s==='./wallet')return inline('export const holdWalletCredit=async(db,partner,order,reversed)=>globalThis.__partnerEvents.holds.push({partner,order,reversed})');if(s==='./order-workflow')return inline('export const commitVerifiedCustomerPayment=async()=>({})');return n(s,c);}});
const {handlePartnerPaystackEvent}=await import('../lib/partners/paystack-order-events.ts');hook.deregister();
const event=async(type)=>{const raw=JSON.stringify({event:type,data:{reference:'refund-reference',transaction:{reference:'PCO_fixture'}}});return handlePartnerPaystackEvent(raw,createHmac('sha512',process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY).update(raw).digest('hex'));};
test('refunds reserve earnings immediately, use the transaction reference, and never undo a reversal',async()=>{
 assert.equal((await handlePartnerPaystackEvent('{}','bad')).status,401);
 assert.equal((await event('refund.pending')).status,200);assert.equal(fixture.paymentStatus,'DISPUTED');assert.equal(fixture.holds[0].reversed,false);
 await event('refund.processed');assert.equal(fixture.paymentStatus,'REVERSED');assert.equal(fixture.holds[1].reversed,true);
 await event('charge.dispute.remind');await event('refund.processed');assert.equal(fixture.paymentStatus,'REVERSED');assert.equal(fixture.holds.length,2);assert.equal(fixture.paymentWrites,2);
});
