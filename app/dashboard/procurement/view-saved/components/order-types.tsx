'use client';
import ApprovedOrders from '@/content/general-procurement/approved-orders.json';
import CompletedOrders from '@/content/general-procurement/completed-orders.json';
import PendingOrders from '@/content/general-procurement/pending-orders.json';
import SavedOrders from '@/content/general-procurement/saved-orders.json';
import PayForShipping from '@/content/general-procurement/pay-for-shipping.json';
import InTransit from '@/content/general-procurement/in-transit-orders.json';
import ReadyFroPickup from '@/content/general-procurement/ready-for-pickup.json';
import OnHoldOrders from '@/content/general-procurement/on-hold-orders.json';
export const OrderTypeItems = [
  {
    title: 'Saved Orders',
    count: SavedOrders.Orders.length,
    href: '/dashboard/procurement/view-saved',
    color: 'bg-orange-500',
  },
  {
    title: 'Pending Orders',
    count: PendingOrders.Orders.length,
    href: '/dashboard/procurement/view-saved/pending-orders',
    color: 'bg-green-500',
  },
  {
    title: 'Approved Orders',
    count: ApprovedOrders.Orders.length,
    href: '/dashboard/procurement/view-saved/approved-orders',
    color: 'bg-orange-500',
  },
  {
    title: 'Pay For Shipping',
    count: PayForShipping.Orders.length,
    href: '/dashboard/procurement/view-saved/pay-for-shipping',
    color: 'bg-blue-500',
  },
  {
    title: 'In-Transit',
    count: InTransit.Orders.length,
    href: '/dashboard/procurement/view-saved/in-transit',
    color: 'bg-orange-500',
  },
  {
    title: 'Ready For Pickup',
    count: ReadyFroPickup.Orders.length,
    href: '/dashboard/procurement/view-saved/ready-for-pickup',
    color: 'bg-orange-500',
  },
  {
    title: 'Completed Orders',
    count: CompletedOrders.Orders.length,
    href: '/dashboard/procurement/view-saved/completed-orders',
    color: 'bg-orange-500',
  },
  {
    title: 'On-Hold Orders',
    count: OnHoldOrders.Orders.length,
    href: '/dashboard/procurement/view-saved/on-hold-orders',
    color: 'bg-orange-500',
  },
];
