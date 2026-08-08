export const TERMINAL_REPORT_ORDER_STATUSES = [
  'refunded',
  'reversed',
  'revoked',
  'disputed',
] as const;

export type BlockedReportOrderStatus =
  (typeof TERMINAL_REPORT_ORDER_STATUSES)[number];

export function isTerminalReportOrderStatus(status: string) {
  return (TERMINAL_REPORT_ORDER_STATUSES as readonly string[]).includes(status);
}

export function resolvePaystackAccessStatus(
  event: string,
  amount: number,
  orderAmount: number,
): BlockedReportOrderStatus | null {
  if (event === 'refund.processed') {
    return amount >= orderAmount ? 'refunded' : 'disputed';
  }
  if (event.startsWith('charge.dispute.')) {
    return event === 'charge.dispute.resolve' && amount >= orderAmount
      ? 'refunded'
      : 'disputed';
  }
  return null;
}

export function resolvePayPalAccessStatus(
  event: string,
): BlockedReportOrderStatus | null {
  if (event === 'PAYMENT.CAPTURE.REFUNDED') return 'refunded';
  if (event === 'PAYMENT.CAPTURE.REVERSED') return 'reversed';
  if (event.startsWith('CUSTOMER.DISPUTE.')) return 'disputed';
  if (
    event === 'PAYMENT.CAPTURE.DENIED' ||
    event === 'PAYMENT.CAPTURE.DECLINED'
  ) {
    return 'revoked';
  }
  return null;
}

export function reportDownloadRequiresAccount(input: {
  hasToken: boolean;
  expiresAt: Date | null;
  now?: Date;
}) {
  const now = input.now || new Date();
  return (
    !input.hasToken ||
    !input.expiresAt ||
    input.expiresAt.getTime() <= now.getTime()
  );
}
