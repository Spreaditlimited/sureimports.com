'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { 
  ArrowLeft, 
  Wallet, 
  Info, 
  Loader2, 
  Phone, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  RefreshCcw, 
  CheckCircle2 
} from 'lucide-react';

import { useAuth } from '@/app/context/AuthContext';
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';
import { resolveMediaUrl } from '@/lib/cloudinary/url';

const STEPS = [
  {
    number: '01',
    icon: Wallet,
    title: 'Virtual Account',
    content: 'A dedicated virtual account will be created for you. Pay at your own pace, ensuring full payment within 6 months.',
  },
  {
    number: '02',
    icon: CreditCard,
    title: '5% Service Fee',
    content: 'All payments attract a 5% fee to help us manage exchange rate fluctuations and payment processor charges.',
  },
  {
    number: '03',
    icon: Truck,
    title: 'Shipping & Delivery',
    content: 'Your product will be secured immediately but will only be shipped from China after full payment is received.',
  },
  {
    number: '04',
    icon: CheckCircle2,
    title: 'Activation Deposit',
    content: 'To activate your Pay Small Small account, an initial deposit of ₦5,000 is required to your virtual account.',
  },
  {
    number: '05',
    icon: RefreshCcw,
    title: 'Cancel Anytime',
    content: 'You can cancel at any time. We will refund your total amount paid, less a 2.5% administrative fee.',
  },
];

export default function PaySmallSmallApp({ product }: any) {
  const router = useRouter();
  const { user } = useAuth();
  const navigateWithAlert = useNavigationWithAlert();

  const calculateAmount = () => {
    const basePrice = parseFloat(product?.productPrice) || 0;
    if (basePrice <= 0) return 0;
    return basePrice + basePrice * 0.05;
  };

  const [pidUser] = useState(user?.pidUser);
  const [email] = useState(user?.userEmail);
  const [pidProduct] = useState(product?.pidProduct);
  const [amount] = useState(calculateAmount());
  const [quantity] = useState(1);
  
  const [phone, setPhoneNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const isValidPhone = phone && phone.length >= 10 && /^\+?[0-9\s-()]+$/.test(phone);
  const productImageUrl = resolveMediaUrl(product?.productImage) || '/placeholder.svg?height=800&width=800';

  useEffect(() => {
    const fetchUser = async () => {
      if (!pidUser) return;
      try {
        const res = await fetch(`/api/user/${pidUser}`);
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setPhoneNumber(data.phone || '');
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [pidUser]);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isValidPhone) return;

    setIsLoading(true);
    toast.info('Initializing your virtual account...');

    const formData = new FormData();
    formData.append('pidUser', pidUser as string);
    formData.append('userEmail', email as string);
    formData.append('pidProduct', pidProduct as string);
    formData.append('phone', phone);
    formData.append('amount', amount.toString());
    formData.append('quantity', quantity.toString());

    try {
      const res = await fetch('/api/crud/pay-small-small/add-product', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.statusx === 'SUCCESS') {
        navigateWithAlert('/dashboard/pay-small-small?status=SAVED', 'success', data.message);
      } else if (data.statusx === 'NO_PHONE_NUMBER') {
        toast.warning(data.message);
      } else {
        toast.error(data.message || 'Failed to process request.');
      }
    } catch (error: any) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      
      {/* Deep Slate Hero Section */}
      <div className="bg-slate-900 pb-32 pt-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <button 
            onClick={() => router.back()} 
            className="group mb-8 flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Product
          </button>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                  Flexible Payments
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                Pay Small Small
              </h1>
              <p className="mt-3 text-sm font-medium text-slate-400 md:text-base max-w-xl">
                Lock in your purchase today and pay at your own pace over the next 6 months. No hidden pressure.
              </p>
            </div>
            
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20">
                <Wallet className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white">0% Interest</p>
                <p className="text-xs text-slate-400">Fixed 5% Service Fee</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          
          {/* LEFT: Product Showcase (Sticky on Desktop) */}
          <div className="w-full lg:sticky lg:top-24 lg:w-[400px] shrink-0">
            <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/20 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
              
              <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-800/50 p-8">
                <Image
                  src={productImageUrl}
                  alt={product?.productName || 'Product'}
                  fill
                  className="object-contain mix-blend-multiply dark:mix-blend-normal p-8"
                  priority
                />
              </div>

              <div className="p-6 sm:p-8">
                <span className="mb-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {product?.productBrand || 'Product'}
                </span>
                <h2 className="mb-6 text-xl font-bold leading-tight text-slate-900 dark:text-white line-clamp-2">
                  {product?.productName}
                </h2>
                
                <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Total Plan Value</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                      ₦{formatAmount(amount)}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <Info className="h-4 w-4 text-indigo-400" />
                    Includes base price + 5% PSS Fee
                  </div>
                </div>
              </div>
              
            </div>
          </div>

          {/* RIGHT: Terms & Form */}
          <div className="flex-1 space-y-8">
            
            {/* Terms Content */}
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">How it works</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed">
                Review the terms of our installment plan carefully. Once activated, your product will be reserved immediately.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {STEPS.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className={`rounded-2xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50 ${index === STEPS.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Step {step.number}
                        </span>
                      </div>
                      <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">{step.title}</h3>
                      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {step.content}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Activation Form */}
            <div className="rounded-[32px] border border-indigo-100 bg-indigo-50/50 p-6 dark:border-indigo-900/30 dark:bg-indigo-900/10 sm:p-10">
              <div className="flex items-start gap-4 mb-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Activate Plan</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Confirm your phone number to generate your dedicated virtual payment account.
                  </p>
                </div>
              </div>

              <div className="max-w-md space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Verified Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="e.g., +234 800 000 0000"
                      value={phone}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="h-14 rounded-xl border-slate-200 bg-white pl-12 text-sm focus-visible:ring-indigo-600 dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!isValidPhone || isLoading}
                  className="h-14 w-full rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing Activation...</>
                  ) : (
                    'Accept Terms & Add to Plan'
                  )}
                </Button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}