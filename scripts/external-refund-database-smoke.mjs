import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import ts from 'typescript';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
function load(file, imports={}) {
  const api={};new Function('exports','require',ts.transpileModule(fs.readFileSync(new URL('../lib/refunds/'+file,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(api,name=>{
    if(name==='server-only')return {};if(name==='node:crypto')return crypto;if(name in imports)return imports[name];throw Error('Unexpected import');
  });return api;
}
const db=new PrismaClient();
const id=crypto.randomUUID().replaceAll('-','');
const refundId='RF_SMOKE_'+id, paymentId='PAY_SMOKE_'+id, orderId='ORDER_SMOKE_'+id;
const reference='R'+id,capture='C'+id;
const rollback=Error('EXPECTED_ROLLBACK');
try {
  await db.$transaction(async tx=>{
    const user=await tx.users.findFirst({select:{pidUser:true}});
    if(!user)throw Error('NO_FIXTURE');
    await tx.payments.create({data:{pidPayment:paymentId,pidUser:user.pidUser,payerName:'Rollback-only test',txID:capture,txRef:orderId,paymentStatus:'PAID',paymentType:'PAYPAL',currency:'USD',amount:100,serviceID:orderId,serviceName:'PROCUREMENT'}});
    await tx.refund_records.create({data:{pidRefund:refundId,pidUser:user.pidUser,pidOrder:orderId,amount:'10.00',currency:'USD',refundStatus:'pending',serviceType:'PROCUREMENT',ext1:'ORDER_ADJUSTMENT',ext2:JSON.stringify({version:1,productRetentionRatio:'0.90000000'})}});
    const provider={id:reference,status:'COMPLETED',amount:{currency_code:'USD',value:'10.00'},links:[{rel:'up',href:'https://api-m.paypal.com/v2/payments/captures/'+capture}]};
    const calls=[];
    const api=load('external-paypal.ts',{
      '@/lib/prisma':{prisma:{$executeRaw:tx.$executeRaw.bind(tx),$transaction:fn=>fn(tx)}},
      './money':load('money.ts'),'./paypal-reference':load('paypal-reference.ts'),
      './paypal-client':{paypalRefundRequest:async(...args)=>{calls.push(args);assert.equal(args.length,1);return args[0].startsWith('/captures/')?{id:capture,amount:{currency_code:'USD',value:'100.00'}}:provider;}},
    });
    await api.recordExternalPayPalRefund(reference,capture);
    await api.recordExternalPayPalRefund(reference,capture);
    const [count]=await tx.$queryRaw`SELECT COUNT(*) n FROM refund_events WHERE id=${'PP_EXTERNAL:'+reference}`;
    assert.equal(Number(count.n),1);
    await api.linkExternalPayPalRefund(reference,refundId,'ROLLBACK_TEST');
    await api.linkExternalPayPalRefund(reference,refundId,'ROLLBACK_TEST');
    const [settlement]=await tx.$queryRaw`SELECT status,settlementAmount,reference FROM refund_settlements WHERE refundId=${refundId}`;
    assert.equal(settlement.status,'SETTLED');assert.equal(Number(settlement.settlementAmount),10);assert.equal(settlement.reference,reference);
    const legs=await tx.$queryRaw`SELECT status,providerReference FROM refund_provider_legs WHERE refundId=${refundId}`;
    assert.equal(legs.length,1);assert.equal(legs[0].status,'SETTLED');
    assert.equal((await tx.refund_records.findUnique({where:{pidRefund:refundId}})).refundStatus,'refunded');
    assert.equal((await tx.payments.findUnique({where:{pidPayment:paymentId}})).paymentStatus,'PAID');
    assert.ok(calls.every(call=>call.length===1));
    throw rollback;
  },{timeout:60000}).catch(error=>{if(error!==rollback)throw error;});
  assert.equal(await db.refund_records.count({where:{pidRefund:refundId}}),0);
  assert.equal(await db.payments.count({where:{pidPayment:paymentId}}),0);
  const [remaining]=await db.$queryRaw`SELECT COUNT(*) n FROM refund_events WHERE id=${'PP_EXTERNAL:'+reference} OR id=${'RESOLVED:PP_EXTERNAL:'+reference}`;
  assert.equal(Number(remaining.n),0);
  for(const table of ['refund_settlements','refund_provider_legs']){const [row]=await db.$queryRawUnsafe(`SELECT COUNT(*) n FROM ${table} WHERE refundId=?`,refundId);assert.equal(Number(row.n),0);}
  console.log('PASS: external refund duplicate delivery and linking settled one exact entitlement without reversing payment. All DB fixtures rolled back; provider calls mocked.');
}catch(error){console.error('External refund DB smoke failed:',error.code||error.name, error.meta?.code || '');process.exitCode=1;}finally{await db.$disconnect();}
