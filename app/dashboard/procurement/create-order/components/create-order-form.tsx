'use client';

import { normalizeAccountCountry } from '@/lib/features/country';
import { deliveryGuidance } from '@/lib/procurement/deliveryGuidance';

import {
  isShippingPlanAllowed,
  requiresSpecialHandling,
  shippingEligibilityMessage,
} from '@/lib/procurement/shippingEligibility';
import React, { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import {
  User,
  Globe,
  CreditCard,
  ShipIcon,
  BoxIcon,
  AlertCircle,
  Info,
  Loader2,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import styles from './create-order.module.css';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';
import { useAuth } from '@/app/context/AuthContext';
import { convertToTitleCase } from '@/app/utils/stringUtils';

interface Country {
  id: number;
  pidCountry: string;
  countryName: string;
  shippingPlans: ShippingPlan[];
}

interface ShippingPlan {
  id: number;
  pidShippingPlan: string;
  shippingPlanName: string;
  shippingPlanRate: number;
  shippingPlanUnit?: string | null;
  shippingPlanCurrency?: 'USD' | 'NGN';
}

const currencyTypeArray = [
  { label: 'CNY - Yuan', value: 'CNY' },
  { label: 'USD - Dollar', value: 'USD' },
] as const;

const orderCategoryArray = [
  { label: 'Goods with Battery', value: 'Goods with Battery' },
  { label: 'Raw Batteries', value: 'Raw Batteries' },
  { label: 'Liquids, Gases, Powder', value: 'Liquids, Gases, Powder' },
  { label: 'Non Battery/liquid', value: 'Other Goods' },
] as const;

const formSchema = z.object({
  orderName: z.string().min(1, 'Order name is required'),
  destinationCountry: z.string().min(1, 'Destination country is required'),
  currencyType: z.string().min(1, 'Currency type is required'),
  shippingPlan: z.string().min(1, 'Shipping plan is required'),
  orderCategory: z.string().min(1, 'Order category is required'),
  shippingAddress: z.string().trim().min(1, 'Shipping address is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface ReportFormProps {
  setIsOpen: React.Dispatch<React.SetStateAction<{ isOpen: boolean }>>;
  partner?: {
    countries: Country[];
    onSubmit: (values: FormValues) => Promise<void>;
  };
}

const CreateOrderForm: React.FC<ReportFormProps> = ({ setIsOpen, partner }) => {
  const [showCurrencyHelp, setShowCurrencyHelp] = useState(false);
  const [profileAddress, setProfileAddress] = useState<{
    address: string;
    country: string;
    phone: string;
  } | null>(null);
  const [addressLoading, setAddressLoading] = useState(!partner);
  const [addressError, setAddressError] = useState(false);
  const [addressMode, setAddressMode] = useState<'profile' | 'different'>(
    'different',
  );
  const differentAddress = React.useRef('');
  const currencyHelpId = React.useId();
  const currencyFieldId = React.useId();
  const router = useRouter();
  const navigateWithAlert = useNavigationWithAlert();
  const { user } = useAuth();

  const pidUser = user?.pidUser;
  const [emailUser] = useState(user?.userEmail);
  const [pidOrder] = useState('DR' + new Date().getTime().toString());

  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [savedOrders, setSavedOrders] = useState<
    Array<{ pidOrder: string; orderName: string | null; productCount: number }>
  >([]);
  const [checkingDrafts, setCheckingDrafts] = useState(true);
  const [allowSeparateOrder, setAllowSeparateOrder] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (partner) {
      setCountries(partner.countries);
      setCheckingDrafts(false);
      return;
    }
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/get-data/countries-shipping-plan');
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Failed to load countries', error);
      }
    };
    fetchCountries();
    fetch('/api/procurement/drafts', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : { orders: [] }))
      .then((data) => setSavedOrders(data.orders || []))
      .finally(() => setCheckingDrafts(false));
  }, [partner]);

  useEffect(() => {
    if (partner || !pidUser) {
      setAddressLoading(false);
      return;
    }
    const controller = new AbortController();
    setAddressLoading(true);
    setAddressError(false);
    fetch('/api/procurement/profile-address', {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Profile unavailable');
        return response.json();
      })
      .then(setProfileAddress)
      .catch((error) => {
        if (error.name !== 'AbortError') setAddressError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setAddressLoading(false);
      });
    return () => controller.abort();
  }, [partner, pidUser]);

  const profileCountry = normalizeAccountCountry(profileAddress?.country);
  const destinationCountry = normalizeAccountCountry(
    selectedCountry?.countryName,
  );
  const addressCountryMismatch = Boolean(
    profileCountry &&
      destinationCountry &&
      profileCountry !== destinationCountry,
  );
  const canUseProfileAddress =
    Boolean(profileAddress?.address) && !addressCountryMismatch;
  const chooseAddress = (mode: 'profile' | 'different') => {
    if (mode === addressMode) return;
    if (mode === 'profile') {
      if (!canUseProfileAddress || !profileAddress) return;
      differentAddress.current = watch('shippingAddress') || '';
      setValue(
        'shippingAddress',
        [profileAddress.address, profileAddress.country, profileAddress.phone]
          .filter(Boolean)
          .join('\n'),
        { shouldDirty: true, shouldValidate: true },
      );
    } else {
      setValue('shippingAddress', differentAddress.current, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    setAddressMode(mode);
  };
  useEffect(() => {
    if (addressMode === 'profile' && addressCountryMismatch) {
      setAddressMode('different');
      setValue('shippingAddress', differentAddress.current, {
        shouldDirty: true,
      });
    }
  }, [addressMode, addressCountryMismatch, setValue]);

  const handleCountryChange = (value: string) => {
    const country = countries.find((c) => c.pidCountry === value) || null;
    setSelectedCountry(country);
    setValue('shippingPlan', '');
  };
  const category = watch('orderCategory');
  const shippingPlanId = watch('shippingPlan');
  const availablePlans =
    selectedCountry?.shippingPlans.filter((plan) =>
      isShippingPlanAllowed(category, plan.shippingPlanName),
    ) || [];
  useEffect(() => {
    if (
      shippingPlanId &&
      selectedCountry &&
      !selectedCountry.shippingPlans.some(
        (plan) =>
          plan.pidShippingPlan === shippingPlanId &&
          isShippingPlanAllowed(category, plan.shippingPlanName),
      )
    )
      setValue('shippingPlan', '');
  }, [category, shippingPlanId, selectedCountry, setValue]);
  const selectedShippingPlan = selectedCountry?.shippingPlans.find(
    (plan) => plan.pidShippingPlan === watch('shippingPlan'),
  );
  const usesCbm = selectedShippingPlan?.shippingPlanUnit === 'CBM';
  const delivery = deliveryGuidance(
    selectedCountry?.countryName,
    Boolean(partner),
  );

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    if (partner) {
      try {
        await partner.onSubmit(formData);
        setIsOpen({ isOpen: false });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Unable to save order.',
        );
      }
      return;
    }
    const submissionData = {
      ...formData,
      pidOrder,
      pidUser,
      emailUser,
      allowSeparateOrder,
    };

    try {
      const response = await fetch('/api/crud/procurement-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json().catch(() => null);
      if (!data?.responsex) {
        throw new Error(
          'The server could not save your order. Your form details are still here. Please try again shortly.',
        );
      }

      if (data.responsex.status === 'SUCCESS') {
        setIsOpen({ isOpen: false });
        navigateWithAlert(
          '/dashboard/procurement/add-product/' + data.responsex.pidOrder,
          'success',
          'Your request has been submitted!',
        );
        router.refresh();
      } else if (data.responsex.status === 'EXISTING_SAVED_ORDERS') {
        setSavedOrders(data.responsex.drafts || []);
        setAllowSeparateOrder(false);
      } else {
        toast.warning(
          data.responsex.message || 'Action failed. Please try again.',
        );
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof TypeError
          ? 'Unable to reach the server. Your form details are still here. Please try again.'
          : error instanceof Error
            ? error.message
            : 'Unable to save your order. Please try again.',
      );
    }
  };

  if (checkingDrafts) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (savedOrders.length > 0 && !allowSeparateOrder) {
    const first = savedOrders[0];
    return (
      <section className={styles.saved} aria-labelledby="saved-order-heading">
        <div className={styles.savedIntro}>
          <div className={styles.savedIcon}>
            <BoxIcon size={22} aria-hidden="true" />
          </div>
          <div>
            <p className={styles.eyebrow}>Continue where you left off</p>
            <h3 id="saved-order-heading" className={styles.savedTitle}>
              {savedOrders.length === 1
                ? 'You have a saved order'
                : `You have ${savedOrders.length} saved orders`}
            </h3>
          </div>
        </div>
        <p className={styles.savedDescription}>
          Go to Saved Orders to open an order and choose what you want to do
          next.
        </p>
        <div className={styles.orderSummary}>
          <div className={styles.orderSummaryTop}>
            <p className={styles.orderName}>
              {first.orderName || 'Untitled order'}
            </p>
            <span className={styles.status}>Draft</span>
          </div>
          <p className={styles.orderMeta}>
            <span>
              {first.productCount} product{first.productCount === 1 ? '' : 's'}
            </span>
            <span className={styles.orderId}>{first.pidOrder}</span>
          </p>
        </div>
        <div className={styles.savedActions}>
          <Button
            type="button"
            onClick={() => {
              setIsOpen({ isOpen: false });
              router.push('/dashboard/procurement/view-orders/saved');
            }}
            className={styles.primaryAction}
          >
            Continue with saved orders
          </Button>
        </div>
        <div className={styles.separate}>
          <p>Need a separate shipment?</p>
          <button
            type="button"
            onClick={() => setAllowSeparateOrder(true)}
            className={styles.separateAction}
          >
            Create a separate order
          </button>
        </div>
      </section>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Basic Info Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Order Name */}
          <div className="space-y-3">
            <label
              htmlFor="orderName"
              className="flex h-8 items-center text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
            >
              Order Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                {...register('orderName')}
                id="orderName"
                placeholder="E.g. Phone accessories"
                className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 pl-11 text-sm focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
              />
            </div>
            {errors.orderName && (
              <p className="text-xs font-bold text-rose-500">
                {errors.orderName.message}
              </p>
            )}
          </div>

          {/* Order Category */}
          <div className="space-y-3">
            <label
              htmlFor="orderCategory"
              className="flex h-8 items-center text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
            >
              Category
            </label>
            <div className="relative">
              <BoxIcon className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Controller
                name="orderCategory"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      id="orderCategory"
                      className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 pl-11 text-sm focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                    >
                      <SelectValue placeholder="Select Goods Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                      {orderCategoryArray.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {errors.orderCategory && (
              <p className="text-xs font-bold text-rose-500">
                {errors.orderCategory.message}
              </p>
            )}
          </div>

          {/* Country */}
          <div className="space-y-3">
            <label
              htmlFor="destinationCountry"
              className="flex h-8 items-center text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
            >
              Destination Country
            </label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Controller
                name="destinationCountry"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleCountryChange(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger
                      id="destinationCountry"
                      className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 pl-11 text-sm focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                    >
                      <SelectValue placeholder="Select Destination" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                      {countries.map((country) => (
                        <SelectItem
                          key={country.pidCountry}
                          value={country.pidCountry}
                        >
                          {country.countryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {errors.destinationCountry && (
              <p className="text-xs font-bold text-rose-500">
                {errors.destinationCountry.message}
              </p>
            )}
          </div>

          {/* Currency */}
          <div className="space-y-3">
            <div className="flex min-h-8 flex-wrap items-center gap-x-3 gap-y-2">
              <label
                htmlFor={currencyFieldId}
                className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
              >
                Shop Currency
              </label>
              <button
                type="button"
                aria-label="Help choosing shop currency"
                aria-expanded={showCurrencyHelp}
                aria-controls={currencyHelpId}
                onClick={() => setShowCurrencyHelp((shown) => !shown)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setShowCurrencyHelp(false);
                }}
                className={styles.helpToggle}
              >
                <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
                Currency guide
              </button>
              <p
                id={currencyHelpId}
                hidden={!showCurrencyHelp}
                className={styles.helpPanel}
              >
                Choose CNY (yuan or RMB) for 1688, Taobao and Pinduoduo, or USD
                for Alibaba. Please keep products with different shop currencies
                in separate orders.
              </p>
            </div>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Controller
                name="currencyType"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      id={currencyFieldId}
                      aria-describedby={
                        showCurrencyHelp ? currencyHelpId : undefined
                      }
                      className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 pl-11 text-sm focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                    >
                      <SelectValue placeholder="Select Shop Currency" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                      {currencyTypeArray.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {errors.currencyType && (
              <p className="text-xs font-bold text-rose-500">
                {errors.currencyType.message}
              </p>
            )}
          </div>
        </div>

        {/* Logistics Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Shipping Plan */}
          <div className="space-y-3 md:col-span-2">
            <label
              htmlFor="shippingPlan"
              className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
            >
              Shipping Plan
            </label>
            <div className="relative">
              <ShipIcon className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Controller
                name="shippingPlan"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedCountry}
                  >
                    <SelectTrigger
                      id="shippingPlan"
                      className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 pl-11 text-sm focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                    >
                      <SelectValue
                        placeholder={
                          selectedCountry
                            ? 'Select Shipping Plan'
                            : 'Select Country First'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                      {availablePlans.map((plan) => (
                        <SelectItem
                          key={plan.pidShippingPlan}
                          value={plan.pidShippingPlan}
                        >
                          {convertToTitleCase(plan.shippingPlanName)} -{' '}
                          {plan.shippingPlanCurrency === 'NGN' ? '₦' : '$'}
                          {Number(plan.shippingPlanRate).toLocaleString()}/
                          {plan.shippingPlanUnit === 'CBM' ? 'CBM' : 'kg'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {requiresSpecialHandling(category) && (
              <p className="text-sm text-slate-500">
                {shippingEligibilityMessage}
              </p>
            )}
            {errors.shippingPlan && (
              <p className="text-xs font-bold text-rose-500">
                {errors.shippingPlan.message}
              </p>
            )}
          </div>

          {/* Shipping Weight Notice */}
          {selectedCountry && (destinationCountry !== 'Nigeria' || usesCbm) && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/30 dark:bg-amber-900/10 md:col-span-2">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
                <div>
                  <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                    {usesCbm
                      ? 'Shipping Volume Notice'
                      : 'Shipping Weight Notice'}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-amber-700 dark:text-amber-400/90">
                    {usesCbm ? (
                      <>
                        For this Nigeria sea-shipping order, each product must
                        include its estimated <strong>CBM per item</strong>. You
                        will see a worked example when adding each product.
                      </>
                    ) : (
                      <>
                        Kindly note that for orders weighing less than{' '}
                        <strong>10kg</strong>, we must use Air Shipping, even if
                        Sea Shipping is selected. For this destination, sea
                        shipping is billed per kg, including when volumetric
                        weight applies.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Address */}
          <div className="space-y-3 md:col-span-2">
            <label
              htmlFor="shippingAddress"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
            >
              <MapPin className="h-3 w-3" /> Final Delivery Address
            </label>
            {!partner && (
              <fieldset className={styles.addressChoices}>
                <legend className="sr-only">Choose a delivery address</legend>
                <button
                  type="button"
                  className={styles.addressOption}
                  aria-pressed={addressMode === 'profile'}
                  disabled={addressLoading || !canUseProfileAddress}
                  onClick={() => chooseAddress('profile')}
                >
                  <span
                    className={styles.addressIndicator}
                    aria-hidden="true"
                  />
                  <span>Use my profile address</span>
                </button>
                <button
                  type="button"
                  className={styles.addressOption}
                  aria-pressed={addressMode === 'different'}
                  onClick={() => chooseAddress('different')}
                >
                  <span
                    className={styles.addressIndicator}
                    aria-hidden="true"
                  />
                  <span>Enter a different address</span>
                </button>
                <p className={styles.addressHint}>
                  {addressLoading ? (
                    'Loading your profile address…'
                  ) : addressError ? (
                    'Your profile address could not be loaded. You can still enter an address below.'
                  ) : addressCountryMismatch ? (
                    `Your profile address is in ${profileAddress?.country}. Please enter an address for ${selectedCountry?.countryName}.`
                  ) : !profileAddress?.address ? (
                    <>
                      No address saved in your profile. Enter one below or{' '}
                      <a
                        href="/dashboard/profile-update"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        update your profile
                      </a>
                      .
                    </>
                  ) : addressMode === 'profile' ? (
                    'Your saved address and phone number are filled in below. You can adjust them for this order.'
                  ) : (
                    'Use an address for this order without changing your profile.'
                  )}
                </p>
              </fieldset>
            )}
            <Textarea
              {...register('shippingAddress', {
                onChange: (event) =>
                  setValue('shippingAddress', event.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  }),
              })}
              id="shippingAddress"
              aria-describedby="order-delivery-guidance"
              placeholder="Enter your complete address and phone number(s)..."
              className="min-h-[120px] w-full resize-none rounded-xl border-slate-200 bg-slate-50 p-4 text-sm focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            />
            {errors.shippingAddress && (
              <p className="text-xs font-bold text-rose-500">
                {errors.shippingAddress.message}
              </p>
            )}
          </div>

          {/* Delivery Info Notice */}
          <div
            id="order-delivery-guidance"
            aria-live="polite"
            className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 dark:border-blue-900/30 dark:bg-blue-900/10 md:col-span-2"
          >
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100">
                  {delivery.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-blue-700 dark:text-blue-300/80">
                  {delivery.address}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-blue-700 dark:text-blue-300/80">
                  {delivery.message}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 active:scale-[0.99] disabled:opacity-70 sm:w-auto sm:px-10"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" /> Create order
              </>
            )}
          </Button>
        </div>
      </form>
    </Suspense>
  );
};

export default CreateOrderForm;
