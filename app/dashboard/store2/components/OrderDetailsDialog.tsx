'use client';

import ImageWithFallback from '../../favicon.ico';

interface OrderDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCancelOrder?: (orderId: string) => void;
  order: {
    id: string;
    number: string;
    product: {
      name: string;
      image: string;
    };
    quantity: number;
    price: string;
    status:
      | 'confirmed'
      | 'shipped'
      | 'arrived'
      | 'replaced'
      | 'shipped-back'
      | 'arrived-back'
      | 'delivered'
      | 'cancelled';
    progress: number;
    orderDate: string;
    expectedDelivery: string;
  };
  isReturned?: boolean;
}

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

// Mock customer data - in a real app, this would come from user state
const customerInfo = {
  name: 'Johnson Adebayo',
  email: 'johnson.adebayo@email.com',
  phone: '+234 801 234 5678',
  address: {
    street: '45 Victoria Island Road',
    city: 'Lagos',
    state: 'Lagos State',
    country: 'Nigeria',
    postalCode: '101241',
  },
};

function OrderProgressBar({
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
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        {orderSteps.map((step, index) => (
          <div key={step.key} className="flex flex-1 flex-col items-center">
            <div
              className={`${isReturned ? 'h-4 w-4' : 'h-6 w-6'} mb-2 flex items-center justify-center rounded-full ${
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
              className={`${isReturned ? 'text-[10px]' : 'text-xs'} text-center font-medium text-muted-foreground`}
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

export default function OrderDetailsDialog({
  isOpen,
  onClose,
  onCancelOrder,
  order,
}: OrderDetailsDialogProps) {
  const canCancel = order.status === 'confirmed';

  const handleCancelOrder = () => {
    if (onCancelOrder && canCancel) {
      onCancelOrder(order.id);
      onClose(); // Close the dialog after triggering cancel
    }
  };

  // Determine if this is a returned order based on status
  const isReturned = ['replaced', 'shipped-back', 'arrived-back'].includes(
    order.status,
  );

  // Calculate estimated shipping cost (mock data)
  const basePrice = parseFloat(order.price.replace(/[₦,]/g, ''));
  const shippingCost = Math.round(basePrice * 0.05); // 5% of product price as shipping
  const totalAmount = basePrice + shippingCost;

  // Format status display for special returned order statuses
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'shipped-back':
        return 'Shipped Back';
      case 'arrived-back':
        return 'Arrived';
      case 'replaced':
        return 'Replaced/Repaired';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        {/* Dialog */}
        <div
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-card shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-6">
            <h2 className="text-xl font-semibold text-foreground">
              Order Details
            </h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6 p-6">
            {/* Order Summary */}
            <div className="rounded-lg bg-muted p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Order Number:</span>
                  <p className="font-semibold text-foreground">
                    {order.number}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p className="font-semibold text-foreground">
                    {getStatusDisplay(order.status)}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Order Date:</span>
                  <p className="font-semibold text-foreground">
                    {order.orderDate}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Expected Delivery:
                  </span>
                  <p className="font-semibold text-indigo-800 dark:text-primary">
                    {order.expectedDelivery}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Progress */}
            <div>
              <h3 className="mb-3 font-semibold text-foreground">
                Order Status
              </h3>
              <OrderProgressBar
                status={order.status}
                progress={order.progress}
                isReturned={isReturned}
              />
            </div>

            {/* Product Details */}
            <div>
              <h3 className="mb-3 font-semibold text-foreground">
                Product Details
              </h3>
              <div className="flex items-start gap-4 rounded-lg bg-muted p-4">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-card">
                  <img
                    src={order.product.image}
                    alt={order.product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 font-medium text-foreground">
                    {order.product.name}
                  </h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      Quantity:{' '}
                      <span className="font-medium">{order.quantity}</span>
                    </p>
                    <p>
                      Unit Price:{' '}
                      <span className="font-medium">{order.price}</span>
                    </p>
                    <p>
                      Condition: <span className="font-medium">Brand New</span>
                    </p>
                    <p>
                      Warranty: <span className="font-medium">12 months</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h3 className="mb-3 font-semibold text-foreground">
                Customer Information
              </h3>
              <div className="space-y-3 rounded-lg bg-muted p-4">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Full Name:
                  </span>
                  <p className="font-medium text-foreground">
                    {customerInfo.name}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <p className="font-medium text-foreground">
                    {customerInfo.email}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Phone Number:
                  </span>
                  <p className="font-medium text-foreground">
                    {customerInfo.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <h3 className="mb-3 font-semibold text-foreground">
                Delivery Address
              </h3>
              <div className="rounded-lg bg-muted p-4">
                <div className="text-foreground">
                  <p className="font-medium">{customerInfo.address.street}</p>
                  <p>
                    {customerInfo.address.city}, {customerInfo.address.state}
                  </p>
                  <p>
                    {customerInfo.address.country}{' '}
                    {customerInfo.address.postalCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div>
              <h3 className="mb-3 font-semibold text-foreground">
                Payment Summary
              </h3>
              <div className="space-y-2 rounded-lg bg-muted p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal ({order.quantity} item
                    {order.quantity > 1 ? 's' : ''}):
                  </span>
                  <span className="font-medium text-foreground">
                    ₦{basePrice.toLocaleString()}.00
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Shipping from China:
                  </span>
                  <span className="font-medium text-foreground">
                    ₦{shippingCost.toLocaleString()}.00
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Import duties & taxes:
                  </span>
                  <span className="font-medium text-foreground">₦0.00</span>
                </div>
                <div className="mt-2 border-t border-border pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">
                      Total Amount:
                    </span>
                    <span className="font-semibold text-foreground">
                      ₦{totalAmount.toLocaleString()}.00
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div>
              <h3 className="mb-3 font-semibold text-foreground">
                Shipping Information
              </h3>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400">
                    <svg
                      className="block size-full"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="mb-1 font-medium">
                      10-Day Express Shipping from China
                    </p>
                    <p>
                      Your order will be shipped directly from our verified
                      suppliers in China. Tracking information will be provided
                      once shipped. All items come with full warranty and
                      after-sales support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 rounded-b-lg border-t border-border bg-muted p-6">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg bg-slate-600 px-4 py-2 font-medium text-white transition-colors hover:bg-slate-700 dark:bg-muted dark:text-foreground dark:hover:bg-muted/80"
            >
              Close
            </button>
            <button
              className={`flex-1 rounded-lg border px-4 py-2 font-medium transition-colors ${
                canCancel
                  ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-500 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30'
                  : 'cursor-not-allowed border-border bg-muted text-muted-foreground'
              }`}
              disabled={!canCancel}
              onClick={handleCancelOrder} // Added onClick handler for cancel button
            >
              {canCancel ? 'Cancel Order' : 'Cannot Cancel'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
