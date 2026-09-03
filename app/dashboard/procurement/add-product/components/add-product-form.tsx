'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

import {
  Tag,
  Link as LinkIcon,
  Scale,
  Banknote,
  Boxes,
  Info,
  Loader2,
  ShoppingCart,
  PlayCircle,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';
import { useAuth } from '@/app/context/AuthContext';
import { useModal } from '@/app/context/ModalContext';

const formSchema = z.object({
  pidUser: z.string(),
  pidProduct: z.string(),
  pidOrder: z.string(),
  emailUser: z.string(),
  productName: z
    .string()
    .min(2, { message: 'Product Name is required' })
    .max(500),
  productLink: z
    .string()
    .min(10, { message: 'Please enter a valid product link' }),
  productPrice: z.string().min(1, { message: 'Please enter product price' }),
  productWeight: z.string().min(1, { message: 'Please enter product weight' }),
  productQuantity: z
    .string()
    .min(1, { message: 'Please enter product quantity' }),
  productInfo: z
    .string()
    .min(1, { message: 'Please enter product information' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddProductForm() {
  const { isModalOpen, openModal, closeModal } = useModal();
  const params = useParams();
  const navigateWithAlert = useNavigationWithAlert();
  const { user } = useAuth();

  const pidOrderx = params?.pidOrder as string;
  const [pidProduct] = useState('PRD' + new Date().getTime().toString());
  const [currency, setCurrencyType] = useState<string>('USD');
  const [measurementUnit, setMeasurementUnit] = useState<'KG' | 'CBM'>('KG');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pidUser: user?.pidUser || '',
      pidProduct: pidProduct,
      pidOrder: pidOrderx || '',
      emailUser: user?.userEmail || '',
      productName: '',
      productLink: '',
      productPrice: '',
      productWeight: '',
      productQuantity: '1',
      productInfo: '',
    },
  });

  useEffect(() => {
    async function fetchDataOrder() {
      if (!pidOrderx) return;
      try {
        const res = await fetch(
          `/api/get-data/order-one?pidOrder=${pidOrderx}`,
        );
        const data = await res.json();
        setCurrencyType(data.getOneRecord?.currencyType || 'USD');
        setMeasurementUnit(
          data.getOneRecord?.shippingMeasurementUnit === 'CBM' ? 'CBM' : 'KG',
        );
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    }
    fetchDataOrder();
  }, [pidOrderx]);

  const onSubmit = async (values: FormValues) => {
    if (parseFloat(values.productPrice) < 0.001) {
      toast.error('Minimum price for any purchase is 0.01.');
      return;
    }
    if (parseFloat(values.productQuantity) < 1) {
      toast.error('Quantity must be at least 1.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/crud/procurement-add-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (data.responsex.status === 'SUCCESS') {
        navigateWithAlert(
          '/dashboard/procurement/view-orders/saved',
          'success',
          'Product successfully added to your order.',
        );
      } else {
        toast.warning(data.responsex.message || 'Action failed.');
      }
    } catch {
      toast.error('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quantity = Number(form.watch('productQuantity') || 0);
  const perItemMeasurement = Number(form.watch('productWeight') || 0);
  const lineMeasurement = quantity * perItemMeasurement;
  const measurementName = measurementUnit === 'CBM' ? 'volume' : 'weight';

  return (
    <>
      {/* Redesigned Weight Guide Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="flex max-h-[90dvh] max-h-[90vh] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white p-0 shadow-2xl dark:border-slate-700 dark:bg-[#161629] lg:max-w-5xl [&>button]:hidden">
          <div className="relative shrink-0 overflow-hidden border-b border-slate-100 bg-white px-5 py-5 dark:border-slate-800 dark:bg-[#161629] sm:px-8">
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-blue-600/10 via-indigo-500/5 to-transparent dark:from-blue-600/20 dark:via-indigo-500/10" />
            <div className="relative flex items-center justify-between gap-4">
              <DialogTitle className="flex items-center gap-3 text-xl font-black text-slate-900 dark:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
                  <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </span>
                Product {measurementUnit === 'CBM' ? 'CBM' : 'Weight'} Guide
              </DialogTitle>

              <DialogClose className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-500 shadow-sm transition hover:bg-slate-200 hover:text-slate-900 dark:border-slate-700 dark:bg-[#0f1020] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white">
                <X className="h-5 w-5" />
                <span className="sr-only">
                  Close product {measurementName} guide modal
                </span>
              </DialogClose>
            </div>
          </div>

          <div className="custom-scrollbar min-h-0 flex-1 space-y-8 overflow-y-auto bg-white p-5 dark:bg-[#161629] sm:p-8">
            {measurementUnit === 'CBM' ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 text-indigo-900 dark:border-indigo-900/40 dark:bg-indigo-950/30 dark:text-indigo-100">
                  <h3 className="font-bold">Enter CBM for one item</h3>
                  <p className="mt-2 text-sm leading-relaxed">
                    If your supplier gives you the total CBM for the whole
                    product line, divide it by the quantity. For example, 10 CBM
                    for 100 items means you should enter 0.1 CBM per item.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-6 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Ask your supplier
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Request the packed carton dimensions or the total shipment
                    CBM. Use packed dimensions, including packaging, rather than
                    the bare product dimensions.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Video Guide */}
                <div className="overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center gap-2 border-b border-slate-200 p-4 dark:border-slate-700">
                    <PlayCircle className="h-4 w-4 text-rose-500" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Video Tutorial
                    </span>
                  </div>
                  <div className="relative aspect-video w-full">
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube.com/embed/${'ZTgoROlS5NY'}`}
                      title="YouTube Video Player"
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                {/* General Tips */}
                <div>
                  <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                    Sourcing Tips
                  </h3>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>
                      Study the 1688 product page details; some suppliers list
                      the weight there.
                    </li>
                    <li>
                      Do an image search on <strong>Alibaba.com</strong> for the
                      same product, as Alibaba listings almost always include
                      weight.
                    </li>
                    <li>
                      Check <strong>Amazon.com</strong> for the same product to
                      find accurate shipping weights.
                    </li>
                  </ul>
                </div>

                {/* Estimated Weights Table */}
                <div>
                  <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                    Estimated Weights Reference
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                      <h4 className="mb-2 border-b border-slate-200 pb-2 text-xs font-black uppercase tracking-widest text-slate-400 dark:border-slate-700">
                        Footwear
                      </h4>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                        <li className="flex justify-between">
                          <span>Sneakers/Canvas</span>{' '}
                          <span className="font-bold">0.6kg - 1kg</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Corporate Shoes</span>{' '}
                          <span className="font-bold">1.0kg</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Boots</span>{' '}
                          <span className="font-bold">2.0kg</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Female Heels/Flats</span>{' '}
                          <span className="font-bold">0.5kg - 0.6kg</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Slippers</span>{' '}
                          <span className="font-bold">0.4kg</span>
                        </li>
                      </ul>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                      <h4 className="mb-2 border-b border-slate-200 pb-2 text-xs font-black uppercase tracking-widest text-slate-400 dark:border-slate-700">
                        Bags & Accessories
                      </h4>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                        <li className="flex justify-between">
                          <span>Big Handbags</span>{' '}
                          <span className="font-bold">1.0kg</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Small Handbags</span>{' '}
                          <span className="font-bold">0.6kg</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Set of Bags (3-in-1)</span>{' '}
                          <span className="font-bold">1.5kg</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Wallets/Purses</span>{' '}
                          <span className="font-bold">0.2kg - 0.3kg</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Watches/Jewelry</span>{' '}
                          <span className="font-bold">0.1kg - 0.2kg</span>
                        </li>
                      </ul>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                      <h4 className="mb-2 border-b border-slate-200 pb-2 text-xs font-black uppercase tracking-widest text-slate-400 dark:border-slate-700">
                        Clothing & Hair
                      </h4>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                        <li className="flex justify-between">
                          <span>Shirts/Gowns/Shorts</span>{' '}
                          <span className="font-bold">0.3kg</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Jeans</span>{' '}
                          <span className="font-bold">0.5kg</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Suits</span>{' '}
                          <span className="font-bold">2.0kg</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Hair Wigs</span>{' '}
                          <span className="font-bold">0.3kg</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Hair Attachment</span>{' '}
                          <span className="font-bold">0.2kg</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="mb-8 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Order Reference
          </p>
          <p className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-white">
            {pidOrderx || 'Pending'}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-900">
          <Boxes className="h-5 w-5 text-slate-400" />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Product Link */}
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="productLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Product URL
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <Input
                          placeholder="Paste the URL from 1688, Taobao, Alibaba..."
                          className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-12 text-sm focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900/50"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )}
              />
            </div>

            {/* Product Name */}
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Product Name / Title
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <Input
                          placeholder="Short description of the item"
                          className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-12 text-sm focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900/50"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )}
              />
            </div>

            {/* Quantity */}
            <FormField
              control={form.control}
              name="productQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Quantity
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Boxes className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="number"
                        min="1"
                        placeholder="1"
                        className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-12 text-sm focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900/50"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-rose-500" />
                </FormItem>
              )}
            />

            {/* Unit Price */}
            <FormField
              control={form.control}
              name="productPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Unit Price ({currency})
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Banknote className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-12 text-sm focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900/50"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-rose-500" />
                </FormItem>
              )}
            />
          </div>

          <hr className="my-4 border-slate-100 dark:border-slate-800" />

          {/* Weight & Information Section */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:items-start">
            {/* Weight Input */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="productWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      {measurementUnit === 'CBM'
                        ? 'Estimated CBM per item'
                        : 'Estimated weight per item (kg)'}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Scale className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <Input
                          type="number"
                          step="any"
                          min="0.0001"
                          placeholder={
                            measurementUnit === 'CBM'
                              ? 'e.g., 0.1'
                              : 'e.g., 1.5'
                          }
                          className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-12 text-sm focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900/50"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500" />
                    {perItemMeasurement > 0 && quantity > 0 && (
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                        {quantity} item{quantity === 1 ? '' : 's'} ×{' '}
                        {perItemMeasurement} {measurementUnit} ={' '}
                        {Number(lineMeasurement.toFixed(4))} {measurementUnit}{' '}
                        total.
                      </p>
                    )}
                  </FormItem>
                )}
              />

              {/* Contextual Weight Guide */}
              <div
                onClick={openModal}
                className="group cursor-pointer rounded-2xl border border-blue-200 bg-blue-50 p-4 transition-all hover:bg-blue-100 dark:border-blue-900/30 dark:bg-blue-900/10 dark:hover:bg-blue-900/20"
              >
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100">
                      Need help with {measurementName}?
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-blue-700 dark:text-blue-300">
                      Enter the {measurementName} of one item. Click here for an
                      explanation and an example using your product quantity.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Variants/Info */}
            <FormField
              control={form.control}
              name="productInfo"
              render={({ field }) => (
                <FormItem className="h-full">
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Variants & Specifications
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Specify colors, sizes, or variants you want the supplier to send..."
                      className="min-h-[140px] resize-none rounded-xl border-slate-200 bg-slate-50 p-4 text-sm focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-500" />
                </FormItem>
              )}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end border-t border-slate-100 pt-6 dark:border-slate-800">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-600 px-8 py-6 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 disabled:opacity-70 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />{' '}
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" /> Save Product to
                  Order
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
