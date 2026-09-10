export function paystackEventReversesCommission(
  event: string,
  data: Record<string, unknown> = {},
) {
  return (
    event === 'refund.processed' ||
    event === 'charge.dispute.create' ||
    event === 'charge.dispute.remind' ||
    (event === 'charge.dispute.resolve' && Number(data.refund_amount || 0) > 0)
  );
}

export function paypalEventReversesCommission(event: string) {
  return (
    event === 'PAYMENT.CAPTURE.REFUNDED' ||
    event === 'PAYMENT.CAPTURE.REVERSED' ||
    event === 'PAYMENT.CAPTURE.DENIED' ||
    event === 'PAYMENT.CAPTURE.DECLINED' ||
    event.startsWith('CUSTOMER.DISPUTE.')
  );
}

export function isCancelableAffiliatePayout(status: string) {
  return status === 'REQUESTED' || status === 'FAILED';
}

export function affiliateOrderReferenceForRefund(
  serviceType: string | null | undefined,
  pidOrder: string | null | undefined,
) {
  const order = String(pidOrder || '').trim();
  if (!order) return null;
  const service = String(serviceType || '')
    .trim()
    .toUpperCase()
    .replaceAll('-', '_')
    .replaceAll(' ', '_');
  if (service === 'PROCUREMENT' || service === 'BUY_FROM_CHINESE_WEBSITES') {
    return `procurement:${order}`;
  }
  if (service === 'PAY_SMALL_SMALL') return `pay-small-small:${order}`;
  if (service === 'SHOP' || service === 'PHONES_AND_LAPTOPS')
    return `shop:${order}`;
  if (service === 'SUPPLIER_REPORTS') return `supplier-report:${order}`;
  if (service === 'SUPPLIER_VERIFICATION')
    return `supplier-verification:${order}`;
  return null;
}
