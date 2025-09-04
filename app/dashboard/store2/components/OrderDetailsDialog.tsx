"use client";

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
    status: 'confirmed' | 'shipped' | 'arrived' | 'replaced' | 'shipped-back' | 'arrived-back' | 'delivered' | 'cancelled';
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

// Mock customer data - in a real app, this would come from user state
const customerInfo = {
  name: "Johnson Adebayo",
  email: "johnson.adebayo@email.com",
  phone: "+234 801 234 5678",
  address: {
    street: "45 Victoria Island Road",
    city: "Lagos",
    state: "Lagos State",
    country: "Nigeria",
    postalCode: "101241"
  }
};

function OrderProgressBar({ status, progress, isReturned = false }: { status: string; progress: number; isReturned?: boolean }) {
  const orderSteps = getOrderSteps(isReturned);
  const currentStepIndex = getStepIndex(status, isReturned);
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        {orderSteps.map((step, index) => (
          <div key={step.key} className="flex flex-col items-center flex-1">
            <div className={`${isReturned ? 'w-4 h-4' : 'w-6 h-6'} rounded-full flex items-center justify-center mb-2 ${
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
            <span className={`${isReturned ? 'text-[10px]' : 'text-xs'} text-muted-foreground text-center font-medium`}>{step.label}</span>
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

export default function OrderDetailsDialog({ isOpen, onClose, onCancelOrder, order }: OrderDetailsDialogProps) {
  const canCancel = order.status === 'confirmed';
  
  const handleCancelOrder = () => {
    if (onCancelOrder && canCancel) {
      onCancelOrder(order.id);
      onClose(); // Close the dialog after triggering cancel
    }
  };

  // Determine if this is a returned order based on status
  const isReturned = ['replaced', 'shipped-back', 'arrived-back'].includes(order.status);
  
  // Calculate estimated shipping cost (mock data)
  const basePrice = parseFloat(order.price.replace(/[₦,]/g, ''));
  const shippingCost = Math.round(basePrice * 0.05); // 5% of product price as shipping
  const totalAmount = basePrice + shippingCost;
  
  // Format status display for special returned order statuses
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'shipped-back': return 'Shipped Back';
      case 'arrived-back': return 'Arrived';
      case 'replaced': return 'Replaced/Repaired';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Dialog */}
        <div 
          className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Order Details</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Order Summary */}
            <div className="bg-muted rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Order Number:</span>
                  <p className="font-semibold text-foreground">{order.number}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p className="font-semibold text-foreground">{getStatusDisplay(order.status)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Order Date:</span>
                  <p className="font-semibold text-foreground">{order.orderDate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Expected Delivery:</span>
                  <p className="font-semibold text-indigo-800 dark:text-primary">{order.expectedDelivery}</p>
                </div>
              </div>
            </div>

            {/* Order Progress */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Order Status</h3>
              <OrderProgressBar status={order.status} progress={order.progress} isReturned={isReturned} />
            </div>

            {/* Product Details */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Product Details</h3>
              <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-card flex-shrink-0">
                  <img
                    src={order.product.image}
                    alt={order.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">{order.product.name}</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Quantity: <span className="font-medium">{order.quantity}</span></p>
                    <p>Unit Price: <span className="font-medium">{order.price}</span></p>
                    <p>Condition: <span className="font-medium">Brand New</span></p>
                    <p>Warranty: <span className="font-medium">12 months</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Customer Information</h3>
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div>
                  <span className="text-muted-foreground text-sm">Full Name:</span>
                  <p className="font-medium text-foreground">{customerInfo.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">Email:</span>
                  <p className="font-medium text-foreground">{customerInfo.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">Phone Number:</span>
                  <p className="font-medium text-foreground">{customerInfo.phone}</p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Delivery Address</h3>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-foreground">
                  <p className="font-medium">{customerInfo.address.street}</p>
                  <p>{customerInfo.address.city}, {customerInfo.address.state}</p>
                  <p>{customerInfo.address.country} {customerInfo.address.postalCode}</p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Payment Summary</h3>
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({order.quantity} item{order.quantity > 1 ? 's' : ''}):</span>
                  <span className="font-medium text-foreground">₦{basePrice.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping from China:</span>
                  <span className="font-medium text-foreground">₦{shippingCost.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Import duties & taxes:</span>
                  <span className="font-medium text-foreground">₦0.00</span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total Amount:</span>
                    <span className="font-semibold text-foreground">₦{totalAmount.toLocaleString()}.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Shipping Information</h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
                    <svg className="block size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">10-Day Express Shipping from China</p>
                    <p>Your order will be shipped directly from our verified suppliers in China. Tracking information will be provided once shipped. All items come with full warranty and after-sales support.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 p-6 border-t border-border bg-muted rounded-b-lg">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-600 hover:bg-slate-700 dark:bg-muted dark:hover:bg-muted/80 text-white dark:text-foreground px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
            <button 
              className={`flex-1 px-4 py-2 rounded-lg font-medium border transition-colors ${
                canCancel 
                  ? 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-300 border-red-200 dark:border-red-500' 
                  : 'bg-muted text-muted-foreground border-border cursor-not-allowed'
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