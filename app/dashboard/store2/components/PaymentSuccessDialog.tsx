"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";

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
  orderNumber = `#${Date.now().toString().slice(-6)}`
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
    return "0.00"
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
      <div className={`relative bg-card rounded-xl shadow-2xl w-full max-w-md mx-auto p-6 border border-border transform transition-all duration-300 ${
        isAnimated ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className={`w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-all duration-500 ${
            isAnimated ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
          }`}>
            <div className="w-8 h-8 text-green-600 dark:text-green-400">
              <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Payment Successful!
          </h2>
          <p className="text-sm text-muted-foreground">
            Your order has been confirmed and will be processed shortly.
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-muted rounded-lg p-4 mb-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Order Number:</span>
            <span className="font-semibold text-foreground">{orderNumber}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Payment Method:</span>
            <span className="font-medium text-foreground">{getPaymentMethodText()}</span>
          </div>
          
          <div className="border-t border-border pt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount Paid:</span>
              <span className="font-semibold text-green-600 dark:text-green-400 text-lg">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Order Status Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5">
              <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-blue-800 dark:text-blue-200 font-medium text-sm mb-1">
                What happens next?
              </p>
              <p className="text-blue-600 dark:text-blue-300 text-xs">
                You'll receive an email confirmation shortly. Your order will be shipped from China within 2-3 business days and should arrive within 10 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button 
            onClick={onGoToOrders}
            className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-primary dark:hover:bg-primary/90 text-white"
          >
            <div className="w-4 h-4 mr-2">
              <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            View My Orders
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full"
          >
            Continue Shopping
          </Button>
        </div>

        {/* Customer Support */}
        <div className="mt-6 pt-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Need help? Contact our support team for assistance with your order.
          </p>
        </div>
      </div>
    </div>
  );
}