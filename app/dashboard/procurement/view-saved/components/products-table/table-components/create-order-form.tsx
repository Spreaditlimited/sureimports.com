'use client';

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

const formSchema = z.object({
  orderName: z
    .string()
    .min(2, {
      message: 'Order Name is required',
    })
    .max(500),
  currency: z.string().min(10, { message: 'Please select a currency' }),
  country: z.string().min(10, { message: 'Please select a country' }),
  plan: z.string().min(10, { message: 'Please select a plan' }),
  address: z.string().min(10, { message: 'Please enter an address' }),
});

const country = [
  { label: 'United States', value: 'United States' },
  { label: 'Canada', value: 'Canada' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'Australia', value: 'Australia' },
  { label: 'Germany', value: 'Germany' },
] as const;

const currency = [
  { label: 'USD - US Dollar', value: 'USD' },
  { label: 'CAD - Canadian Dollar', value: 'CAD' },
  { label: 'GBP - British Pound', value: 'GBP' },
  { label: 'AUD - Australian Dollar', value: 'AUD' },
  { label: 'EUR - Euro', value: 'EUR' },
] as const;

const plan = [
  { label: 'Monthly Plan', value: 'Monthly Plan' },
  { label: 'Quarterly Plan', value: 'Quarterly Plan' },
  { label: 'Semi-Annual Plan', value: 'Semi-Annual Plan' },
  { label: 'Annual Plan', value: 'Annual Plan' },
  { label: 'Pay-As-You-Go', value: 'Pay-As-You-Go' },
] as const;

interface ReportFormProps {}

const CreateOrderForm: React.FC<ReportFormProps> = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderName: '',
      currency: '',
      country: '',
      plan: '',
      address: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-col lg:flex-row">
            <div className="w-10/12 space-y-8">
              <FormField
                control={form.control}
                name="orderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Name</FormLabel>
                    <FormControl className="col-span-6">
                      <div className="item-center flex">
                        <Image
                          src="/icons/name.svg"
                          alt="search"
                          width={20}
                          height={20}
                          className="absolute m-2 lg:m-5"
                        />
                        <Input
                          className="w-[340px] bg-slate-100 pl-12 lg:h-[60px] lg:w-[478px]"
                          placeholder="Enter Supplier name"
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
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>currency</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className="col-span-6">
                          <Button
                            variant="outline"
                            className={cn(
                              'w-[340px] justify-between bg-slate-100 dark:bg-slate-800 lg:h-[60px] lg:w-[478px]',
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
                                : 'Select currency'}
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
                                    form.setValue('currency', currency.value);
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
            </div>
            <div className="w-10/12 space-y-8">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>country</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className="col-span-6">
                          <Button
                            variant="outline"
                            className={cn(
                              'w-[340px] justify-between bg-slate-100 dark:bg-slate-800 lg:h-[60px] lg:w-[478px]',
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
                                : 'Select country'}
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
                                    form.setValue('country', country.value);
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
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Plan</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className="col-span-6">
                          <Button
                            variant="outline"
                            className={cn(
                              'w-[340px] justify-between bg-slate-100 dark:bg-slate-800 lg:h-[60px] lg:w-[478px]',
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
                                    form.setValue('plan', plan.value);
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
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping Address</FormLabel>
                <FormControl>
                  <Input
                    className="flex h-10 w-[340px] flex-col items-start bg-slate-100 lg:h-[120px] lg:w-[977px]"
                    placeholder="Enter shipping address here"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-span-8 flex justify-start" />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-[16px] hidden text-xs text-slate-600 lg:block lg:w-[972px] lg:text-sm">
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
