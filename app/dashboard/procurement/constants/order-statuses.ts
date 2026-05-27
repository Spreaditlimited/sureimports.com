export type ProcurementStatusItem = {
  title: string;
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
    title: 'Saved',
    value: 'saved',
    href: '/dashboard/procurement/view-orders/saved',
    countKey: 'savedOrderCount',
  },
  {
    title: 'Pending',
    value: 'pending',
    href: '/dashboard/procurement/view-orders/pending',
    countKey: 'pendingOrderCount',
  },
  {
    title: 'Approved',
    value: 'approved',
    href: '/dashboard/procurement/view-orders/approved',
    countKey: 'approvedOrderCount',
  },
  {
    title: 'Pay Shipping',
    value: 'pay-for-shipping',
    href: '/dashboard/procurement/view-orders/pay-for-shipping',
    countKey: 'payForShippingOrderCount',
  },
  {
    title: 'In-Transit',
    value: 'in-transit',
    href: '/dashboard/procurement/view-orders/in-transit',
    countKey: 'inTransitOrderCount',
  },
  {
    title: 'Ready For Pickup',
    value: 'ready-for-pickup',
    href: '/dashboard/procurement/view-orders/ready-for-pickup',
    countKey: 'readyForPickupOrderCount',
  },
  {
    title: 'Completed',
    value: 'completed',
    href: '/dashboard/procurement/view-orders/completed',
    countKey: 'completedOrdersCount',
  },
  {
    title: 'On-Hold',
    value: 'on-hold',
    href: '/dashboard/procurement/view-orders/on-hold',
    countKey: 'onHoldOrdersCount',
  },
  {
    title: 'Bank Pending (Saved)',
    value: 'bank-pending-saved-orders',
    href: '/dashboard/procurement/view-orders/bank-pending-saved-orders',
    countKey: 'bankPendingSavedOrdersCount',
  },
  {
    title: 'Bank Pending (Shipping)',
    value: 'bank-pending-shipping-orders',
    href: '/dashboard/procurement/view-orders/bank-pending-shipping-orders',
    countKey: 'bankPendingShippingOrdersCount',
  },
  {
    title: 'Cancelled',
    value: 'cancelled',
    href: '/dashboard/procurement/view-orders/cancelled',
    countKey: 'cancelledOrdersCount',
  },
];
