'use client';

import { v4 as uuidv4 } from 'uuid'; // For generating order IDs
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/_lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input-with-dark-mode';
import { CommandList } from 'cmdk';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';
import { useState } from 'react';
import React from 'react';

const formSchema = z.object({
  pidUser: z
    .string()
    .min(2, {
      message: 'User ID is required, Please refresh page or login again.',
    })
    .max(500),

  pidOrder: z
    .string()
    .min(2, {
      message: 'Order ID is required, Please refresh page or login again.',
    })
    .max(500),

  emailUser: z
    .string()
    .min(2, {
      message: 'User Email is required, Please refresh page or login again.',
    })
    .max(500),

  orderName: z
    .string()
    .min(2, {
      message: 'Order Name is required',
    })
    .max(500),

  destinationCountry: z
    .string()
    .min(2, { message: 'Destination Country is required' }),
  currencyType: z.string().min(2, { message: 'Currenty Type is Required' }),
  shippingPlan: z.string().min(2, { message: 'Shipping Plan is required' }),

  orderCategory: z
    .string()
    .min(2, { message: 'Please select an order Category' }),
  shippingAddress: z
    .string()
    .min(2, { message: 'Please enter the shipping address.' }),
});

// const country = [
//   { label: 'United States', value: 'United States' },
//   { label: 'Canada', value: 'Canada' },
//   { label: 'United Kingdom', value: 'United Kingdom' },
//   { label: 'Australia', value: 'Australia' },
//   { label: 'Germany', value: 'Germany' },
// ] as const;

const currency = [
  { label: 'CNY - Yuan', value: 'CNY' },
  { label: 'USD - Dollar', value: 'USD' },
  // { label: 'CAD - Canadian Dollar', value: 'CAD' },
  // { label: 'GBP - British Pound', value: 'GBP' },
  // { label: 'AUD - Australian Dollar', value: 'AUD' },
  // { label: 'EUR - Euro', value: 'EUR' },
] as const;

const plan = [
  { label: 'Normal Shipping', value: 'NORMAL_SHIPPING' },
  { label: 'Express Shipping', value: 'EXPRESS_SHIPPING' },
  { label: 'Special Shipping', value: 'SPECIAL_SHIPPING' },
  // { label: 'Sea Shipping', value: 'SEA_SHIPPING' },
] as const;

const OrderCategory = [
  { label: 'Goods with Battery', value: 'Goods with Battery' },
  { label: 'Raw Batteries', value: 'Raw Batteries' },
  { label: 'Liquids, Gases, Powder', value: 'Liquids, Gases, Powder' },
  { label: 'Other Goods', value: 'Other Goods' },
] as const;

interface ReportFormProps {
  setIsOpen: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
    }>
  >;
}

const country = [
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

const CreateOrderForm: React.FC<ReportFormProps> = ({ setIsOpen }) => {
  //initialize alert system
  let orderID = 'DR' + new Date().getTime().toString();
  const navigateWithAlert = useNavigationWithAlert();
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const [pidOrder, setPidOrder] = useState(orderID);
  const [email, setEmail] = useState(user?.email);
  const [message, setMessage] = React.useState('');
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pidUser: pidUser,
      pidOrder: pidOrder,
      emailUser: email,
      orderName: '',
      destinationCountry: '',
      currencyType: '',
      shippingPlan: '',
      orderCategory: '',
      shippingAddress: '',
    },
  });

  //SUBMIT FORM
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setIsOpen({ isOpen: false });
    toast.info('Processing . . .');
    //await new Promise((resolve) => setTimeout(resolve, 3000));

    const pidOrder = values.pidOrder;
    const pidUser = values.pidUser;
    const emailUser = values.emailUser;
    const orderName = values.orderName;
    const destinationCountry = values.destinationCountry;
    const currencyType = values.currencyType;
    const shippingPlan = values.shippingPlan;
    const orderCategory = values.orderCategory;
    const shippingAddress = values.shippingAddress;

    //MAKE REQUEST ATTEMPT
    try {
      //MAKE REQUEST
      const res = await fetch('/api/crud/procurement-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pidOrder,
          pidUser,
          emailUser,
          orderName,
          destinationCountry,
          currencyType,
          shippingPlan,
          orderCategory,
          shippingAddress,
        }),
      });

      const data: ApiResponse = await res.json();

      if (data.responsex.status == 'SUCCESS') {
        navigateWithAlert(
          '/dashboard/procurement/view-orders/saved',
          'success',
          'Your request has been submitted!',
        );
      }

      // if (data.responsex.status == 'SUCCESS') {
      //   openModal();
      //   toast.success(data.responsex.message);
      // }

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full space-y-8">
              <FormField
                control={form.control}
                name="orderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Name </FormLabel>
                    <FormControl className="col-span-6">
                      <div className="item-center relative z-50 flex">
                        <Image
                          src="/icons/name.svg"
                          alt="search"
                          width={20}
                          height={20}
                          className="absolute m-2 lg:m-5"
                        />
                        <Input
                          className="bg-slate-100 pl-12 lg:h-[60px] lg:w-[478px]"
                          placeholder="Give your order a Name"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="col-span-8 flex justify-start" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currencyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>currency</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className="col-span-6">
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-between bg-slate-100 dark:bg-gray-800 lg:h-[60px] lg:w-[478px]',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <div className="flex gap-2">
                              <Image
                                src="/icons/currency.svg"
                                alt="search"
                                width={20}
                                height={20}
                                className=""
                              />
                              {field.value
                                ? currency.find(
                                    (currency) =>
                                      currency.value === field.value,
                                  )?.label
                                : 'Shop currency'}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search Type" />
                          <CommandEmpty>No currency</CommandEmpty>
                          <CommandGroup>
                            {currency.map((currency) => (
                              <CommandList key={currency.value}>
                                <CommandItem
                                  value={currency.label}
                                  onSelect={() => {
                                    form.setValue(
                                      'currencyType',
                                      currency.value,
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      currency.value === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {currency.label}
                                </CommandItem>
                              </CommandList>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="col-span-8 flex justify-start" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="orderCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Category</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className="col-span-6">
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-between bg-slate-100 dark:bg-gray-800 lg:h-[60px] lg:w-[478px]',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <div className="flex gap-2">
                              {field.value
                                ? OrderCategory.find(
                                    (OrderCategory) =>
                                      OrderCategory.value ===
                                      OrderCategory.value,
                                  )?.label
                                : 'Select a Product Category'}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[250px] p-0">
                        <Command>
                          <CommandInput placeholder="Search Type" />
                          <CommandEmpty>No currency</CommandEmpty>
                          <CommandGroup>
                            {OrderCategory.map((OrderCategory) => (
                              <CommandList key={OrderCategory.value}>
                                <CommandItem
                                  value={OrderCategory.label}
                                  onSelect={() => {
                                    form.setValue(
                                      'orderCategory',
                                      OrderCategory.value,
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      OrderCategory.value === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {OrderCategory.label}
                                </CommandItem>
                              </CommandList>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="col-span-8 flex justify-start" />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-8 max-lg:mt-8">
              <FormField
                control={form.control}
                name="destinationCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>country</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className="col-span-6">
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-between bg-slate-100 dark:bg-gray-800 lg:h-[60px] lg:w-[478px]',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <div className="flex gap-2">
                              <Image
                                src="/icons/country.svg"
                                alt="search"
                                width={20}
                                height={20}
                                className=""
                              />
                              {field.value
                                ? country.find(
                                    (country) => country.value === field.value,
                                  )?.label
                                : 'Destination country'}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search Type" />
                          <CommandEmpty>No subjects</CommandEmpty>
                          <CommandGroup>
                            {country.map((country) => (
                              <CommandList key={country.value}>
                                <CommandItem
                                  value={country.label}
                                  onSelect={() => {
                                    form.setValue(
                                      'destinationCountry',
                                      country.value,
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      country.value === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {country.label}
                                </CommandItem>
                              </CommandList>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="col-span-8 flex justify-start" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingPlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Plan</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className="col-span-6">
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-between bg-slate-100 dark:bg-gray-800 lg:h-[60px] lg:w-[478px]',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value
                              ? plan.find((plan) => plan.value === field.value)
                                  ?.label
                              : 'Select'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search Type" />
                          <CommandEmpty>No subjects</CommandEmpty>
                          <CommandGroup>
                            {plan.map((plan) => (
                              <CommandList key={plan.value}>
                                <CommandItem
                                  value={plan.label}
                                  onSelect={() => {
                                    form.setValue('shippingPlan', plan.value);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      plan.value === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {plan.label}
                                </CommandItem>
                              </CommandList>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="col-span-8 flex justify-start" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="shippingAddress"
            render={({ field }) => (
              <FormItem className="max-lg:mt-5">
                <FormLabel>Shipping Address</FormLabel>
                <FormControl>
                  <Input
                    className="flex h-10 w-full flex-col items-start bg-slate-100 lg:h-[120px] lg:w-[977px]"
                    placeholder="Enter shipping address here"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-span-8 flex justify-start" />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-[16px] hidden text-xs text-slate-600 dark:text-slate-400 lg:block lg:w-[972px] lg:text-sm">
          Please, provide your exact delivery address including phone number(s)
          for orders going to Canada, US, Mexico, UK, as they are delivered by
          DHL. Orders going to Ghana, Zimbabwe, Cameroon, etc., are delivered by
          our Chinese shipping partners straight to your delivery address.
          Orders to Nigeria are delivered to our Lagos office. You can pick up
          or we forward to your location at an extra cost.
        </div>
        <Button type="submit" className="my-[25px] h-[49px] w-[162px]">
          Create Order
        </Button>
      </form>
    </Form>
  );
};

export default CreateOrderForm;
