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
import imgImage from "asset/f92fee668398ade3037049641a93d24fd459fa68.png"
import imgImage2 from "figma:asset/27d4ec04ddb84fba75591233e680f165d5cb6726.png"
import imgAdobeExpressFile41 from "figma:asset/de3ce56cf2aad05726683d46c461a21611e2b82b.png"
import imgImage3 from "figma:asset/ea715f49495dbfc812bf1773fc538cb0cbd3f088.png"
import imgSubtract from "figma:asset/4964a0ebe3d64b53b49b697a91f64216e204411f.png"
import { imgImage1, imgGroup } from "../imports/svg-2dlsy"
import { useAuth } from '@/app/context/AuthContext'
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert'
import Loading from '../../loading';

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
    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-500 rounded-sm" />
    {checked && (
      <div
        className="absolute inset-[5.208%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.938px] mask-size-[18px_18px]"
        style={{ maskImage: `url('${imgGroup}')` }}
      >
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
          <g id="Group">
            <path d={svgPaths.p1ce82000} fill="var(--color-primary)" />
            <path d={svgPaths.p25628e20} fill="var(--color-primary)" />
          </g>
        </svg>
      </div>
    )}
  </div>
))

export default function App({productx, status}: {productx: any, status: string}) {

  const [products, setProducts] = useState<any[]>(productx);
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [selectedStatus, setSelectedStatus] = useState<Status>('SAVED')
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [cancellingProductId, setCancellingProductId] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [walletBalance] = useState('₦120.00') // Wallet balance

    const { user } = useAuth();
    const navigateWithAlert = useNavigationWithAlert();
  
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

    useEffect(() => {
      const fetchCustomer = async () => {
        try {
          const response = await fetch(`/api/paystack/get-customer/${email}`);
  
          // if (!response.ok) {
          //   throw new Error('Failed to fetch customer data');
          // }
  
          const data: any = await response.json();
  
          //alert(data.statusx+' '+data.message);
          setStatus(data.statusx);
          setMessage(data.message);
          setCustomer(data.customerDetails);
          setTransaction(data.transactionDetails);
        } catch (statusx) {
          //setError(error instanceof Error ? error.message : 'Unknown error');
          //setStatus(statusx as string);
        } finally {
          setLoading(false);
        }
      };
  
      fetchCustomer();
    }, [email]);
  
    if (loading)
      return (
        <div>
          <Loading />
        </div>
      );

//alert(JSON.stringify(products));

// model paysmallsmall {
//   id                Int       @id @default(autoincrement())
//   pidPaySmallSmall  String    @unique()
//   pidUser           String   
//   pidProduct        String?  
//   productName       String?   
//   productDescription String? 
//   amount            Float
//   quantity          Int
//   status            PayStatus
//   ext1              String?
//   ext2              String?
//   statusx           String?
//   createdAt         DateTime? @default(now())
//   updatedAt         DateTime? @default(now())
//   store             store?    @relation(fields: [pidProduct], references: [pidProduct]) // Add this relation
// }


// const [products, setProducts] = useState<any[]>
// (
//   [
//       {
//         id: 1,
//         productName: 'MacBook Air 13.3" (2015, i5, 4GB RAM, 128GB SSD) – Classic Mac, Ultra Portable',
//         amount: '₦378,000.00',
//         createdAt: 'Fri Aug 01 2025 12:17:17 GMT+0100 (West Africa Standard Time)',
//         productDescription: 'A perfect entry-level MacBook for students, writers, and everyday users. The 2015 MacBook Air...',
//         image: "./imports/logo.png",
//         status: "SAVED" as Status,
//         checked: false
//       },
//   ]
// );

//alert(JSON.stringify(products));
//[{"id":1,"productName":"MacBook Air 13.3\" (2015, i5, 4GB RAM, 128GB SSD) – Classic Mac, Ultra Portable","amount":"₦378,000.00","createdAt":"Fri Aug 01 2025 12:17:17 GMT+0100 (West Africa Standard Time)","productDescription":"A perfect entry-level MacBook for students, writers, and everyday users. The 2015 MacBook Air...","image":"./imports/logo.png","status":"SAVED","checked":false}]

  const [productsx, setProductsx] = useState<Product[]>([
    {
      id: 1,
      title: 'MacBook Air 13.3" (2015, i5, 4GB RAM, 128GB SSD) – Classic Mac, Ultra Portable',
      price: '₦378,000.00',
      date: 'Fri Aug 01 2025 12:17:17 GMT+0100 (West Africa Standard Time)',
      description: 'A perfect entry-level MacBook for students, writers, and everyday users. The 2015 MacBook Air...',
      image: "./imports/logo.png",
      status: 'SAVED',
      checked: false
    },
    {
      id: 2,
      title: 'HP EliteBook x360 1040 G8 – Power Meets Elegance',
      price: '₦1,015,875.00',
      date: 'Fri Aug 01 2025 12:17:17 GMT+0100 (West Africa Standard Time)',
      description: 'Experience elite performance in a sleek, convertible design with the HP EliteBook...',
      image: "./imports/logo.png",
      status: 'SAVED',
      checked: false
    },
    {
      id: 3,
      title: 'iPhone 15 Pro Max – Titanium Power. Ultimate Performance. Pro Beyond.',
      price: '₦1,299,000.00',
      date: 'Fri Aug 01 2025 12:17:17 GMT+0100 (West Africa Standard Time)',
      description: 'Experience next-level performance with the iPhone 15 Pro Max – built with aerospace-grade titanium construction.',
      image: "./imports/logo.png",
      status: 'SAVED',
      checked: false
    },
    {
      id: 4,
      title: 'Samsung Galaxy S24 Ultra – Epic Performance. Ultra Clarity. Built to Lead.',
      price: '₦1,179,500.00',
      date: 'Fri Aug 01 2025 12:17:17 GMT+0100 (West Africa Standard Time)',
      description: 'Push boundaries with the Galaxy S24 Ultra – featuring a sleek armor aluminum body...',
      image: "./imports/logo.png",
      status: 'SAVED',
      checked: false,
      startDate: 'Fri Mar 01 2025 12:17:17 GMT+0100 (West Africa Standard Time)' // Started 5.5 months ago for demo
    },
    {
      id: 5,
      title: 'iPad Pro 12.9" (2022) – M2 Chip, 256GB, Wi-Fi + Cellular',
      price: '₦850,000.00',
      date: 'Fri Aug 01 2025 12:17:17 GMT+0100 (West Africa Standard Time)',
      description: 'The ultimate iPad experience with M2 chip performance and stunning Liquid Retina XDR display.',
      image: "./imports/logo.png",
      status: 'SAVED',
      checked: false
    },
    {
      id: 6,
      title: 'Apple Watch Series 9 – Advanced Health Monitoring',
      price: '₦320,000.00',
      date: 'Fri Aug 01 2025 12:17:17 GMT+0100 (West Africa Standard Time)',
      description: 'Stay connected and monitor your health with the most advanced Apple Watch yet.',
      image: "./imports/logo.png",
      status: 'SAVED',
      checked: false
    }
  ])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Utility function to parse price string to number
  const parsePrice = (priceString: string): number => {
    if (typeof priceString !== 'string') {
      console.error('Invalid priceString:', priceString);
      return 0; // Return 0 if priceString is not a valid string
    }
    return parseFloat(priceString.replace(/[₦,]/g, ''));
  }

  // Check if wallet balance is sufficient for a product
  const hasSufficientBalance = (productPrice: string): boolean => {
    const balance = parsePrice(walletBalance)
    const price = parsePrice(productPrice)
    return balance >= price
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
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

  const handleActivate = (productId: number) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, status: 'STARTED', checked: false, createdAt: new Date().toString() }
        : product
    ))
  }

  const handleClaim = (productId: number) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, status: 'COMPLETED', checked: false }
        : product
    ))
  }

  const handleCancelRequest = (productId: number) => {
    setCancellingProductId(productId)
    setShowCancelDialog(true)
  }

  const handleCancelConfirm = async () => {
    if (cancellingProductId === null) return

    setIsProcessing(true)
    setShowCancelDialog(false)

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

  const ProductImage = React.memo(({ image, title }: { image: string; title: string }) => (
    <div className="relative w-full h-[280px] sm:h-[240px] bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 rounded-[24px] overflow-hidden shadow-inner group-hover:shadow-lg transition-all duration-300">
      <div className="absolute border-2 border-neutral-200/50 dark:border-neutral-600/50 inset-0 pointer-events-none rounded-[24px]" />
      <div className="absolute inset-0 p-6 flex items-center justify-center">
        <img
          src={
            (process.env.NEXT_PUBLIC_R2_PUBLIC_URL +
              '/' +
              `${image}`) as string
          }
          alt={title}
          className="max-w-full max-h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
    </div>
  ))

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
    const canClaim = hasSufficientBalance(product.amount)
    

    return (
      <Card className="bg-card border-0 w-full h-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card via-card to-accent/10 overflow-hidden group">
        <CardContent className="p-6 h-full flex flex-col relative">
          <ProductImage image={product.store.productImage} title={product.productName} />
          
          <div className="flex-1 flex flex-col space-y-4 mt-6">
            <div className="space-y-3">
              <h3 className="text-foreground font-semibold leading-tight dark:text-white">{product.productName}</h3>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">{product.amount}</p>
                <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-xs font-medium">
                  NGN
                </div>
              </div>
              <p className="text-base sm:text-sm text-muted-foreground">{String(product.createdAt)}</p>
            </div>
            
            <div className="border-t border-border/30 pt-4">
              <p className="text-base sm:text-sm text-muted-foreground leading-relaxed flex-1">{product.productDescription}</p>
            </div>
            
            <div className="space-y-4 mt-auto">
              {/* Countdown Timer - only for Started status */}
              {product.status === 'Started' && product.createdAt && (
                <CountdownTimer startDate={product.createdAt} />
              )}
              
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
                    onClick={() => handleActivate(product.id)}
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
                    onClick={() => handleCancelRequest(product.id)}
                    variant="outline" 
                    className="w-full h-12 border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 disabled:border-gray-300 disabled:text-gray-300 disabled:hover:bg-transparent shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
                    disabled={!product.checked}
                  >
                    <span className="flex items-center gap-2">
                      ⚠️ Cancel Pay Small Small
                    </span>
                  </Button>
                  
                  <Button 
                    onClick={() => handleClaim(product.id)}
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
    <div className="min-h-screen dark:bg-black text-foreground index-0">
      {/* Main Content */}
      <div className="relative z-10x container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
            Pay Small Small
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage your installment payments with ease</p>
        </div>

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
                    <div className="font-bold text-foreground text-lg dark:text-white">Wema Bank</div>
                  </div>
                  <div className="space-y-2 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800/30">
                    <span className="text-muted-foreground font-medium">Account Name</span>
                    <div className="font-bold text-foreground text-lg break-all dark:text-white">SUREIMPORTERS/ATSU EMMANUEL</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800/30">
                    <span className="text-muted-foreground font-medium">Account Number</span>
                    <div className="font-bold text-foreground text-xl font-mono tracking-wider dark:text-white">9322401979</div>
                  </div>
                  <div className="space-y-2 p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/30">
                    <span className="text-muted-foreground font-medium">Currency</span>
                    <div className="font-bold text-foreground text-lg dark:text-white">NGN</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Balance */}
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-700 text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-indigo-600/80"></div>
              <CardContent className="p-8 flex items-start justify-between relative z-10x">
                <div className="space-y-3">
                  <p className="text-purple-100 font-medium">Wallet Balance</p>
                  <p className="text-3xl font-bold text-white">{walletBalance}</p>
                  <div className="flex items-center gap-2 text-purple-100">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Active</span>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
              </CardContent>
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
                <h3 className="text-xl font-semibold text-foreground">No Products Found</h3>
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

  // return (
  //   <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 rounded-2xl border border-orange-200 dark:border-orange-800 shadow-lg">
  //     {/* Header */}
  //     <div className="px-4 py-3 sm:px-5 sm:py-4 text-center border-b border-orange-200/50 dark:border-orange-700/50">
  //       <div className="flex items-center justify-center gap-2">
  //         <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></div>
  //         <h4 className="text-orange-900 dark:text-orange-300 font-bold">
  //           ⏰ Payment Deadline
  //         </h4>
  //       </div>
  //     </div>

  //     {/* Countdown Grid */}
  //     <div className="p-4 sm:p-5">
  //       <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-4">
  //         <div className="flex flex-col items-center space-y-2">
  //           <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-orange-200 dark:border-orange-700 shadow-sm hover:shadow-md transition-all duration-200 w-full aspect-square flex items-center justify-center min-h-[44px] sm:min-h-[52px]">
  //             <span className="text-orange-800 dark:text-orange-400 font-bold text-base sm:text-xl">
  //               {formatNumber(timeLeft.months)}
  //             </span>
  //           </div>
  //           <span className="text-orange-600 dark:text-orange-500 text-xs font-medium">Mo</span>
  //         </div>

  //         <div className="flex flex-col items-center space-y-2">
  //           <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-orange-200 dark:border-orange-700 shadow-sm hover:shadow-md transition-all duration-200 w-full aspect-square flex items-center justify-center min-h-[44px] sm:min-h-[52px]">
  //             <span className="text-orange-800 dark:text-orange-400 font-bold text-base sm:text-xl">
  //               {formatNumber(timeLeft.days)}
  //             </span>
  //           </div>
  //           <span className="text-orange-600 dark:text-orange-500 text-xs font-medium">Days</span>
  //         </div>

  //         <div className="flex flex-col items-center space-y-2">
  //           <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-orange-200 dark:border-orange-700 shadow-sm hover:shadow-md transition-all duration-200 w-full aspect-square flex items-center justify-center min-h-[44px] sm:min-h-[52px]">
  //             <span className="text-orange-800 dark:text-orange-400 font-bold text-base sm:text-xl">
  //               {formatNumber(timeLeft.hours)}
  //             </span>
  //           </div>
  //           <span className="text-orange-600 dark:text-orange-500 text-xs font-medium">Hrs</span>
  //         </div>

  //         <div className="flex flex-col items-center space-y-2">
  //           <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-orange-200 dark:border-orange-700 shadow-sm hover:shadow-md transition-all duration-200 w-full aspect-square flex items-center justify-center min-h-[44px] sm:min-h-[52px]">
  //             <span className="text-orange-800 dark:text-orange-400 font-bold text-base sm:text-xl">
  //               {formatNumber(timeLeft.minutes)}
  //             </span>
  //           </div>
  //           <span className="text-orange-600 dark:text-orange-500 text-xs font-medium">Min</span>
  //         </div>

  //         <div className="flex flex-col items-center space-y-2">
  //           <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-orange-200 dark:border-orange-700 shadow-sm hover:shadow-md transition-all duration-200 w-full aspect-square flex items-center justify-center min-h-[44px] sm:min-h-[52px]">
  //             <span className="text-orange-800 dark:text-orange-400 font-bold text-base sm:text-xl animate-pulse">
  //               {formatNumber(timeLeft.seconds)}
  //             </span>
  //           </div>
  //           <span className="text-orange-600 dark:text-orange-500 text-xs font-medium">Sec</span>
  //         </div>
  //       </div>

  //       {/* Warning Message */}
  //       <div className="bg-orange-100/80 dark:bg-orange-900/30 rounded-xl p-3 sm:p-4 border border-orange-200/60 dark:border-orange-700/60">
  //         <div className="flex items-start gap-2">
  //           <span className="text-orange-600 dark:text-orange-400 text-sm flex-shrink-0 mt-0.5">⚡</span>
  //           <p className="text-orange-800 dark:text-orange-400 text-xs sm:text-sm font-medium leading-relaxed">
  //             Complete payments before this time or plan will be auto-cancelled
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )
})