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
import { Card } from './ui/card';
import { useState } from 'react';

interface TopUpDialogProps {
  bankName?: any;
  accountName?: any;
  accountNumber?: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function TopUpDialog({
  bankName,
  accountName,
  accountNumber,
  isOpen,
  onClose,
}: TopUpDialogProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const bankDetails = {
    bankName: bankName,
    accountName: accountName,
    accountNumber: accountNumber,
    sortCode: 'Not Applicable',
    transferReference: 'WALLET-TOPUP',
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <svg
                className="h-4 w-4 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V12M12 12V18M12 12H18M12 12H6"
                />
              </svg>
            </div>
            Top Up Your Wallet
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Transfer to the account below. Funds reflect within 2-5 minutes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Bank Account Details */}
          <Card className="border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <svg
                className="h-4 w-4 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10H21M7 15H1M13 15H21M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 5 3.89543 5 5V19C5 20.1046 3.89543 21 5 21Z"
                />
              </svg>
              Bank Account Details
            </h4>

            <div className="space-y-2">
              {/* Bank Name */}
              <div className="flex items-center justify-between rounded border bg-background p-2">
                <div>
                  <p className="text-xs text-muted-foreground">Bank Name</p>
                  <p className="text-sm font-medium text-foreground">
                    {bankName}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(bankDetails.bankName, 'bankName')
                  }
                  className="h-8 w-8 p-0 text-blue-600 dark:text-blue-400"
                >
                  {copiedField === 'bankName' ? (
                    <svg
                      className="h-3 w-3"
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
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6C4.89543 16 4 15.1046 4 14V6C4 4.89543 4.89543 4 6 4H14C15.1046 4 16 4.89543 16 6V8M10 12H18C19.1046 12 20 12.8954 20 14V20C20 21.1046 19.1046 22 18 22H10C8.89543 22 8 21.1046 8 20V14C8 12.8954 8.89543 12 10 12Z"
                      />
                    </svg>
                  )}
                </Button>
              </div>

              {/* Account Name */}
              <div className="flex items-center justify-between rounded border bg-background p-2">
                <div>
                  <p className="text-xs text-muted-foreground">Account Name</p>
                  <p className="text-sm font-medium text-foreground">
                    {accountName}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(bankDetails.accountName, 'accountName')
                  }
                  className="h-8 w-8 p-0 text-blue-600 dark:text-blue-400"
                >
                  {copiedField === 'accountName' ? (
                    <svg
                      className="h-3 w-3"
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
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6C4.89543 16 4 15.1046 4 14V6C4 4.89543 4 6 4H14C15.1046 4 16 4.89543 16 6V8M10 12H18C19.1046 12 20 12.8954 20 14V20C20 21.1046 19.1046 22 18 22H10C8.89543 22 8 21.1046 8 20V14C8 12.8954 8.89543 12 10 12Z"
                      />
                    </svg>
                  )}
                </Button>
              </div>

              {/* Account Number */}
              <div className="flex items-center justify-between rounded border bg-background p-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Account Number
                  </p>
                  <p className="text-sm font-medium tracking-wider text-foreground">
                    {accountNumber}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(accountNumber, 'accountNumber')
                  }
                  className="h-8 w-8 p-0 text-blue-600 dark:text-blue-400"
                >
                  {copiedField === 'accountNumber' ? (
                    <svg
                      className="h-3 w-3"
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
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6C4.89543 16 4 15.1046 4 14V6C4 4.89543 4.89543 4 6 4H14C15.1046 4 16 4.89543 16 6V8M10 12H18C19.1046 12 20 12.8954 20 14V20C20 21.1046 19.1046 22 18 22H10C8.89543 22 8 21.1046 8 20V14C8 12.8954 8.89543 12 10 12Z"
                      />
                    </svg>
                  )}
                </Button>
              </div>

              {/* Sort Code */}
              <div className="flex items-center justify-between rounded border bg-background p-2">
                <div>
                  <p className="text-xs text-muted-foreground">Sort Code</p>
                  <p className="text-sm font-medium tracking-wider text-foreground">
                    {bankDetails.sortCode}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(bankDetails.sortCode, 'sortCode')
                  }
                  className="h-8 w-8 p-0 text-blue-600 dark:text-blue-400"
                >
                  {copiedField === 'sortCode' ? (
                    <svg
                      className="h-3 w-3"
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
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6C4.89543 16 4 15.1046 4 14V6C4 4.89543 4.89543 4 6 4H14C15.1046 4 16 4.89543 16 6V8M10 12H18C19.1046 12 20 12.8954 20 14V20C20 21.1046 19.1046 22 18 22H10C8.89543 22 8 21.1046 8 20V14C8 12.8954 8.89543 12 10 12Z"
                      />
                    </svg>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Instructions & Notice */}
          <div className="rounded-lg bg-muted p-3">
            <h4 className="mb-2 text-sm font-medium text-foreground">
              Quick Instructions:
            </h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Use mobile banking or visit a branch</span>
              </div>
              <div className="flex gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Funds reflect within 2-5 minutes</span>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-amber-600 dark:bg-amber-400">
                <svg
                  className="h-2 w-2 text-white dark:text-amber-900"
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
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Security Notice
                </h4>
                <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                  Only transfer from accounts in your name. Third-party
                  transfers may be rejected.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-3">
          <Button onClick={onClose} className="w-full">
            Got it, I'll make the transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
