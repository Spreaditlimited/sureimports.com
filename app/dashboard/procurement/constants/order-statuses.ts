export type ProcurementStatusItem = {
  title: string;
  description: string;
  value: string;
  href: string;
  countKey:
    | 'savedOrderCount'
    | 'pendingOrderCount'
    | 'approvedOrderCount'
    | 'payForShippingOrderCount'
    | 'inTransitOrderCount'
    | 'readyForPickupOrderCount'
    | 'completedOrdersCount'
    | 'onHoldOrdersCount'
    | 'bankPendingSavedOrdersCount'
    | 'bankPendingShippingOrdersCount'
    | 'cancelledOrdersCount';
};

export const PROCUREMENT_STATUS_ITEMS: ProcurementStatusItem[] = [
  {
    title: 'Draft',
    description: 'Add products, review your order and pay when ready.',
    value: 'saved',
    href: '/dashboard/procurement/view-orders/saved',
    countKey: 'savedOrderCount',
  },
  {
    title: 'Awaiting approval',
    description: 'Your payment is confirmed. Your order is awaiting review.',
    value: 'pending',
    href: '/dashboard/procurement/view-orders/pending',
    countKey: 'pendingOrderCount',
  },
  {
    title: 'Approved for purchase',
    description: 'Your order has passed review and is approved for purchase.',
    value: 'approved',
    href: '/dashboard/procurement/view-orders/approved',
    countKey: 'approvedOrderCount',
  },
  {
    title: 'Shipping payment due',
    description: 'Review your confirmed shipping charges and pay any balance due.',
    value: 'pay-for-shipping',
    href: '/dashboard/procurement/view-orders/pay-for-shipping',
    countKey: 'payForShippingOrderCount',
  },
  {
    title: 'In transit',
    description: 'Shipping payment is confirmed. Open your order for available tracking updates.',
    value: 'in-transit',
    href: '/dashboard/procurement/view-orders/in-transit',
    countKey: 'inTransitOrderCount',
  },
  {
    title: 'Ready for collection',
    description: 'Your order is ready for collection. Check the collection instructions.',
    value: 'ready-for-pickup',
    href: '/dashboard/procurement/view-orders/ready-for-pickup',
    countKey: 'readyForPickupOrderCount',
  },
  {
    title: 'Completed',
    description: 'Your order has been marked complete.',
    value: 'completed',
    href: '/dashboard/procurement/view-orders/completed',
    countKey: 'completedOrdersCount',
  },
  {
    title: 'On hold',
    description: 'Your order is paused. Open it to review the message and next steps.',
    value: 'on-hold',
    href: '/dashboard/procurement/view-orders/on-hold',
    countKey: 'onHoldOrdersCount',
  },
  {
    title: 'Order payment under review',
    description: 'Your bank payment is awaiting confirmation.',
    value: 'bank-pending-saved-orders',
    href: '/dashboard/procurement/view-orders/bank-pending-saved-orders',
    countKey: 'bankPendingSavedOrdersCount',
  },
  {
    title: 'Shipping payment under review',
    description: 'Your shipping bank payment is awaiting confirmation.',
    value: 'bank-pending-shipping-orders',
    href: '/dashboard/procurement/view-orders/bank-pending-shipping-orders',
    countKey: 'bankPendingShippingOrdersCount',
  },
  {
    title: 'Cancelled',
    description: 'Your order has been cancelled. Open it to review any refund details.',
    value: 'cancelled',
    href: '/dashboard/procurement/view-orders/cancelled',
    countKey: 'cancelledOrdersCount',
  },
];

export function procurementStatusLabel(status: string) {
  return PROCUREMENT_STATUS_ITEMS.find(item => item.value === status)?.title || (status === 'merged' ? 'Merged' : status.replaceAll('-', ' '));
}
