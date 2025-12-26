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

interface CancelOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderNumber: string;
  orderTotal: string;
}

export default function CancelOrderDialog({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
  orderTotal,
}: CancelOrderDialogProps) {
  // Calculate the refund amount (minus 2.5% inconvenience fee)
  const calculateRefund = (totalString: string) => {
    // Check if totalString is undefined or null, provide default
    if (!totalString) {
      return {
        refund: 0,
        fee: 0,
        original: 0,
      };
    }

    // Extract numeric value from price string (e.g., "₦967,500.00" -> 967500)
    const numericValue = parseInt(
      totalString.replace(/[₦,\s]/g, '').split('.')[0],
    );
    const refundAmount = numericValue * 0.975; // 97.5% of original amount
    const feeAmount = numericValue * 0.025; // 2.5% fee

    return {
      refund: Math.round(refundAmount),
      fee: Math.round(feeAmount),
      original: numericValue,
    };
  };

  const { refund, fee } = calculateRefund(orderTotal);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <svg
                className="h-5 w-5 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            Cancel Order {orderNumber}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Are you sure you want to cancel this order? Please review the
                implications below:
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Implications List */}
          <div className="space-y-3 rounded-lg bg-muted p-4">
            <h4 className="font-medium text-foreground">
              What happens when you cancel:
            </h4>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <svg
                    className="h-3 w-3 text-red-600 dark:text-red-400"
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
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Order Processing Stopped
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your order will no longer be processed and shipment will be
                    cancelled.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                  <svg
                    className="h-3 w-3 text-yellow-600 dark:text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Inconvenience Fee Applied
                  </p>
                  <p className="text-sm text-muted-foreground">
                    A 2.5% inconvenience fee (₦{fee.toLocaleString()}) will be
                    deducted from your refund.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <svg
                    className="h-3 w-3 text-green-600 dark:text-green-400"
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
                  <p className="font-medium text-foreground">
                    Automatic Wallet Credit
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ₦{refund.toLocaleString()} will be automatically credited to
                    your wallet.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <svg
                    className="h-3 w-3 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Flexible Wallet Usage
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Use your wallet balance to purchase other products or
                    withdraw to your bank account.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Breakdown */}
          <div className="rounded-lg bg-accent p-4">
            <h4 className="mb-3 font-medium text-foreground">
              Refund Breakdown:
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Total:</span>
                <span className="font-medium text-foreground">
                  {orderTotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Inconvenience Fee (2.5%):
                </span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  -₦{fee.toLocaleString()}
                </span>
              </div>
              <div className="my-2 h-px bg-border"></div>
              <div className="flex justify-between">
                <span className="font-medium text-foreground">
                  Wallet Credit:
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  ₦{refund.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-3">
          <Button variant="outline" onClick={onClose}>
            Keep Order
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
            }}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
          >
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
