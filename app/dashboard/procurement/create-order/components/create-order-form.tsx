'use client';

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
  CheckCircle2
} from 'lucide-react';
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
}

const currencyTypeArray = [
  { label: 'CNY - Yuan', value: 'CNY' },
  { label: 'USD - Dollar', value: 'USD' },
] as const;

const orderCategoryArray = [
  { label: 'Goods with Battery', value: 'Goods with Battery' },
  { label: 'Raw Batteries', value: 'Raw Batteries' },
  { label: 'Liquids, Gases, Powder', value: 'Liquids, Gases, Powder' },
  { label: 'Other Goods', value: 'Other Goods' },
] as const;

const formSchema = z.object({
  orderName: z.string().min(1, 'Order name is required'),
  destinationCountry: z.string().min(1, 'Destination country is required'),
  currencyType: z.string().min(1, 'Currency type is required'),
  shippingPlan: z.string().min(1, 'Shipping plan is required'),
  orderCategory: z.string().min(1, 'Order category is required'),
  shippingAddress: z.string().min(1, 'Shipping address is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface ReportFormProps {
  setIsOpen: React.Dispatch<React.SetStateAction<{ isOpen: boolean }>>;
}

const CreateOrderForm: React.FC<ReportFormProps> = ({ setIsOpen }) => {
  const router = useRouter();
  const navigateWithAlert = useNavigationWithAlert();
  const { user } = useAuth();
  
  const [pidUser] = useState(user?.pidUser);
  const [emailUser] = useState(user?.userEmail);
  const [pidOrder] = useState('DR' + new Date().getTime().toString());
  
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/get-data/countries-shipping-plan');
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Failed to load countries", error);
      }
    };
    fetchCountries();
  }, []);

  const handleCountryChange = (value: string) => {
    const country = countries.find((c) => c.pidCountry === value) || null;
    setSelectedCountry(country);
  };

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    const submissionData = { ...formData, pidOrder, pidUser, emailUser };

    try {
      const response = await fetch('/api/crud/procurement-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (data.responsex.status === 'SUCCESS') {
        setIsOpen({ isOpen: false });
        navigateWithAlert(
          '/dashboard/procurement/add-product/' + data.responsex.pidOrder,
          'success',
          'Your request has been submitted!'
        );
        router.refresh();
      } else {
        toast.warning(data.responsex.message || 'Action failed. Please try again.');
      }
    } catch (error: any) {
      toast.error('An error occurred. Please check your connection.');
    }
  };

  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Basic Info Section */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Order Name */}
          <div className="space-y-3">
            <label htmlFor="orderName" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Order Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                {...register('orderName')}
                id="orderName"
                placeholder="E.g., Summer Electronics Restock"
                className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 pl-11 text-sm focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
              />
            </div>
            {errors.orderName && <p className="text-xs font-bold text-rose-500">{errors.orderName.message}</p>}
          </div>

          {/* Order Category */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
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
                    <SelectTrigger className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 pl-11 text-sm focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white">
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
            {errors.orderCategory && <p className="text-xs font-bold text-rose-500">{errors.orderCategory.message}</p>}
          </div>

          {/* Country */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
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
                    <SelectTrigger className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 pl-11 text-sm focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white">
                      <SelectValue placeholder="Select Destination" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                      {countries.map((country) => (
                        <SelectItem key={country.pidCountry} value={country.pidCountry}>
                          {country.countryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {errors.destinationCountry && <p className="text-xs font-bold text-rose-500">{errors.destinationCountry.message}</p>}
          </div>

          {/* Currency */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Currency
            </label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Controller
                name="currencyType"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 pl-11 text-sm focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white">
                      <SelectValue placeholder="Select Currency" />
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
            {errors.currencyType && <p className="text-xs font-bold text-rose-500">{errors.currencyType.message}</p>}
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* Logistics Section */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Shipping Plan */}
          <div className="space-y-3 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Shipping Plan
            </label>
            <div className="relative">
              <ShipIcon className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Controller
                name="shippingPlan"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCountry}>
                    <SelectTrigger className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 pl-11 text-sm focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white">
                      <SelectValue placeholder={selectedCountry ? "Select Shipping Plan" : "Select Country First"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                      {selectedCountry?.shippingPlans.map((plan) => (
                        <SelectItem key={plan.pidShippingPlan} value={plan.pidShippingPlan}>
                          {convertToTitleCase(plan.shippingPlanName)} - ${plan.shippingPlanRate}/Kg
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {errors.shippingPlan && <p className="text-xs font-bold text-rose-500">{errors.shippingPlan.message}</p>}
          </div>

          {/* Shipping Weight Notice */}
          <div className="md:col-span-2 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/30 dark:bg-amber-900/10">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
              <div>
                <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">Shipping Weight Notice</h3>
                <p className="mt-1 text-xs leading-relaxed text-amber-700 dark:text-amber-400/90">
                  Kindly note that for orders weighing less than <strong>10kg</strong>, we must use Air Shipping, even if Sea Shipping is selected.
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-3 md:col-span-2">
            <label htmlFor="shippingAddress" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <MapPin className="h-3 w-3" /> Final Delivery Address
            </label>
            <Textarea
              {...register('shippingAddress')}
              id="shippingAddress"
              placeholder="Enter complete address including ZIP/Postal code..."
              className="min-h-[120px] w-full resize-none rounded-xl border-slate-200 bg-slate-50 p-4 text-sm focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            />
            {errors.shippingAddress && <p className="text-xs font-bold text-rose-500">{errors.shippingAddress.message}</p>}
          </div>

          {/* Delivery Info Notice */}
          <div className="md:col-span-2 rounded-2xl border border-blue-100 bg-blue-50/50 p-5 dark:border-blue-900/30 dark:bg-blue-900/10">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100">Delivery Logistics</h3>
                <p className="mt-1 text-xs leading-relaxed text-blue-700 dark:text-blue-300/80">
                  Please provide your exact delivery address and phone number(s). Orders to US, UK, Canada, and Mexico are fulfilled via DHL. Orders to African nations are delivered by our shipping partners directly to your address. Nigerian orders arrive at our Lagos office for pickup or local forwarding.
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
              <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
            ) : (
              <><CheckCircle2 className="h-5 w-5" /> Initialize Order</>
            )}
          </Button>
        </div>

      </form>
    </Suspense>
  );
};

export default CreateOrderForm;