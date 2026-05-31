'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
import { 
  Check, 
  ChevronDown, 
  Phone, 
  User, 
  Globe2, 
  Scale, 
  Hash, 
  Truck, 
  FileText,
  Boxes,
  Send
} from 'lucide-react';
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
import { CommandList } from 'cmdk';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';
import { Input } from '@/components/ui/input-with-dark-mode';

type ShippingPlanOption = {
  pidShippingPlan: string;
  shippingPlanName: string;
  shippingPlanRate: number;
};

type CountryOption = {
  pidCountry: string;
  countryName: string;
  shippingPlans: ShippingPlanOption[];
};

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
  shippingPlan: z.string().min(1, 'select the shipping plan'),
  expectedShipments: z.string().optional(),
  wantProductVerification: z.boolean().default(false),
  wantConsolidation: z.boolean().default(false),
  multipleSuppliers: z.boolean().default(false),
  whatsappNumber: z
    .string()
    .min(10, { message: 'WhatsApp Number must not be empty' })
    .regex(/^\d+$/, { message: 'WhatsApp Number must be a number' }),
  description: z.string().min(10, 'description is required'),
});

interface ApiResponse {
  responsex: any;
  successx: boolean;
  userx: any;
}

function ShippingOnlyForm() {
  const productID = 'SL' + new Date().getTime().toString();
  const navigateWithAlert = useNavigationWithAlert();
  const { user } = useAuth();
  
  const [pidUser] = useState(user?.pidUser || '');
  const [pidShippingOnly] = useState(productID);
  const [email] = useState(user?.userEmail || '');
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isShippingPlanOpen, setIsShippingPlanOpen] = useState(false);

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
  const shippingTo = form.watch('shippingTo');
  const selectedCountry = useMemo(
    () => countries.find((country) => country.pidCountry === shippingTo),
    [countries, shippingTo],
  );
  const shippingPlans = selectedCountry?.shippingPlans ?? [];

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch('/api/get-data/countries-shipping-plan', {
          cache: 'no-store',
        });
        if (!res.ok) {
          throw new Error('Unable to fetch countries');
        }
        const data = (await res.json()) as CountryOption[];
        setCountries(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error('Unable to load destination countries and shipping plans.');
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (!user) return;

    const currentWhatsapp = form.getValues('whatsappNumber');
    const currentName = form.getValues('shippingName');

    const firstName = (user.userFirstname || '').trim();
    const lastName = (user.userLastname || '').trim();
    const fallbackName = (user.name || '').trim();

    const fullNameRaw = [firstName, lastName].filter(Boolean).join(' ').trim();
    const dedupedWords = Array.from(
      new Set(fullNameRaw.split(/\s+/).filter(Boolean)),
    );
    const profileName = dedupedWords.join(' ') || fallbackName;

    const rawPhone = user.userPhone ?? user.phone ?? '';
    const profilePhone = String(rawPhone).trim();

    form.setValue('pidUser', user.pidUser || '');
    form.setValue('email', user.userEmail || '');

    if (!currentWhatsapp && profilePhone) {
      form.setValue('whatsappNumber', profilePhone);
    }

    if (!currentName && profileName) {
      form.setValue('shippingName', profileName);
    }
  }, [form, user]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.info('Processing request...');

    try {
      const res = await fetch('/api/crud/shipping-only-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data: ApiResponse = await res.json();

      if (data.responsex?.status === 'SUCCESS') {
        navigateWithAlert(
          '/dashboard/shipping-only/request-received',
          'success',
          'Your request has been submitted!'
        );
      } else if (data.responsex?.status === 'EMPTY_FIELD' || data.responsex?.status === 'FAILED') {
        toast.warning(data.responsex.message);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } catch (error: any) {
      toast.error('Network error. Could not submit request.');
    }
  };

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm transition-all dark:border-slate-700 dark:bg-[#161629]">
      <div className="border-b border-slate-100 p-6 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Submit Shipment Details</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Complete this form to alert our warehouse about your incoming goods.
        </p>
      </div>

      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Group 1: Basic Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="whatsappNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="WhatsApp Number"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-6 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-[#0f1020] dark:text-white dark:placeholder:text-slate-600"
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
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Name on Shipment"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-6 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-[#0f1020] dark:text-white dark:placeholder:text-slate-600"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Group 2: Logistics */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="shippingTo"
                render={({ field }) => (
                  <FormItem>
                    <Popover open={isCountryOpen} onOpenChange={setIsCountryOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-between rounded-xl border border-slate-200 bg-slate-50 py-6 pl-4 pr-4 text-sm text-slate-900 hover:bg-slate-100 focus:ring-2 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-[#0f1020] dark:text-white dark:hover:bg-[#1d1f36]',
                              !field.value && 'text-slate-400 dark:text-slate-600'
                            )}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <Globe2 className="h-4 w-4 shrink-0 text-slate-400" />
                              <span className="truncate">
                                {field.value
                                  ? countries.find((country) => country.pidCountry === field.value)?.countryName
                                  : 'Destination Country'}
                              </span>
                            </div>
                            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[calc(100vw-2rem)] max-w-[300px] p-0 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 shadow-xl">
                        <Command className="bg-transparent">
                          <CommandInput placeholder="Search country..." className="border-none focus:ring-0 dark:text-white" />
                          <CommandEmpty className="py-3 text-center text-sm text-slate-500">No country found.</CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-y-auto custom-scrollbar">
                            {countries.map((country) => (
                              <CommandList key={country.pidCountry}>
                                <CommandItem
                                  value={country.countryName}
                                  onSelect={() => {
                                    form.setValue('shippingTo', country.pidCountry);
                                    form.setValue('shippingPlan', '');
                                    setIsCountryOpen(false);
                                  }}
                                  className="cursor-pointer dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      country.pidCountry === field.value ? 'opacity-100 text-blue-500' : 'opacity-0'
                                    )}
                                  />
                                  {country.countryName}
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
                name="shippingPlan"
                render={({ field }) => (
                  <FormItem>
                    <Popover
                      open={isShippingPlanOpen}
                      onOpenChange={setIsShippingPlanOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-between rounded-xl border border-slate-200 bg-slate-50 py-6 pl-4 pr-4 text-sm text-slate-900 hover:bg-slate-100 focus:ring-2 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-[#0f1020] dark:text-white dark:hover:bg-[#1d1f36]',
                              !field.value && 'text-slate-400 dark:text-slate-600'
                            )}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <Truck className="h-4 w-4 shrink-0 text-slate-400" />
                              <span className="truncate">
                                {field.value
                                  ? shippingPlans
                                      .find((plan) => plan.pidShippingPlan === field.value)
                                      ?.shippingPlanName.replace(/_/g, ' ')
                                  : 'Shipping Plan'}
                              </span>
                            </div>
                            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[calc(100vw-2rem)] max-w-[300px] p-0 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 shadow-xl">
                        <Command className="bg-transparent">
                          <CommandGroup>
                            {shippingPlans.map((plan) => (
                              <CommandList key={plan.pidShippingPlan}>
                                <CommandItem
                                  value={plan.shippingPlanName.replace(/_/g, ' ')}
                                  onSelect={() =>
                                    {
                                      form.setValue('shippingPlan', plan.pidShippingPlan);
                                      setIsShippingPlanOpen(false);
                                    }}
                                  className="cursor-pointer dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      plan.pidShippingPlan === field.value
                                        ? 'opacity-100 text-blue-500'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {plan.shippingPlanName.replace(/_/g, ' ')}
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
                      <div className="relative">
                        <Scale className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Est. Weight (kg) or CBM"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-6 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-[#0f1020] dark:text-white dark:placeholder:text-slate-600"
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
                    <FormControl>
                      <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Tracking No (Optional)"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-6 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-[#0f1020] dark:text-white dark:placeholder:text-slate-600"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Group 3: Options */}
            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-[#0f1020]">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Additional Services
              </h3>
              
              <FormField
                control={form.control}
                name="wantProductVerification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1 border-slate-300 data-[state=checked]:bg-blue-600 dark:border-slate-600 dark:data-[state=checked]:bg-blue-500"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium text-slate-900 dark:text-slate-200 cursor-pointer">
                        Want product verification?
                      </FormLabel>
                      {field.value && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          You will be charged 0 RMB per kg.
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
                        className="mt-1 border-slate-300 data-[state=checked]:bg-blue-600 dark:border-slate-600 dark:data-[state=checked]:bg-blue-500"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium text-slate-900 dark:text-slate-200 cursor-pointer">
                        Want consolidation?
                      </FormLabel>
                      {field.value && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          You will be charged 0 RMB per kg.
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
                        className="mt-1 border-slate-300 data-[state=checked]:bg-blue-600 dark:border-slate-600 dark:data-[state=checked]:bg-blue-500"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium text-slate-900 dark:text-slate-200 cursor-pointer">
                        Are you sending products from multiple suppliers?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch('multipleSuppliers') && (
                <div className="pt-2 pl-7">
                  <FormField
                    control={form.control}
                    name="expectedShipments"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Boxes className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              {...field}
                              type="number"
                              placeholder="How many shipments are we expecting?"
                              className="w-full rounded-xl border border-slate-200 bg-white py-5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-600 dark:bg-[#161629] dark:text-white dark:placeholder:text-slate-500"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Group 4: Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                      <Textarea
                        placeholder="Tell us the exact products you are shipping. Does it contain battery, liquid, powder? Give us as much information as possible."
                        className="min-h-[120px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 py-4 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-[#0f1020] dark:text-white dark:placeholder:text-slate-600"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <Button 
                type="submit" 
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-6 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 active:scale-[0.98] dark:shadow-blue-900/40 sm:w-auto sm:px-10"
              >
                <Send className="h-4 w-4" /> Submit Shipment
              </Button>
            </div>
            
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ShippingOnlyForm;
