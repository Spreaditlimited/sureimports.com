'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

interface CancelSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: {
    orderNumber: string;
    refundAmount: string;
  } | null;
  onGoToWallet: () => void;
}

export default function CancelSuccessDialog({
  isOpen,
  onClose,
  orderDetails,
  onGoToWallet,
}: CancelSuccessDialogProps) {
  if (!orderDetails || !isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <svg
                className="h-5 w-5 text-green-600 dark:text-green-400"
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
            </div>
            Order Successfully Cancelled
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Your order {orderDetails.orderNumber} has been successfully
                cancelled and moved to the Cancelled Orders tab.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Success Message */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-600 dark:bg-green-400">
                <svg
                  className="h-3 w-3 text-white dark:text-green-900"
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
              </div>
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-200">
                  Refund Credited Successfully
                </h4>
                <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                  <span className="font-semibold">
                    {orderDetails.refundAmount}
                  </span>{' '}
                  has been automatically credited to your wallet.
                </p>
              </div>
            </div>
          </div>

          {/* Wallet Information */}
          <div className="rounded-lg bg-muted p-4">
            <h4 className="mb-3 font-medium text-foreground">
              What you can do with your wallet balance:
            </h4>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <svg
                    className="h-2.5 w-2.5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V11M5 9H19L18 21H6L5 9Z"
                    />
                  </svg>
                </div>
                <span className="text-muted-foreground">
                  Use it to purchase other products instantly
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <svg
                    className="h-2.5 w-2.5 text-purple-600 dark:text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7C17 5.34315 15.6569 4 14 4H10C8.34315 4 7 5.34315 7 7V9M3 11L21 11M5 21H19C20.1046 21 21 20.1046 21 19V13C21 11.8954 20.1046 11 19 11H5C3.89543 11 3 11.8954 3 13V19C3 20.1046 3.89543 21 5 21Z"
                    />
                  </svg>
                </div>
                <span className="text-muted-foreground">
                  Withdraw to your bank account
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                  <svg
                    className="h-2.5 w-2.5 text-orange-600 dark:text-orange-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6L21 12L9 19Z"
                    />
                  </svg>
                </div>
                <span className="text-muted-foreground">
                  Combine with other payment methods
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose}>
            Continue Shopping
          </Button>
          <Button
            onClick={() => {
              onGoToWallet();
              onClose();
            }}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10H21M7 15H1M13 15H21M5 21H19C20.1046 21 21 20.1046 21 19V13C21 11.8954 20.1046 11 19 11H5C3.89543 11 3 11.8954 3 13V19C3 20.1046 3.89543 21 5 21Z"
              />
            </svg>
            Go to Wallet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
