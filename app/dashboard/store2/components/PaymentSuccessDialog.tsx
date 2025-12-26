'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';

interface PaymentSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToOrders: () => void;
  totalAmount: number;
  paymentMethod: 'wallet' | 'paystack';
  orderNumber?: string;
}

export function PaymentSuccessDialog({
  isOpen,
  onClose,
  onGoToOrders,
  totalAmount,
  paymentMethod,
  orderNumber = `#${Date.now().toString().slice(-6)}`,
}: PaymentSuccessDialogProps) {
  const [isAnimated, setIsAnimated] = useState(false);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
      // Trigger animation after a short delay
      setTimeout(() => setIsAnimated(true), 100);
    } else {
      setIsAnimated(false);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const formatCurrency = (amount: number) => {
    //return `₦${amount.toLocaleString()}.00`;
    return '0.00';
  };

  const getPaymentMethodText = () => {
    return paymentMethod === 'wallet' ? 'Wallet Payment' : 'Card Payment';
  };

  // Don't render anything if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative mx-auto w-full max-w-md transform rounded-xl border border-border bg-card p-6 shadow-2xl transition-all duration-300 ${
          isAnimated ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Success Icon */}
        <div className="mb-6 text-center">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 transform items-center justify-center rounded-full bg-green-100 transition-all duration-500 dark:bg-green-900/30 ${
              isAnimated ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
            }`}
          >
            <div className="h-8 w-8 text-green-600 dark:text-green-400">
              <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                <path
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Payment Successful!
          </h2>
          <p className="text-sm text-muted-foreground">
            Your order has been confirmed and will be processed shortly.
          </p>
        </div>

        {/* Payment Details */}
        <div className="mb-6 space-y-3 rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Order Number:</span>
            <span className="font-semibold text-foreground">{orderNumber}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Payment Method:
            </span>
            <span className="font-medium text-foreground">
              {getPaymentMethodText()}
            </span>
          </div>

          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Amount Paid:
              </span>
              <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Order Status Info */}
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400">
              <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                <path
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-blue-800 dark:text-blue-200">
                What happens next?
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                You'll receive an email confirmation shortly. Your order will be
                shipped from China within 2-3 business days and should arrive
                within 10 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={onGoToOrders}
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-primary dark:hover:bg-primary/90"
          >
            <div className="mr-2 h-4 w-4">
              <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                <path
                  d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            View My Orders
          </Button>

          <Button variant="outline" onClick={onClose} className="w-full">
            Continue Shopping
          </Button>
        </div>

        {/* Customer Support */}
        <div className="mt-6 border-t border-border pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Need help? Contact our support team for assistance with your order.
          </p>
        </div>
      </div>
    </div>
  );
}
