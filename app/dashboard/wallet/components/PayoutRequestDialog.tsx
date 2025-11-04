"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface PayoutRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  pidUser: string;
  onPayoutRequested: () => void;
}

export default function PayoutRequestDialog({ 
  isOpen, 
  onClose, 
  walletBalance, 
  pidUser,
  onPayoutRequested 
}: PayoutRequestDialogProps) {
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [payoutRequested, setPayoutRequested] = useState(false);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [payoutData, setPayoutData] = useState<any>(null);

  const formatCurrency = (amount: number): string => {
    return `₦${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const validateAmount = (): boolean => {
    const payoutAmount = parseFloat(amount);

    if (!amount || isNaN(payoutAmount) || payoutAmount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    if (payoutAmount > walletBalance) {
      setError('Amount exceeds available balance');
      return false;
    }

    if (payoutAmount < 1000) {
      setError('Minimum payout amount is ₦1,000');
      return false;
    }

    setError('');
    return true;
  };

  const handleProceedToConfirmation = () => {
    if (!validateAmount()) {
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmPayout = async () => {
    if (!validateAmount()) {
      return;
    }

    setIsLoading(true);

    try {
      const payoutAmount = parseFloat(amount);
      
      const response = await fetch('/api/payout-request/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pidUser: pidUser,
          amount: payoutAmount,
        }),
      });

      const result = await response.json();
      
      if (result.statusx === 'SUCCESS') {
        console.log('Payout request created:', result.data);
        setPayoutData(result.data);
        toast.success(result.message);
        setShowConfirmation(false);
        setPayoutRequested(true);
        
        // Notify parent component to refresh
        onPayoutRequested();
        
        // Auto close after 5 seconds
        setTimeout(() => {
          handleClose();
        }, 5000);
      } else {
        console.error('Payout request failed:', result.message);
        toast.error(result.message);
        setShowConfirmation(false);
      }
    } catch (error) {
      console.error('Error creating payout request:', error);
      toast.error('Failed to create payout request. Please try again later.');
      setShowConfirmation(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowConfirmation(false);
    setPayoutRequested(false);
    setAmount('');
    setError('');
    setPayoutData(null);
    onClose();
  };

  // Success Screen
  if (payoutRequested && payoutData) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600 dark:text-green-400"
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
              Payout Request Submitted
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-600 dark:bg-green-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white dark:text-green-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200">Request Confirmed</h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Your payout request for <span className="font-semibold">{formatCurrency(payoutData.amount)}</span> has been submitted successfully.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Payout Details:</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference:</span>
                  <span className="font-mono text-foreground">{payoutData.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(payoutData.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium">
                    Pending
                  </span>
                </div>
              </div>
            </div>

            {payoutData.bankDetails && (
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-3">Bank Details:</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank:</span>
                    <span className="text-foreground">{payoutData.bankDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account:</span>
                    <span className="font-mono text-foreground">{payoutData.bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="text-foreground">{payoutData.bankDetails.accountName}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">What happens next:</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-muted-foreground">Our team will process your payout within 24 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7C17 5.34315 15.6569 4 14 4H10C8.34315 4 7 5.34315 7 7V9M3 11L21 11M5 21H19C20.1046 21 21 20.1046 21 19V13C21 11.8954 20.1046 11 19 11H5C3.89543 11 3 11.8954 5 13V19C3 20.1046 3.89543 21 5 21Z" />
                    </svg>
                  </div>
                  <span className="text-muted-foreground">Funds will be transferred to your registered bank account</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8V16M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" />
                    </svg>
                  </div>
                  <span className="text-muted-foreground">Funds will be credited within 3 business days</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                This dialog will close automatically in a few seconds...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Confirmation Screen
  if (showConfirmation) {
    const payoutAmount = parseFloat(amount);
    
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-orange-600 dark:text-orange-400"
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
              Confirm Payout Request
            </DialogTitle>
            <DialogDescription>
              Please confirm that you want to request a payout of the specified amount.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Available Balance:</span>
                <span className="font-medium text-foreground">{formatCurrency(walletBalance)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payout Amount:</span>
                <span className="font-semibold text-foreground text-lg">{formatCurrency(payoutAmount)}</span>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-600 dark:bg-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white dark:text-amber-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-200">Please Note</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Once submitted, this payout request cannot be cancelled. The funds will be transferred to your registered bank account.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowConfirmation(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmPayout}
              className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Confirm Payout Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Main Input Screen
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7C17 5.34315 15.6569 4 14 4H10C8.34315 4 7 5.34315 7 7V9M3 11L21 11M5 21H19C20.1046 21 21 20.1046 21 19V13C21 11.8954 20.1046 11 19 11H5C3.89543 11 3 11.8954 5 13V19C3 20.1046 3.89543 21 5 21Z"
                />
              </svg>
            </div>
            Request Payout
          </DialogTitle>
          <DialogDescription>
            Transfer funds from your wallet to your registered bank account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Balance */}
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Available Balance:</span>
              <span className="font-bold text-foreground text-lg">{formatCurrency(walletBalance)}</span>
            </div>
          </Card>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="payout-amount" className="text-sm font-medium">
              Payout Amount (₦)
            </Label>
            <Input
              id="payout-amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              min="1000"
              max={walletBalance}
              className={error ? 'border-red-500' : ''}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Min: ₦1,000 • Max: {formatCurrency(walletBalance)}
            </p>
          </div>

          {/* Information */}
          <Card className="p-4">
            <h4 className="font-medium text-foreground mb-2 text-sm">Important Information:</h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">•</span>
                </div>
                <span className="text-muted-foreground">Funds will be transferred to your registered bank account</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">•</span>
                </div>
                <span className="text-muted-foreground">Processed within 24 hours, received in 3 business days</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">•</span>
                </div>
                <span className="text-muted-foreground">No processing fees charged</span>
              </div>
            </div>
          </Card>

          {/* Bank Account Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-600 dark:bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-2.5 h-2.5 text-white dark:text-yellow-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 text-xs">Bank Account Required</h4>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-0.5">
                  Ensure your bank details are added in account settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleProceedToConfirmation}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
            disabled={!amount || parseFloat(amount) <= 0}
          >
            Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

