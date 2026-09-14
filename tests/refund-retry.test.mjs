import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import ts from 'typescript';import crypto from 'node:crypto';
function load(file,imports={}){const api={};new Function('exports','require',ts.transpileModule(fs.readFileSync(new URL('../lib/refunds/'+file,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(api,n=>n==='server-only'?{}:n==='node:crypto'?crypto:imports[n]);return api;}
function run({status='FAILED',local='FAILED',capture='CAP123',amount='10.00',changed=false}={}){
 const writes=[],calls=[];let queries=0;
 const leg={id:'LEG123',refundId:'RF123',paymentId:'PAY123',captureId:'CAP123',currency:'USD',amount:'10.00',status:local,providerReference:'REF123'};
 const db={$queryRaw:async sql=>{queries++;return sql.join('').includes('SELECT status,method')?[{method:'PAYPAL',status:'REQUESTED'}]:[{...leg,status:changed&&queries>1?'SUPERSEDED':local}];},$executeRaw:async(sql,...values)=>{writes.push([sql.join('?'),values]);return 1;},$transaction:fn=>fn(db)};
 const policy=load('paypal-policy.ts',{'./money':load('money.ts')});
 const api=load('retry-paypal.ts',{'@/lib/prisma':{prisma:db},'./paypal-reference':load('paypal-reference.ts'),'./paypal-policy':policy,'./paypal-client':{paypalRefundRequest:async(...args)=>{calls.push(args);return{id:'REF123',status,invoice_id:'LEG123',amount:{currency_code:'USD',value:amount},links:[{rel:'up',href:'https://api-m.paypal.com/v2/payments/captures/'+capture}]};}}});
 return{api,writes,calls};
}
test('failed refund replacement is GET-only, preserves history and requires later approval',async()=>{const r=run();await r.api.prepareFailedPayPalRetry('RF123','LEG123','ADMIN');assert.deepEqual(r.calls,[['/refunds/REF123']]);assert.equal(r.writes.length,3);assert.match(r.writes[0][0],/SUPERSEDED/);assert.match(r.writes[1][0],/INSERT INTO refund_provider_legs/);});
test('pending, completed, unknown or mismatched refund cannot be retried',async()=>{for(const options of [{status:'PENDING'},{status:'COMPLETED'},{status:'UNKNOWN'},{capture:'OTHER'},{amount:'9.00'},{local:'PROCESSING'}]){const r=run(options);await assert.rejects(r.api.prepareFailedPayPalRetry('RF123','LEG123','ADMIN'));assert.equal(r.writes.length,0);}});
test('another reviewer replacing the leg wins the lock; a second retry is rejected',async()=>{const r=run({changed:true});await assert.rejects(r.api.prepareFailedPayPalRetry('RF123','LEG123','ADMIN'),/changed/);assert.equal(r.writes.length,0);});
