'use client';

import { useEffect, useState } from 'react';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Check,
  Wallet,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BiMoney } from 'react-icons/bi';
import Paystack from '@/components/uix/Paystack';
import { useAuth } from '@/app/context/AuthContext';
import PaystackButton from '@/components/paystack/PaystackButtonStore';
import { toast } from 'sonner';
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Wallet Payment Dialog Component
interface WalletPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  totalAmount: number;
  productName: string;
  quantity: number;
  onPaymentConfirmed: () => void;
  isProcessing: boolean;
}

function WalletPaymentDialog({
  isOpen,
  onClose,
  walletBalance,
  totalAmount,
  productName,
  quantity,
  onPaymentConfirmed,
  isProcessing,
}: WalletPaymentDialogProps) {
  const formatAmount = (amount: number) => {
    return amount
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const hasInsufficientFunds = walletBalance < totalAmount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
            <Wallet className="h-5 w-5 text-green-600" />
            Pay from Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Product Info */}
          <div className="space-y-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Purchase Details
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {productName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Quantity: {quantity}
            </p>
          </div>

          {/* Balance and Amount Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Wallet Balance
              </span>
              <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                ₦{formatAmount(walletBalance)}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Amount to Pay
              </span>
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                ₦{formatAmount(totalAmount)}
              </span>
            </div>

            <div
              className={`flex items-center justify-between rounded-lg p-3 ${
                hasInsufficientFunds
                  ? 'bg-red-50 dark:bg-red-900/20'
                  : 'bg-gray-50 dark:bg-gray-800'
              }`}
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Remaining Balance
              </span>
              <span
                className={`text-lg font-semibold ${
                  hasInsufficientFunds
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                ₦{formatAmount(walletBalance - totalAmount)}
              </span>
            </div>
          </div>

          {/* Insufficient Funds Warning */}
          {hasInsufficientFunds && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Insufficient Funds
                  </h4>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                    You need an additional ₦
                    {formatAmount(totalAmount - walletBalance)} to complete this
                    purchase. Please fund your wallet or choose a different
                    payment method.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={onPaymentConfirmed}
              disabled={hasInsufficientFunds || isProcessing}
              className="flex-1 bg-green-600 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Processing...
                </div>
              ) : (
                `Pay ₦${formatAmount(totalAmount)}`
              )}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="border-t border-gray-200 pt-2 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
            Payment will be deducted from your wallet balance immediately
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ProductDetails({ product }: any) {
  const router = useRouter();
  const { user } = useAuth();

  const [pidUser, setPidUser] = useState(user?.pidUser as string);
  const [email, setEmail] = useState(user?.userEmail as string);
  const [quantity, setQuantity] = useState(1);

  // Calculate price based on quantity
  const price = quantity * (product.productPrice as number);
  const amount = price;

  const [activeTab, setActiveTab] = useState('description');
  const [showTooltip, setShowTooltip] = useState(false);

  // Wallet payment states
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [isWalletPaymentProcessing, setIsWalletPaymentProcessing] =
    useState(false);

  const navigateWithAlert = useNavigationWithAlert();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [cancellingProductId, setCancellingProductId] = useState<any[] | null>(
    [],
  ) as any;
  const [isProcessing, setIsProcessing] = useState(false);
  const [pidPaySmallSmall, setPidPaySmallSmall] = useState<string>('');

  const [customer, setCustomer] = useState<any | null>(null);
  const [transactions, setTransaction] = useState<any | null>(null);

  const [loading, setLoading] = useState(true);
  const [statusx, setStatus] = useState<string | null>(null);
  const [statusz, setStatusz] = useState<string | null>('');

  const [message, setMessage] = useState<string | null>(null);

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handlePaymentSuccess = (reference: string) => {
    console.log('Payment initiated, reference:', reference);
    toast.info('Payment Successful!');
    router.push('/dashboard/success/payment');
  };

  const handlePaymentClose = () => {
    console.log('Payment was closed');
    toast.info('Payment was closed');
    router.push('/dashboard/failed/payment');
  };

  const handleVerificationComplete = (success: boolean, data?: any) => {
    if (success) {
      console.log('Payment successful:', data);
      toast.success('Payment verified successfully!');
      router.push('/dashboard/success/payment');
    } else {
      console.log('Payment failed:', data);
      const errorMessage =
        data?.message || data?.error || 'Payment verification failed';
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        // Do not fetch until we have an email
        if (!email) {
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/paystack/get-customer/${email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch customer data');
        }

        const data: any = await response.json();

        setStatus(data.statusx);
        setMessage(data.message);
        setCustomer(data.customerDetails);
        setTransaction(data.transactionDetails);
      } catch (statusx) {
        setStatus(statusx as string);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [email]);

  // Handle wallet payment button click
  const handleWalletPaymentClick = () => {
    if (!transactions || !transactions.totalAmount) {
      toast.warning('Unable to load wallet information. Please try again.');
      return;
    }
    setShowWalletDialog(true);
  };

  // Handle wallet payment confirmation
  const handleWalletPaymentConfirmed = async () => {
    setIsWalletPaymentProcessing(true);

    try {
      await payFromWallet(
        product.pidProduct, // productId
        pidUser, // pidUser
        pidPaySmallSmall, // pidPaySmallSmall (this might be empty/undefined)
        product.pidProduct, // pidProduct
        price, // amount (already includes quantity)
      );
    } catch (error) {
      console.error('Wallet payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsWalletPaymentProcessing(false);
      setShowWalletDialog(false);
    }
  };

  // PAY FROM WALLET FUNCTION
  const payFromWallet = async (
    productId: any,
    pidUser: any,
    pidPaySmallSmall: any,
    pidProduct: any,
    amount: any,
  ) => {
    // Check if amount is valid for product claim
    if (parseFloat(transactions.totalAmount) < parseFloat(amount)) {
      toast.warning(
        `You do not have sufficient funds to claim this product. Fund your wallet with a minimum of ₦${parseFloat(
          amount,
        )
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} to claim this product.`,
      );
      return;
    }

    toast.info('Processing Purchase...');

    try {
      // Build the API URL with proper parameters
      const apiUrl = new URL('/api/pay-from-wallet/', window.location.origin);
      apiUrl.searchParams.append('pidUser', user?.pidUser || '');
      apiUrl.searchParams.append('pidPaySmallSmall', pidPaySmallSmall || '');
      apiUrl.searchParams.append('pidProduct', pidProduct);
      apiUrl.searchParams.append('amount', amount.toString());
      apiUrl.searchParams.append('quantity', quantity.toString());

      const response = await fetch(apiUrl.toString());
      const data: any = await response.json();

      if (data.statusx === 'SUCCESS') {
        toast.success(data.message);
        router.push('/dashboard/success/payment');
        setShowWalletDialog(false);
        // Optionally refresh the page or update the wallet balance
        // window.location.reload();
      } else if (data.statusx === 'FAILED') {
        toast.warning(data.message);
      } else {
        toast.warning('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.warning('Action failed! Error: ' + error);
    } finally {
      setIsWalletPaymentProcessing(false);
    }
  };

  return (
    <div className="mx-autox max-w-7xlx m-7 mb-14 rounded-lg bg-white p-8 shadow-md dark:bg-gray-900">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <img
              src={
                (process.env.NEXT_PUBLIC_R2_PUBLIC_URL +
                  '/' +
                  `${product.productImage}`) as string
              }
              alt="Product Image"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="mb-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {product.productBrand}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {product.productName}
            </h1>
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                5.0{' '}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₦
              {
                parseFloat(price.toString())
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
              }
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              MOQ - {product.productMOQ}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              {product.productDescription}
            </p>
          </div>

          <div className="items-center sm:flex md:space-x-4 lg:space-x-4">
            <div className="mb-5 flex w-fit items-center rounded-md border border-gray-300 px-4 py-2 align-middle dark:border-gray-700 xl:mb-0">
              <button
                onClick={decrementQuantity}
                className="py-1x px-3 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                -
              </button>

              <span className="py-1x px-3 text-gray-900 dark:text-white">
                {quantity}
              </span>

              <button
                onClick={incrementQuantity}
                className="py-1x px-3 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                +
              </button>
            </div>

            <PaystackButton
              title={' Pay '}
              email={email}
              amount={amount * quantity} // Paystack requires amount in kobo
              pidUser={pidUser}
              pidProduct={product.pidProduct}
              productPrice={product.productPrice as any}
              productName={product.productName}
              quantity={quantity as any}
              currency={'NGN'}
              serviceID={product.pidProduct}
              serviceName={'SURESTORE'}
              serviceDescription={'Online Purchase'}
              publicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''}
              onSuccess={handlePaymentSuccess}
              onClose={handlePaymentClose}
              onVerificationComplete={handleVerificationComplete}
              fullName={user?.userFirstname}
              // phone={user?.userPhone || ''}
              // address={user?.userAddress || ''}
              deliveryOption={'N/A'}
              deliveryLocation={'N/A'}
              metadata={{
                custom_fields: [
                  {
                    display_name: 'Payment For',
                    variable_name: 'payment_for',
                    value: 'Online Purchase',
                  },
                ],
              }}
            />

            <div className="relative">
              <button
                onClick={() =>
                  router.push(
                    '/dashboard/store/pay-small-small-terms?id=' +
                      product.pidProduct,
                  )
                }
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="mt-5 flex w-full flex-1 items-center justify-center rounded-md bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50 xl:mt-0"
              >
                <BiMoney className="mr-2 h-6 w-6" />
                Pay Small Small
              </button>
            </div>
          </div>

          <hr />
          <button
            onClick={handleWalletPaymentClick}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="mt-5 flex w-full flex-1 items-center justify-center rounded-md bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 xl:mt-0"
          >
            <Wallet className="mr-2 h-6 w-6" />
            Pay from Wallet
          </button>
          <hr />

          <button
            onClick={() => router.push('/dashboard/store?id=laptop')}
            className="mt-3 flex flex-1 items-center justify-center rounded-md bg-slate-600 px-4 py-2 font-medium text-white transition-colors hover:bg-slate-700"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Back to Store
          </button>

          <hr />
        </div>
      </div>

      {/* Wallet Payment Dialog */}
      <WalletPaymentDialog
        isOpen={showWalletDialog}
        onClose={() => setShowWalletDialog(false)}
        walletBalance={transactions?.totalAmount || 0}
        totalAmount={price} // Already includes quantity
        productName={product.productName}
        quantity={quantity}
        onPaymentConfirmed={handleWalletPaymentConfirmed}
        isProcessing={isWalletPaymentProcessing}
      />

      {/* Product Details Tabs */}
      <div className="mb-10 mt-12">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="-mb-px grid grid-cols-3">
            <button
              onClick={() => setActiveTab('description')}
              className={`inline-block p-4 text-center ${
                activeTab === 'description'
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Description
            </button>

            <button
              onClick={() => setActiveTab('features')}
              className={`inline-block p-4 text-center ${
                activeTab === 'features'
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Features
            </button>

            <button
              onClick={() => setActiveTab('specifications')}
              className={`inline-block p-4 text-center ${
                activeTab === 'specifications'
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Pay Small Small
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-0 rounded-b-md border border-t-0 p-4 text-gray-700 dark:text-gray-300">
          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="space-y-4">
              <p>{product.productDescription}</p>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <ul className="space-y-3">{product.productFeature}</ul>
          )}

          {/* Specifications Tab */}
          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
              <div>
                <p>{product.productSpecification}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
