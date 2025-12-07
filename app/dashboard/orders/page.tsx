/**
 * ============================================================================
 * MY ORDERS PAGE - ORDER STATUS DISPLAY
 * ============================================================================
 *
 * Purpose: Display user's order history with status tracking
 *
 * Order Status System:
 * - Status Flow: PAID → PROCESSING → SHIPPED → DELIVERED → COMPLETED
 * - Status Badges: Color-coded visual indicators for each status
 * - Order Categorization:
 *   - Active Orders: PAID, PROCESSING, SHIPPED, DELIVERED
 *   - Recent Orders: COMPLETED (last 30 days)
 *   - Old Orders: COMPLETED (>30 days), CANCELLED
 *
 * Status Definitions:
 * - PAID: Order paid, awaiting admin processing (Blue badge)
 * - PROCESSING: Admin is preparing the order (Yellow badge)
 * - SHIPPED: Order dispatched to customer (Purple badge)
 * - DELIVERED: Order delivered to customer (Green badge)
 * - COMPLETED: Order fully completed (Dark green badge)
 * - CANCELLED: Order cancelled (Red badge)
 *
 * Related Files:
 * - Database Schema: prisma/schema.prisma (store_sales model)
 * - Payment APIs: app/api/shop/payment/verify/route.ts (Paystack)
 *                 app/api/shop/payment/wallet/route.ts (Wallet)
 *
 * Admin Integration:
 * - Admin updates order status through admin panel (to be implemented)
 * - Status changes trigger customer notifications (to be implemented)
 * ============================================================================
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Package, ShoppingBag, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Order {
  id: string;
  pidStore: string;
  pidProduct: string;
  pidUser: string;
  product_name: string;
  unit_price: string;
  total_price: string;
  quantity: string;
  status: string; // Order status: PAID, PROCESSING, SHIPPED, DELIVERED, COMPLETED, CANCELLED
  ext1: string | null; // Transaction reference
  ext2: string | null; // Payment method (PAYSTACK, WALLET)
  createdAt: Date;
  updatedAt: Date;
}

interface GroupedOrder {
  transactionRef: string;
  products: Order[];
  totalAmount: number;
  status: string;
  paymentMethod: string | null;
  orderDate: Date;
  orderIds: string[];
}

type OrderCategory = 'active' | 'recent' | 'old';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderCategory>('active');

  useEffect(() => {
    if (user?.pidUser) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();

      if (data.statusx === 'SUCCESS') {
        // Convert createdAt strings to Date objects
        const ordersWithDates = data.data.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt),
        }));
        setOrders(ordersWithDates);

        // Group orders by transaction reference
        const grouped = groupOrdersByTransaction(ordersWithDates);
        setGroupedOrders(grouped);
      } else {
        toast.error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Group orders by transaction reference (ext1)
  const groupOrdersByTransaction = (orders: Order[]): GroupedOrder[] => {
    const groupMap = new Map<string, Order[]>();

    // Group orders by transaction reference
    orders.forEach((order) => {
      // Use ext1 as transaction reference, or create unique key if null/empty
      const transactionRef = order.ext1 || `SINGLE_${order.pidStore}`;

      if (!groupMap.has(transactionRef)) {
        groupMap.set(transactionRef, []);
      }
      groupMap.get(transactionRef)!.push(order);
    });

    // Convert map to array of GroupedOrder objects
    const groupedOrders: GroupedOrder[] = [];

    groupMap.forEach((products, transactionRef) => {
      // Calculate total amount for all products in this transaction
      const totalAmount = products.reduce((sum, product) => {
        return sum + parseFloat(product.total_price);
      }, 0);

      // Use the earliest createdAt date
      const orderDate = new Date(
        Math.min(...products.map((p) => new Date(p.createdAt).getTime()))
      );

      // Determine overall status (prioritize PAID > PROCESSING > SHIPPED > DELIVERED > COMPLETED > CANCELLED)
      // Lower number = higher priority (shows most urgent status first)
      const statusPriority: Record<string, number> = {
        PAID: 1,        // Newly paid orders (highest priority)
        PROCESSING: 2,  // Being prepared
        SHIPPED: 3,     // In transit
        DELIVERED: 4,   // Delivered to customer
        COMPLETED: 5,   // Fully completed
        CANCELLED: 6,   // Cancelled orders
      };

      const status = products.reduce((prevStatus, product) => {
        const prevPriority = statusPriority[prevStatus] || 999;
        const currentPriority = statusPriority[product.status] || 999;
        return currentPriority < prevPriority ? product.status : prevStatus;
      }, products[0].status);

      // Use payment method from first product (should be same for all)
      const paymentMethod = products[0].ext2;

      // Collect all order IDs
      const orderIds = products.map((p) => p.pidStore);

      groupedOrders.push({
        transactionRef,
        products,
        totalAmount,
        status,
        paymentMethod,
        orderDate,
        orderIds,
      });
    });

    // Sort by order date (newest first)
    return groupedOrders.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
  };

  // Categorize grouped orders
  // Active: PAID, PROCESSING, SHIPPED, DELIVERED (orders in progress)
  // Recent: COMPLETED orders within last 30 days
  // Old: COMPLETED orders older than 30 days, and CANCELLED orders
  const categorizeOrders = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const activeOrders = groupedOrders.filter(
      (order) =>
        order.status === 'PAID' ||
        order.status === 'PROCESSING' ||
        order.status === 'SHIPPED' ||
        order.status === 'DELIVERED'
    );

    const recentOrders = groupedOrders.filter(
      (order) =>
        order.status === 'COMPLETED' &&
        new Date(order.orderDate) >= thirtyDaysAgo
    );

    const oldOrders = groupedOrders.filter(
      (order) =>
        (order.status === 'COMPLETED' && new Date(order.orderDate) < thirtyDaysAgo) ||
        order.status === 'CANCELLED'
    );

    return { activeOrders, recentOrders, oldOrders };
  };

  const { activeOrders, recentOrders, oldOrders } = categorizeOrders();

  // Get status badge styling
  // Order Status Flow: PAID → PROCESSING → SHIPPED → DELIVERED → COMPLETED
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
      PAID: {
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        icon: <CheckCircle className="h-3 w-3" />,
        label: 'Paid',
      },
      PROCESSING: {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        icon: <Clock className="h-3 w-3" />,
        label: 'Processing',
      },
      SHIPPED: {
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        icon: <Truck className="h-3 w-3" />,
        label: 'Shipped',
      },
      DELIVERED: {
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        icon: <Package className="h-3 w-3" />,
        label: 'Delivered',
      },
      COMPLETED: {
        color: 'bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-300',
        icon: <CheckCircle className="h-3 w-3" />,
        label: 'Completed',
      },
      CANCELLED: {
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        icon: <XCircle className="h-3 w-3" />,
        label: 'Cancelled',
      },
    };

    const config = statusConfig[status] || statusConfig.PAID;

    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Get payment method badge
  const getPaymentMethodBadge = (method: string | null) => {
    if (!method) return <span className="text-xs text-slate-500 dark:text-slate-400">N/A</span>;

    const methodConfig: Record<string, { color: string; label: string }> = {
      WALLET: {
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        label: 'Wallet',
      },
      PAYSTACK: {
        color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
        label: 'Paystack',
      },
    };

    const config = methodConfig[method] || {
      color: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
      label: method,
    };

    return (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Render grouped order card
  const renderOrderCard = (groupedOrder: GroupedOrder) => {
    const isSingleProduct = groupedOrder.products.length === 1;
    const displayRef = groupedOrder.transactionRef.startsWith('SINGLE_')
      ? groupedOrder.transactionRef.replace('SINGLE_', '')
      : groupedOrder.transactionRef;

    return (
      <Card
        key={groupedOrder.transactionRef}
        className="p-6 mb-6 bg-white dark:bg-slate-900 dark:border-slate-700 border border-slate-200 hover:shadow-lg transition-shadow"
      >
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              {isSingleProduct ? (
                <>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                    {groupedOrder.products[0].product_name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Order ID: {groupedOrder.products[0].pidStore}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Order with {groupedOrder.products.length} items
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {groupedOrder.orderIds.length} product{groupedOrder.orderIds.length > 1 ? 's' : ''}
                  </p>
                </>
              )}
            </div>
            {getStatusBadge(groupedOrder.status)}
          </div>

          {/* Products List */}
          <div className="space-y-2">
            {groupedOrder.products.map((product, index) => (
              <div
                key={product.id}
                className={`flex justify-between items-start text-sm ${
                  index > 0 ? 'pt-2 border-t border-slate-100 dark:border-slate-800' : ''
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-slate-100 line-clamp-1">
                    {product.product_name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Qty: {product.quantity} × ₦
                    {parseFloat(product.unit_price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>
                <div className="text-right ml-2">
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    ₦{parseFloat(product.total_price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Total Amount</p>
              <p className="font-bold text-lg text-slate-900 dark:text-slate-100">
                ₦{groupedOrder.totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Payment Method</p>
              <div className="mt-1">{getPaymentMethodBadge(groupedOrder.paymentMethod)}</div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {format(new Date(groupedOrder.orderDate), 'MMM dd, yyyy • hh:mm a')}
            </div>
            {!groupedOrder.transactionRef.startsWith('SINGLE_') && (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Ref: {displayRef.substring(0, 12)}...
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  // Render empty state
  const renderEmptyState = (category: string) => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
        <Package className="h-12 w-12 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
        No {category} orders
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        {category === 'active' && "You don't have any orders being processed or shipped."}
        {category === 'recent' && "You haven't completed any orders in the last 30 days."}
        {category === 'old' && "You don't have any older or cancelled orders."}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-black">
      <div className="p-4 dark:bg-black">
        <div className="flex justify-between max-sm:flex-col">
          <div className="text-[28px] font-bold text-black dark:text-slate-200 max-sm:pb-4">
            My Orders
          </div>
        </div>

        <div className="mt-[7px] items-start justify-center gap-2 rounded-xl bg-white p-2 py-[10px] text-base font-normal text-slate-600 dark:bg-black dark:text-white max-sm:pl-4 md:flex-row">
          View and track all your orders
        </div>
      </div>

      {/* Content */}
      <div className="px-5 md:px-8 pb-8 md:max-w-7xl md:mx-auto pt-6 md:pt-0">
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'active'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Currently Active ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'recent'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Recent Orders ({recentOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('old')}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'old'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Old Orders ({oldOrders.length})
            </button>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTab === 'active' && (
            <>
              {activeOrders.length > 0
                ? activeOrders.map(renderOrderCard)
                : renderEmptyState('active')}
            </>
          )}
          {activeTab === 'recent' && (
            <>
              {recentOrders.length > 0
                ? recentOrders.map(renderOrderCard)
                : renderEmptyState('recent')}
            </>
          )}
          {activeTab === 'old' && (
            <>
              {oldOrders.length > 0
                ? oldOrders.map(renderOrderCard)
                : renderEmptyState('old')}
            </>
          )}
        </div>

        {/* Summary Stats */}
        {groupedOrders.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-white dark:bg-slate-900 dark:border-slate-700 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Active Orders</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {activeOrders.length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-white dark:bg-slate-900 dark:border-slate-700 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Recent Orders</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {recentOrders.length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-white dark:bg-slate-900 dark:border-slate-700 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Package className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Orders</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {groupedOrders.length}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

