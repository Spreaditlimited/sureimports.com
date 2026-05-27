// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { WalletPaymentDialog } from './WalletPaymentDialog';
import svgPaths from '../imports/svg-3g55n0e1d6';

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cartTotal: string;
  onPaymentMethodSelect: (method: string) => void;
}

export function CheckoutDialog({
  isOpen,
  onClose,
  cartTotal,
  onPaymentMethodSelect,
}: CheckoutDialogProps) {
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
    onPaymentMethodSelect('Pay Now');
    // This would redirect to payment gateway
    alert('Pay Now selected - This would redirect to payment gateway');
    onClose();
  };

  const handlePaySmallSmall = () => {
    onPaymentMethodSelect('Pay Small Small');
    // Open the Pay Small Small app
    window.open(
      'https://www.figma.com/make/r3zoDO6Qx8j2xCD4GIdsQN/Pay-Small-Small-NextJS-App?t=m0pDjeDNVlgmjIdv-6',
      '_blank',
    );
    onClose();
  };

  const handlePayFromWallet = () => {
    setShowWalletDialog(true);
  };

  const handleWalletPaymentComplete = () => {
    onPaymentMethodSelect('Pay From Wallet');
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
        <div className="relative mx-4 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <div className="h-5 w-5">
              <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="pr-8 text-xl font-semibold text-foreground">
              Choose Payment Method
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Select your preferred payment option to complete your purchase of{' '}
              {cartTotal}
            </p>
          </div>

          {/* Payment Options */}
          <div className="space-y-4">
            {/* Pay Now Option */}
            <button
              onClick={handlePayNow}
              className="group flex w-full items-center gap-3 rounded-lg border border-blue-600 bg-blue-600 px-4 py-4 transition-colors hover:border-blue-700 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <div className="h-6 w-6 flex-shrink-0">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 24 24"
                >
                  <path d={svgPaths.p3f087f00} fill="white" />
                  <path d={svgPaths.p4cbce00} fill="white" />
                  <path d={svgPaths.p261e480} fill="white" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="text-base font-semibold text-white">
                  Pay Now
                </div>
                <div className="text-sm text-blue-100">
                  Complete payment immediately via secure gateway
                </div>
              </div>
              <div className="h-5 w-5 flex-shrink-0">
                <svg
                  className="block size-full"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>

            {/* Pay Small Small Option */}
            <button
              onClick={handlePaySmallSmall}
              className="group flex w-full items-center gap-3 rounded-lg border border-purple-600 bg-purple-600 px-4 py-4 transition-colors hover:border-purple-700 hover:bg-purple-700"
            >
              <div className="h-6 w-6 flex-shrink-0">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 24 24"
                >
                  <path d={svgPaths.p3a008300} fill="white" />
                  <path d={svgPaths.p10caf200} fill="white" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="text-base font-semibold text-white">
                  Pay Small Small
                </div>
                <div className="text-sm text-purple-100">
                  Split payment into manageable installments
                </div>
              </div>
              <div className="h-5 w-5 flex-shrink-0">
                <svg
                  className="block size-full"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>

            {/* Pay From Wallet Option */}
            <button
              onClick={handlePayFromWallet}
              className="group flex w-full items-center gap-3 rounded-lg border border-indigo-800 bg-indigo-800 px-4 py-4 transition-colors hover:border-indigo-900 hover:bg-indigo-900 dark:border-primary dark:bg-primary dark:hover:border-primary/90 dark:hover:bg-primary/90"
            >
              <div className="h-6 w-6 flex-shrink-0">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d={svgPaths.pe630880}
                    fill="white"
                    className="dark:fill-primary-foreground"
                  />
                  <path
                    d={svgPaths.p28711e0}
                    fill="white"
                    className="dark:fill-primary-foreground"
                  />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="text-base font-semibold text-white dark:text-primary-foreground">
                  Pay From Wallet
                </div>
                <div className="text-sm text-indigo-100 dark:text-primary-foreground/80">
                  Use your wallet balance for instant payment
                </div>
              </div>
              <div className="h-5 w-5 flex-shrink-0">
                <svg
                  className="block size-full"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="white"
                    className="dark:stroke-primary-foreground"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end border-t border-border pt-6">
            <Button variant="outline" onClick={onClose} className="px-6">
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
