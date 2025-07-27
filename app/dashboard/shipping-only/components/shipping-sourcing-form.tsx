'use client';

import React, { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Check, ChevronDown } from 'lucide-react';
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
import { Input } from '@/components/ui/input-with-dark-mode';
import { CommandList } from 'cmdk';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';

const formSchema = z.object({
  pidUser: z.string(),
  pidShippingOnly: z.string(),
  email: z.string(),
  shippingName: z.string().min(1, {
    message: 'Name is required',
  }),
  shippingTo: z.string().min(1, 'select the country you are shipping from'),
  grossWeight: z.string().min(1, 'select the gross weight of the product'),
  trackingNumber: z.string().optional(),
  shippingPlan: z.enum([
    'Normal Air Cargo',
    'Express Air Cargo',
    'Special Air Cargo',
    'Sea Shipping',
  ]),
  expectedShipments: z.string(),
  wantProductVerification: z.boolean().default(false),
  wantConsolidation: z.boolean().default(false),
  multipleSuppliers: z.boolean().default(false),
  whatsappNumber: z
    .string()
    .min(10, { message: 'WhatsApp Number must not be empty' })
    .regex(/^\d+$/, { message: 'WhatsApp Number must be a number' }),
  description: z.string().min(10, 'description is required'),
});

const plan = [
  { label: 'Normal Air Cargo', value: 'Normal Air Cargo' },
  { label: 'Express Air Cargo', value: 'Express Air Cargo' },
  { label: 'Special Air Cargo', value: 'Special Air Cargo' },
  { label: 'Sea Shipping', value: 'Sea Shipping' },
] as const;

const shippingfrom = [
  { label: 'Afghanistan', value: 'Afghanistan' },
  { label: 'Albania', value: 'Albania' },
  { label: 'Algeria', value: 'Algeria' },
  { label: 'Andorra', value: 'Andorra' },
  { label: 'Angola', value: 'Angola' },
  { label: 'Antigua and Barbuda', value: 'Antigua and Barbuda' },
  { label: 'Argentina', value: 'Argentina' },
  { label: 'Armenia', value: 'Armenia' },
  { label: 'Australia', value: 'Australia' },
  { label: 'Austria', value: 'Austria' },
  { label: 'Azerbaijan', value: 'Azerbaijan' },
  { label: 'Bahamas', value: 'Bahamas' },
  { label: 'Bahrain', value: 'Bahrain' },
  { label: 'Bangladesh', value: 'Bangladesh' },
  { label: 'Barbados', value: 'Barbados' },
  { label: 'Belarus', value: 'Belarus' },
  { label: 'Belgium', value: 'Belgium' },
  { label: 'Belize', value: 'Belize' },
  { label: 'Benin', value: 'Benin' },
  { label: 'Bhutan', value: 'Bhutan' },
  { label: 'Bolivia', value: 'Bolivia' },
  { label: 'Bosnia and Herzegovina', value: 'Bosnia and Herzegovina' },
  { label: 'Botswana', value: 'Botswana' },
  { label: 'Brazil', value: 'Brazil' },
  { label: 'Brunei', value: 'Brunei' },
  { label: 'Bulgaria', value: 'Bulgaria' },
  { label: 'Burkina Faso', value: 'Burkina Faso' },
  { label: 'Burundi', value: 'Burundi' },
  { label: "Côte d'Ivoire", value: "Côte d'Ivoire" },
  { label: 'Cabo Verde', value: 'Cabo Verde' },
  { label: 'Cambodia', value: 'Cambodia' },
  { label: 'Cameroon', value: 'Cameroon' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Central African Republic', value: 'Central African Republic' },
  { label: 'Chad', value: 'Chad' },
  { label: 'Chile', value: 'Chile' },
  { label: 'China', value: 'China' },
  { label: 'Colombia', value: 'Colombia' },
  { label: 'Comoros', value: 'Comoros' },
  { label: 'Congo', value: 'Congo' },
  { label: 'Costa Rica', value: 'Costa Rica' },
  { label: 'Croatia', value: 'Croatia' },
  { label: 'Cuba', value: 'Cuba' },
  { label: 'Cyprus', value: 'Cyprus' },
  { label: 'Czech Republic', value: 'Czech Republic' },
  {
    label: 'Democratic Republic of the Congo',
    value: 'Democratic Republic of the Congo',
  },
  { label: 'Denmark', value: 'Denmark' },
  { label: 'Djibouti', value: 'Djibouti' },
  { label: 'Dominica', value: 'Dominica' },
  { label: 'Dominican Republic', value: 'Dominican Republic' },
  { label: 'Ecuador', value: 'Ecuador' },
  { label: 'Egypt', value: 'Egypt' },
  { label: 'El Salvador', value: 'El Salvador' },
  { label: 'Equatorial Guinea', value: 'Equatorial Guinea' },
  { label: 'Eritrea', value: 'Eritrea' },
  { label: 'Estonia', value: 'Estonia' },
  { label: 'Eswatini', value: 'Eswatini' },
  { label: 'Ethiopia', value: 'Ethiopia' },
  { label: 'Fiji', value: 'Fiji' },
  { label: 'Finland', value: 'Finland' },
  { label: 'France', value: 'France' },
  { label: 'Gabon', value: 'Gabon' },
  { label: 'Gambia', value: 'Gambia' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Germany', value: 'Germany' },
  { label: 'Ghana', value: 'Ghana' },
  { label: 'Greece', value: 'Greece' },
  { label: 'Grenada', value: 'Grenada' },
  { label: 'Guatemala', value: 'Guatemala' },
  { label: 'Guinea', value: 'Guinea' },
  { label: 'Guinea-Bissau', value: 'Guinea-Bissau' },
  { label: 'Guyana', value: 'Guyana' },
  { label: 'Haiti', value: 'Haiti' },
  { label: 'Holy See', value: 'Holy See' },
  { label: 'Honduras', value: 'Honduras' },
  { label: 'Hungary', value: 'Hungary' },
  { label: 'Iceland', value: 'Iceland' },
  { label: 'India', value: 'India' },
  { label: 'Indonesia', value: 'Indonesia' },
  { label: 'Iran', value: 'Iran' },
  { label: 'Iraq', value: 'Iraq' },
  { label: 'Ireland', value: 'Ireland' },
  { label: 'Israel', value: 'Israel' },
  { label: 'Italy', value: 'Italy' },
  { label: 'Jamaica', value: 'Jamaica' },
  { label: 'Japan', value: 'Japan' },
  { label: 'Jordan', value: 'Jordan' },
  { label: 'Kazakhstan', value: 'Kazakhstan' },
  { label: 'Kenya', value: 'Kenya' },
  { label: 'Kiribati', value: 'Kiribati' },
  { label: 'Kuwait', value: 'Kuwait' },
  { label: 'Kyrgyzstan', value: 'Kyrgyzstan' },
  { label: 'Laos', value: 'Laos' },
  { label: 'Latvia', value: 'Latvia' },
  { label: 'Lebanon', value: 'Lebanon' },
  { label: 'Lesotho', value: 'Lesotho' },
  { label: 'Liberia', value: 'Liberia' },
  { label: 'Libya', value: 'Libya' },
  { label: 'Liechtenstein', value: 'Liechtenstein' },
  { label: 'Lithuania', value: 'Lithuania' },
  { label: 'Luxembourg', value: 'Luxembourg' },
  { label: 'Madagascar', value: 'Madagascar' },
  { label: 'Malawi', value: 'Malawi' },
  { label: 'Malaysia', value: 'Malaysia' },
  { label: 'Maldives', value: 'Maldives' },
  { label: 'Mali', value: 'Mali' },
  { label: 'Malta', value: 'Malta' },
  { label: 'Marshall Islands', value: 'Marshall Islands' },
  { label: 'Mauritania', value: 'Mauritania' },
  { label: 'Mauritius', value: 'Mauritius' },
  { label: 'Mexico', value: 'Mexico' },
  { label: 'Micronesia', value: 'Micronesia' },
  { label: 'Moldova', value: 'Moldova' },
  { label: 'Monaco', value: 'Monaco' },
  { label: 'Mongolia', value: 'Mongolia' },
  { label: 'Montenegro', value: 'Montenegro' },
  { label: 'Morocco', value: 'Morocco' },
  { label: 'Mozambique', value: 'Mozambique' },
  { label: 'Myanmar', value: 'Myanmar' },
  { label: 'Namibia', value: 'Namibia' },
  { label: 'Nauru', value: 'Nauru' },
  { label: 'Nepal', value: 'Nepal' },
  { label: 'Netherlands', value: 'Netherlands' },
  { label: 'New Zealand', value: 'New Zealand' },
  { label: 'Nicaragua', value: 'Nicaragua' },
  { label: 'Niger', value: 'Niger' },
  { label: 'Nigeria', value: 'Nigeria' },
  { label: 'North Korea', value: 'North Korea' },
  { label: 'North Macedonia', value: 'North Macedonia' },
  { label: 'Norway', value: 'Norway' },
  { label: 'Oman', value: 'Oman' },
  { label: 'Pakistan', value: 'Pakistan' },
  { label: 'Palau', value: 'Palau' },
  { label: 'Palestine State', value: 'Palestine State' },
  { label: 'Panama', value: 'Panama' },
  { label: 'Papua New Guinea', value: 'Papua New Guinea' },
  { label: 'Paraguay', value: 'Paraguay' },
  { label: 'Peru', value: 'Peru' },
  { label: 'Philippines', value: 'Philippines' },
  { label: 'Poland', value: 'Poland' },
  { label: 'Portugal', value: 'Portugal' },
  { label: 'Qatar', value: 'Qatar' },
  { label: 'Romania', value: 'Romania' },
  { label: 'Russia', value: 'Russia' },
  { label: 'Rwanda', value: 'Rwanda' },
  { label: 'Saint Kitts and Nevis', value: 'Saint Kitts and Nevis' },
  { label: 'Saint Lucia', value: 'Saint Lucia' },
  {
    label: 'Saint Vincent and the Grenadines',
    value: 'Saint Vincent and the Grenadines',
  },
  { label: 'Samoa', value: 'Samoa' },
  { label: 'San Marino', value: 'San Marino' },
  { label: 'Sao Tome and Principe', value: 'Sao Tome and Principe' },
  { label: 'Saudi Arabia', value: 'Saudi Arabia' },
  { label: 'Senegal', value: 'Senegal' },
  { label: 'Serbia', value: 'Serbia' },
  { label: 'Seychelles', value: 'Seychelles' },
  { label: 'Sierra Leone', value: 'Sierra Leone' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'Slovakia', value: 'Slovakia' },
  { label: 'Slovenia', value: 'Slovenia' },
  { label: 'Solomon Islands', value: 'Solomon Islands' },
  { label: 'Somalia', value: 'Somalia' },
  { label: 'South Africa', value: 'South Africa' },
  { label: 'South Korea', value: 'South Korea' },
  { label: 'South Sudan', value: 'South Sudan' },
  { label: 'Spain', value: 'Spain' },
  { label: 'Sri Lanka', value: 'Sri Lanka' },
  { label: 'Sudan', value: 'Sudan' },
  { label: 'Suriname', value: 'Suriname' },
  { label: 'Sweden', value: 'Sweden' },
  { label: 'Switzerland', value: 'Switzerland' },
  { label: 'Syria', value: 'Syria' },
  { label: 'Tajikistan', value: 'Tajikistan' },
  { label: 'Tanzania', value: 'Tanzania' },
  { label: 'Thailand', value: 'Thailand' },
  { label: 'Timor-Leste', value: 'Timor-Leste' },
  { label: 'Togo', value: 'Togo' },
  { label: 'Tonga', value: 'Tonga' },
  { label: 'Trinidad and Tobago', value: 'Trinidad and Tobago' },
  { label: 'Tunisia', value: 'Tunisia' },
  { label: 'Turkey', value: 'Turkey' },
  { label: 'Turkmenistan', value: 'Turkmenistan' },
  { label: 'Tuvalu', value: 'Tuvalu' },
  { label: 'Uganda', value: 'Uganda' },
  { label: 'Ukraine', value: 'Ukraine' },
  { label: 'United Arab Emirates', value: 'United Arab Emirates' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'United States of America', value: 'United States of America' },
  { label: 'Uruguay', value: 'Uruguay' },
  { label: 'Uzbekistan', value: 'Uzbekistan' },
  { label: 'Vanuatu', value: 'Vanuatu' },
  { label: 'Venezuela', value: 'Venezuela' },
  { label: 'Vietnam', value: 'Vietnam' },
  { label: 'Yemen', value: 'Yemen' },
  { label: 'Zambia', value: 'Zambia' },
  { label: 'Zimbabwe', value: 'Zimbabwe' },
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

// SHIPPING ONLY CLIENT FORM PROCESSING STARTS
function ShippingOnlyForm() {
  //initialize alert system
  let productID = 'SL' + new Date().getTime().toString();
  const navigateWithAlert = useNavigationWithAlert();
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const [pidShippingOnly, setPidShippingOnly] = useState(productID);
  const [email, setEmail] = useState(user?.userEmail);
  const [message, setMessage] = React.useState('');
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pidUser: pidUser,
      pidShippingOnly: pidShippingOnly,
      email: email,
      shippingName: '',
      whatsappNumber: '',
      shippingTo: '',
      grossWeight: '',
      trackingNumber: '',
      shippingPlan: '' as any,
      expectedShipments: '',
      wantProductVerification: false,
      wantConsolidation: false,
      multipleSuppliers: false,
      description: '',
    },
  });

  //SUBMIT FORM
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.info('Processing . . .');
    //await new Promise((resolve) => setTimeout(resolve, 3000));

    const pidUser = values.pidUser;
    const email = values.email;
    const pidShippingOnly = values.pidShippingOnly;
    const whatsappNumber = values.whatsappNumber;
    const shippingName = values.shippingName;
    const shippingTo = values.shippingTo;
    const grossWeight = values.grossWeight;
    const trackingNumber = values.trackingNumber;
    const shippingPlan = values.shippingPlan;
    const expectedShipments = values.expectedShipments;
    const wantProductVerification = values.wantProductVerification;
    const wantConsolidation = values.wantConsolidation;
    const multipleSuppliers = values.multipleSuppliers;
    const description = values.description;

    //MAKE REQUEST ATTEMPT
    try {
      //MAKE REQUEST
      const res = await fetch('/api/crud/shipping-only-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pidUser,
          email,
          pidShippingOnly,
          whatsappNumber,
          shippingName,
          grossWeight,
          trackingNumber,
          shippingPlan,
          shippingTo,
          expectedShipments,
          wantProductVerification,
          wantConsolidation,
          multipleSuppliers,
          description,
        }),
      });

      const data: ApiResponse = await res.json();

      if (data.responsex.status == 'SUCCESS') {
        navigateWithAlert(
          '/dashboard/shipping-only/request-received',
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

  //------------------------ UI/UX DISPLAY STARTS ------------------------//
  return (
    <div className="flex max-h-full w-96 flex-col gap-[20px] rounded-xl bg-white p-[25px] dark:bg-[#161629] max-xl:w-full xl:w-full">
      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Submit Shipment Details
      </div>

      <div className="text-base text-slate-400">
        Complete this short form and one of our customer representatives will
        reach out to you within 1 business day.
      </div>

      <div className="">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="whatsappNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="item-center relative flex">
                      <Image
                        src="/icons/name.svg"
                        alt="search"
                        width={20}
                        height={20}
                        className="absolute m-2 xl:m-5"
                      />
                      <Input
                        placeholder="Enter Your WhatsApp Number"
                        className="w-full rounded-[10px] bg-slate-100 pl-12 text-sm xl:h-[60px]"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingName"
              render={({ field }) => (
                <FormItem>
                  <div className="item-center relative flex">
                    <Image
                      src="/icons/specialsourcing/email.svg"
                      alt="search"
                      width={20}
                      height={20}
                      className="absolute m-2 xl:m-5"
                    />

                    <FormControl>
                      <Input
                        placeholder="Name on Shipment"
                        className="w-full rounded-[10px] bg-slate-100 pl-12 text-sm xl:h-[60px]"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingTo"
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-between rounded-[10px] bg-slate-100 dark:bg-slate-800 dark:text-gray-400 max-xl:pl-2 xl:h-[60px] xl:pl-5',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          <div className="flex gap-2 overflow-hidden max-xl:gap-5">
                            <Image
                              src="/icons/country.svg"
                              alt="search"
                              width={20}
                              height={20}
                              className=""
                            />
                            {field.value
                              ? shippingfrom.find(
                                  (shippingfrom) =>
                                    shippingfrom.value === field.value,
                                )?.label
                              : 'Destination country'}
                          </div>
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search Type" />
                        <CommandEmpty>No subjects</CommandEmpty>
                        <CommandGroup>
                          {shippingfrom.map((shippingfrom) => (
                            <CommandList key={shippingfrom.value}>
                              <CommandItem
                                value={shippingfrom.label}
                                key={shippingfrom.value}
                                onSelect={() => {
                                  form.setValue(
                                    'shippingTo',
                                    shippingfrom.value,
                                  );
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    shippingfrom.value === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                {shippingfrom.label}
                              </CommandItem>
                            </CommandList>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grossWeight"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="item-center relative flex">
                      <Image
                        src="/icons/specialsourcing/weight.svg"
                        alt="search"
                        width={20}
                        height={20}
                        className="absolute m-2 xl:m-5"
                      />
                      <Input
                        placeholder="Estimated weight of shipment"
                        className="w-full rounded-[10px] bg-slate-100 pl-12 text-sm xl:h-[60px]"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trackingNumber"
              render={({ field }) => (
                <FormItem>
                  <div className="item-center relative flex">
                    <Image
                      src="/icons/specialsourcing/email.svg"
                      alt="search"
                      width={20}
                      height={20}
                      className="absolute m-2 xl:m-5"
                    />

                    <FormControl>
                      <Input
                        placeholder="Enter Tracking No (Optional)"
                        className="w-full rounded-[10px] bg-slate-100 pl-12 text-sm xl:h-[60px]"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingPlan"
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl className="col-span-6">
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-between rounded-[10px] bg-slate-100 dark:bg-slate-800 dark:text-gray-400 xl:h-[60px]',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value
                            ? plan.find((plan) => plan.value === field.value)
                                ?.label
                            : 'Shipping Plan'}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
            <FormField
              control={form.control}
              name="wantProductVerification"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Want product verification?</FormLabel>
                    {field.value && (
                      <p className="text-sm text-muted-foreground">
                        You will be charged 0RMB per kg.
                      </p>
                    )}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wantConsolidation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Want consolidation?</FormLabel>
                    {field.value && (
                      <p className="text-sm text-muted-foreground">
                        You will be charged 0RMB per kg.
                      </p>
                    )}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="multipleSuppliers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Are you sending products from multiple suppliers?
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {form.watch('multipleSuppliers') && (
              <FormField
                control={form.control}
                name="expectedShipments"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...(field as any)}
                        type="number"
                        placeholder="How many shipments are we expecting?"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us the exact products you are shipping. does it contain
              battery, liquid, powder? Give us as much information as possible."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col">
              <Button type="submit" className="h-[54px]">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ShippingOnlyForm;
