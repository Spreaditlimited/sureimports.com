import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const exports = {};
new Function('exports','require',ts.transpileModule(fs.readFileSync(new URL('../lib/refunds/payout-guard.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(exports,()=>({}));

test('an unresolved source refund blocks payout even if a reconciliation batch completed',async()=>{
  let parameters;
  const tx={$queryRaw:async(sql,...values)=>{parameters=values;assert.match(sql.join(''),/NOT EXISTS/);return [{pidRefund:'BACKLOG'}];}};
  await assert.rejects(exports.assertRefundsReconciled(tx,42,'USD'),/customer refund is being reviewed/);
  assert.deepEqual(parameters,[42,'USD']);
});
test('fully reconciled refunds allow the payout guard to pass',async()=>{
  await exports.assertRefundsReconciled({$queryRaw:async()=>[]},42,'NGN');
});
test('unresolved external provider refund blocks payout after internal refunds are reconciled',async()=>{
  const tx={$queryRaw:async(sql,...values)=>{const query=sql.join('');if(query.includes('EXTERNAL_PAYPAL_REFUND')){assert.deepEqual(values,[42,'USD']);assert.match(query,/RESOLVED:/);return [{id:'PP_EXTERNAL:REFUND123'}];}return [];}};
  await assert.rejects(exports.assertRefundsReconciled(tx,42,'USD'),/customer refund is being reviewed/);
});
test('late unreserved deductions block provider submission',async()=>{
  await assert.rejects(exports.assertNoUnreservedRefundDeductions({$queryRaw:async()=>[{refundId:'LATE'}]},42,'USD'),/Cancel this payout/);
});
test('deductions already reserved or zero do not block submission',async()=>{
  const tx={$queryRaw:async sql=>{assert.match(sql.join(''),/a.payoutId IS NULL AND a.amount > 0/);return [];}};
  await exports.assertNoUnreservedRefundDeductions(tx,42,'NGN');
});
