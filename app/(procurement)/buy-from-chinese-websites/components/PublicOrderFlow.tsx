'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowRight,
  Loader2,
  PackagePlus,
  ShoppingCart,
  Trash2,
  User,
  MapPin,
  Package,
  FileText,
  Globe
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { convertToTitleCase } from '@/app/utils/stringUtils';
import {
  buildFacebookLeadMeta,
  trackBrowserLeadEvent,
} from '@/lib/marketing/facebookLeadMeta';
import {
  PENDING_PROCUREMENT_CHECKOUT_KEY,
  POST_AUTH_REDIRECT_KEY,
  PROCUREMENT_RESUME_CHECKOUT_PATH,
} from '@/lib/auth/loginRedirect';

type ShippingPlan = {
  pidShippingPlan: string;
  shippingPlanName: string;
  shippingPlanRate: number;
  shippingPlanUnit?: string | null;
};

type Country = {
  pidCountry: string;
  countryName: string;
  shippingPlans: ShippingPlan[];
};

type ProductDraft = {
  productName: string;
  productLink: string;
  productPrice: string;
  productWeight: string;
  productQuantity: string;
  productInfo: string;
};

const initialProduct: ProductDraft = {
  productName: '',
  productLink: '',
  productPrice: '',
  productWeight: '',
  productQuantity: '1',
  productInfo: '',
};

export default function PublicOrderFlow() {
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);

  const [account, setAccount] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [order, setOrder] = useState({
    orderName: '',
    destinationCountry: '',
    currencyType: 'USD',
    shippingPlan: '',
    orderCategory: 'Other Goods',
    shippingAddress: '',
  });
  const [productDraft, setProductDraft] = useState<ProductDraft>(initialProduct);
  const [products, setProducts] = useState<ProductDraft[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadCountries = async () => {
      try {
        const response = await fetch('/api/get-data/countries-shipping-plan', {
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('Failed to fetch countries');
        const data = (await response.json()) as Country[];
        if (!cancelled) {
          setCountries(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) {
          toast.error('Unable to load destination countries right now.');
        }
      } finally {
        if (!cancelled) {
          setCountriesLoading(false);
        }
      }
    };

    loadCountries();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedCountry = useMemo(
    () => countries.find((country) => country.pidCountry === order.destinationCountry),
    [countries, order.destinationCountry],
  );

  const formatPlanUnit = (unit?: string | null) =>
    unit?.toUpperCase() === 'CBM' ? 'CBM' : 'kg';

  const totalEstimatedValue = useMemo(() => {
    return products.reduce((total, p) => total + (Number(p.productPrice) * Number(p.productQuantity)), 0);
  }, [products]);

  const currencySymbol = useMemo(() => {
    if (order.currencyType === 'CNY') return '¥';
    if (order.currencyType === 'USD') return '$';
    return order.currencyType;
  }, [order.currencyType]);

  const addProduct = () => {
    if (
      !productDraft.productName.trim() ||
      !productDraft.productLink.trim() ||
      !productDraft.productPrice ||
      !productDraft.productWeight ||
      !productDraft.productQuantity
    ) {
      toast.error('Complete product name, link, price, weight and quantity.');
      return;
    }

    if (
      Number(productDraft.productPrice) <= 0 ||
      Number(productDraft.productWeight) <= 0 ||
      Number(productDraft.productQuantity) <= 0
    ) {
      toast.error('Price, weight and quantity must be greater than zero.');
      return;
    }

    setProducts((prev) => [...prev, productDraft]);
    setProductDraft(initialProduct);
    toast.success('Product added to order summary.');
  };

  const removeProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const proceedToPayment = async () => {
    if (!order.orderName.trim() || !order.destinationCountry || !order.shippingPlan || !order.shippingAddress.trim()) {
      toast.error('Complete order name, destination, shipping plan and address.');
      return;
    }

    if (!account.email.trim()) {
      toast.error('Email is required to continue.');
      return;
    }

    if (products.length === 0) {
      toast.error('Add at least one product before continuing.');
      return;
    }

    const leadMeta = buildFacebookLeadMeta();
    const payload = {
      account,
      order,
      products: products.map((item) => ({
        ...item,
        productPrice: Number(item.productPrice),
        productWeight: Number(item.productWeight),
        productQuantity: Number(item.productQuantity),
      })),
      ...leadMeta,
    };

    setSubmitting(true);
    try {
      const authResponse = await fetch('/api/auth/me', { cache: 'no-store' });
      if (!authResponse.ok) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(
            PENDING_PROCUREMENT_CHECKOUT_KEY,
            JSON.stringify(payload),
          );
          window.localStorage.setItem(
            POST_AUTH_REDIRECT_KEY,
            PROCUREMENT_RESUME_CHECKOUT_PATH,
          );
        }
        toast.info('Please sign in or create an account to save your order.');
        router.push(
          `/auth/login?next=${encodeURIComponent(PROCUREMENT_RESUME_CHECKOUT_PATH)}`,
        );
        return;
      }

      const response = await fetch('/api/public/procurement/bootstrap-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data?.statusx === 'SUCCESS') {
        trackBrowserLeadEvent({
          eventId: leadMeta.fbEventId,
          contentName: 'Buy From Chinese Websites Submission',
          contentCategory: 'Procurement',
          numItems: payload.products.length,
          value: totalEstimatedValue,
          currency: order.currencyType || 'USD',
        });
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(PENDING_PROCUREMENT_CHECKOUT_KEY);
          window.localStorage.removeItem(POST_AUTH_REDIRECT_KEY);
        }
        toast.success('Order created. Redirecting to your dashboard...');
        router.push(data.redirectTo);
        return;
      }

      if (
        data?.statusx === 'AUTH_REQUIRED' ||
        data?.statusx === 'ACCOUNT_EXISTS_LOGIN_REQUIRED'
      ) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(
            PENDING_PROCUREMENT_CHECKOUT_KEY,
            JSON.stringify(payload),
          );
          window.localStorage.setItem(
            POST_AUTH_REDIRECT_KEY,
            PROCUREMENT_RESUME_CHECKOUT_PATH,
          );
        }
        toast.info('Please sign in or create an account to continue.');
        router.push(
          `/auth/login?next=${encodeURIComponent(PROCUREMENT_RESUME_CHECKOUT_PATH)}`,
        );
        return;
      }

      toast.error(data?.message || 'Unable to continue right now.');
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-transparent">
      {/* Main Flow Content */}
      <section className="w-full">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(340px,380px)] 2xl:grid-cols-[minmax(0,1fr)_400px] xl:items-start">
          
          {/* LEFT COLUMN: Data Entry */}
          <div className="space-y-6">
            
            {/* Step 1: Account Details */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Contact Information</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Where should we send your order updates?</p>
                </div>
              </div>
              
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">First Name</label>
                  <Input placeholder="John" value={account.firstName} onChange={(e) => setAccount((prev) => ({ ...prev, firstName: e.target.value }))} className="h-12 rounded-xl dark:bg-slate-800/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Last Name</label>
                  <Input placeholder="Doe" value={account.lastName} onChange={(e) => setAccount((prev) => ({ ...prev, lastName: e.target.value }))} className="h-12 rounded-xl dark:bg-slate-800/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                  <Input type="email" placeholder="john@example.com" value={account.email} onChange={(e) => setAccount((prev) => ({ ...prev, email: e.target.value }))} className="h-12 rounded-xl dark:bg-slate-800/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Phone Number</label>
                  <Input placeholder="+234 801 234 5678" value={account.phone} onChange={(e) => setAccount((prev) => ({ ...prev, phone: e.target.value }))} className="h-12 rounded-xl dark:bg-slate-800/50" />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Details */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Shipping Logistics</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tell us about the shipment destination.</p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Order Reference Name</label>
                  <Input placeholder="e.g., Summer Inventory 2026" value={order.orderName} onChange={(e) => setOrder((prev) => ({ ...prev, orderName: e.target.value }))} className="h-12 rounded-xl dark:bg-slate-800/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Destination Country</label>
                  <select
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-800/50 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300"
                    value={order.destinationCountry}
                    onChange={(e) => setOrder((prev) => ({ ...prev, destinationCountry: e.target.value, shippingPlan: '' }))}
                  >
                    <option value="" className="dark:bg-slate-900">Select destination country</option>
                    {countriesLoading ? (
                      <option className="dark:bg-slate-900">Loading countries...</option>
                    ) : (
                      countries.map((country) => (
                        <option key={country.pidCountry} value={country.pidCountry} className="dark:bg-slate-900">
                          {country.countryName}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Shipping Plan</label>
                  <select
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-800/50 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300"
                    value={order.shippingPlan}
                    onChange={(e) => setOrder((prev) => ({ ...prev, shippingPlan: e.target.value }))}
                    disabled={!selectedCountry}
                  >
                    <option value="" className="dark:bg-slate-900">
                      {selectedCountry ? 'Select shipping plan' : 'Choose country first'}
                    </option>
                    {selectedCountry?.shippingPlans.map((plan) => (
                      <option key={plan.pidShippingPlan} value={plan.pidShippingPlan} className="dark:bg-slate-900">
                        {convertToTitleCase(plan.shippingPlanName)} (${plan.shippingPlanRate}/{formatPlanUnit(plan.shippingPlanUnit)})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">China Shop Currency</label>
                  <select
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-800/50 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300"
                    value={order.currencyType}
                    onChange={(e) => setOrder((prev) => ({ ...prev, currencyType: e.target.value }))}
                  >
                    <option value="USD" className="dark:bg-slate-900">USD</option>
                    <option value="CNY" className="dark:bg-slate-900">CNY</option>
                  </select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Product Category</label>
                  <select
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-800/50 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300"
                    value={order.orderCategory}
                    onChange={(e) => setOrder((prev) => ({ ...prev, orderCategory: e.target.value }))}
                  >
                    <option value="Goods with Battery" className="dark:bg-slate-900">Goods with Battery</option>
                    <option value="Raw Batteries" className="dark:bg-slate-900">Raw Batteries</option>
                    <option value="Liquids, Gases, Powder" className="dark:bg-slate-900">Liquids, Gases, Powder</option>
                    <option value="Other Goods" className="dark:bg-slate-900">Other Goods</option>
                  </select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Delivery Address</label>
                  <Textarea
                    placeholder="Enter the full delivery address"
                    value={order.shippingAddress}
                    onChange={(e) => setOrder((prev) => ({ ...prev, shippingAddress: e.target.value }))}
                    className="min-h-[100px] rounded-xl dark:bg-slate-800/50"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Add Products */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <Package className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Add Sourcing Items</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Add the links and details for the products you want.</p>
                </div>
              </div>

              <div className="space-y-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50 sm:p-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Product Name</label>
                  <Input placeholder="e.g., Wireless Bluetooth Earbuds" value={productDraft.productName} onChange={(e) => setProductDraft((prev) => ({ ...prev, productName: e.target.value }))} className="h-12 rounded-xl bg-white dark:bg-slate-900" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Product Link</label>
                  <Input placeholder="https://1688.com/..." value={productDraft.productLink} onChange={(e) => setProductDraft((prev) => ({ ...prev, productLink: e.target.value }))} className="h-12 rounded-xl bg-white dark:bg-slate-900" />
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Unit Price</label>
                    <Input placeholder="0.00" type="number" value={productDraft.productPrice} onChange={(e) => setProductDraft((prev) => ({ ...prev, productPrice: e.target.value }))} className="h-12 rounded-xl bg-white dark:bg-slate-900" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Unit Weight (kg)</label>
                    <Input placeholder="0.5" type="number" value={productDraft.productWeight} onChange={(e) => setProductDraft((prev) => ({ ...prev, productWeight: e.target.value }))} className="h-12 rounded-xl bg-white dark:bg-slate-900" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Quantity</label>
                    <Input placeholder="1" type="number" value={productDraft.productQuantity} onChange={(e) => setProductDraft((prev) => ({ ...prev, productQuantity: e.target.value }))} className="h-12 rounded-xl bg-white dark:bg-slate-900" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Variants & Notes (Optional)</label>
                  <Textarea placeholder="e.g., 50 Red, 50 Blue, US Plug" value={productDraft.productInfo} onChange={(e) => setProductDraft((prev) => ({ ...prev, productInfo: e.target.value }))} className="min-h-[80px] rounded-xl bg-white dark:bg-slate-900" />
                </div>
                
                <Button type="button" variant="outline" className="h-12 w-full rounded-xl border-dashed border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/40" onClick={addProduct}>
                  <PackagePlus className="mr-2 h-5 w-5" />
                  Add to Order Summary
                </Button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="space-y-6 xl:sticky xl:top-28">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-6">
              
              <h3 className="mb-6 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                <FileText className="h-5 w-5 text-brand-orange-500" /> Order Summary
              </h3>

              {products.length === 0 ? (
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-800/50">
                  <ShoppingCart className="mb-3 h-8 w-8 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Your cart is empty.</p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Add products using the form to see them here.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {products.map((product, index) => (
                    <div key={`${product.productLink}-${index}`} className="group relative rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-slate-200 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700">
                      <div className="pr-8">
                        <p className="font-bold text-slate-900 dark:text-white line-clamp-1" title={product.productName}>{product.productName}</p>
                        <p className="mt-1 text-xs text-indigo-600 dark:text-indigo-400 line-clamp-1" title={product.productLink}>{product.productLink}</p>
                        <div className="mt-3 flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1 rounded-md bg-white px-2 py-1 shadow-sm dark:bg-slate-900">
                            <span className="text-[11px] font-bold">{currencySymbol}</span> {product.productPrice}
                          </span>
                          <span className="flex items-center gap-1 rounded-md bg-white px-2 py-1 shadow-sm dark:bg-slate-900">
                            Qty: {product.productQuantity}
                          </span>
                          <span className="flex items-center gap-1 rounded-md bg-white px-2 py-1 shadow-sm dark:bg-slate-900">
                            {product.productWeight}kg
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="absolute right-3 top-3 rounded-full bg-white p-2 text-slate-400 opacity-100 shadow-sm transition-all hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-900 dark:text-slate-500 dark:hover:bg-rose-900/30 dark:hover:text-rose-400 lg:opacity-0 lg:group-hover:opacity-100"
                        onClick={() => removeProduct(index)}
                        aria-label="Remove product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Dynamic Totals */}
              {products.length > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-500 dark:text-slate-400">
                    <span>Total Items</span>
                    <span>{products.length} unique</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-lg font-black text-slate-900 dark:text-white">
                    <span>Est. Goods Value</span>
                    <span>{order.currencyType} {totalEstimatedValue.toFixed(2)}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">*Shipping costs and local currency equivalent will be calculated before you pay.</p>
                </div>
              )}

              <div className="mt-8">
                <Button
                  type="button"
                  className="h-14 w-full rounded-xl bg-brand-orange-500 text-base font-bold text-white shadow-xl shadow-brand-orange-500/20 transition-all hover:bg-brand-orange-600 active:scale-[0.98] disabled:opacity-70 border-0"
                  onClick={proceedToPayment}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" /></>
                  )}
                </Button>
                <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                  By continuing, you agree to our terms of service and shipping policies.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>
      
    </div>
  );
}
