"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";

interface WalletPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onPaymentComplete?: () => void;
}

export function WalletPaymentDialog({ isOpen, onClose, totalAmount, onPaymentComplete }: WalletPaymentDialogProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  // Mock wallet balance - in a real app this would come from an API or state management
  const walletBalance = 1500000; // ₦1,500,000.00
  
  // The payment amount is now directly the totalAmount number
  const paymentAmount = totalAmount || 0;
  const hasEnoughBalance = walletBalance >= paymentAmount;
  const canPay = hasEnoughBalance && isConfirmed;

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
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset confirmation when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsConfirmed(false);
    }
  }, [isOpen]);

  const handlePayment = () => {
    if (canPay) {
      if (onPaymentComplete) {
        onPaymentComplete();
      }
      onClose();
    }
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}.00`;
  };

  // Don't render anything if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto border border-border">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
        >
          <div className="w-5 h-5">
            <svg className="block size-full" fill="none" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground pr-8">
            Pay From Wallet
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Review your wallet balance and confirm payment
          </p>
        </div>
        
        {/* Wallet Balance Section */}
        <div className="bg-muted rounded-lg p-4 mb-6">
          <div className="space-y-3">
            {/* Wallet Balance */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Wallet Balance:</span>
              <span className={`font-semibold ${hasEnoughBalance ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(walletBalance)}
              </span>
            </div>
            
            {/* Payment Amount */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Payment Amount:</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(paymentAmount)}
              </span>
            </div>
            
            {/* Divider */}
            <div className="border-t border-border"></div>
            
            {/* Remaining Balance */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Remaining Balance:</span>
              <span className={`font-semibold ${hasEnoughBalance ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(hasEnoughBalance ? walletBalance - paymentAmount : 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Insufficient Balance Warning */}
        {!hasEnoughBalance && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 text-red-500 dark:text-red-400">
                <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                  <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-red-800 dark:text-red-200 font-medium text-sm">Insufficient Wallet Balance</p>
                <p className="text-red-600 dark:text-red-300 text-xs mt-1">
                  You need an additional {formatCurrency(paymentAmount - walletBalance)} to complete this payment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Checkbox */}
        <div className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="w-4 h-4 text-indigo-600 dark:text-primary bg-input-background dark:bg-input border-border rounded focus:ring-indigo-500 dark:focus:ring-primary focus:ring-2"
              />
            </div>
            <div className="text-sm">
              <div className="text-foreground">
                I confirm that I want to proceed with this payment from my wallet balance.
              </div>
              {hasEnoughBalance && (
                <div className="text-muted-foreground text-xs mt-1">
                  By checking this box, you authorize the deduction of {formatCurrency(paymentAmount)} from your wallet.
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          
          <button
            onClick={handlePayment}
            disabled={!canPay}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              canPay
                ? 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                : hasEnoughBalance
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 cursor-not-allowed border border-red-200 dark:border-red-800'
            }`}
          >
            {hasEnoughBalance ? 'Pay Now' : 'Insufficient Balance'}
          </button>
        </div>

        {/* Security Note */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-4 h-4">
              <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span>Your wallet transactions are secured with bank-level encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}