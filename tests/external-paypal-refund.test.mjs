import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import crypto from 'node:crypto';
function load(file,imports={}){const api={};new Function('exports','require',ts.transpileModule(fs.readFileSync(new URL('../lib/refunds/'+file,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(api,name=>{if(name==='server-only')return {};if(name==='node:crypto')return crypto;if(name in imports)return imports[name];throw Error(name);});return api;}
const money=load('money.ts'), references=load('paypal-reference.ts');
const refund={id:'REFUND123',status:'COMPLETED',amount:{currency_code:'USD',value:'10.00'},links:[{rel:'up',href:'https://api-m.paypal.com/v2/payments/captures/CAPTURE123'}]};
const source={pidUser:'USER',pidOrder:'ORDER',currency:'USD',amount:'10.00',refundStatus:'pending',ext1:'ORDER_ADJUSTMENT',ext2:JSON.stringify({version:1,productRetentionRatio:'0.90000000'}),serviceType:'PROCUREMENT'};
function engine({provider=refund,sourceRefund=source,payments=[{pidPayment:'PAY1',amount:'100',currency:'USD'}],snapshots=[],reserved='0',resolved=[]}={}){
 const calls=[],writes=[];
 const db={
  $executeRaw:async(sql,...values)=>{writes.push([sql.join('?'),values]);return 1;},
  refund_records:{update:async input=>writes.push(['refund_records',input])},
  $queryRaw:async(sql,...values)=>{const text=sql.join('');
   if(text.includes('SELECT pidUser'))return sourceRefund?[sourceRefund]:[];
   if(text.includes('SELECT detailsJson'))return [{detailsJson:JSON.stringify({captureId:'CAPTURE123',currency:'USD',amount:'10.00'})}];
   if(text.includes('SELECT refundId FROM refund_events'))return resolved;
   if(text.includes('FROM payments'))return payments;
   if(text.includes('FROM refund_settlements'))return snapshots;
   if(text.includes('SUM(amount)'))return [{amount:reserved}];
   if(text.includes('FROM refund_provider_legs'))return [];
   throw Error(text);
  },
  $transaction:async fn=>fn(db),
 };
 const api=load('external-paypal.ts',{'@/lib/prisma':{prisma:db},'./money':money,'./paypal-reference':references,'./paypal-client':{paypalRefundRequest:async(...args)=>{calls.push(args);return args[0].startsWith('/captures/')?{id:'CAPTURE123',amount:{currency_code:'USD',value:'100.00'}}:provider;}}});
 return {...api,calls,writes};
}
test('external partial refund is recorded without reversing payment or creating money movement',async()=>{
 const run=engine();await run.recordExternalPayPalRefund('REFUND123','CAPTURE123');
 assert.deepEqual(run.calls,[['/refunds/REFUND123'],['/captures/CAPTURE123']]);
 assert.equal(run.writes.length,1);assert.match(run.writes[0][0],/ON DUPLICATE KEY UPDATE id=id/);
 assert.match(run.writes[0][0],/EXTERNAL_PAYPAL_REFUND/);
});
test('invalid linkage, excessive amount and currency mismatch cannot persist evidence',async()=>{
 for(const provider of [{...refund,links:[]},{...refund,amount:{currency_code:'USD',value:'101.00'}},{...refund,amount:{currency_code:'GBP',value:'10.00'}}]){
  const run=engine({provider});await assert.rejects(run.recordExternalPayPalRefund('REFUND123','CAPTURE123'));assert.equal(run.writes.length,0);
 }
});
test('linking verified external refund only uses GET and settles the exact existing entitlement',async()=>{
 const run=engine();await run.linkExternalPayPalRefund('REFUND123','RF1','ADMIN');
 assert.deepEqual(run.calls,[['/refunds/REFUND123']]);
 assert.equal(run.writes.filter(([sql])=>sql==='refund_records').length,1);
 assert.ok(run.writes.some(([sql,values])=>sql.includes('EXTERNAL_REFUND_LINKED')&&values.includes('RESOLVED:PP_EXTERNAL:REFUND123')));
});
test('linking rejects different customer/order payment, amounts, already settled records and absent classification',async()=>{
 for(const options of [{payments:[]},{sourceRefund:{...source,amount:'11.00'}},{sourceRefund:{...source,currency:'GBP'}},{sourceRefund:{...source,refundStatus:'refunded'}},{sourceRefund:{...source,ext2:'{}'}},{snapshots:[{refundId:'RF1'}]},{reserved:'95.00'},{provider:{...refund,status:'PENDING'}}]){
  const run=engine(options);await assert.rejects(run.linkExternalPayPalRefund('REFUND123','RF1','ADMIN'));assert.equal(run.writes.length,0);
 }
});
test('duplicate link is idempotent and cannot redirect the provider refund to a different entitlement',async()=>{
 const run=engine({resolved:[{refundId:'RF1'}]});await run.linkExternalPayPalRefund('REFUND123','RF1','ADMIN');assert.equal(run.writes.length,0);
 await assert.rejects(run.linkExternalPayPalRefund('REFUND123','RF2','ADMIN'),/different refund/);
});
test('external review intercept precedes full reversal in webhook',()=>{
 const code=fs.readFileSync(new URL('../app/api/intelligence/paypal-webhook/route.ts',import.meta.url),'utf8');
 assert.ok(code.indexOf('await recordExternalPayPalRefund')<code.indexOf('await voidAffiliateConversions'));
});
