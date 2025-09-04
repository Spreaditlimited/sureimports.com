"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { WalletPaymentDialog } from "./WalletPaymentDialog";
import svgPaths from "../imports/svg-3g55n0e1d6";

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cartTotal: string;
  onPaymentMethodSelect: (method: string) => void;
}

export function CheckoutDialog({ isOpen, onClose, cartTotal, onPaymentMethodSelect }: CheckoutDialogProps) {
  const [showWalletDialog, setShowWalletDialog] = useState(false);
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

  const handlePayNow = () => {
    onPaymentMethodSelect("Pay Now");
    // This would redirect to payment gateway
    alert("Pay Now selected - This would redirect to payment gateway");
    onClose();
  };

  const handlePaySmallSmall = () => {
    onPaymentMethodSelect("Pay Small Small");
    // Open the Pay Small Small app
    window.open('https://www.figma.com/make/r3zoDO6Qx8j2xCD4GIdsQN/Pay-Small-Small-NextJS-App?t=m0pDjeDNVlgmjIdv-6', '_blank');
    onClose();
  };

  const handlePayFromWallet = () => {
    setShowWalletDialog(true);
  };

  const handleWalletPaymentComplete = () => {
    onPaymentMethodSelect("Pay From Wallet");
    setShowWalletDialog(false);
    onClose();
  };

  const handleWalletDialogClose = () => {
    setShowWalletDialog(false);
  };

  // Don't render anything if not open
  if (!isOpen) return null;

  return (
    <>
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
              Choose Payment Method
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Select your preferred payment option to complete your purchase of {cartTotal}
            </p>
          </div>
          
          {/* Payment Options */}
          <div className="space-y-4">
            {/* Pay Now Option */}
            <button
              onClick={handlePayNow}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors flex items-center gap-3 py-4 px-4 rounded-lg border border-blue-600 hover:border-blue-700 group"
            >
              <div className="w-6 h-6 flex-shrink-0">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <path d={svgPaths.p3f087f00} fill="white" />
                  <path d={svgPaths.p4cbce00} fill="white" />
                  <path d={svgPaths.p261e480} fill="white" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-white text-base">Pay Now</div>
                <div className="text-blue-100 text-sm">Complete payment immediately via secure gateway</div>
              </div>
              <div className="w-5 h-5 flex-shrink-0">
                <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>

            {/* Pay Small Small Option */}
            <button
              onClick={handlePaySmallSmall}
              className="w-full bg-purple-600 hover:bg-purple-700 transition-colors flex items-center gap-3 py-4 px-4 rounded-lg border border-purple-600 hover:border-purple-700 group"
            >
              <div className="w-6 h-6 flex-shrink-0">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <path d={svgPaths.p3a008300} fill="white" />
                  <path d={svgPaths.p10caf200} fill="white" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-white text-base">Pay Small Small</div>
                <div className="text-purple-100 text-sm">Split payment into manageable installments</div>
              </div>
              <div className="w-5 h-5 flex-shrink-0">
                <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>

            {/* Pay From Wallet Option */}
            <button
              onClick={handlePayFromWallet}
              className="w-full bg-indigo-800 hover:bg-indigo-900 dark:bg-primary dark:hover:bg-primary/90 transition-colors flex items-center gap-3 py-4 px-4 rounded-lg border border-indigo-800 dark:border-primary hover:border-indigo-900 dark:hover:border-primary/90 group"
            >
              <div className="w-6 h-6 flex-shrink-0">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <path d={svgPaths.pe630880} fill="white" className="dark:fill-primary-foreground" />
                  <path d={svgPaths.p28711e0} fill="white" className="dark:fill-primary-foreground" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-white dark:text-primary-foreground text-base">Pay From Wallet</div>
                <div className="text-indigo-100 dark:text-primary-foreground/80 text-sm">Use your wallet balance for instant payment</div>
              </div>
              <div className="w-5 h-5 flex-shrink-0">
                <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" stroke="white" className="dark:stroke-primary-foreground" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-6 border-t border-border mt-6">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="px-6"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Wallet Payment Dialog */}
      <WalletPaymentDialog
        isOpen={showWalletDialog}
        onClose={handleWalletDialogClose}
        cartTotal={cartTotal}
        onPaymentComplete={handleWalletPaymentComplete}
      />
    </>
  );
}