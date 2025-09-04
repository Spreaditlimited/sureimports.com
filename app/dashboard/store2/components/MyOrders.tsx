"use client";

import { useState, useEffect } from "react";
import ImageWithFallback from '../../../../public/favicon.png';
import svgPaths from "../imports/svg-91ncinf66q";

import imgSureimportsReverse from '../../../../public/favicon.png';
import { imgGroup, imgImage15 } from "../imports/svg-yzqxa";
import OrderDetailsDialog from "./OrderDetailsDialog";
import CancelOrderDialog from "./CancelOrderDialog";
import CancelSuccessDialog from "./CancelSuccessDialog";
import { ThemeToggle } from "./ThemeToggle";
import type { Order, OrderTab } from "./App";

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
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, ' - ');
};

const mockOrders: Record<OrderTab, Order[]> = {
  upcoming: [
    {
      id: "1",
      number: "#1234",
      product: {
        name: "HP EliteBook x360 1040 G8",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center"
      },
      quantity: 2,
      price: "₦967,500.00",
      status: 'shipped',
      progress: 50,
      orderDate: "02 - 08 - 2025",
      expectedDelivery: formatDate(addBusinessDays(new Date('2025-08-02'), 10))
    },
    {
      id: "2",
      number: "#1235",
      product: {
        name: 'MacBook Air 13.6" M2 Chip 8GB 512GB',
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&crop=center"
      },
      quantity: 1,
      price: "₦1,147,500.00",
      status: 'arrived',
      progress: 75,
      orderDate: "01 - 08 - 2025",
      expectedDelivery: formatDate(addBusinessDays(new Date('2025-08-01'), 10))
    },
    {
      id: "6",
      number: "#1236",
      product: {
        name: "FAYA Wireless Earbuds Pro",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop&crop=center"
      },
      quantity: 2,
      price: "₦45,000.00",
      status: 'confirmed',
      progress: 25,
      orderDate: "06 - 08 - 2025",
      expectedDelivery: formatDate(addBusinessDays(new Date('2025-08-06'), 10))
    },
    {
      id: "8",
      number: "#1238",
      product: {
        name: "Samsung Galaxy S24 Ultra 512GB",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&crop=center"
      },
      quantity: 1,
      price: "₦1,650,000.00",
      status: 'confirmed',
      progress: 25,
      orderDate: "07 - 08 - 2025",
      expectedDelivery: formatDate(addBusinessDays(new Date('2025-08-07'), 10))
    },
    {
      id: "9",
      number: "#1239",
      product: {
        name: "iPhone 15 Pro Max 256GB - Natural Titanium",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&crop=center"
      },
      quantity: 1,
      price: "₦1,850,000.00",
      status: 'confirmed',
      progress: 25,
      orderDate: "08 - 08 - 2025",
      expectedDelivery: formatDate(addBusinessDays(new Date('2025-08-08'), 10))
    }
  ],
  previous: [
    {
      id: "7",
      number: "#1237",
      product: {
        name: "iPhone 14 128GB - Midnight",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&crop=center"
      },
      quantity: 1,
      price: "₦1,200,000.00",
      status: 'delivered',
      progress: 100,
      orderDate: "15 - 07 - 2025",
      expectedDelivery: "29 - 07 - 2025"
    }
  ],
  returned: [
    {
      id: "3",
      number: "#1230",
      product: {
        name: "Samsung Galaxy S24 Ultra",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&crop=center"
      },
      quantity: 1,
      price: "₦1,650,000.00",
      status: 'delivered',
      progress: 100,
      orderDate: "10 - 07 - 2025",
      expectedDelivery: "24 - 07 - 2025"
    },
    {
      id: "4",
      number: "#1231",
      product: {
        name: "iPhone 15 Pro Max",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&crop=center"
      },
      quantity: 1,
      price: "₦1,850,000.00",
      status: 'shipped-back',
      progress: 71, // 5/7 * 100
      orderDate: "05 - 07 - 2025",
      expectedDelivery: "19 - 07 - 2025"
    },
    {
      id: "5",
      number: "#1232",
      product: {
        name: "iPad Pro 12.9\" M2",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&crop=center"
      },
      quantity: 1,
      price: "₦1,450,000.00",
      status: 'replaced',
      progress: 57, // 4/7 * 100
      orderDate: "20 - 06 - 2025",
      expectedDelivery: "04 - 07 - 2025"
    }
  ],
  cancelled: []
};

const regularOrderSteps = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'arrived', label: 'Arrived' },
  { key: 'delivered', label: 'Delivered' }
];

const returnedOrderSteps = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'arrived', label: 'Arrived' },
  { key: 'replaced', label: 'Replaced/Repaired' },
  { key: 'shipped-back', label: 'Shipped back' },
  { key: 'arrived-back', label: 'Arrived' },
  { key: 'delivered', label: 'Delivered' }
];

const getOrderSteps = (isReturned: boolean) => {
  return isReturned ? returnedOrderSteps : regularOrderSteps;
};

const getStepIndex = (status: string, isReturned: boolean) => {
  const steps = getOrderSteps(isReturned);
  return steps.findIndex(step => step.key === status);
};

// Mobile Components
function MobileOrderProgressBar({ status, progress, isReturned = false }: { status: string; progress: number; isReturned?: boolean }) {
  const orderSteps = getOrderSteps(isReturned);
  const currentStepIndex = getStepIndex(status, isReturned);

  return (
    <div className="mt-4">
      {/* Progress Bar Background */}
      <div className="relative">
        <div className="bg-muted h-2 rounded-[20px] w-full" />
        <div
          className="bg-indigo-800 dark:bg-primary h-2 rounded-[20px] absolute top-0 left-0"
          style={{ width: `${progress}%` }}
        />

        {/* Progress Dots */}
        <div className="absolute top-0 left-0 w-full flex justify-between items-center" style={{ transform: 'translateY(-5px)' }}>
          {orderSteps.map((step, index) => (
            <div key={step.key} className="relative">
              <div className={`${isReturned ? 'size-[16px]' : 'size-[22px]'} rounded-full flex items-center justify-center ${
                index <= currentStepIndex
                  ? 'bg-indigo-800 dark:bg-primary'
                  : 'bg-muted border border-border'
              }`}>
                {index <= currentStepIndex ? (
                  <div className={isReturned ? 'w-3 h-3' : 'w-4 h-4'}>
                    <svg className="block size-full" fill="none" viewBox="0 0 16 16">
                      <path d="M4.83398 7.66661L6.72065 9.55327L10.5007 5.77995" stroke="white" className="dark:stroke-primary-foreground" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </svg>
                  </div>
                ) : (
                  <div className={isReturned ? 'w-3 h-3' : 'w-4 h-4'}>
                    <svg className="block size-full" fill="none" viewBox="0 0 16 16">
                      <path d="M4.83398 7.66661L6.72065 9.55327L10.5007 5.77995" stroke="currentColor" className="text-muted-foreground" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 text-xs font-medium text-foreground">
        {orderSteps.map((step) => (
          <span key={step.key} className={`text-center ${isReturned ? 'text-[10px]' : ''}`}>{step.label}</span>
        ))}
      </div>
    </div>
  );
}

function MobileOrderCard({ order, onOrderDetailsClick, onCancelOrderClick, isReturned = false }: { order: Order; onOrderDetailsClick: (orderId: string) => void; onCancelOrderClick: (orderId: string) => void; isReturned?: boolean }) {
  // Determine if order can be cancelled (only if status is 'confirmed')
  const canCancel = order.status === 'confirmed';

  // Format status display for special returned order statuses
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'shipped-back': return 'Shipped Back';
      case 'arrived-back': return 'Arrived';
      case 'replaced': return 'Replaced/Repaired';
      case 'cancelled': return 'Cancelled';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="bg-card rounded-[15px] border border-border p-5 space-y-4">
      {/* Order Summary */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="font-semibold text-foreground">Order No. : {order.number}</p>
          <p className="font-medium text-foreground">Status : {getStatusDisplay(order.status)}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold text-foreground">Total : {order.price}</p>
          <p className="font-medium text-foreground">Date : {order.orderDate}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <MobileOrderProgressBar status={order.status} progress={order.progress} isReturned={isReturned} />

      {/* Ordered Items */}
      <div className="space-y-4">
        <p className="font-medium text-foreground">Ordered Item's :</p>

        {/* First Item */}
        <div className="flex items-center justify-between">
          <div className="w-[124px] h-[124px] rounded-[10px] bg-muted border border-border overflow-hidden">
            <ImageWithFallback
              src={order.product.image}
              alt={order.product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 ml-4 space-y-1">
            <p className="font-medium text-foreground">{order.product.name}</p>
            <p className="font-medium text-center text-foreground">Quantity : {order.quantity}</p>
            <p className="font-semibold text-center text-foreground">{order.price}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={() => onOrderDetailsClick(order.id)}
            className="flex-1 bg-indigo-800 dark:bg-primary text-white dark:text-primary-foreground px-2.5 py-2 rounded-[10px] font-normal"
          >
            Order Details
          </button>
          <button
            onClick={() => canCancel && onCancelOrderClick(order.id)}
            className={`flex-1 px-2.5 py-2 rounded-[10px] font-normal transition-colors ${
              canCancel
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-400 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30'
                : 'bg-muted border border-border text-muted-foreground cursor-not-allowed'
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
    <div className="bg-[#0e0e1f] dark:bg-card w-full relative pt-12 pb-4" style={{ minHeight: '90px' }}>
      {/* Back Button */}
      <button
        onClick={onBackToStore}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center"
      >
        <svg className="w-6 h-6 text-white dark:text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18L9 12L15 6" />
        </svg>
      </button>
      
      {/* Logo */}
      <div 
        className="absolute top-1/2 left-16 transform -translate-y-1/2 w-[180px] h-[20px] bg-no-repeat bg-contain"
        style={{ backgroundImage: `url('${imgSureimportsReverse}')` }}
      />
      
      {/* Theme Toggle */}
      <div className="absolute top-1/2 right-16 transform -translate-y-1/2">
        <ThemeToggle />
      </div>
      
      {/* Hamburger Menu */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-[26px] h-[20px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 20">
          <path d={svgPaths.p26572800} fill="white" className="dark:fill-foreground" />
        </svg>
      </div>
    </div>
  );
}

function MobileTitleWithButtons({ onBulkBuyer, onBackToStore }: { onBulkBuyer: () => void; onBackToStore: () => void }) {
  return (
    <div className="px-5 pt-8 pb-4 bg-background">
      <div className="flex items-start justify-between mb-4">
        <h1 className="text-lg font-semibold text-foreground flex-1 mr-3">My Orders</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onBulkBuyer}
            className="bg-purple-600 hover:bg-purple-700 transition-colors flex items-center gap-1 px-2 py-1 rounded-lg"
          >
            <div className="w-3 h-3">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <path d="M16 11V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V11M5 9H19L18 21H6L5 9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-medium text-white text-xs">Bulk?</span>
          </button>
          <button
            onClick={onBackToStore}
            className="bg-slate-600 hover:bg-slate-700 dark:bg-muted dark:hover:bg-muted/80 transition-colors flex items-center gap-1 px-2 py-1 rounded-lg"
          >
            <div className="w-3 h-3">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <path d="M15 18L9 12L15 6" stroke="white" className="dark:stroke-foreground" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-medium text-white dark:text-foreground text-xs">Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function DesktopOrderProgressBar({ status, progress, isReturned = false }: { status: string; progress: number; isReturned?: boolean }) {
  const orderSteps = getOrderSteps(isReturned);
  const currentStepIndex = getStepIndex(status, isReturned);

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        {orderSteps.map((step, index) => (
          <div key={step.key} className="flex flex-col items-center flex-1">
            <div className={`${isReturned ? 'w-4 h-4' : 'w-6 h-6'} rounded-full flex items-center justify-center ${
              index <= currentStepIndex
                ? 'bg-indigo-800 dark:bg-primary text-white dark:text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}>
              {index <= currentStepIndex ? (
                <svg className={isReturned ? 'w-3 h-3' : 'w-4 h-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <div className={`${isReturned ? 'w-1 h-1' : 'w-2 h-2'} rounded-full bg-current`}></div>
              )}
            </div>
            <span className={`${isReturned ? 'text-[10px]' : 'text-xs'} text-muted-foreground mt-1 text-center`}>{step.label}</span>
          </div>
        ))}
      </div>
      <div className="relative">
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-indigo-800 dark:bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function DesktopOrderCard({ order, onOrderDetailsClick, onCancelOrderClick, isReturned = false }: { order: Order; onOrderDetailsClick: (orderId: string) => void; onCancelOrderClick: (orderId: string) => void; isReturned?: boolean }) {
  // Determine if order can be cancelled (only if status is 'confirmed')
  const canCancel = order.status === 'confirmed';

  return (
    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Product Image */}
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          <img
            src={order.product.image}
            alt={order.product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Order Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-medium text-foreground">Order {order.number}</p>
              <p className="text-muted-foreground truncate">{order.product.name}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">{order.price}</p>
              <p className="text-sm text-muted-foreground">Qty: {order.quantity}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <DesktopOrderProgressBar status={order.status} progress={order.progress} isReturned={isReturned} />

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onOrderDetailsClick(order.id)}
              className="flex-1 bg-indigo-800 hover:bg-indigo-900 dark:bg-primary dark:hover:bg-primary/90 text-white dark:text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Order Details
            </button>
            <button
              onClick={() => canCancel && onCancelOrderClick(order.id)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                canCancel
                  ? 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-300 border-red-200 dark:border-red-500'
                  : 'bg-muted text-muted-foreground border-border cursor-not-allowed'
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

export default function MyOrders({ onBackToStore, onBulkBuyer, onGoToWallet, orders: ordersFromApp, onOrdersUpdate, onOrderRefund }: MyOrdersProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<OrderTab>('upcoming');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [cancelledOrderDetails, setCancelledOrderDetails] = useState<{orderNumber: string; refundAmount: string} | null>(null);

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
      cancelled: getTabCount('cancelled')
    };

    const labels = {
      upcoming: `Active Orders (${counts.upcoming.toString().padStart(2, '0')})`,
      previous: `Previous Orders (${counts.previous})`,
      returned: `Returned Orders (${counts.returned.toString().padStart(2, '0')})`,
      cancelled: `Cancelled Orders (${counts.cancelled.toString().padStart(2, '0')})`
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
    const order = Object.values(orders).flat().find(order => order.id === orderId);
    if (order && order.status === 'confirmed') {
      setOrderToCancel(order);
      setShowCancelDialog(true);
    }
  };

  const handleConfirmCancellation = () => {
    if (orderToCancel) {
      // Calculate refund amount
      const originalAmount = parseInt(orderToCancel.price.replace(/[₦,\s]/g, '').split('.')[0]);
      const refundAmount = Math.round(originalAmount * 0.975);

      // Move order to cancelled tab
      const newOrders = { ...orders };

      // Remove from current tab (should be upcoming)
      newOrders.upcoming = newOrders.upcoming.filter(order => order.id !== orderToCancel.id);

      // Add to cancelled tab with cancelled status
      const cancelledOrder = {
        ...orderToCancel,
        status: 'cancelled' as const,
        progress: 0
      };
      newOrders.cancelled = [...newOrders.cancelled, cancelledOrder];

      // Update orders in App.tsx
      onOrdersUpdate(newOrders);

      // Add refund amount to wallet
      onOrderRefund(refundAmount, orderToCancel.number);

      // Store cancellation details for success dialog
      setCancelledOrderDetails({
        orderNumber: orderToCancel.number,
        refundAmount: `₦${refundAmount.toLocaleString()}`
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
  const selectedOrder = selectedOrderId ?
    Object.values(orders)
      .flat()
      .find(order => order.id === selectedOrderId) : null;

  if (isMobile) {
    return (
      <>
        <div className="bg-background min-h-screen">
          <MobileHeader onBackToStore={onBackToStore} />
          <MobileTitleWithButtons onBulkBuyer={onBulkBuyer} onBackToStore={onBackToStore} />

          {/* Order Status Dropdown */}
          <div className="px-5 pb-6">
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-background border border-indigo-800 dark:border-primary rounded-[10px] p-2.5 w-full flex items-center justify-between"
              >
                <span className="font-semibold text-indigo-800 dark:text-primary text-center flex-1">
                  {getTabLabel(activeTab)}
                </span>
                <div className="w-6 h-6">
                  <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                    <path d={svgPaths.p3cbdb180} fill="#3730A3" className="dark:fill-primary" />
                  </svg>
                </div>
              </button>

              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-[10px] shadow-lg z-10">
                  {(['upcoming', 'previous', 'returned', 'cancelled'] as OrderTab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setShowDropdown(false);
                      }}
                      className={`w-full p-2.5 text-left font-semibold ${
                        activeTab === tab
                          ? 'text-indigo-800 dark:text-primary bg-indigo-50 dark:bg-primary/10'
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
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 opacity-50 text-muted-foreground">
                  <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-foreground mb-2">
                  {activeTab === 'upcoming' && 'No active orders'}
                  {activeTab === 'previous' && 'No previous orders'}
                  {activeTab === 'returned' && 'No returned orders'}
                  {activeTab === 'cancelled' && 'No cancelled orders'}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {activeTab === 'upcoming' && 'Your active orders will appear here'}
                  {activeTab === 'previous' && 'Your order history will appear here'}
                  {activeTab === 'returned' && 'Your returned orders will appear here'}
                  {activeTab === 'cancelled' && 'Your cancelled orders will appear here'}
                </p>
                {activeTab === 'upcoming' && (
                  <button
                    onClick={onBackToStore}
                    className="bg-indigo-800 hover:bg-indigo-900 dark:bg-primary dark:hover:bg-primary/90 transition-colors text-white dark:text-primary-foreground px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
                  >
                    <div className="w-5 h-5">
                      <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                        <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16 5 16H17M17 13V16M9 19.5A1.5 1.5 0 1 1 12 19.5 1.5 1.5 0 0 1 9 19.5ZM20 19.5A1.5 1.5 0 1 1 23 19.5 1.5 1.5 0 0 1 20 19.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
      <div className="bg-background min-h-screen">
        {/* Desktop Header */}
        <div className="border-b border-border bg-background sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div
                className="w-[200px] h-[24px] bg-no-repeat bg-contain cursor-pointer"
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
        <div className="max-w-7xl mx-auto px-6">
          <div className="py-8">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={onBackToStore}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18L9 12L15 6" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl font-medium text-foreground">My Orders</h1>
                  <p className="text-muted-foreground">Track and manage your orders</p>
                </div>
              </div>
              <div className="flex gap-2 ml-8">
                <button
                  onClick={onBulkBuyer}
                  className="bg-purple-600 hover:bg-purple-700 transition-colors flex items-center gap-2 px-4 py-2 rounded-lg"
                >
                  <div className="w-4 h-4">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                      <path d="M16 11V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V11M5 9H19L18 21H6L5 9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="font-medium text-white">Bulk Buyer?</span>
                </button>
              </div>
            </div>

            {/* Desktop Tab Navigation */}
            <div className="flex space-x-1 mb-8 bg-muted p-1 rounded-lg">
              {(['upcoming', 'previous', 'returned', 'cancelled'] as OrderTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
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
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 opacity-50 text-muted-foreground">
                  <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No orders found</h3>
                <p className="text-muted-foreground">You don't have any orders in this category yet.</p>
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