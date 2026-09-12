import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
const hooks = registerHooks({ resolve(specifier, context, next) {
  if (specifier === './procurement-request-policy') return next(new URL(`${specifier}.ts`, context.parentURL).href, context);
  return next(specifier, context);
} });
const { customerOrderSchema, partnerReleaseBlockReason, customerOrderStages } = await import('../lib/partners/customer-order-policy.ts');
hooks.deregister();
test('customer ordering mirrors procurement price/quantity/measurement fields, never client-owned payment or approval', () => {
  const input = { orderName: 'School bags', destinationCountry: 'nigeria-id', shippingPlan: 'sea-id', currencyType: 'CNY', products: [{ productName: 'Bag', productLink: 'https://detail.1688.com/offer/123.html', productPrice: 12, productQuantity: 10, shippingMeasurePerUnit: 0.01, productInfo: 'Blue, large' }] };
  assert.equal(customerOrderSchema.safeParse(input).success, true);
  for (const extra of [{ partnerId: 'other' }, { paymentStatus: 'PAID' }, { partnerReview: 'APPROVED' }, { shippingAddress: 'customer address' }, { serviceChargeBps: 1 }]) assert.equal(customerOrderSchema.safeParse({ ...input, ...extra }).success, false);
  assert.equal(customerOrderSchema.safeParse({ ...input, products: [{ ...input.products[0], productPrice: 0 }] }).success, false);
  assert.equal(customerOrderSchema.safeParse({ ...input, products: [{ ...input.products[0], shippingMeasurePerUnit: 0 }] }).success, false);
});
test('SI processing requires confirmed payment for the current revision plus partner approval', () => {
  const paid = { status: 'pending', paymentStatus: 'PAID', verifiedPaymentReference: 'verified-ref', partnerReview: 'APPROVED', revision: 2, paidRevision: 2 };
  assert.equal(partnerReleaseBlockReason(paid), null);
  assert.equal(partnerReleaseBlockReason({ ...paid, partnerReview: 'AWAITING_REVIEW' }), 'PARTNER_APPROVAL_REQUIRED');
  for (const override of [{ paymentStatus: 'UNPAID' }, { verifiedPaymentReference: null }, { paidRevision: 1 }]) assert.equal(partnerReleaseBlockReason({ ...paid, ...override }), 'PAYMENT_NOT_CONFIRMED');
  for (const status of customerOrderStages.filter(status => status !== 'pending')) assert.equal(partnerReleaseBlockReason({ ...paid, status }), 'ORDER_NOT_PENDING');
});
