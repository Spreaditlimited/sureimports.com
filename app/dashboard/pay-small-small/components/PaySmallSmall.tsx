'use client'

import React, { useState, useEffect } from 'react'
import { Wallet } from 'lucide-react'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import  imgx  from './imports/logo.png'
import svgPaths from "../imports/svg-vry8tcjx11"

import { imgImage1, imgGroup } from "../imports/svg-2dlsy"
import { useAuth } from '@/app/context/AuthContext'
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert'
import Loading from '../../loading';
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type Status = 'SAVED' | 'STARTED' | 'COMPLETED' | 'CANCELLED'

interface Product {
  id: number
  title: string
  price: string
  date: string
  description: string
  image: string
  status: Status
  checked: boolean
  startDate?: string // For Started status products
}

const VuesaxOutlineWallet = React.memo(() => (
  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
    <g id="wallet-2">
      <path d={svgPaths.p19a4a480} fill="currentColor" />
      <path d={svgPaths.p33ea4180} fill="currentColor" />
      <path d={svgPaths.p3ddf5000} fill="currentColor" />
    </g>
  </svg>
))

const VuesaxOutlineArrowDown = React.memo(() => (
  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
    <g id="arrow-down">
      <path d={svgPaths.p3cbdb180} fill="currentColor" />
    </g>
  </svg>
))

const CheckboxIcon = React.memo(({ checked }: { checked: boolean }) => (
  <div className="relative shrink-0 size-[18px] overflow-clip">
    <div className={`absolute inset-0 border-2 rounded-sm transition-colors ${
      checked 
        ? 'bg-blue-600 border-blue-600' 
        : 'bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-500'
    }`} />
    {checked && (
      <div className="absolute inset-0 flex items-center justify-center">
        <svg 
          className="w-3 h-3 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={3} 
            d="M5 13l4 4L19 7" 
          />
        </svg>
      </div>
    )}
  </div>
))

interface WalletPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  totalAmount: number;
  productName: string;
  onPaymentConfirmed: () => void;
  isProcessing: boolean;
}

function WalletPaymentDialog({
  isOpen,
  onClose,
  walletBalance,
  totalAmount,
  productName,
  onPaymentConfirmed,
  isProcessing
}: WalletPaymentDialogProps) {
  const formatAmount = (amount: number) => {
    return amount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const hasInsufficientFunds = walletBalance < totalAmount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-green-600" />
            Claim Product from Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Product Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-gray-900 dark:text-white">Product Details</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{productName}</p>
          </div>

          {/* Balance and Amount Breakdown */}
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Wallet Balance
              </span>
              <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                ₦{formatAmount(walletBalance)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Amount to Pay
              </span>
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                ₦{formatAmount(totalAmount)}
              </span>
            </div>

            <div className={`flex justify-between items-center p-3 rounded-lg ${
              hasInsufficientFunds 
                ? 'bg-red-50 dark:bg-red-900/20' 
                : 'bg-gray-50 dark:bg-gray-800'
            }`}>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Remaining Balance
              </span>
              <span className={`text-lg font-semibold ${
                hasInsufficientFunds 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                ₦{formatAmount(walletBalance - totalAmount)}
              </span>
            </div>
          </div>

          {/* Insufficient Funds Warning */}
          {hasInsufficientFunds && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Insufficient Funds
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    You need an additional ₦{formatAmount(totalAmount - walletBalance)} to claim this product.
                    Please fund your wallet first.
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
              className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={onPaymentConfirmed}
              disabled={hasInsufficientFunds || isProcessing}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div> 
              ) : (
                `Claim Product - ₦${formatAmount(totalAmount)}`
              )}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2 border-t border-gray-200 dark:border-gray-700">
            Payment will be deducted from your wallet balance immediately
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function App({productx, status}: {productx: any, status: string}) {

  const router = useRouter();
  const { user } = useAuth();
  const navigateWithAlert = useNavigationWithAlert();

  const [products, setProducts] = useState<any[]>(productx);
  const [selectedStatus, setSelectedStatus] = useState<Status>('SAVED')
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [cancellingProductId, setCancellingProductId] = useState<any[] | null>([]) as any
  const [isProcessing, setIsProcessing] = useState(false)
  const [pidPaySmallSmall, setPidPaySmallSmall] = useState<string>('');

  const [pidUser, setPidUser] = useState(user?.pidUser);
  const [email, setEmail] = useState(user?.userEmail);
  const [amount, setAmount] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [customer, setCustomer] = useState<any | null>(null);
  const [transactions, setTransaction] = useState<any | null>(null);

  const [loading, setLoading] = useState(true);
  const [statusx, setStatus] = useState<string | null>(null);
  const [statusz, setStatusz] = useState<string | null>('');

  const [message, setMessage] = useState<string | null>(null);

  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [isWalletPaymentProcessing, setIsWalletPaymentProcessing] = useState(false);
  const [claimingProduct, setClaimingProduct] = useState<any>(null);

  // Client-only render to avoid SSR/CSR mismatches from auth/theme/locale
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])


  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        // Do not fetch until we have an email
        if (!email) {
          setLoading(false)
          return
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


    
  // Do not render on server; mount on client to prevent hydration mismatch
  if (!mounted) return null

  if(loading)
    return (
        <div>
          <Loading />
        </div>
    );


    if(!products)
      return (
          <div>
            <Loading />
          </div>
      );
    

  //////////// WALLET ACTIVATION //////////
  function walletActivation() {
    toast.info('Activating Wallet, please wait . . .');

    const activateWallet = async () => {
      try {
        const response = await fetch(
          '/api/paystack/wallet-customer-activation?pidUser=' + user?.pidUser,
        );

        const data: any = await response.json();

        const customerID = data.customerID;

        if (data.statusx == 'SUCCESS') {
          toast.success(data.message);

          try {
            const response = await fetch(
              '/api/paystack/wallet-bank-activation',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  customer: customerID,
                  preferred_bank: 'wema-bank',
                }),
              },
            );

            const data: any = await response.json();

            if (!data.status) {
              toast.warning(
                'Account Activation Failed, please try again or contact support. Error-Msg: ' +
                  data.message,
              );
            } else {
              navigateWithAlert(
                '/dashboard/wallet?status=SUCCESS',
                'success',
                'Wallet was successfully Activated!',
              );
              router.push('/dashboard/pay-small-small?status=SAVED');
              window.location.reload();
            }
          } catch (err) {
            toast.warning(
              'Account Activation Failed, please try again or contact support. Error: ' +
                err,
            );
          } finally {
            setLoading(false);
          }
        }
      } catch (statusx) {
      } finally {
        setLoading(false);
      }
    };

    activateWallet();
  }



    //DELETE PAY SMALL SMALL
    const startPaySmallSmall = async (
      pidUser: any,
      pidPaySmallSmall: any,
      pidProduct: any,
      amount: any,
    ) => {
      // Check if the users account is ready
      if (statusx == 'NO_ACCOUNT' || statusx == 'NO_CUSTOMER') {
        toast.warning(
          'You do not have a wallet account. Please activate your wallet to start paying small small.',
        );
        return;
      }
  
      // Check if the user has sufficient funds
      if (transactions.totalAmount < 5000) {
        toast.warning(
          'You do not have sufficient funds to activate pay small small. Fund your wallet with a minimum of N5,000 to Activate this product.',
        );
        return;
      }
  
      toast.info('Processing . . .');
      // Perform the action based on the button clicked
  
      try {
        const response = await fetch(
          '/api/pay-small-small/start?' +
            'pidUser=' +
            user?.pidUser +
            '&pidPaySmallSmall=' +
            pidPaySmallSmall +
            '&pidProduct=' +
            pidProduct,
        );
  
        const data: any = await response.json();
  
        if (data.statusx == 'SUCCESS') {
          toast.success(data.message);
          router.push('/dashboard/pay-small-small?status=STARTED');
        }
        if (data.statusx == 'FAILED') {
          toast.warning(data.message);
        }
      } catch (statusx) {
        toast.warning('Action failed! Error: ' + statusx);
      } finally {
        setLoading(false);
      }
    };
  
    //CANCEL PAY SMALL SMALL
    const cancelPaySmallSmall = async (
        productId: any,
        pidUser: any,
        pidPaySmallSmall: any,
        pidProduct: any,
        amount: any,
    ) => {

        toast.info('Cancelling Pay Small Small . . .');
        // Perform the action based on the button clicked
    
        try {
          const response = await fetch(
            '/api/pay-small-small/cancel?' +
              'pidUser=' +
              user?.pidUser +
              '&pidPaySmallSmall=' +
              pidPaySmallSmall +
              '&pidProduct=' +
              pidProduct,
          );
  
        const data: any = await response.json();
  
        if (data.statusx == 'SUCCESS') {
          toast.success(data.message);
          await router.push('/dashboard/pay-small-small?status=CANCELLED');
          window.location.reload();
          setShowCancelDialog(false);
          
        }
        if (data.statusx == 'FAILED') {
          toast.warning(data.message);
        }
      } catch (statusx) {
        toast.warning('Action failed! Error: ' + statusx);
      } finally {
        setLoading(false);
      }
    };
  


    
    // CLAIM PAY SMALL SMALL
    const claimPaySmallSmall = async (
      productId: any,
      pidUser: any,
      pidPaySmallSmall: any,
      pidProduct: any,
      amount: any,
    ) => {
      // Set the product being claimed and show dialog
      setClaimingProduct({
        productId,
        pidUser,
        pidPaySmallSmall,
        pidProduct,
        amount
      });
      setShowWalletDialog(true);
    };

    const handleWalletPaymentConfirmed = async () => {
      if (!claimingProduct) return;
  
      setIsWalletPaymentProcessing(true);
      
      try {
        const { productId, pidUser, pidPaySmallSmall, pidProduct, amount } = claimingProduct;
  
        // Build the API URL with proper parameters
        const apiUrl = new URL('/api/pay-from-wallet-pss', window.location.origin);
        apiUrl.searchParams.append('pidUser', pidUser);
        apiUrl.searchParams.append('pidPaySmallSmall', pidPaySmallSmall);
        apiUrl.searchParams.append('pidProduct', pidProduct);
        apiUrl.searchParams.append('amount', amount.toString());
  
        const response = await fetch(apiUrl.toString());
        const data: any = await response.json();
  
        if (data.statusx === 'SUCCESS') {
          toast.success(data.message);
          setShowWalletDialog(false);
          setClaimingProduct(null);
          router.push('/dashboard/pay-small-small?status=COMPLETED');
          window.location.reload();
        } else if (data.statusx === 'FAILED') {
          toast.warning(data.message);
          setShowWalletDialog(false);
        } else {
          toast.warning('Claim failed. Please try again.');
          setShowWalletDialog(false);
        }
      } catch (error) {
        console.error('Wallet claim error:', error);
        toast.warning('Action failed! Error: ' + error);
        setShowWalletDialog(false);
      } finally {
        setIsWalletPaymentProcessing(false);
      }
    };

  
      


  // Utility function to parse price string to number
  const parsePrice = (priceString: string): number => {
    if (typeof priceString !== 'string') {
      console.error('Invalid priceString:', priceString);
      return 0; // Return 0 if priceString is not a valid string
    }
    return parseFloat(priceString.replace(/[₦,]/g, ''));
  }




  // Deterministic date formatting (UTC) to prevent SSR/CSR mismatches
  const formatDateForSSR = (input: unknown): string => {
    if (!input) return '';
    const d = new Date(input as any);
    if (isNaN(d.getTime())) return String(input ?? '');
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    }).format(d) + ' UTC';
  }

    


  // Check if wallet balance is sufficient for a product
  const hasSufficientBalance = (productPrice: string): boolean => {
    // Use actual wallet balance from transactions instead of hardcoded walletBalance
    const balance = transactions?.totalAmount || 0;
    const price = parseFloat(productPrice);
    return balance >= price;
  }

  const handleStatusChange = (value: Status) => {
    setSelectedStatus(value)
  }

  const handleProductCheck = (productId: number) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, checked: !product.checked }
        : product
    ))
  }

  const handleActivate = (productId:any, pidPaySmallSmall:any, pidUser:any, pidProduct:any, amount:any) => {
    startPaySmallSmall(
      pidUser,
      pidPaySmallSmall,
      pidProduct,
      amount,
    );
  }

  const handleClaim = (productId:any, pidPaySmallSmall:any, pidUser:any, pidProduct:any, amount:any) => {
    claimPaySmallSmall(
      productId,
      pidUser,
      pidPaySmallSmall,
      pidProduct,
      amount,
    );
  }



  const handleCancelRequest = (productId:any, pidPaySmallSmall:any, pidUser:any, pidProduct:any, amount:any) => {
    setCancellingProductId([productId, pidPaySmallSmall, pidUser, pidProduct, amount])
    setShowCancelDialog(true)
  }

  const handleCancelConfirm = async () => {

    if (cancellingProductId === null) return

    let productId = cancellingProductId[0];
    let pidPaySmallSmall = cancellingProductId[1];
    let pidUser = cancellingProductId[2];
    let pidProduct = cancellingProductId[3];
    let amount = cancellingProductId[4];

    cancelPaySmallSmall(
      productId,
      pidUser,
      pidPaySmallSmall,
      pidProduct,
      amount,
    );


    setIsProcessing(true)
    

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500))

    setProducts(products.map(product => 
      product.id === cancellingProductId 
        ? { ...product, status: 'CANCELLED', checked: false }
        : product
    ))

    setIsProcessing(false)
    setShowSuccessDialog(true)
    setCancellingProductId(null)
  }

  const handleCancelDismiss = () => {
    setShowCancelDialog(false)
    setCancellingProductId(null)
  }

  const handleSuccessClose = () => {
    setShowSuccessDialog(false)
  }

  const filteredProducts = products.filter(product => product.status === selectedStatus)

  const getStatusDisplayName = (status: Status) => {
    return status.toLowerCase().charAt(0).toUpperCase() + status.toLowerCase().slice(1);  
  }



  
  const ProductImage = React.memo(({ image, title }: { image?: string | null; title?: string }) => {
    const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
    const hasImage = Boolean(image && base)
    const src = hasImage ? `${base}/${image}` : undefined

    return (
      <div className="relative w-full h-[280px] sm:h-[240px] bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 rounded-[24px] overflow-hidden shadow-inner group-hover:shadow-lg transition-all duration-300">
        <div className="absolute border-2 border-neutral-200/50 dark:border-neutral-600/50 inset-0 pointer-events-none rounded-[24px]" />
        <div className="absolute inset-0 p-6 flex items-center justify-center">
          {hasImage ? (
            <img
              src={src}
              alt={title || 'Product image'}
              className="max-w-full max-h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Hide broken images gracefully
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <span className="text-sm">No image available</span>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
      </div>
    )
  })

  const ProductCard = React.memo(({ product }: { product: any }) => {
    // Get the appropriate checkbox label based on status
    const getCheckboxLabel = (status: Status) => {
      switch (status) {
        case 'SAVED':
          return 'Check this box to Activate Pay Small Small for this product'
        case 'STARTED':
          return 'Check this box to cancel Pay Small Small for this product'
        default:
          return ''
      }
    }

    // Determine if checkbox should be shown
    const showCheckbox = product.status === 'SAVED' || product.status === 'STARTED'

    // Check if user can claim this product based on wallet balance
    // Use transactions.totalAmount instead of walletBalance string
    const canClaim = transactions?.totalAmount >= parseFloat(product.amount);

    return (
      <Card className="bg-card border-0 w-full h-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card via-card to-accent/10 overflow-hidden group">
        <CardContent className="p-6 h-full flex flex-col relative">
          
          {/* Use null-safe access with fallback */}
          <ProductImage
            image={product?.store?.productImage ?? product?.productImage ?? null}
            title={product?.productName ?? 'Product'}
          />
          
          <div className="flex-1 flex flex-col space-y-4 mt-6">
            
            <div className="space-y-3">
              <h3 className="text-foreground font-semibold leading-tight dark:text-white">{product.productName}</h3>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  {
                  parseFloat(product.amount as any)
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                  }
                </p>
                <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-xs font-medium">
                  NGN
                </div>
              </div>
              <p className="text-base sm:text-sm text-muted-foreground">{formatDateForSSR(product.createdAt)}</p>
            </div>
            
            <div className="border-t border-border/30 pt-4">
              <p className="text-base sm:text-sm text-muted-foreground leading-relaxed flex-1">{product.productDescription}</p>
            </div>
            
            <div className="space-y-4 mt-auto">
              {/* Countdown Timer - only for STARTED status */}
              {
                product.status === 'STARTED' && product.createdAt && (
                  <CountdownTimer startDate={String(product.createdAt)} />
                )
              }
              
              {/* Checkbox - only for Saved and Started status */}
              {showCheckbox && (
                <div className="flex flex-row gap-[5px] items-center">
                  <button onClick={() => handleProductCheck(product.id)}>
                    <CheckboxIcon checked={product.checked} />
                  </button>
                  <p className="text-base sm:text-sm text-foreground dark:text-white">
                    {getCheckboxLabel(product.status)}
                  </p>
                </div>
              )}
              
              {/* Buttons for Saved status */}
              {product.status === 'SAVED' && (
                <div className="space-y-3 w-full">
                  <Button 
                    onClick={() => handleActivate(
                      //productId, pidPaySmallSmall, pidUser, pidProduct
                      product.id, product.pidPaySmallSmall, product.pidUser, product.pidProduct, product.amount
                    )}
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 text-white disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-300 disabled:text-gray-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold"
                    disabled={!product.checked}
                  >
                    <span className="flex items-center gap-2">
                      ✨ Activate Pay Small Small
                    </span>
                  </Button>
                </div>
              )}
              
              {/* Buttons for Started status */}
              {product.status === 'STARTED' && (
                <div className="space-y-3 w-full">

                  <Button 
                    onClick={() => handleCancelRequest(product.id, product.pidPaySmallSmall, product.pidUser, product.pidProduct, product.amount)}
                    variant="outline" 
                    className="w-full h-12 border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 disabled:border-gray-300 disabled:text-gray-300 disabled:hover:bg-transparent shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
                    disabled={!product.checked}
                  >
                        <span className="flex items-center gap-2">
                          ⚠️ Cancel Pay Small Small
                        </span>
                  </Button>
                  
                  <Button 
                    onClick={() => handleClaim(product.id, product.pidPaySmallSmall, product.pidUser, product.pidProduct, product.amount)}
                    className="w-full h-12 bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 hover:from-green-700 hover:via-green-800 hover:to-emerald-800 text-white disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-300 disabled:text-gray-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold"
                    disabled={!canClaim}
                  >
                    <span className="flex items-center gap-2">
                      {canClaim ? '🎉 Claim Product' : '💰 Insufficient Balance'}
                    </span>
                  </Button>
                </div>
              )}
              
              {/* Status messages for Completed and Cancelled */}
              {product.status === 'COMPLETED' && (
                <div className="p-5 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">✓</span></div>
                    <p className="text-green-800 dark:text-green-400 text-base font-semibold">
                      Payment Completed Successfully! 🎉
                    </p>
                  </div>
                </div>
              )}
              
              {product.status === 'CANCELLED' && (
                <div className="p-5 bg-gradient-to-r from-red-50 via-pink-50 to-red-50 dark:from-red-900/20 dark:via-pink-900/20 dark:to-red-900/20 rounded-xl border-2 border-red-200 dark:border-red-800 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">✕</span></div>
                        <p className="text-red-800 dark:text-red-400 text-base font-semibold">
                          Payment Plan Cancelled
                        </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  })

  return (
    <div className="min-h-screen dark:bg-black text-foreground index-0" suppressHydrationWarning>
      {/* Main Content */}
      <div className="relative z-10x container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Header */}
        {/* <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
            Pay Small Small
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage your installment payments with ease</p>
        </div> */}

        {/* Virtual Account Details */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 dark:text-white">
            <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
            Virtual Account Details
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Account Info */}
            <Card className="lg:col-span-2 shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card via-card to-accent/20">
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/30">
                    <span className="text-muted-foreground font-medium">Bank</span>
                    <div className="font-bold text-foreground text-lg dark:text-white">{customer?.bankName ?? ''}</div>
                  </div>
                  <div className="space-y-2 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800/30">
                    <span className="text-muted-foreground font-medium">Account Name</span>
                    <div className="font-bold text-foreground text-lg break-all dark:text-white">{customer?.bankAccountName ?? ''}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800/30">
                    <span className="text-muted-foreground font-medium">Account Number</span>
                    <div className="font-bold text-foreground text-xl font-mono tracking-wider dark:text-white">{customer?.bankAccountNumber ?? ''}</div>
                  </div>
                  <div className="space-y-2 p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/30">
                    <span className="text-muted-foreground font-medium">Currency</span>
                    <div className="font-bold text-foreground text-lg dark:text-white">{customer?.currency ?? ''}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Balance */}
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-700 text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-indigo-600/80"></div>
              
              {(statusx == 'NO_ACCOUNT' || statusx == 'NO_CUSTOMER') && (
                    <CardContent className="p-8 flex items-start justify-between relative z-10x">
                    <div className="space-y-3">
                      <p className="text-purple-100 font-medium">Wallet Balance</p>

                      <p className="text-3xl font-bold text-white">
                      ₦0.00
                      </p>

                      <div className="flex items-center gap-2 text-purple-100">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        <span className="text-sm">No Wallet Account </span>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                      <Wallet className="h-8 w-8 text-white" />
                    </div>
                  </CardContent>
              )}

              {statusx == 'WALLET_READY' && (
              <CardContent className="p-8 flex items-start justify-between relative z-10x">
                <div className="space-y-3">
                  <p className="text-purple-100 font-medium">Wallet Balance</p>
                  <p className="text-3xl font-bold text-white">
                  ₦
                  
                  {
                    Number(transactions?.totalAmount ?? 0)
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  </p>
                  <div className="flex items-center gap-2 text-purple-100">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Active</span>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
              </CardContent>
          )}
              
            </Card>
          </div>
        </div>

        {/* Products Section */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-card via-card to-accent/10 rounded-2xl border border-border/50 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-1.5 h-6 sm:h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full flex-shrink-0"></div>
                <h2 className="text-lg sm:text-2xl font-bold text-foreground dark:text-white">
                  {getStatusDisplayName(selectedStatus)} Products
                </h2>
              </div>
              <span className="self-start sm:self-auto px-2 sm:px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs sm:text-sm font-medium flex-shrink-0">
                {filteredProducts.length}
              </span>
            </div>
            
            <div className="flex-shrink-0 w-full sm:w-auto">
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="dark:text-white w-full sm:w-40 md:w-48 h-10 sm:h-12 border-2 border-border/50 bg-background/80 backdrop-blur-sm hover:bg-accent/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-md border-border/50">
                  <SelectItem value="SAVED" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">Saved</SelectItem>
                  <SelectItem value="STARTED" className="hover:bg-orange-50 dark:hover:bg-orange-900/20">Started</SelectItem>
                  <SelectItem value="COMPLETED" className="hover:bg-green-50 dark:hover:bg-green-900/20">Completed</SelectItem>
                  <SelectItem value="CANCELLED" className="hover:bg-red-50 dark:hover:bg-red-900/20">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product:any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground dark:text-white">No Products Found</h3>
                <p className="text-muted-foreground">No products found for the "{selectedStatus}" status.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Cancel Pay Small Small</DialogTitle>
            <DialogDescription className="text-center">
              Please confirm your cancellation decision below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-base sm:text-sm text-muted-foreground text-center leading-relaxed">
              You are about to discontinue paying in installments for this product. If you cancel, we will automatically withhold 2.5% of the paid amount to cover administrative costs and leave the balance in your wallet. You can choose to withdraw the balance to your bank account or pay for another product.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={handleCancelDismiss}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Don't Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelConfirm}
              disabled={isProcessing}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {isProcessing ? 'Processing...' : 'Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pay Small Small Cancelled</DialogTitle>
            <DialogDescription>
              Your Pay Small Small has been successfully cancelled.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={handleSuccessClose} className="w-full sm:w-auto">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Wallet Payment Dialog */}
      {claimingProduct && (
        <WalletPaymentDialog
          isOpen={showWalletDialog}
          onClose={() => {
            setShowWalletDialog(false);
            setClaimingProduct(null);
          }}
          walletBalance={transactions?.totalAmount || 0}
          totalAmount={parseFloat(claimingProduct.amount)}
          productName={products.find(p => p.id === claimingProduct.productId)?.productName || 'Product'}
          onPaymentConfirmed={handleWalletPaymentConfirmed}
          isProcessing={isWalletPaymentProcessing}
        />
      )}
    </div>
  )
}

// Countdown Timer Component
const CountdownTimer = React.memo(({ startDate }: { startDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const start = new Date(startDate)
      const sixMonthsLater = new Date(start)
      sixMonthsLater.setMonth(start.getMonth() + 6)
      
      const now = new Date()
      const difference = sixMonthsLater.getTime() - now.getTime()

      if (difference <= 0) {
        setIsExpired(true)
        setTimeLeft({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30))
      const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ months, days, hours, minutes, seconds })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [startDate])

  if (isExpired) {
    return (
      <div className="p-4 sm:p-5 bg-gradient-to-br from-red-50 via-pink-50 to-red-50 dark:from-red-900/20 dark:via-pink-900/20 dark:to-red-900/20 rounded-xl border border-red-200 dark:border-red-800 shadow-md">
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg">⚠️</span>
          </div>
          <p className="text-red-800 dark:text-red-400 font-semibold text-center">
            Payment deadline expired - Plan will be cancelled
          </p>
        </div>
      </div>
    )
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0')
})