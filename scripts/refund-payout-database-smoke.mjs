import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
const api = {};
new Function('exports', 'require', ts.transpileModule(fs.readFileSync(new URL('../lib/refunds/payout-guard.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(api, () => ({}));
const db = new PrismaClient();
const refundId = 'GUARD_SMOKE_' + randomUUID();
const rollback = new Error('EXPECTED_ROLLBACK');
try {
  await db.$transaction(async tx => {
    const affiliate = await tx.affiliate_accounts.findFirst({ select: { id: true } });
    const service = await tx.affiliate_program_services.findFirst({ select: { id: true } });
    if (!affiliate || !service) throw new Error('NO_ELIGIBLE_FIXTURE');
    const conversion = await tx.affiliate_conversions.create({ data: {
      pidConversion: refundId, affiliateId: affiliate.id, serviceId: service.id,
      externalOrderReference: 'procurement:' + refundId, paymentCurrency: 'USD',
      externalPaymentReference: 'paypal:' + refundId,
      grossAmount: 100, eligibleAmount: 100, commissionCurrency: 'USD', commissionAmount: 20,
      status: 'AVAILABLE',
    } });
    await api.assertRefundsReconciled(tx, conversion.affiliateId, conversion.commissionCurrency);
    await api.assertNoUnreservedRefundDeductions(tx, conversion.affiliateId, conversion.commissionCurrency);
    const orderId = conversion.externalOrderReference.slice('procurement:'.length);
    await tx.$executeRaw`INSERT INTO refund_records (pidRefund,pidOrder,amount,currency,refundStatus,serviceType,ext1) VALUES (${refundId},${orderId},'1.00',${conversion.commissionCurrency},'pending','PROCUREMENT','ORDER_ADJUSTMENT')`;
    await assert.rejects(api.assertRefundsReconciled(tx, conversion.affiliateId, conversion.commissionCurrency), /customer refund/);
    await tx.$executeRaw`INSERT INTO refund_events (id,refundId,eventType,actorPid) VALUES (${'COMMISSION:'+refundId},${refundId},'COMMISSION_ADJUSTED','ROLLBACK_TEST')`;
    await api.assertRefundsReconciled(tx, conversion.affiliateId, conversion.commissionCurrency);
    const externalId = 'PP_EXTERNAL:' + refundId;
    const evidence = JSON.stringify({ captureId: refundId, orderId: '', currency: 'USD', amount: '1.00' });
    await tx.$executeRaw`INSERT INTO refund_events (id,refundId,eventType,actorPid,detailsJson) VALUES (${externalId},${refundId},'EXTERNAL_PAYPAL_REFUND','ROLLBACK_TEST',${evidence})`;
    await assert.rejects(api.assertRefundsReconciled(tx, conversion.affiliateId, conversion.commissionCurrency), /customer refund/);
    await tx.$executeRaw`INSERT INTO refund_events (id,refundId,eventType,actorPid,detailsJson) VALUES (${'RESOLVED:' + externalId},${refundId},'EXTERNAL_REFUND_LINKED','ROLLBACK_TEST','{}')`;
    await api.assertRefundsReconciled(tx, conversion.affiliateId, conversion.commissionCurrency);
    await tx.$executeRaw`INSERT INTO affiliate_refund_adjustments (refundId,conversionId,amount,currency) VALUES (${refundId},${conversion.id},0.01,${conversion.commissionCurrency})`;
    await assert.rejects(api.assertNoUnreservedRefundDeductions(tx, conversion.affiliateId, conversion.commissionCurrency), /Cancel this payout/);
    throw rollback;
  }, { timeout: 15000 }).catch(error => { if (error !== rollback) throw error; });
  for (const table of ['refund_records','refund_events','affiliate_refund_adjustments']) {
    const column = table === 'refund_records' ? 'pidRefund' : 'refundId';
    const [row] = await db.$queryRawUnsafe(`SELECT COUNT(*) n FROM ${table} WHERE ${column}=?`, refundId);
    assert.equal(Number(row.n), 0);
  }
  assert.equal(await db.affiliate_conversions.count({ where: { pidConversion: refundId } }), 0);
  console.log('PASS: source-refund backlog, external PayPal review and late-deduction guards exercised against DB. All fixture rows rolled back; no provider calls or real balances changed.');
} catch (error) {
  console.error('Refund payout smoke did not pass:', error.code || (error.message === 'NO_ELIGIBLE_FIXTURE' ? 'NO_ELIGIBLE_FIXTURE' : error.name));
  process.exitCode = 1;
} finally { await db.$disconnect(); }
