import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
try {
  const totals = await db.$queryRaw`SELECT COALESCE(currency,'UNSPECIFIED') currency,refundStatus,COUNT(*) records,SUM(CAST(amount AS DECIMAL(20,2))) amount FROM refund_records GROUP BY currency,refundStatus`;
  const candidates = await db.$queryRaw`SELECT r.pidRefund,r.currency,r.refundStatus,c.countryName destination,COUNT(DISTINCT p.currency) paymentCurrencies,GROUP_CONCAT(DISTINCT p.currency) paidCurrencies FROM refund_records r JOIN orders o ON o.pidOrder=r.pidOrder LEFT JOIN country c ON c.pidCountry=o.destinationCountry LEFT JOIN payments p ON p.serviceID=o.pidOrder AND p.pidUser=r.pidUser AND p.paymentStatus='PAID' WHERE r.serviceType='PROCUREMENT' AND r.currency='NGN' AND c.countryName IS NOT NULL AND LOWER(c.countryName) NOT IN ('nigeria','ng') GROUP BY r.pidRefund,r.currency,r.refundStatus,c.countryName`;
  const settlements = await db.$queryRaw`SELECT sourceCurrency,settlementCurrency,status,COUNT(*) records,SUM(sourceAmount) sourceAmount,SUM(settlementAmount) settledAmount FROM refund_settlements GROUP BY sourceCurrency,settlementCurrency,status`;
  console.log(JSON.stringify({ readOnly: true, totals, historicalCurrencyReview: candidates, settlements }, (_key,value) => typeof value === 'bigint' ? value.toString() : value, 2));
} catch (error) {
  console.error('Refund audit failed:', error.code || error.name);
  process.exitCode = 1;
} finally { await db.$disconnect(); }
