const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
function load(file,deps={}) {
 const module={exports:{}};
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 new Function('require','module','exports',code)(name=>name==='server-only'?{}:deps[name]||require(name),module,module.exports);
 return module.exports;
}
const policy=load('lib/intelligence/paypalPolicy.ts');
test('PayPal USD validation rejects rounding tricks, wrong currencies and unpaid statuses',()=>{
 assert.equal(policy.paypalUsdMinor('50.00'),5000);
 for(const value of ['50.001','-50','NaN','1e2',0,null]) assert.throws(()=>policy.paypalUsdMinor(value));
 for(const patch of [{currency:'NGN'},{actualAmount:'49.99'},{status:'PENDING'}]) assert.throws(()=>policy.validatePaypalSubscriptionPayment({actualAmount:'50.00',currency:'USD',expectedMinor:5000,status:'COMPLETED',...patch}));
 assert.equal(policy.paidMonthEnd(new Date('2026-01-31T12:00:00Z')).toISOString(),'2026-02-28T12:00:00.000Z');
 assert.equal(policy.paidMonthEnd(new Date('2028-01-31T12:00:00Z')).toISOString(),'2028-02-29T12:00:00.000Z');
});
function settlementHarness() {
 const checkout={id:'INTPP1',pidUser:'customer-1',pidSubscription:'INTSUB1',kind:'SUBSCRIPTION',planKey:'starter',providerReference:'I-1',providerPlanId:'P-1',environment:'live',amountMinor:5000,credits:3,status:'ACTIVE'};
 let providerStatus='ACTIVE', balance=0, granted=0, snapshot=null;
 const ledger=new Map();
 let transactions=[{id:'SALE1',status:'COMPLETED',time:'2026-01-31T12:00:00Z',amount_with_breakdown:{gross_amount:{value:'50.00',currency_code:'USD'}}}];
 const tx={
  $queryRaw:async(strings,...values)=>{
   const sql=strings.join('?');
   if(sql.includes('WHERE paymentReference'))return ledger.has(values[0])?[ledger.get(values[0])]:[];
   if(sql.includes('SELECT paidAt,periodEnd'))return [...ledger.values()].filter(p=>p.status==='COMPLETED').sort((a,b)=>b.periodEnd-a.periodEnd).slice(0,1);
   return [{pidAccount:'credit1',id:'INTPP1'}];
  },
  $executeRaw:async(strings,...values)=>{
   const sql=strings.join('?');
   if(sql.startsWith('INSERT INTO intelligence_paypal_payments'))ledger.set(values[0],{checkoutId:values[1],credits:values[3],status:values[4],paidAt:values[5],periodEnd:values[6]});
   if(sql.startsWith('UPDATE intelligence_paypal_payments'))ledger.get(values[0]).status='REVERSED';
   if(sql.startsWith('UPDATE intelligence_credit_accounts')){balance+=values[0];granted++;}
   return 1;
  },
  intelligence_subscriptions:{update:async args=>{snapshot=args.data;},updateMany:async args=>{if(snapshot)snapshot={...snapshot,...args.data};return {count:1};}},
 };
 const prisma={...tx,$transaction:async fn=>fn(tx),$queryRaw:async(strings,...values)=>strings.join('?').includes('WHERE paymentReference') ? (ledger.has(values[0])?[ledger.get(values[0])]:[]) : [checkout]};
 const api=load('lib/intelligence/paypalSettlement.ts',{
  '@/lib/prisma':{prisma},
  '@/lib/affiliate/commissions':{AFFILIATE_SERVICE_KEYS:{SUPPLIER_INTELLIGENCE:'intelligence'},recordAffiliateConversion:async()=>{},voidAffiliateConversions:async()=>{}},
  '@/lib/paypal':{getSureImportsPayPalEnvironment:()=> 'live'},
  '@/lib/paypalValidation':{assertPayPalOrderMatches:()=>{}},
  './credits':{getOrCreateIntelligenceCreditAccount:async()=>({})},
  './paypalApi':{intelligencePayPalRequest:async path=>path.includes('/transactions?')?{transactions}:{custom_id:checkout.id,plan_id:checkout.providerPlanId,status:providerStatus}},
  './paypalPolicy':policy,
 });
 return {api,checkout,setTransactions:value=>transactions=value,setStatus:value=>providerStatus=value,get:()=>({balance,granted,snapshot,ledger})};
}
test('subscription callbacks grant each paid cycle once; refunds cannot be replayed into access',async()=>{
 const h=settlementHarness();
 await h.api.syncIntelligencePayPalSubscription(h.checkout);
 await h.api.syncIntelligencePayPalSubscription(h.checkout);
 assert.equal(h.get().balance,3);assert.equal(h.get().granted,1);
 h.setTransactions([{id:'SALE1',status:'REFUNDED',time:'2026-01-31T12:00:00Z',amount_with_breakdown:{gross_amount:{value:'50.00',currency_code:'USD'}}}]);
 await h.api.syncIntelligencePayPalSubscription(h.checkout);
 assert.equal(h.get().balance,0);assert.equal(h.get().snapshot.status,'revoked');
 h.setTransactions([{id:'SALE1',status:'COMPLETED',time:'2026-01-31T12:00:00Z',amount_with_breakdown:{gross_amount:{value:'50.00',currency_code:'USD'}}}]);
 assert.equal((await h.api.syncIntelligencePayPalSubscription(h.checkout)).paid,false);assert.equal(h.get().balance,0);
});
test('later paid renewals survive refunds for earlier billing cycles; cancellation keeps paid access',async()=>{
 const h=settlementHarness();await h.api.syncIntelligencePayPalSubscription(h.checkout);
 h.setTransactions([{id:'SALE2',status:'COMPLETED',time:'2026-02-28T12:00:00Z',amount_with_breakdown:{gross_amount:{value:'50.00',currency_code:'USD'}}}]);await h.api.syncIntelligencePayPalSubscription(h.checkout);
 h.setTransactions([{id:'SALE1',status:'REFUNDED',time:'2026-01-31T12:00:00Z',amount_with_breakdown:{gross_amount:{value:'50.00',currency_code:'USD'}}}]);h.setStatus('CANCELLED');await h.api.syncIntelligencePayPalSubscription(h.checkout);
 assert.equal(h.get().balance,3);assert.equal(h.get().snapshot.status,'non_renewing');assert.equal(h.get().snapshot.currentPeriodEnd.toISOString(),'2026-03-28T12:00:00.000Z');
});
test('wrong subscription owner, provider plan and sandbox cannot grant live credit',async()=>{
 const h=settlementHarness();await assert.rejects(()=>h.api.getIntelligencePayPalCheckout('INTPP1','someone-else'));
 h.setTransactions([{id:'SALE1',status:'COMPLETED',time:'2026-01-31T12:00:00Z',amount_with_breakdown:{gross_amount:{value:'1.00',currency_code:'USD'}}}]);await assert.rejects(()=>h.api.syncIntelligencePayPalSubscription(h.checkout));assert.equal(h.get().granted,0);
 h.checkout.environment='sandbox';h.setTransactions([{id:'SALE1',status:'COMPLETED',time:'2026-01-31T12:00:00Z',amount_with_breakdown:{gross_amount:{value:'50.00',currency_code:'USD'}}}]);await assert.rejects(()=>h.api.syncIntelligencePayPalSubscription(h.checkout));assert.equal(h.get().granted,0);
});
test('consultation PayPal confirms exact USD 50 before using existing booking fulfillment',async()=>{
 let fulfilled=0, amount='50.00', environment='live';
 const api=load('lib/consultationPayPal.ts',{
  '@/lib/prisma':{prisma:{$queryRaw:async()=>[{reference:'BOOK1',pidBooking:'B1',providerReference:'PP1',environment,currency:'USD',amountKobo:5000}],$executeRaw:async()=>1}},
  '@/lib/paypal':{getSureImportsPayPalEnvironment:()=>environment,getPayPalOrder:async()=>({sureImportsEnvironment:environment,status:'COMPLETED',purchase_units:[{payments:{captures:[{id:'CAP1',status:'COMPLETED',amount:{value:amount,currency_code:'USD'},create_time:'2026-01-01T00:00:00Z'}]}}]})},
  '@/lib/paypalValidation':{assertPayPalOrderMatches:(_,expected)=>{assert.equal(expected.customId,'B1');assert.equal(expected.amountMinor,5000);}},
  '@/lib/intelligence/paypalPolicy':policy,
  '@/lib/consultationFulfillment':{fulfillConsultationPayment:async payment=>{assert.equal(payment.currency,'USD');assert.equal(payment.amount,5000);fulfilled++;return {status:'booked'};}},
 });
 await api.verifyPayPalConsultation('BOOK1');assert.equal(fulfilled,1);
 amount='49.99';await assert.rejects(()=>api.verifyPayPalConsultation('BOOK1'));assert.equal(fulfilled,1);
 amount='50.00';environment='sandbox';await assert.rejects(()=>api.verifyPayPalConsultation('BOOK1'));assert.equal(fulfilled,1);
});
test('booking checkout fixes international price server-side and preserves Nigerian Paystack',async()=>{
 const originalFetch=global.fetch,originalSecret=process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;
 const orders=[],initializations=[];
 const tx={$queryRaw:async()=>[],$executeRaw:async()=>1};
 const api=load('app/api/consultation/book/route.ts',{
  'next/server':{NextResponse:Response},
  '@/lib/paypal':{createPayPalOrder:async input=>{orders.push(input);return {id:'PP1',approvalUrl:'/checkout/paypal?session=test'};},getSureImportsPayPalEnvironment:()=> 'live'},
  '@/lib/consultationPayPal':{CONSULTATION_USD_CENTS:5000},
  '@/lib/features/country':{normalizeAccountCountry:value=>['Nigeria','United Kingdom'].includes(value)?value:null},
  '@/lib/intelligence/reportCheckoutSecurity':{checkoutReturnUrl:(_,path)=>'https://www.sureimports.com'+path,enforceReportCheckoutRateLimit:async()=>({allowed:true})},
  '@/lib/consultation':{absoluteUrl:path=>'https://www.sureimports.com'+path,bookingTokens:()=>({pidBooking:'B1',manageToken:'token'}),clean:(value)=>String(value||''),consultationAmountKobo:()=>5000000,isCandidateSlot:()=>true},
  '@/lib/prisma':{prisma:{...tx,$transaction:async fn=>fn(tx)}},
 });
 const request=country=>new Request('https://www.sureimports.com/api/consultation/book',{method:'POST',headers:{origin:'https://www.sureimports.com','content-type':'application/json'},body:JSON.stringify({billingCountry:country,amount:1,currency:'NGN',fullName:'Test Buyer',email:'test@example.com',phone:'test',consultationGoal:'Test',slotStartIso:'2026-12-01T10:00:00Z'})});
 try{
 process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY='mock';global.fetch=async(_,options)=>{initializations.push(JSON.parse(options.body));return Response.json({status:true,data:{authorization_url:'https://checkout.paystack.com/test'}});};
 assert.equal((await api.POST(request('United Kingdom'))).status,200);assert.equal(orders[0].amount,'50.00');assert.equal(orders[0].currency,'USD');assert.equal(initializations.length,0);
 assert.equal((await api.POST(request('Nigeria'))).status,200);assert.equal(initializations[0].amount,5000000);assert.equal(initializations[0].currency,'NGN');assert.equal(orders.length,1);
 assert.equal((await api.POST(request('Invalid'))).status,400);
 }finally{global.fetch=originalFetch;if(originalSecret===undefined)delete process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;else process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY=originalSecret;}
});
test('admin USD pricing rejects invalid prices and concurrent edits',async()=>{
 let permitted=true,affected=1,writes=0;
 const api=load('../admin.sureimports.com/app/api/intelligence/usd-pricing/route.ts',{
  '@/app/api/_lib/adminAccess':{requireAdminServiceAccess:async()=>permitted?{ok:true}:{ok:false,response:Response.json({},{status:403})}},
  '@/lib/prisma':{prisma:{$transaction:async fn=>fn({$executeRaw:async()=>{writes++;return affected;}})}},
 });
 const request=prices=>new Request('https://admin.sureimports.com/api/intelligence/usd-pricing',{method:'PUT',headers:{origin:'https://admin.sureimports.com'},body:JSON.stringify({prices})});
 const rows=['starter','pro'].map(planKey=>({planKey,priceUsdCents:2500,extraCreditPriceUsdCents:500,revision:0}));
 permitted=false;assert.equal((await api.PUT(request(rows))).status,403);assert.equal(writes,0);permitted=true;
 assert.equal((await api.PUT(request([null,rows[1]]))).status,400);
 assert.equal((await api.PUT(request([{...rows[0],priceUsdCents:50},rows[1]]))).status,400);assert.equal(writes,0);
 affected=0;assert.equal((await api.PUT(request(rows))).status,409);
 affected=1;assert.equal((await api.PUT(request(rows))).status,200);
});
