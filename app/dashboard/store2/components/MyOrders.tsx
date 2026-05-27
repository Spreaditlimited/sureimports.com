// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import ImageWithFallback from '../../../../public/favicon.png';
import svgPaths from '../imports/svg-91ncinf66q';

import imgSureimportsReverse from '../../../../public/favicon.png';
import { imgGroup, imgImage15 } from '../imports/svg-yzqxa';
import OrderDetailsDialog from './OrderDetailsDialog';
import CancelOrderDialog from './CancelOrderDialog';
import CancelSuccessDialog from './CancelSuccessDialog';
import { ThemeToggle } from './ThemeToggle';
import type { Order, OrderTab } from './App';

interface MyOrdersProps {
  onBackToStore: () => void;
  onBulkBuyer: () => void;
  onGoToWallet: () => void;
  orders?: Record<OrderTab, Order[]>;
  onOrdersUpdate: (orders: Record<OrderTab, Order[]>) => void;
  onOrderRefund: (refundAmount: number, orderNumber: string) => void;
}

// Types are now imported from App.tsx

// Helper function to calculate business days
const addBusinessDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  let addedDays = 0;

  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      addedDays++;
    }
  }

  return result;
};

// Helper function to format date
const formatDate = (date: Date): string => {
  return date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replace(/\//g, ' - ');
};

const mockOrders: Record<OrderTab, Order[]> = {
  upcoming: [
    {
      id: '1',
      number: '#1234',
      product: {
        name: 'HP EliteBook x360 1040 G8',
        image:
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center',
      },
      quantity: 2,
      price: '₦967,500.00',
      status: 'shipped',
      progress: 50,
      orderDate: '02 - 08 - 2025',
      expectedDelivery: formatDate(addBusinessDays(new Date('2025-08-02'), 10)),
    },
    {
      id: '2',
      number: '#1235',
      product: {
        name: 'MacBook Air 13.6" M2 Chip 8GB 512GB',
        image:
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&crop=center',
      },
      quantity: 1,
      price: '₦1,147,500.00',
      status: 'arrived',
      progress: 75,
      orderDate: '01 - 08 - 2025',
      expectedDelivery: formatDate(addBusinessDays(new Date('2025-08-01'), 10)),
    },
    {
      id: '6',
      number: '#1236',
      product: {
        name: 'FAYA Wireless Earbuds Pro',
        image:
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop&crop=center',
      },
      quantity: 2,
      price: '₦45,000.00',
      status: 'confirmed',
      progress: 25,
      orderDate: '06 - 08 - 2025',
      expectedDelivery: formatDate(addBusinessDays(new Date('2025-08-06'), 10)),
    },
    {
      id: '8',
      number: '#1238',
      product: {
        name: 'Samsung Galaxy S24 Ultra 512GB',
        image:
          'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&crop=center',
      },
      quantity: 1,
      price: '₦1,650,000.00',
      status: 'confirmed',
      progress: 25,
      orderDate: '07 - 08 - 2025',
      expectedDelivery: formatDate(addBusinessDays(new Date('2025-08-07'), 10)),
    },
    {
      id: '9',
      number: '#1239',
      product: {
        name: 'iPhone 15 Pro Max 256GB - Natural Titanium',
        image:
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&crop=center',
      },
      quantity: 1,
      price: '₦1,850,000.00',
      status: 'confirmed',
      progress: 25,
      orderDate: '08 - 08 - 2025',
      expectedDelivery: formatDate(addBusinessDays(new Date('2025-08-08'), 10)),
    },
  ],
  previous: [
    {
      id: '7',
      number: '#1237',
      product: {
        name: 'iPhone 14 128GB - Midnight',
        image:
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&crop=center',
      },
      quantity: 1,
      price: '₦1,200,000.00',
      status: 'delivered',
      progress: 100,
      orderDate: '15 - 07 - 2025',
      expectedDelivery: '29 - 07 - 2025',
    },
  ],
  returned: [
    {
      id: '3',
      number: '#1230',
      product: {
        name: 'Samsung Galaxy S24 Ultra',
        image:
          'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&crop=center',
      },
      quantity: 1,
      price: '₦1,650,000.00',
      status: 'delivered',
      progress: 100,
      orderDate: '10 - 07 - 2025',
      expectedDelivery: '24 - 07 - 2025',
    },
    {
      id: '4',
      number: '#1231',
      product: {
        name: 'iPhone 15 Pro Max',
        image:
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&crop=center',
      },
      quantity: 1,
      price: '₦1,850,000.00',
      status: 'shipped-back',
      progress: 71, // 5/7 * 100
      orderDate: '05 - 07 - 2025',
      expectedDelivery: '19 - 07 - 2025',
    },
    {
      id: '5',
      number: '#1232',
      product: {
        name: 'iPad Pro 12.9" M2',
        image:
          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&crop=center',
      },
      quantity: 1,
      price: '₦1,450,000.00',
      status: 'replaced',
      progress: 57, // 4/7 * 100
      orderDate: '20 - 06 - 2025',
      expectedDelivery: '04 - 07 - 2025',
    },
  ],
  cancelled: [],
};

const regularOrderSteps = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'arrived', label: 'Arrived' },
  { key: 'delivered', label: 'Delivered' },
];

const returnedOrderSteps = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'arrived', label: 'Arrived' },
  { key: 'replaced', label: 'Replaced/Repaired' },
  { key: 'shipped-back', label: 'Shipped back' },
  { key: 'arrived-back', label: 'Arrived' },
  { key: 'delivered', label: 'Delivered' },
];

const getOrderSteps = (isReturned: boolean) => {
  return isReturned ? returnedOrderSteps : regularOrderSteps;
};

const getStepIndex = (status: string, isReturned: boolean) => {
  const steps = getOrderSteps(isReturned);
  return steps.findIndex((step) => step.key === status);
};

// Mobile Components
function MobileOrderProgressBar({
  status,
  progress,
  isReturned = false,
}: {
  status: string;
  progress: number;
  isReturned?: boolean;
}) {
  const orderSteps = getOrderSteps(isReturned);
  const currentStepIndex = getStepIndex(status, isReturned);

  return (
    <div className="mt-4">
      {/* Progress Bar Background */}
      <div className="relative">
        <div className="h-2 w-full rounded-[20px] bg-muted" />
        <div
          className="absolute left-0 top-0 h-2 rounded-[20px] bg-indigo-800 dark:bg-primary"
          style={{ width: `${progress}%` }}
        />

        {/* Progress Dots */}
        <div
          className="absolute left-0 top-0 flex w-full items-center justify-between"
          style={{ transform: 'translateY(-5px)' }}
        >
          {orderSteps.map((step, index) => (
            <div key={step.key} className="relative">
              <div
                className={`${isReturned ? 'size-[16px]' : 'size-[22px]'} flex items-center justify-center rounded-full ${
                  index <= currentStepIndex
                    ? 'bg-indigo-800 dark:bg-primary'
                    : 'border border-border bg-muted'
                }`}
              >
                {index <= currentStepIndex ? (
                  <div className={isReturned ? 'h-3 w-3' : 'h-4 w-4'}>
                    <svg
                      className="block size-full"
                      fill="none"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M4.83398 7.66661L6.72065 9.55327L10.5007 5.77995"
                        stroke="white"
                        className="dark:stroke-primary-foreground"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className={isReturned ? 'h-3 w-3' : 'h-4 w-4'}>
                    <svg
                      className="block size-full"
                      fill="none"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M4.83398 7.66661L6.72065 9.55327L10.5007 5.77995"
                        stroke="currentColor"
                        className="text-muted-foreground"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Labels */}
      <div className="mt-2 flex justify-between text-xs font-medium text-foreground">
        {orderSteps.map((step) => (
          <span
            key={step.key}
            className={`text-center ${isReturned ? 'text-[10px]' : ''}`}
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function MobileOrderCard({
  order,
  onOrderDetailsClick,
  onCancelOrderClick,
  isReturned = false,
}: {
  order: Order;
  onOrderDetailsClick: (orderId: string) => void;
  onCancelOrderClick: (orderId: string) => void;
  isReturned?: boolean;
}) {
  // Determine if order can be cancelled (only if status is 'confirmed')
  const canCancel = order.status === 'confirmed';

  // Format status display for special returned order statuses
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'shipped-back':
        return 'Shipped Back';
      case 'arrived-back':
        return 'Arrived';
      case 'replaced':
        return 'Replaced/Repaired';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="space-y-4 rounded-[15px] border border-border bg-card p-5">
      {/* Order Summary */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="font-semibold text-foreground">
            Order No. : {order.number}
          </p>
          <p className="font-medium text-foreground">
            Status : {getStatusDisplay(order.status)}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold text-foreground">Total : {order.price}</p>
          <p className="font-medium text-foreground">
            Date : {order.orderDate}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <MobileOrderProgressBar
        status={order.status}
        progress={order.progress}
        isReturned={isReturned}
      />

      {/* Ordered Items */}
      <div className="space-y-4">
        <p className="font-medium text-foreground">Ordered Item's :</p>

        {/* First Item */}
        <div className="flex items-center justify-between">
          <div className="h-[124px] w-[124px] overflow-hidden rounded-[10px] border border-border bg-muted">
            <ImageWithFallback
              src={order.product.image}
              alt={order.product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="ml-4 flex-1 space-y-1">
            <p className="font-medium text-foreground">{order.product.name}</p>
            <p className="text-center font-medium text-foreground">
              Quantity : {order.quantity}
            </p>
            <p className="text-center font-semibold text-foreground">
              {order.price}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={() => onOrderDetailsClick(order.id)}
            className="flex-1 rounded-[10px] bg-indigo-800 px-2.5 py-2 font-normal text-white dark:bg-primary dark:text-primary-foreground"
          >
            Order Details
          </button>
          <button
            onClick={() => canCancel && onCancelOrderClick(order.id)}
            className={`flex-1 rounded-[10px] px-2.5 py-2 font-normal transition-colors ${
              canCancel
                ? 'border border-red-400 bg-red-50 text-red-400 hover:bg-red-100 dark:border-red-500 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30'
                : 'cursor-not-allowed border border-border bg-muted text-muted-foreground'
            }`}
            disabled={!canCancel}
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileHeader({ onBackToStore }: { onBackToStore: () => void }) {
  return (
    <div
      className="relative w-full bg-[#0e0e1f] pb-4 pt-12 dark:bg-card"
      style={{ minHeight: '90px' }}
    >
      {/* Back Button */}
      <button
        onClick={onBackToStore}
        className="absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 transform items-center justify-center"
      >
        <svg
          className="h-6 w-6 text-white dark:text-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 18L9 12L15 6"
          />
        </svg>
      </button>

      {/* Logo */}
      <div
        className="absolute left-16 top-1/2 h-[20px] w-[180px] -translate-y-1/2 transform bg-contain bg-no-repeat"
        style={{ backgroundImage: `url('${imgSureimportsReverse}')` }}
      />

      {/* Theme Toggle */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 transform">
        <ThemeToggle />
      </div>

      {/* Hamburger Menu */}
      <div className="absolute right-4 top-1/2 h-[20px] w-[26px] -translate-y-1/2 transform">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 26 20"
        >
          <path
            d={svgPaths.p26572800}
            fill="white"
            className="dark:fill-foreground"
          />
        </svg>
      </div>
    </div>
  );
}

function MobileTitleWithButtons({
  onBulkBuyer,
  onBackToStore,
}: {
  onBulkBuyer: () => void;
  onBackToStore: () => void;
}) {
  return (
    <div className="bg-background px-5 pb-4 pt-8">
      <div className="mb-4 flex items-start justify-between">
        <h1 className="mr-3 flex-1 text-lg font-semibold text-foreground">
          My Orders
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onBulkBuyer}
            className="flex items-center gap-1 rounded-lg bg-purple-600 px-2 py-1 transition-colors hover:bg-purple-700"
          >
            <div className="h-3 w-3">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16 11V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V11M5 9H19L18 21H6L5 9Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 12V16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12V16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 12V16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xs font-medium text-white">Bulk?</span>
          </button>
          <button
            onClick={onBackToStore}
            className="flex items-center gap-1 rounded-lg bg-slate-600 px-2 py-1 transition-colors hover:bg-slate-700 dark:bg-muted dark:hover:bg-muted/80"
          >
            <div className="h-3 w-3">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="white"
                  className="dark:stroke-foreground"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xs font-medium text-white dark:text-foreground">
              Back
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function DesktopOrderProgressBar({
  status,
  progress,
  isReturned = false,
}: {
  status: string;
  progress: number;
  isReturned?: boolean;
}) {
  const orderSteps = getOrderSteps(isReturned);
  const currentStepIndex = getStepIndex(status, isReturned);

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        {orderSteps.map((step, index) => (
          <div key={step.key} className="flex flex-1 flex-col items-center">
            <div
              className={`${isReturned ? 'h-4 w-4' : 'h-6 w-6'} flex items-center justify-center rounded-full ${
                index <= currentStepIndex
                  ? 'bg-indigo-800 text-white dark:bg-primary dark:text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {index <= currentStepIndex ? (
                <svg
                  className={isReturned ? 'h-3 w-3' : 'h-4 w-4'}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <div
                  className={`${isReturned ? 'h-1 w-1' : 'h-2 w-2'} rounded-full bg-current`}
                ></div>
              )}
            </div>
            <span
              className={`${isReturned ? 'text-[10px]' : 'text-xs'} mt-1 text-center text-muted-foreground`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      <div className="relative">
        <div className="h-2 w-full rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-indigo-800 transition-all duration-300 dark:bg-primary"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function DesktopOrderCard({
  order,
  onOrderDetailsClick,
  onCancelOrderClick,
  isReturned = false,
}: {
  order: Order;
  onOrderDetailsClick: (orderId: string) => void;
  onCancelOrderClick: (orderId: string) => void;
  isReturned?: boolean;
}) {
  // Determine if order can be cancelled (only if status is 'confirmed')
  const canCancel = order.status === 'confirmed';

  return (
    <div className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        {/* Product Image */}
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          <img
            src={order.product.image}
            alt={order.product.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Order Details */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="font-medium text-foreground">
                Order {order.number}
              </p>
              <p className="truncate text-muted-foreground">
                {order.product.name}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">{order.price}</p>
              <p className="text-sm text-muted-foreground">
                Qty: {order.quantity}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <DesktopOrderProgressBar
            status={order.status}
            progress={order.progress}
            isReturned={isReturned}
          />

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onOrderDetailsClick(order.id)}
              className="flex-1 rounded-lg bg-indigo-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-900 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
            >
              Order Details
            </button>
            <button
              onClick={() => canCancel && onCancelOrderClick(order.id)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                canCancel
                  ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-500 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30'
                  : 'cursor-not-allowed border-border bg-muted text-muted-foreground'
              }`}
              disabled={!canCancel}
            >
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyOrders({
  onBackToStore,
  onBulkBuyer,
  onGoToWallet,
  orders: ordersFromApp,
  onOrdersUpdate,
  onOrderRefund,
}: MyOrdersProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<OrderTab>('upcoming');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [cancelledOrderDetails, setCancelledOrderDetails] = useState<{
    orderNumber: string;
    refundAmount: string;
  } | null>(null);

  // Use orders from App.tsx or fallback to mock data
  const orders = ordersFromApp || mockOrders;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize orders in App.tsx if not already set
  useEffect(() => {
    if (!ordersFromApp && onOrdersUpdate) {
      onOrdersUpdate(mockOrders);
    }
  }, [ordersFromApp, onOrdersUpdate]);

  const getTabCount = (tab: OrderTab) => {
    return orders[tab].length;
  };

  const getTabLabel = (tab: OrderTab) => {
    const counts = {
      upcoming: getTabCount('upcoming'),
      previous: getTabCount('previous'),
      returned: getTabCount('returned'),
      cancelled: getTabCount('cancelled'),
    };

    const labels = {
      upcoming: `Active Orders (${counts.upcoming.toString().padStart(2, '0')})`,
      previous: `Previous Orders (${counts.previous})`,
      returned: `Returned Orders (${counts.returned.toString().padStart(2, '0')})`,
      cancelled: `Cancelled Orders (${counts.cancelled.toString().padStart(2, '0')})`,
    };

    return labels[tab];
  };

  const handleOrderDetailsClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowOrderDetails(true);
  };

  const handleCloseOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrderId(null);
  };

  const handleCancelOrderClick = (orderId: string) => {
    const order = Object.values(orders)
      .flat()
      .find((order) => order.id === orderId);
    if (order && order.status === 'confirmed') {
      setOrderToCancel(order);
      setShowCancelDialog(true);
    }
  };

  const handleConfirmCancellation = () => {
    if (orderToCancel) {
      // Calculate refund amount
      const originalAmount = parseInt(
        orderToCancel.price.replace(/[₦,\s]/g, '').split('.')[0],
      );
      const refundAmount = Math.round(originalAmount * 0.975);

      // Move order to cancelled tab
      const newOrders = { ...orders };

      // Remove from current tab (should be upcoming)
      newOrders.upcoming = newOrders.upcoming.filter(
        (order) => order.id !== orderToCancel.id,
      );

      // Add to cancelled tab with cancelled status
      const cancelledOrder = {
        ...orderToCancel,
        status: 'cancelled' as const,
        progress: 0,
      };
      newOrders.cancelled = [...newOrders.cancelled, cancelledOrder];

      // Update orders in App.tsx
      onOrdersUpdate(newOrders);

      // Add refund amount to wallet
      onOrderRefund(refundAmount, orderToCancel.number);

      // Store cancellation details for success dialog
      setCancelledOrderDetails({
        orderNumber: orderToCancel.number,
        refundAmount: `₦${refundAmount.toLocaleString()}`,
      });

      // Close cancel dialog first
      setShowCancelDialog(false);
      setOrderToCancel(null);

      // Then show success dialog
      setShowCancelSuccess(true);
    }
  };

  const handleCloseCancelDialog = () => {
    setShowCancelDialog(false);
    setOrderToCancel(null);
  };

  // Find the selected order across all tabs
  const selectedOrder = selectedOrderId
    ? Object.values(orders)
        .flat()
        .find((order) => order.id === selectedOrderId)
    : null;

  if (isMobile) {
    return (
      <>
        <div className="min-h-screen bg-background">
          <MobileHeader onBackToStore={onBackToStore} />
          <MobileTitleWithButtons
            onBulkBuyer={onBulkBuyer}
            onBackToStore={onBackToStore}
          />

          {/* Order Status Dropdown */}
          <div className="px-5 pb-6">
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex w-full items-center justify-between rounded-[10px] border border-indigo-800 bg-background p-2.5 dark:border-primary"
              >
                <span className="flex-1 text-center font-semibold text-indigo-800 dark:text-primary">
                  {getTabLabel(activeTab)}
                </span>
                <div className="h-6 w-6">
                  <svg
                    className="block size-full"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d={svgPaths.p3cbdb180}
                      fill="#3730A3"
                      className="dark:fill-primary"
                    />
                  </svg>
                </div>
              </button>

              {showDropdown && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-[10px] border border-border bg-card shadow-lg">
                  {(
                    [
                      'upcoming',
                      'previous',
                      'returned',
                      'cancelled',
                    ] as OrderTab[]
                  ).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setShowDropdown(false);
                      }}
                      className={`w-full p-2.5 text-left font-semibold ${
                        activeTab === tab
                          ? 'bg-indigo-50 text-indigo-800 dark:bg-primary/10 dark:text-primary'
                          : 'text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      {getTabLabel(tab)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Orders Content */}
          <div className="px-5 pb-24">
            {orders[activeTab].length > 0 ? (
              <div className="space-y-4">
                {orders[activeTab].map((order) => (
                  <MobileOrderCard
                    key={order.id}
                    order={order}
                    onOrderDetailsClick={handleOrderDetailsClick}
                    onCancelOrderClick={handleCancelOrderClick}
                    isReturned={activeTab === 'returned'}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-50">
                  <svg
                    className="block size-full"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 2V8H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 13H8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 17H8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 9H9H8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 className="mb-2 text-xl font-medium text-foreground">
                  {activeTab === 'upcoming' && 'No active orders'}
                  {activeTab === 'previous' && 'No previous orders'}
                  {activeTab === 'returned' && 'No returned orders'}
                  {activeTab === 'cancelled' && 'No cancelled orders'}
                </h2>
                <p className="mb-8 text-muted-foreground">
                  {activeTab === 'upcoming' &&
                    'Your active orders will appear here'}
                  {activeTab === 'previous' &&
                    'Your order history will appear here'}
                  {activeTab === 'returned' &&
                    'Your returned orders will appear here'}
                  {activeTab === 'cancelled' &&
                    'Your cancelled orders will appear here'}
                </p>
                {activeTab === 'upcoming' && (
                  <button
                    onClick={onBackToStore}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-800 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-900 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                  >
                    <div className="h-5 w-5">
                      <svg
                        className="block size-full"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16 5 16H17M17 13V16M9 19.5A1.5 1.5 0 1 1 12 19.5 1.5 1.5 0 0 1 9 19.5ZM20 19.5A1.5 1.5 0 1 1 23 19.5 1.5 1.5 0 0 1 20 19.5Z"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    Start Shopping
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dialogs */}
        {showOrderDetails && selectedOrder && (
          <OrderDetailsDialog
            isOpen={showOrderDetails}
            onClose={handleCloseOrderDetails}
            onCancelOrder={handleCancelOrderClick}
            order={selectedOrder}
            isReturned={activeTab === 'returned'}
          />
        )}
        {/* Cancel Order Dialog */}
        <CancelOrderDialog
          isOpen={showCancelDialog}
          onClose={handleCloseCancelDialog}
          onConfirm={handleConfirmCancellation}
          orderNumber={orderToCancel?.number || ''}
          orderTotal={orderToCancel?.price || ''}
        />
        {/* Cancel Success Dialog */}
        <CancelSuccessDialog
          isOpen={showCancelSuccess}
          onClose={() => setShowCancelSuccess(false)}
          orderDetails={cancelledOrderDetails}
          onGoToWallet={onGoToWallet}
        />
      </>
    );
  }

  // Desktop view
  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Desktop Header */}
        <div className="sticky top-0 z-40 border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div
                className="h-[24px] w-[200px] cursor-pointer bg-contain bg-no-repeat"
                style={{ backgroundImage: `url('${imgSureimportsReverse}')` }}
                onClick={onBackToStore}
              />

              {/* Navigation and Actions */}
              <div className="flex items-center gap-6">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-6">
          <div className="py-8">
            <div className="mb-8 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onBackToStore}
                  className="rounded-lg p-2 transition-colors hover:bg-accent"
                >
                  <svg
                    className="h-6 w-6 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 18L9 12L15 6"
                    />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl font-medium text-foreground">
                    My Orders
                  </h1>
                  <p className="text-muted-foreground">
                    Track and manage your orders
                  </p>
                </div>
              </div>
              <div className="ml-8 flex gap-2">
                <button
                  onClick={onBulkBuyer}
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 transition-colors hover:bg-purple-700"
                >
                  <div className="h-4 w-4">
                    <svg
                      className="block size-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M16 11V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V11M5 9H19L18 21H6L5 9Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 12V16"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 12V16"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15 12V16"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-white">Bulk Buyer?</span>
                </button>
              </div>
            </div>

            {/* Desktop Tab Navigation */}
            <div className="mb-8 flex space-x-1 rounded-lg bg-muted p-1">
              {(
                ['upcoming', 'previous', 'returned', 'cancelled'] as OrderTab[]
              ).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {getTabLabel(tab)}
                </button>
              ))}
            </div>

            {/* Orders Grid */}
            {orders[activeTab].length > 0 ? (
              <div className="grid gap-4">
                {orders[activeTab].map((order) => (
                  <DesktopOrderCard
                    key={order.id}
                    order={order}
                    onOrderDetailsClick={handleOrderDetailsClick}
                    onCancelOrderClick={handleCancelOrderClick}
                    isReturned={activeTab === 'returned'}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-50">
                  <svg
                    className="block size-full"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 2V8H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-medium text-foreground">
                  No orders found
                </h3>
                <p className="text-muted-foreground">
                  You don't have any orders in this category yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Order Dialog */}
      <CancelOrderDialog
        isOpen={showCancelDialog}
        onClose={handleCloseCancelDialog}
        onConfirm={handleConfirmCancellation}
        orderNumber={orderToCancel?.number || ''}
        orderTotal={orderToCancel?.price || ''}
      />

      {/* Cancel Success Dialog */}
      <CancelSuccessDialog
        isOpen={showCancelSuccess}
        onClose={() => setShowCancelSuccess(false)}
        orderDetails={cancelledOrderDetails}
        onGoToWallet={onGoToWallet}
      />

      {/* Order Details Dialog */}
      {selectedOrder && (
        <OrderDetailsDialog
          isOpen={showOrderDetails}
          onClose={handleCloseOrderDetails}
          onCancelOrder={handleCancelOrderClick}
          order={selectedOrder}
          isReturned={activeTab === 'returned'}
        />
      )}
    </>
  );
}
