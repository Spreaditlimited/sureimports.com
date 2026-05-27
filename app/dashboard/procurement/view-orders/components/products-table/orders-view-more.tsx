'use client';

import React, { useEffect, useState, useRef } from 'react';
import { 
  useParams, 
  usePathname, 
  useRouter, 
  useSearchParams 
} from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input-with-dark-mode';
import Loader from '@/components/uix/Loader';
import { useAuth } from '@/app/context/AuthContext';
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';

// Icons
import { 
  Download, 
  Trash2, 
  Edit, 
  ShieldCheck, 
  Ticket,
  AlertCircle,
  Info,
  MapPin,
  Scale,
  Ship,
  Banknote,
  CheckCircle2,
  Wallet
} from 'lucide-react';

import FlutterwavePaymentButton from '@/components/FlutterwavePaymentButton';
import FlutterwavePaymentButton2 from '@/components/FlutterwavePaymentButton2';

interface ProductData {
  id: number;
  pidUser: string;
  pidProduct: string;
  pidOrder: string;
  productName: string;
  productLink: string;
  productCategory: string;
  productPrice: string;
  productWeight: string;
  productQuantity: string;
  productInfo: string;
  createdAt: string;
}

interface MoreOrdersProps {
  products: ProductData[];
  statusOverride?: string;
}

interface ApiResponse {
  responsex: any;
  successx: boolean;
}

const formatNaira = (value: number) =>
  `₦${Number(value || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function MoreOrders({
  products,
  statusOverride,
}: MoreOrdersProps) {
  const { user } = useAuth();
  const router = useRouter();
  const navigateWithAlert = useNavigationWithAlert();
  const params = useParams<{ statusx: string }>();
  
  const status = statusOverride || params.statusx || '';
  const status2 = statusOverride || params.statusx || '';

  const [loading, setLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabled2, setIsDisabled2] = useState(false);

  const [pidOrder] = useState<string>(products[0]?.pidOrder || '');
  const [actionType, setActionType] = useState<string>('');

  const [getAllProducts, setGetAllProducts] = useState<any[]>([]);
  const [productsTotalPrice, setProductsTotalPrice] = useState<number>(0);
  const [initialTotalCost, initialTotalCostOrder] = useState<number>(0);
  const [productsTotalCount, setProductsTotalCount] = useState<number>(0);
  const [productsTotalWeight, setProductsTotalWeight] = useState<number>(0);

  const [currencyType, setCurrencyType] = useState<string>('...');
  const [exNairaToDollar, setExNairaToDollar] = useState<number>(0);
  const [exYuanToDollar, setExYuanToDollar] = useState<number>(0);

  const [serviceCharge, setServiceCharge] = useState<number>(0);
  const [serviceChargeValue, setServiceChargeValue] = useState<number>(0);
  const [vat, setVat] = useState<number>(0);
  const [vatValue, setVatValue] = useState<number>(0);

  const [actualWeightValue, setActualWeightValue] = useState<number>(0);
  const [actualDomesticShippingCostValue, setActualDomesticShippingCostValue] = useState<number>(0);
  const [actualInternationalShippingCost, setActualInternationalShippingCost] = useState<number>(0);
  const [actualTotalShippingCost, setActualTotalShippingCost] = useState<number>(0);

  const [destinationCountry, setDestinationCountry] = useState<string>('...');
  const [shippingPlanName, setShippingPlanName] = useState<string>('...');
  const [shippingPlanRate, setShippingPlanRate] = useState<number>(0);
  const [domesticShippingCost, setDomesticShippingCost] = useState<number>(0);
  const [estimatedTotalShippingCost, setEstimatedTotalShippingCost] = useState<number>(0);
  const [grandTotalCost, setGrandTotalCost] = useState<number>(0);
  const [onHoldDifference, setOnHoldDifference] = useState<number>(0);

  const [amountNaira, setAmountNaira] = useState<number>(0);
  const [amountNairaDifference, setAmountNairaDifference] = useState<number>(0);
  const [amountPounds, setAmountPounds] = useState<number>(0);

  const contentRef = useRef<HTMLDivElement>(null);
  const normalizedCurrency = String(currencyType || '').trim().toUpperCase();
  const normalizedDestination = String(destinationCountry || '').trim().toLowerCase();
  const shouldShowNairaRate =
    normalizedDestination.includes('nigeria') && Number(exNairaToDollar) > 0;
  const shouldShowYuanRate =
    normalizedCurrency === 'CNY' && Number(exYuanToDollar) > 0;
  const isWalletEligibleForOrder = normalizedDestination.includes('nigeria');
  const returnTo = encodeURIComponent(
    `/dashboard/procurement/view-orders/${status || 'saved'}`,
  );

  function replaceNullWithZero<T>(value: T | null): T | number {
    return value === null ? 0 : value;
  }

  async function getProductsDetails() {
    try {
      setLoading(true);
      const res = await fetch(`/api/get-data/procurement-product-data?pidOrder=${pidOrder}`, { cache: 'no-store' });
      if (!res.ok) return;

      const data = await res.json();

      if (data.productsGetAll && data.productsGetAll.length > 0) {
        setGetAllProducts(data.productsGetAll);
        setProductsTotalPrice(replaceNullWithZero(data.productsTotalPrice) as number);
        initialTotalCostOrder(replaceNullWithZero(data.initialTotalCost) as number);
        setProductsTotalCount(replaceNullWithZero(data.productsTotalCount) as number);
        setProductsTotalWeight(replaceNullWithZero(data.productsTotalWeight) as number);
        setActualWeightValue(replaceNullWithZero(data.actualWeight) as number);
        setActualDomesticShippingCostValue(replaceNullWithZero(data.actualDomesticShippingCost) as number);
        setActualInternationalShippingCost(replaceNullWithZero(data.actualInternationalShippingCost) as number);
        setActualTotalShippingCost(replaceNullWithZero(data.actualTotalShippingCost) as number);
        setCurrencyType(data.currencyType);
        setExNairaToDollar(replaceNullWithZero(data.exNairaToDollar) as number);
        setExYuanToDollar(replaceNullWithZero(data.exYuanToDollar) as number);
        setServiceCharge(replaceNullWithZero(data.serviceCharge) as number);
        setServiceChargeValue(replaceNullWithZero(data.serviceChargeValue) as number);
        setVat(replaceNullWithZero(data.vat) as number);
        setVatValue(replaceNullWithZero(data.vatValue) as number);
        setDestinationCountry(data.destinationCountry);
        setShippingPlanName(data.shippingPlanName);
        setShippingPlanRate(replaceNullWithZero(data.shippingPlanRate) as number);
        setDomesticShippingCost(replaceNullWithZero(data.domesticShippingCost) as number);
        setEstimatedTotalShippingCost(replaceNullWithZero(data.estimatedTotalShippingCost) as number);
        setAmountNaira(replaceNullWithZero(data.grandTotalCost) as number * (replaceNullWithZero(data.exNairaToDollar) as number));
        setAmountNairaDifference(replaceNullWithZero(data.onHoldDifference) as number * (replaceNullWithZero(data.exNairaToDollar) as number));
        setAmountPounds(replaceNullWithZero(data.grandTotalCost) as number * 0.8);
        setGrandTotalCost(replaceNullWithZero(data.grandTotalCost) as number);
        setOnHoldDifference(replaceNullWithZero(data.onHoldDifference) as number);
      } else {
        setGetAllProducts([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProductsDetails();
  }, []);

  const actionProductDelete = async (pidProductx: string) => {
    try {
      toast.info('Deleting Product...');
      setLoading(true);
      const res = await fetch(`/api/crud/procurement-delete-product/${user?.pidUser}/${pidProductx}`);
      if (!res.ok) throw new Error('Failed to delete');
      const data: ApiResponse = await res.json();

      if (data.responsex.status === 'SUCCESS') {
        toast.success(data.responsex.message);
        getProductsDetails();
      } else {
        toast.warning(data.responsex.message);
      }
    } catch (error: any) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    try {
      toast.loading('Cancelling Order...');
      const res = await fetch(`/api/crud/procurement-cancel-order?pidUser=${user?.pidUser}&pidOrder=${pidOrder}`);
      const data: ApiResponse = await res.json();

      if (data.responsex.status === 'SUCCESS') {
        toast.success(data.responsex.message);
        navigateWithAlert('/dashboard/procurement/view-orders/cancelled', 'success', 'Order has been cancelled!');
      } else {
        toast.warning(data.responsex.message);
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const returnOrderNoAction = async () => {
    toast.info('Returning Order...');
    try {
      const res = await fetch(`/api/status-processing/procurement-onhold-orders/return-order?pidUser=${user?.pidUser}&pidOrder=${pidOrder}`);
      const data = await res.json();
      if (data.statusx === 'SUCCESS') {
        toast.success(data.message);
        router.push('/dashboard/procurement/view-orders/pending');
      } else {
        toast.warning(data.message);
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const returnOrderWithRefund = async () => {
    toast.info('Processing Refund & Returning Order...');
    try {
      const res = await fetch(`/api/status-processing/procurement-onhold-orders/refund-order?pidUser=${user?.pidUser}&pidOrder=${pidOrder}&refundAmount=${onHoldDifference}`);
      const data = await res.json();
      if (data.statusx === 'SUCCESS') {
        toast.success(data.message);
        router.push('/dashboard/procurement/view-orders/pending');
      } else {
        toast.warning(data.message);
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.info('Processing...');
    
    const formData = new FormData(event.currentTarget);
    formData.append('pidOrder', pidOrder);
    formData.append('pidUser', user?.pidUser as string);
    formData.append('currentStatus', status);
    formData.append('newStatus', actionType);
    formData.append('refundAmount', (actualTotalShippingCost - estimatedTotalShippingCost).toString());
    formData.append('serviceType', 'PROCUREMENT');

    try {
      const res = await fetch('/api/status-processing/procurement', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.statusx === 'SUCCESS') {
        toast.success(data.message);
        router.push('/dashboard/procurement/view-orders/' + actionType);
      } else {
        toast.warning(data.message);
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const payWithWallet = async (payload: {
    amountNaira: number;
    nextStatus: string;
    newTotalAmount?: number;
    newTotalWeight?: number;
    newEstimatedTotalShippingCost?: number;
  }) => {
    try {
      toast.info('Processing wallet payment...');
      const res = await fetch('/api/pay-from-wallet/procurement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pidUser: user?.pidUser,
          pidOrder,
          amount: payload.amountNaira,
          nextStatus: payload.nextStatus,
          newTotalAmount: payload.newTotalAmount,
          newTotalWeight: payload.newTotalWeight,
          newEstimatedTotalShippingCost: payload.newEstimatedTotalShippingCost,
        }),
      });
      const rawResponseText = await res.text();
      let data: any = null;
      try {
        data = rawResponseText ? JSON.parse(rawResponseText) : null;
      } catch {
        data = null;
      }
      if (!res.ok || data?.statusx !== 'SUCCESS') {
        if (data?.statusx === 'NO_WALLET') {
          toast.warning(data.message || 'Please activate your wallet first.');
          router.push('/dashboard/wallet');
          return;
        }
        if (data?.statusx === 'INSUFFICIENT_WALLET_BALANCE') {
          const walletBalance = Number(data?.meta?.walletBalance ?? 0);
          const requiredAmount = Number(data?.meta?.requiredAmount ?? payload.amountNaira);
          const shortfall = Number(data?.meta?.shortfall ?? Math.max(requiredAmount - walletBalance, 0));
          toast.error(
            `Insufficient wallet balance. Balance: ${formatNaira(walletBalance)}. Add: ${formatNaira(shortfall)} to pay ${formatNaira(requiredAmount)}.`,
          );
          return;
        }
        toast.error(
          data?.message ||
            rawResponseText ||
            'Unable to complete wallet payment right now. Please try again.',
        );
        return;
      }

      toast.success(data.message || 'Wallet payment successful');
      router.push(`/dashboard/procurement/view-orders/${payload.nextStatus}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unable to complete wallet payment right now. Please try again.';
      toast.error(errorMessage);
    }
  };

  const generatePDF = async () => {
    if (!contentRef.current) return;
    toast.info('Generating Invoice PDF...');
    const canvas = await html2canvas(contentRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const printableWidth = pageWidth - margin * 2;
    const printableHeight = pageHeight - margin * 2;

    const imgWidth = printableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const totalPages = Math.max(1, Math.ceil(imgHeight / printableHeight));

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
      if (pageIndex > 0) pdf.addPage();

      const sourceY = (canvas.height / totalPages) * pageIndex;
      const sourceHeight = canvas.height / totalPages;

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sourceHeight;
      const pageCtx = pageCanvas.getContext('2d');
      if (!pageCtx) continue;

      pageCtx.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        sourceHeight,
        0,
        0,
        canvas.width,
        sourceHeight,
      );

      const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
      const pageImgHeight = (pageCanvas.height * imgWidth) / pageCanvas.width;

      pdf.addImage(
        pageImgData,
        'PNG',
        margin,
        margin,
        imgWidth,
        Math.min(pageImgHeight, printableHeight),
      );
    }

    pdf.save(`Order_${pidOrder}_Invoice.pdf`);
    toast.success('PDF downloaded successfully.');
  };

  const formatCurrency = (val: number) => val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (loading) return <div className="p-10"><Loader /></div>;

  return (
    <div className="flex flex-col gap-6 p-6">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Order Manifest</h3>
        <Button onClick={generatePDF} variant="outline" className="h-9 rounded-xl border-slate-200 text-xs font-bold dark:border-slate-700">
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </Button>
      </div>

      <div ref={contentRef} className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        
        {/* PDF Header (Only really visible/useful in PDF or top of card) */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Invoice Ref</p>
            <p className="font-mono text-lg font-black text-slate-900 dark:text-white">{pidOrder}</p>
          </div>
          <div className="text-right">
             <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Status</p>
             <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase">{status}</p>
          </div>
        </div>

        {/* 1. Itemized Table */}
        <div className="overflow-x-auto p-6">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:border-slate-800">
                <th className="pb-3 pl-2">Item</th>
                <th className="pb-3">Unit Price ({currencyType})</th>
                <th className="pb-3">Qty</th>
                <th className="pb-3">Weight</th>
                <th className="pb-3">Total</th>
                {['saved', 'on-hold'].includes(status) && <th className="pb-3 text-right pr-2">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {getAllProducts.map((datax: any, index: number) => (
                <tr key={datax.pidProduct} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-4 pl-2">
                    <div className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-[300px]">
                      {datax.productName}
                    </div>
                    <Link href={datax.productLink} target="_blank" className="text-xs text-blue-500 hover:underline line-clamp-1 max-w-[300px]">
                      {datax.productLink}
                    </Link>
                  </td>
                  <td className="py-4 font-medium text-slate-600 dark:text-slate-300">{formatCurrency(datax.productPrice)}</td>
                  <td className="py-4 font-medium text-slate-600 dark:text-slate-300">{datax.productQuantity}</td>
                  <td className="py-4 font-medium text-slate-600 dark:text-slate-300">{datax.productWeight} kg</td>
                  <td className="py-4 font-bold text-slate-900 dark:text-white">{formatCurrency(datax.productPrice * datax.productQuantity)}</td>
                  
                  {['saved', 'on-hold'].includes(status) && (
                    <td className="py-4 text-right pr-2">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => router.push(`/dashboard/procurement/edit-product/${datax.pidProduct}`)}
                          className="h-8 w-8 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => actionProductDelete(datax.pidProduct)}
                          className="h-8 w-8 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2. Logistics & Finance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-t border-slate-100 bg-slate-50/50 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/30">
          
          {/* Left: Logistics Details */}
          <div className="p-6 space-y-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <MapPin className="h-4 w-4 text-slate-400" /> Shipping Information
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Destination</span>
                <span className="font-semibold text-slate-900 dark:text-white">{destinationCountry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Port of Exit</span>
                <span className="font-semibold text-slate-900 dark:text-white">HONG KONG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Est. Total Weight</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(productsTotalWeight)} kg</span>
              </div>
              {status === 'pay-for-shipping' && (
                <div className="flex justify-between border-t border-slate-200 pt-2 dark:border-slate-700">
                  <span className="text-slate-500 font-bold">Actual Confirmed Weight</span>
                  <span className="font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(actualWeightValue)} kg</span>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
              <div className="flex items-center gap-2 mb-2">
                <Ship className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-blue-900 dark:text-blue-100">
                  {shippingPlanName.replace('_', ' ')}
                </h4>
              </div>
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                Rate: ${shippingPlanRate} {shippingPlanName === 'SEA_SHIPPING' ? '(N500,000/CBM)' : 'per Kg'}
              </p>
            </div>

            {/* Exchange Rates Display */}
            <div className="space-y-2 pt-2 text-xs text-slate-500">
              <p className="font-bold uppercase tracking-widest mb-1 text-[10px]">Active Exchange Rates</p>
              {shouldShowYuanRate && <p>1 USD = ¥{formatCurrency(exYuanToDollar)} Yuan</p>}
              {shouldShowNairaRate && <p>1 USD = ₦{formatCurrency(exNairaToDollar)} Naira</p>}
              {!shouldShowYuanRate && !shouldShowNairaRate && (
                <p className="text-slate-400">Exchange rates unavailable for this route.</p>
              )}
            </div>
          </div>

          {/* Right: Financial Summary */}
          <div className="p-6 space-y-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Banknote className="h-4 w-4 text-slate-400" /> Financial Breakdown
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Products Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  ${formatCurrency(currencyType === 'CNY' ? productsTotalPrice / exYuanToDollar : productsTotalPrice)}
                </span>
              </div>

              {/* Shipping Breakdowns */}
              {status === 'pay-for-shipping' ? (
                <>
                  <div className="flex justify-between text-slate-500">
                    <span>Actual Domestic Shipping</span>
                    <span>${formatCurrency(actualDomesticShippingCostValue)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Actual Intl. Shipping</span>
                    <span>${formatCurrency(actualInternationalShippingCost)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 dark:border-slate-700">
                    <span className="font-semibold text-slate-900 dark:text-white">Actual Total Shipping</span>
                    <span className="font-bold text-slate-900 dark:text-white">${formatCurrency(actualTotalShippingCost)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-slate-500">
                    <span>Est. Domestic Shipping</span>
                    <span>${formatCurrency(domesticShippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Est. Intl. Shipping</span>
                    <span>${formatCurrency(estimatedTotalShippingCost - domesticShippingCost)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 dark:border-slate-700">
                    <span className="font-semibold text-slate-900 dark:text-white">Est. Total Shipping</span>
                    <span className="font-bold text-slate-900 dark:text-white">${formatCurrency(estimatedTotalShippingCost)}</span>
                  </div>
                </>
              )}

              {/* Fees */}
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Service Charge ({serviceCharge}%)</span>
                <span className="text-slate-500">${formatCurrency(serviceChargeValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">VAT ({vat}%)</span>
                <span className="text-slate-500">${formatCurrency(vatValue)}</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="rounded-2xl bg-indigo-600 p-5 text-white shadow-lg shadow-indigo-600/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Grand Total</p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black">${formatCurrency(grandTotalCost)}</span>
                <div className="text-right text-indigo-100">
                  {currencyType === 'CNY' && <p className="text-sm font-semibold">¥{formatCurrency(grandTotalCost * exYuanToDollar)}</p>}
                  {destinationCountry === 'Nigeria' && <p className="text-sm font-bold">₦{formatCurrency(grandTotalCost * exNairaToDollar)}</p>}
                  {destinationCountry === 'United Kingdom' && <p className="text-sm font-bold">£{formatCurrency(amountPounds)}</p>}
                </div>
              </div>
            </div>

            {/* Differential / Outstanding Calculations */}
            {(status2 === 'on-hold' || status === 'pay-for-shipping') && (
              <div className={`rounded-xl border p-4 ${
                (status2 === 'on-hold' ? onHoldDifference : actualTotalShippingCost - estimatedTotalShippingCost) > 0 
                  ? 'border-rose-200 bg-rose-50 dark:border-rose-900/30 dark:bg-rose-900/10' 
                  : 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-900/10'
              }`}>
                {(() => {
                  const diff = status2 === 'on-hold' ? onHoldDifference : actualTotalShippingCost - estimatedTotalShippingCost;
                  const isOwe = diff > 0;
                  return (
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${isOwe ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                        {isOwe ? 'Outstanding Balance:' : 'Refund Amount:'}
                      </span>
                      <div className="text-right">
                        <span className={`text-lg font-black ${isOwe ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                          ${formatCurrency(Math.abs(diff))}
                        </span>
                        {destinationCountry === 'Nigeria' && (
                          <p className={`text-xs font-bold ${isOwe ? 'text-rose-500' : 'text-emerald-500'}`}>
                            ₦{formatCurrency(Math.abs(diff) * exNairaToDollar)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* 3. Actions & Payments Section */}
        
        {/* SAVED - Initial Payment */}
        {status === 'saved' && (
          <div className="border-t border-slate-100 bg-indigo-50/50 p-6 dark:border-slate-800 dark:bg-indigo-900/10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDisabled}
                    onChange={(e) => setIsDisabled(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Accept Terms & Conditions</p>
                    <p className="text-xs text-slate-500 mt-1">I agree to the <Link href="/terms-and-conditions" className="text-indigo-600 hover:underline">Terms of Service</Link> to proceed with this payment.</p>
                  </div>
                </label>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <FlutterwavePaymentButton
                  amount={grandTotalCost}
                  amountNaira={amountNaira}
                  destinationCountry={destinationCountry}
                  totalWeight={productsTotalWeight}
                  email={user?.userEmail || ''}
                  name={user?.userFirstname || ''}
                  phone_number={''}
                  currency={'USD'}
                  payment_type={'CARD'}
                  consumer_id={user?.pidUser || ''}
                  service_id={pidOrder}
                  service_name={'PROCUREMENT'}
                  description={'General Procurement & Shipping Service'}
                  isDisabled={isDisabled}
                  className={isDisabled 
                    ? "flex h-12 items-center justify-center rounded-xl bg-indigo-600 px-6 font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500" 
                    : "flex h-12 items-center justify-center rounded-xl bg-slate-200 px-6 font-bold text-slate-400 cursor-not-allowed dark:bg-slate-800"}
                />
                <Button
                  disabled={!isDisabled}
                  className={isDisabled 
                    ? "h-12 rounded-xl bg-slate-900 px-6 font-bold text-white shadow-md transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900" 
                    : "h-12 rounded-xl bg-slate-200 px-6 font-bold text-slate-400 cursor-not-allowed dark:bg-slate-800"}
                  onClick={() => {
                    // Logic retained
                    router.push(`/dashboard/bank-payment/?service=procurement&amount=${grandTotalCost}&amountNaira=${amountNaira}&currencyType=${currencyType}&exNairaToDollar=${exNairaToDollar}&destinationCountry=${destinationCountry}&status=${status}&newEstimatedTotalShippingCost=${estimatedTotalShippingCost}&newTotalAmount=${grandTotalCost}&newTotalWeight=${productsTotalWeight}&serviceID=${pidOrder}&serviceDescription=Pay for General Procurement Service&returnTo=${returnTo}`);
                  }}
                >
                  <Banknote className="mr-2 h-4 w-4" /> Bank Deposit
                </Button>
                {isWalletEligibleForOrder && (
                  <Button
                    disabled={!isDisabled}
                    className={isDisabled
                      ? "h-12 rounded-xl bg-emerald-600 px-6 font-bold text-white shadow-md transition hover:bg-emerald-500"
                      : "h-12 rounded-xl bg-slate-200 px-6 font-bold text-slate-400 cursor-not-allowed dark:bg-slate-800"}
                    title="Pay with wallet"
                    onClick={() =>
                      payWithWallet({
                        amountNaira: amountNaira,
                        nextStatus: 'pending',
                        newTotalAmount: grandTotalCost,
                        newTotalWeight: productsTotalWeight,
                        newEstimatedTotalShippingCost: estimatedTotalShippingCost,
                      })
                    }
                  >
                    <Wallet className="mr-2 h-4 w-4" /> Wallet
                  </Button>
                )}
              </div>
            </div>
            
            {/* Coupons & Insurance Footer */}
            <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-indigo-100 pt-6 dark:border-indigo-900/30">
               <div className="flex items-center gap-3">
                 <ShieldCheck className="h-8 w-8 text-emerald-500" />
                 <div>
                   <p className="text-sm font-bold text-slate-900 dark:text-white">Comprehensively Insured</p>
                   <p className="text-xs text-slate-500">Your order is protected end-to-end.</p>
                 </div>
               </div>
               <div className="flex w-full md:w-auto items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <div className="pl-3"><Ticket className="h-4 w-4 text-slate-400" /></div>
                  <input type="text" placeholder="Promo code" className="h-10 w-full bg-transparent px-2 text-sm focus:outline-none dark:text-white" />
                  <Button className="h-10 rounded-lg bg-slate-900 px-6 text-xs font-bold text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500">Apply</Button>
               </div>
            </div>
          </div>
        )}

        {/* PENDING - Cancel Option */}
        {status2 === 'pending' && (
          <div className="border-t border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/30">
             <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDisabled2}
                    onChange={(e) => setIsDisabled2(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-600"
                  />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm cancellation intent</span>
                </label>
                <Button
                  disabled={!isDisabled2}
                  onClick={cancelOrder}
                  variant="destructive"
                  className="h-12 rounded-xl px-8 font-bold"
                >
                  Cancel Order
                </Button>
             </div>
          </div>
        )}

        {/* ON-HOLD Logic (Zero Difference, Outstanding, or Refund) */}
        {status2 === 'on-hold' && (
          <div className="border-t border-slate-100 bg-indigo-50/50 p-6 dark:border-slate-800 dark:bg-indigo-900/10">
             <div className="flex flex-col gap-6">
                
                {/* Checkbox confirmation required for all ON-HOLD actions */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onHoldDifference > 0 ? isDisabled : isDisabled2}
                    onChange={(e) => onHoldDifference > 0 ? setIsDisabled(e.target.checked) : setIsDisabled2(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Confirm Action</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {onHoldDifference < 0 
                        ? "You will be refunded less a 2.5% inconvenience fee." 
                        : "I agree to the terms to proceed."}
                    </p>
                  </div>
                </label>

                {/* Actions based on difference */}
                {onHoldDifference === 0 && (
                  <Button 
                    disabled={!isDisabled2} 
                    onClick={returnOrderNoAction}
                    className="h-12 w-full md:w-auto rounded-xl bg-indigo-600 font-bold"
                  >
                    Return Order for Processing
                  </Button>
                )}

                {onHoldDifference > 0 && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <FlutterwavePaymentButton2
                      amount={onHoldDifference}
                      amountNaira={amountNairaDifference}
                      destinationCountry={destinationCountry}
                      totalWeight={productsTotalWeight}
                      email={user?.userEmail || ''}
                      name={user?.userFirstname || ''}
                      phone_number={''}
                      currency={'USD'}
                      payment_type={'CARD'}
                      consumer_id={user?.pidUser || ''}
                      service_id={pidOrder}
                      service_name={'PROCUREMENT'}
                      description={'General Procurement & Shipping Service'}
                      isDisabled={isDisabled}
                      className={isDisabled 
                        ? "flex h-12 flex-1 items-center justify-center rounded-xl bg-indigo-600 px-6 font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500" 
                        : "flex h-12 flex-1 items-center justify-center rounded-xl bg-slate-200 px-6 font-bold text-slate-400 cursor-not-allowed dark:bg-slate-800"}
                    />
                <Button
                      disabled={!isDisabled}
                      className={isDisabled 
                        ? "h-12 flex-1 rounded-xl bg-slate-900 px-6 font-bold text-white shadow-md transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900" 
                        : "h-12 flex-1 rounded-xl bg-slate-200 px-6 font-bold text-slate-400 cursor-not-allowed dark:bg-slate-800"}
                      onClick={() => {
                        // Routing logic retained
                        router.push(`/dashboard/bank-payment/?service=procurement&amount=${onHoldDifference}&amountNaira=${amountNaira}&currencyType=${currencyType}&exNairaToDollar=${exNairaToDollar}&destinationCountry=${destinationCountry}&status=${status}&newEstimatedTotalShippingCost=${estimatedTotalShippingCost}&newTotalAmount=${grandTotalCost}&newTotalWeight=${productsTotalWeight}&serviceID=${pidOrder}&serviceDescription=Pay for General Procurement Service&returnTo=${returnTo}`);
                      }}
                    >
                      <Banknote className="mr-2 h-4 w-4" /> Bank Deposit
                    </Button>
                    {isWalletEligibleForOrder && (
                      <Button
                        disabled={!isDisabled}
                        className={isDisabled
                          ? "h-12 flex-1 rounded-xl bg-emerald-600 px-6 font-bold text-white shadow-md transition hover:bg-emerald-500"
                          : "h-12 flex-1 rounded-xl bg-slate-200 px-6 font-bold text-slate-400 cursor-not-allowed dark:bg-slate-800"}
                        title="Pay with wallet"
                        onClick={() =>
                          payWithWallet({
                            amountNaira: amountNairaDifference,
                            nextStatus: 'pending',
                            newTotalAmount: grandTotalCost,
                            newTotalWeight: productsTotalWeight,
                            newEstimatedTotalShippingCost: estimatedTotalShippingCost,
                          })
                        }
                      >
                        <Wallet className="mr-2 h-4 w-4" /> Wallet
                      </Button>
                    )}
                  </div>
                )}

                {onHoldDifference < 0 && (
                  <Button 
                    disabled={!isDisabled2} 
                    onClick={returnOrderWithRefund}
                    className="h-12 w-full md:w-auto rounded-xl bg-indigo-600 font-bold"
                  >
                    Activate Refund & Process Order
                  </Button>
                )}
             </div>
          </div>
        )}

        {/* PAY FOR SHIPPING - Owe vs Refund */}
        {status === 'pay-for-shipping' && (
          <div className="border-t border-slate-100 bg-indigo-50/50 p-6 dark:border-slate-800 dark:bg-indigo-900/10">
            {actualTotalShippingCost - estimatedTotalShippingCost > 0 ? (
              // User owes money
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <label className="flex items-start gap-3 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={isDisabled}
                    onChange={(e) => setIsDisabled(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Accept Terms & Conditions</p>
                  </div>
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <FlutterwavePaymentButton
                    amount={actualTotalShippingCost - estimatedTotalShippingCost}
                    amountNaira={(actualTotalShippingCost - estimatedTotalShippingCost) * exNairaToDollar}
                    destinationCountry={destinationCountry}
                    totalWeight={productsTotalWeight}
                    email={user?.userEmail || ''}
                    name={user?.userFirstname || ''}
                    phone_number={''}
                    currency={'USD'}
                    payment_type={'CARD'}
                    consumer_id={user?.pidUser || ''}
                    service_id={pidOrder}
                    service_name={'PROCUREMENT'}
                    description={'General Procurement & Shipping Service'}
                    isDisabled={isDisabled}
                    className={isDisabled 
                      ? "flex h-12 items-center justify-center rounded-xl bg-indigo-600 px-6 font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500" 
                      : "flex h-12 items-center justify-center rounded-xl bg-slate-200 px-6 font-bold text-slate-400 cursor-not-allowed dark:bg-slate-800"}
                  />
                  <Button
                    disabled={!isDisabled}
                    className={isDisabled 
                      ? "h-12 rounded-xl bg-slate-900 px-6 font-bold text-white shadow-md transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900" 
                      : "h-12 rounded-xl bg-slate-200 px-6 font-bold text-slate-400 cursor-not-allowed dark:bg-slate-800"}
                    onClick={() => {
                      // Routing logic retained
                      router.push(`/dashboard/bank-payment/?service=procurement&amount=${actualTotalShippingCost - estimatedTotalShippingCost}&amountNaira=${(actualTotalShippingCost - estimatedTotalShippingCost) * exNairaToDollar}&currencyType=${currencyType}&exNairaToDollar=${exNairaToDollar}&destinationCountry=${destinationCountry}&status=${status}&newEstimatedTotalShippingCost=${estimatedTotalShippingCost}&newTotalAmount=${grandTotalCost}&newTotalWeight=${productsTotalWeight}&serviceID=${pidOrder}&serviceDescription=Pay for General Procurement Service&returnTo=${returnTo}`);
                    }}
                  >
                    <Banknote className="mr-2 h-4 w-4" /> Bank Deposit
                  </Button>
                  {isWalletEligibleForOrder && (
                    <Button
                      disabled={!isDisabled}
                      className={isDisabled
                        ? "h-12 rounded-xl bg-emerald-600 px-6 font-bold text-white shadow-md transition hover:bg-emerald-500"
                        : "h-12 rounded-xl bg-slate-200 px-6 font-bold text-slate-400 cursor-not-allowed dark:bg-slate-800"}
                      title="Pay with wallet"
                      onClick={() =>
                        payWithWallet({
                          amountNaira: (actualTotalShippingCost - estimatedTotalShippingCost) * exNairaToDollar,
                          nextStatus: 'in-transit',
                          newTotalAmount: grandTotalCost,
                          newTotalWeight: productsTotalWeight,
                          newEstimatedTotalShippingCost: estimatedTotalShippingCost,
                        })
                      }
                    >
                      <Wallet className="mr-2 h-4 w-4" /> Wallet
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              // User gets a refund
              <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <label className="flex items-start gap-3 cursor-pointer flex-1">
                  <input
                    required
                    type="checkbox"
                    checked={isDisabled}
                    onChange={(e) => setIsDisabled(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Accept Terms & Conditions</p>
                    <p className="text-xs text-slate-500 mt-1">Accept the refund value and move to shipping.</p>
                  </div>
                </label>
                <Button 
                  type="submit"
                  disabled={!isDisabled}
                  onClick={() => setActionType('in-transit')}
                  className="h-12 rounded-xl bg-indigo-600 px-8 font-bold text-white shadow-lg transition hover:bg-indigo-500"
                >
                  Process Refund & Ship Order
                </Button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
