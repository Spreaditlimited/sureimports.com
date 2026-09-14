import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { procurementProductValue } from '../lib/procurement/productPricing.ts';

const rates={ngnPerUsd:1500,cnyPerUsd:7,ngnPerCny:225};
test('Nigeria RMB goods use the direct rate, not the USD cross-rate',()=>{
  assert.deepEqual(procurementProductValue(700,'CNY','Nigeria',rates),{ngn:157500,usd:105,direct:true});
  assert.notEqual(157500,700/7*1500);
});
test('USD, NGN, non-Nigeria and frozen legacy calculations remain unchanged',()=>{
  assert.equal(procurementProductValue(700,'CNY','Ghana',rates).usd,100);
  assert.equal(procurementProductValue(700,'CNY','Nigeria',rates,1).ngn,150000);
  assert.equal(procurementProductValue(100,'USD','Nigeria',rates).ngn,150000);
  assert.equal(procurementProductValue(150000,'NGN','Nigeria',rates).ngn,150000);
  assert.throws(()=>procurementProductValue(700,'CNY','Nigeria',{...rates,ngnPerCny:0}),/RMB to NGN/);
});

const hook=registerHooks({resolve(s,c,n){
  if(s==='@/lib/prisma')return {url:'data:text/javascript,export const prisma=globalThis.__pricingDb',shortCircuit:true};
  if(s.startsWith('.')&&!/\.(ts|mjs|js)$/.test(s))return n(new URL(s+'.ts',c.parentURL).href,c);
  return n(s,c);
}});
let order={pidOrder:'order',currencyType:'CNY',status:'saved',destinationCountry:'ng',shippingPlan:'air',shippingPricingVersion:2,shippingRateSnapshot:10,shippingRateCurrency:'USD',shippingMeasurementUnit:'KG'};
let financial={exNairaToDollar:1500,exYuanToDollar:7,exNairaToYuan:225,service_charge:15,vat:7.5,procurementMinimumOrderNgn:0};
globalThis.__pricingDb={$queryRaw:async()=>[{procurementVatForeign:'20',exGbpPerUsd:'0.8'}],orders:{findFirst:async()=>order},products:{findMany:async()=>[{productPrice:70,productQuantity:10,shippingMeasurePerUnit:1}]},country:{findUnique:async()=>({countryName:'Nigeria'})},shippingplan:{findUnique:async()=>({shippingPlanName:'Air'})},exchange_rate:{findUnique:async()=>financial}};
const {getProcurementOrderLifecycle}=await import('../lib/procurement/orderLifecycle.ts');
const {priceCustomerOrder}=await import('../lib/partners/order-cost.ts');
hook.deregister();
test('lifecycle includes fees on the direct product base and freezes version/rates after payment',async()=>{
  const estimate=await getProcurementOrderLifecycle('order');
  assert.equal(estimate.productsTotalNgn,157500);
  assert.equal(estimate.serviceChargeValueUsd*1500,23625);
  assert.equal(estimate.payment.due,340396.88);
  assert.equal(estimate.snapshot.productPricingVersion,2);
  order={...order,...estimate.snapshot,status:'pending'};
  financial={...financial,exNairaToYuan:300,exNairaToDollar:2000};
  const paid=await getProcurementOrderLifecycle('order');
  assert.equal(paid.productsTotalNgn,157500);
  assert.equal(paid.rates.ngnPerCny,225);
  assert.equal(paid.payment.due,0);
  assert.equal(paid.grandTotalUsd,estimate.grandTotalUsd);
  order={...order,productPricingVersion:null};
  assert.equal((await getProcurementOrderLifecycle('order')).productsTotalNgn,150000);
});
test('partner earnings, VAT and shipping use the direct product base with integer kobo allocations',()=>{
  const input={currencyType:'CNY',products:[{productPrice:70,productQuantity:10,shippingMeasurePerUnit:1}]};
  const result=priceCustomerOrder(input,{countryName:'Nigeria',planName:'Air',version:2,rate:10,rateCurrency:'USD',measurementUnit:'KG'},{...rates,vatPercent:7.5,serviceChargeBps:1500,partnerShareBps:500,minimumOrderNgn:0});
  assert.equal(result.productCostMinor,15750000);
  assert.equal(result.partnerEarningsMinor,787500);
  assert.equal(result.serviceChargeMinor,2362500);
  assert.equal(result.taxMinor,177188);
  assert.equal(result.shippingMinor,15750000);
  assert.equal(result.orderTotalMinor,34039688);
});
