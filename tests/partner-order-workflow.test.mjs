import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { customerProcessingFee } from '../lib/partners/processing-fee.ts';
process.env.AFFILIATE_SECURITY_KEY = Buffer.alloc(32, 9).toString('base64');
process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY = 'sk_live_synthetic_never_sent';
let row, payments = [], orders = [], products = [], ownership = [], requestCount = 0, failProducts = false;
const partner = { id: 'partner-a', slug: 'shop-a', ownerPidUser: 'owner', status: 'ACTIVE', approvedAt: new Date(), country: 'NG', settlementCurrency: 'NGN', kyc: { status: 'VERIFIED' }, storefront: { published: true, receivingAddress: 'Partner Lagos depot' }, bankVerifiedAt: new Date(), paystackSubaccountCode: 'ACCT_synthetic', liveCollectionEnabled: true, settlementPolicy: 'EARNINGS_WALLET', serviceChargeBps: 1500, partnerShareBps: 500, pricingRevision: 2 };
const tx = {
  $queryRaw: async (strings, ...values) => {
    const sql = strings.join('?');
    if (sql.includes('commercial_program_memberships')) return [{ program: 'PARTNER', subjectId: 'partner:partner-a' }];
    if (sql.includes('procurement_partner_customer_orders')) return row && (values[0] === row.id || values[0] === row.checkoutReference) ? [row] : [];
    return [{ id: partner.id }];
  },
  $executeRaw: async (strings, ...values) => {
    const sql = strings.join('?');
    if (sql.startsWith('INSERT INTO procurement_partner_order_events')) return 1;
    if (sql.includes('SET checkoutReference')) Object.assign(row, { checkoutReference: values[0], checkoutCiphertext: values[1], detailsCiphertext: values[2], paymentStatus: 'INITIALIZED' });
    else if (sql.includes('SET checkoutCiphertext')) row.checkoutCiphertext = values[0];
    else if (sql.includes("status = 'pending'")) Object.assign(row, { status: 'pending', paymentStatus: 'PAID', verifiedPaymentReference: values[0], paidRevision: row.revision, partnerReview: 'AWAITING_REVIEW' });
    else if (sql.includes("partnerReview = 'APPROVED'")) Object.assign(row, { partnerReview: 'APPROVED', releasedOrderId: row.id });
    else if (sql.includes("status = 'cancelled'")) Object.assign(row, { status: 'cancelled', revision: row.revision + 1 });
    else throw new Error(sql);
    return 1;
  },
  procurement_partners: { findUnique: async () => partner },
  users: { findUnique: async ({ where }) => ({ userEmail: `${where.pidUser}@example.test`, userFirstname: 'Synthetic', userLastname: 'Test' }) },
  exchange_rate: { findUnique: async () => ({ exNairaToDollar: '1500', exYuanToDollar: '7', exNairaToYuan: '225', vat: '7.5', procurementMinimumOrderNgn: 1000 }) },
  payments: { findFirst: async ({ where }) => payments.find(p => p.txRef === where.txRef), create: async ({ data }) => { payments.push(data); return data; } },
  orders: { create: async ({ data }) => { orders.push(data); return data; } },
  products: { createMany: async ({ data }) => { if (failProducts) throw new Error('Synthetic transaction failure'); products.push(...data); } },
  procurement_partner_orders: { create: async ({ data }) => ownership.push(data) },
};
partner.domains = [{hostname:'shop.example.com',primary:true,status:'READY',verifiedAt:new Date(),readyAt:new Date(),disconnectedAt:null,expiresAt:null}];
globalThis.__partnerFlowDb = { ...tx, $transaction: async callback => {
  const before = structuredClone({ row, payments, orders, products, ownership });
  try { return await callback(tx); } catch (error) { ({ row, payments, orders, products, ownership } = before); throw error; }
} };
const hooks = registerHooks({ resolve(specifier, context, next) {
  if (specifier === './wallet') return {url:'data:text/javascript,export async function creditWallet(db,partnerId,orderId,amount){if(!Number.isSafeInteger(amount)||amount<0)throw new Error("Invalid wallet earning")}',shortCircuit:true};
  if (specifier === 'server-only') return { url: 'data:text/javascript,export{}', shortCircuit: true };
  if (specifier === '@/lib/prisma') return { url: 'data:text/javascript,export const prisma=globalThis.__partnerFlowDb', shortCircuit: true };
  if (specifier === '@/lib/procurement/shippingPricing') return { url: 'data:text/javascript,export async function resolveNewProcurementShippingPricing(){return {countryName:"Nigeria",planName:"Sea",measurementUnit:"CBM",rateCurrency:"NGN",rate:250000,version:2}}', shortCircuit: true };
  if (specifier.startsWith('.') && !/\.(ts|mjs|js)$/.test(specifier)) return next(new URL(`${specifier}.ts`, context.parentURL).href, context);
  return next(specifier, context);
} });
const { encryptKyc, decryptKyc } = await import('../lib/partners/kyc-crypto.ts');
const { initiateCustomerCheckout, commitVerifiedCustomerPayment, approveCustomerOrder, cancelCustomerDraft } = await import('../lib/partners/order-workflow.ts');
const { priceCustomerOrder } = await import('../lib/partners/order-cost.ts');
hooks.deregister();
const input = { orderName: 'School bags', destinationCountry: 'NG-id', shippingPlan: 'sea-id', currencyType: 'CNY', products: [{ productName: 'Bag', productLink: 'https://detail.1688.com/offer/123.html', productPrice: 70, productQuantity: 10, shippingMeasurePerUnit: 0.01, productInfo: 'Blue, large' }] };
row = { id: 'PCUST_synthetic', partnerId: partner.id, customerPidUser: 'customer', status: 'saved', revision: 1, paymentStatus: 'UNPAID', partnerReview: 'NOT_READY', releasedOrderId: null, checkoutReference: null, checkoutCiphertext: null, detailsCiphertext: encryptKyc(Buffer.from(JSON.stringify({ input, receivingAddress: 'Old depot', pricingRevision: 1 })), 'customer-order:partner-a:PCUST_synthetic').toString('base64') };
const decode = () => JSON.parse(decryptKyc(Buffer.from(row.checkoutCiphertext, 'base64'), 'customer-checkout:partner-a:PCUST_synthetic').toString());
globalThis.fetch = async (url, options) => {
  assert.equal(url, 'https://api.paystack.co/transaction/initialize'); requestCount++;
  const body = JSON.parse(options.body), checkout = decode();
  assert.equal(body.transaction_charge, undefined);
  assert.equal(body.amount, checkout.cost.orderTotalMinor + checkout.processingFeeMinor);
  assert.equal(body.subaccount, undefined); assert.equal(checkout.settlementPolicy, "EARNINGS_WALLET");
  assert.deepEqual(body.channels, ['bank', 'ussd']);
  return Response.json({ status: true, data: { reference: body.reference, authorization_url: 'https://checkout.paystack.com/synthetic' } });
};
test('fee gross-up covers published local tariff, threshold and cap', () => {
  for (const net of [1, 10000, 246249, 246250, 250000, 1000000, 12666667, 99999999]) {
    const fee = customerProcessingFee(net), gross = net + fee;
    const tariff = Math.min(200000, Math.ceil(gross * 0.015) + (gross < 250000 ? 0 : 10000));
    assert.ok(gross - tariff >= net, `${net}: fee shortfall`);
    assert.ok(fee <= 200000);
  }
  for (const bad of [0, -1, NaN, Infinity, 1.5]) assert.throws(() => customerProcessingFee(bad));
});
test('new orders can start empty but cannot be paid before products are added', () => {
  const cost = priceCustomerOrder({ ...input, products: [] }, { version: 2, measurementUnit: 'KG', rate: 10, rateCurrency: 'USD', countryName: 'Nigeria', planName: 'Air' }, { ngnPerUsd: 1500, cnyPerUsd: 7, vatPercent: 7.5, serviceChargeBps: 1500, partnerShareBps: 500, minimumOrderNgn: 0 });
  assert.equal(cost.orderTotalMinor, 0); assert.equal(cost.meetsMinimum, false); assert.equal(cost.partnerEarningsMinor, 0);
});
test('checkout, verification and partner release enforce ownership, amount and idempotency', async () => {
  await assert.rejects(approveCustomerOrder('owner', row.id, 1), { status: 409 });
  await assert.rejects(initiateCustomerCheckout('shop-a', 'intruder', row.id, 1, 0), { status: 404 });
  await assert.rejects(initiateCustomerCheckout('shop-a', 'customer', row.id, 2, 0), { status: 409 });
  partner.liveCollectionEnabled = false;
  await assert.rejects(initiateCustomerCheckout('shop-a', 'customer', row.id, 1, 0), { status: 409 });
  partner.liveCollectionEnabled = true;
  await assert.rejects(initiateCustomerCheckout('shop-a', 'customer', row.id, 1, 1), { status: 409 });
  // 157,500 direct-RMB products + 32,500 shipping + 23,625 service + 1,771.88 VAT + 2,000 fee.
  const result = await initiateCustomerCheckout('shop-a', 'customer', row.id, 1, 21739688);
  assert.equal(result.url, 'https://checkout.paystack.com/synthetic');
  assert.equal((await initiateCustomerCheckout('shop-a', 'customer', row.id, 1, 21739688)).url, result.url);
  assert.equal(requestCount, 1); assert.equal(orders.length, 0); assert.equal(payments.length, 0);
  const checkout = decode();
  const receipt = { status: 'success', reference: row.checkoutReference, amount: checkout.totalMinor, currency: 'NGN', domain: 'live', orderId: row.id, transactionId: '1234567890' };
  for (const patch of [{ amount: receipt.amount - 1 }, { domain: 'test' }, { orderId: 'other' }, { status: 'pending' }, { currency: 'USD' }]) await assert.rejects(commitVerifiedCustomerPayment(receipt.reference, { ...receipt, ...patch }), { status: 409 });
  await commitVerifiedCustomerPayment(receipt.reference, receipt);
  assert.equal((await commitVerifiedCustomerPayment(receipt.reference, receipt)).duplicate, true);
  assert.equal(payments.length, 1); assert.equal(orders.length, 0);
  await assert.rejects(approveCustomerOrder('other-owner', row.id, 1), { status: 404 });
  failProducts = true;
  await assert.rejects(approveCustomerOrder('owner', row.id, 1), /Synthetic transaction failure/);
  assert.equal(orders.length, 0); assert.equal(row.releasedOrderId, null);
  failProducts = false;
  await approveCustomerOrder('owner', row.id, 1);
  assert.equal((await approveCustomerOrder('owner', row.id, 1)).duplicate, true);
  assert.equal(orders.length, 1); assert.equal(products.length, 1); assert.equal(ownership.length, 1);
  assert.equal(orders[0].pidUser, 'owner'); assert.equal(orders[0].shippingAddress, 'Partner Lagos depot');
  assert.equal(orders[0].status, 'pending'); assert.equal(ownership[0].partnerEarningsMinor, 787500n);
  assert.equal(orders[0].productPricingVersion, 2); assert.equal(orders[0].exchangeRate3, '225');
  assert.equal(ownership[0].pricingRevision, 2);
});
test('saved cancellation cannot cross customers or touch paid/initialized orders', async () => {
  const previous = structuredClone(row);
  row = { ...row, status: 'saved', paymentStatus: 'UNPAID', checkoutReference: null, verifiedPaymentReference: null, releasedOrderId: null };
  await assert.rejects(cancelCustomerDraft('shop-a', 'intruder', row.id, row.revision), { status: 404 });
  row.paymentStatus = 'INITIALIZED';
  await assert.rejects(cancelCustomerDraft('shop-a', 'customer', row.id, row.revision), { status: 409 });
  row.paymentStatus = 'UNPAID';
  const result = await cancelCustomerDraft('shop-a', 'customer', row.id, row.revision);
  assert.equal(result.status, 'cancelled');
  row = previous;
});
