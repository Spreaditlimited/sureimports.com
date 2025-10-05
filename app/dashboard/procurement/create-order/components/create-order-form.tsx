'use client';

import { X, User, Globe, CreditCard, ShipIcon, BoxIcon } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';
import { useAuth } from '@/app/context/AuthContext';
import { Suspense, useEffect, useState } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
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
  // { label: 'CAD - Canadian Dollar', value: 'CAD' },
  // { label: 'GBP - British Pound', value: 'GBP' },
  // { label: 'AUD - Australian Dollar', value: 'AUD' },
  // { label: 'EUR - Euro', value: 'EUR' },
] as const;

const shippingPlanArray = [
  { label: 'Normal Shipping', value: 'NORMAL_SHIPPING' },
  { label: 'Express Shipping', value: 'EXPRESS_SHIPPING' },
  { label: 'Special Shipping', value: 'SPECIAL_SHIPPING' },
  { label: 'Sea Shipping', value: 'SEA_SHIPPING' },
] as const;

const orderCategoryArray = [
  { label: 'Goods with Battery', value: 'Goods with Battery' },
  { label: 'Raw Batteries', value: 'Raw Batteries' },
  { label: 'Liquids, Gases, Powder', value: 'Liquids, Gases, Powder' },
  { label: 'Other Goods', value: 'Other Goods' },
] as const;

const destinationCountryArray = [
  { label: 'Nigeria', value: 'NGR' },
  { label: 'United Kingdom', value: 'UK' },
  { label: 'Cameroon', value: 'cameroon' },
  { label: "Côte d'Ivoire", value: 'c_te_d_ivoire' },
  { label: 'Benin Republic', value: 'benin_republic' },
  { label: 'Kenya (Nairobi)', value: 'kenya_nairobi' },
  { label: 'Nigeria', value: 'Nigeria' },
  { label: 'Ghana (Accra)', value: 'ghana_accra' },
  { label: 'Zimbabwe', value: 'Argentina' },
  { label: 'Uganda', value: 'Armenia' },
  { label: 'United States', value: 'united_states' },
  { label: 'Canada', value: 'canada' },
  { label: 'Mexico', value: 'mexico' },
  { label: 'South Africa', value: 'south_africa' },
  { label: 'Tanzania', value: 'tanzania' },
  { label: 'Kenya (Nakuru)', value: 'Kenya (Nakuru)' },
  { label: 'Kenya (Kisumu)', value: 'Kenya (Kisumu)' },
  { label: 'Kenya (Eldoret)', value: 'Kenya (Eldoret)' },
  { label: 'Uganda (Kampala)', value: 'uganda_kampala' },
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

//USER DATA
interface User {
  pidUser: string;
  email: string;
  name: string;
}

//API RESPONSE
interface ApiResponse {
  responsex: any;
  successx: boolean;
  userx: User;
}

interface ReportFormProps {
  setIsOpen: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
    }>
  >;
}

const CreateOrderForm: React.FC<ReportFormProps> = ({ setIsOpen }) => {
  let orderID = 'DR' + new Date().getTime().toString();
  const navigateWithAlert = useNavigationWithAlert();
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const [pidOrder, setPidOrder] = useState(orderID);
  const [emailUser, setEmailUser] = useState(user?.userEmail);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    // Combine form data with orderId and userEmail
    const submissionData = {
      ...formData,
      pidOrder,
      pidUser,
      emailUser,
    };

    try {
      //alert(JSON.stringify(submissionData));return;
      console.log(JSON.stringify(submissionData));
      const response = await fetch('/api/crud/procurement-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data: ApiResponse = await response.json();

      if (data.responsex.status == 'SUCCESS') {
        setIsOpen({ isOpen: false });
        navigateWithAlert(
          '/dashboard/procurement/add-product/' + data.responsex.pidOrder,
          'success',
          'Your request has been submitted!',
        );
        const router = useRouter();
        router.refresh();
      }

      if (data.responsex.status == 'EMPTY_FIELD') {
        toast.warning(data.responsex.message);
      }
      if (data.responsex.status == 'FAILED') {
        toast.warning(data.responsex.message);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      //setLoading(false);
    }
  };

  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch('/api/get-data/countries-shipping-plan');
      const data = await response.json();
      setCountries(data);
    };

    fetchCountries();
  }, []);

  const handleCountryChange = (value: string) => {
    const country = countries.find((c) => c.pidCountry === value) || null;
    setSelectedCountry(country);
  };

  return (
    <>
      {/* <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Create New Order</h1>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </div> */}
      <Suspense fallback={<div>Loading...</div>}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="orderName"
                className="text-gray-700 dark:text-white"
              >
                Order Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500 lg:top-5" />
                <Input
                  {...register('orderName')}
                  id="orderName"
                  placeholder="Give your order a Name"
                  className="w-full border-gray-300 bg-white pl-10 text-gray-900 placeholder:text-gray-500 dark:border-gray-800 dark:bg-[#262b38] dark:text-gray-300 dark:placeholder:text-gray-400 lg:h-[60px] lg:text-base"
                />
              </div>
              {errors.orderName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.orderName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="country"
                className="text-gray-700 dark:text-white"
              >
                Country
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 z-10 h-5 w-5 text-gray-400 dark:text-gray-500 lg:top-5" />
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
                        id="country"
                        className="w-full border-gray-300 bg-white pl-10 text-gray-900 dark:border-gray-800 dark:bg-[#262b38] dark:text-gray-300 lg:h-[60px] lg:text-base"
                      >
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
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
                <p className="mt-1 text-sm text-red-600">
                  {errors.destinationCountry.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="currency"
                className="text-gray-700 dark:text-white"
              >
                currency
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-2.5 z-10 h-5 w-5 text-gray-400 dark:text-gray-500 lg:top-5" />
                <Controller
                  name="currencyType"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="currency"
                        className="w-full border-gray-300 bg-white pl-10 text-gray-900 dark:border-gray-800 dark:bg-[#262b38] dark:text-gray-300 lg:h-[60px] lg:text-base"
                      >
                        <SelectValue placeholder="Shop currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencyTypeArray.map((currency) => (
                          <SelectItem
                            key={currency.value}
                            value={currency.value}
                          >
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {errors.currencyType && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.currencyType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="currency"
                className="text-gray-700 dark:text-white"
              >
                Order Category
              </Label>
              <div className="relative">
                <BoxIcon className="absolute left-3 top-2.5 z-10 h-5 w-5 text-gray-400 dark:text-gray-500 lg:top-5" />
                <Controller
                  name="orderCategory"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="currency"
                        className="w-full border-gray-300 bg-white pl-10 text-gray-900 dark:border-gray-800 dark:bg-[#262b38] dark:text-gray-300 lg:h-[60px] lg:text-base"
                      >
                        <SelectValue placeholder="Order Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {orderCategoryArray.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {errors.orderCategory && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.orderCategory.message}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label
                htmlFor="shippingPlan"
                className="text-gray-700 dark:text-white"
              >
                Shipping Plan
              </Label>
              <div className="relative">
                <ShipIcon className="absolute left-3 top-2.5 z-10 h-5 w-5 text-gray-400 dark:text-gray-500 lg:top-5" />
                <Controller
                  name="shippingPlan"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="shippingPlan"
                        className="w-full border-gray-300 bg-white pl-10 text-gray-900 dark:border-gray-800 dark:bg-[#262b38] dark:text-gray-300 lg:h-[60px] lg:text-base"
                      >
                        <SelectValue placeholder="Shipping Plan" />
                      </SelectTrigger>

                      <SelectContent>
                        {/* IF SHIPPING DESTINATION IS NIGERIA */}
                        {selectedCountry?.shippingPlans.map((plan) => (
                          <SelectItem
                            key={plan.pidShippingPlan}
                            value={plan.pidShippingPlan}
                          >
                            {convertToTitleCase(plan.shippingPlanName)}&nbsp; ($
                            {plan.shippingPlanRate}) per Kg
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {errors.shippingPlan && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shippingPlan.message}
                </p>
              )}

              {/* A Warning Message  */}
              <div className="flex-1">
      <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
        Shipping Weight Notice
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-yellow-700 dark:text-yellow-200">
        Kindly note that for orders with weight less than 10kg, we must use air shipping even if you select sea shipping.
      </p>
    </div>

            </div>

            {/* IF SHIPPING DESTINATION IS NIGERIA
            {selectedCountry?.shippingPlans.map((plan) => (

              (selectedCountry.countryName == "Nigeria" && plan.shippingPlanName == "EXPRESS_SHIPPING") && (
              <SelectItem
                key={plan.pidShippingPlan}
                value={plan.pidShippingPlan}
              >
                {convertToTitleCase(plan.shippingPlanName)}&nbsp; ($
                {plan.shippingPlanRate}) per Kg
              </SelectItem>
              )

              ))} */}

            <div className="space-y-2 md:col-span-2">
              <Label
                htmlFor="shippingAddress"
                className="text-gray-700 dark:text-white"
              >
                Shipping Address
              </Label>
              <Textarea
                {...register('shippingAddress')}
                id="shippingAddress"
                placeholder="Enter shipping address here"
                className="min-h-[100px] w-full border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 dark:border-gray-800 dark:bg-[#262b38] dark:text-gray-300 dark:placeholder:text-gray-400 lg:text-base"
              />
              {errors.shippingAddress && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shippingAddress.message}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2 lg:text-base">
              Please, provide your exact delivery address including phone
              number(s) for orders going to Canada, US, Mexico, UK, as they are
              delivered by DHL. Orders going to Ghana, Zimbabwe, Cameroon, etc.,
              are delivered by our Chinese shipping partners straight to your
              delivery address. Orders to Nigeria are delivered to our Lagos
              office. You can pick up or we forward to your location at an extra
              cost.
            </div>

            <div className="space-y-2 md:col-span-2 lg:text-base">
              <Button type="submit" className="my-[25px] h-[49px] w-[162px]">
                Create Order
              </Button>
            </div>
          </div>
        </form>
      </Suspense>
    </>
  );
};

export default CreateOrderForm;
