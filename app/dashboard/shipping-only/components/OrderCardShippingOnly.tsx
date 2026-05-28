'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';
import { useModal } from '@/app/context/ModalContext';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { EnumLike, z } from 'zod';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  pidUser: z.string(),
  pidShippingOnly: z.string(),
  shippingName: z.string().min(10, {
    message: 'Name is required',
  }),
  shippingEmail: z.string().email({
    message: 'Email is required',
  }),
  whatsappNumber: z
    .string()
    .min(10, { message: 'WhatsApp Number must not be empty' })
    .regex(/^\d+$/, { message: 'WhatsApp Number must be a number' }),
  shippingTo: z.string().min(10, 'select the country you are shipping to'),
  grossWeight: z.string().min(10, 'select the gross weight of the product'),
  trackingNumber: z.string().optional(),
  shippingPlan: z.enum([
    'Normal Air Cargo',
    'Express Air Cargo',
    'Special Air Cargo',
    'Sea Shipping',
  ]),
  expectedShipments: z.string().optional(),
  wantProductVerification: z.boolean().default(false),
  wantConsolidation: z.boolean().default(false),
  multipleSuppliers: z.boolean().default(false),
  description: z.string().min(10, 'Description is required'),
});

const plan = [
  { label: 'Normal Air Cargo', value: 'Normal Air Cargo' },
  { label: 'Express Air Cargo', value: 'Express Air Cargo' },
  { label: 'Special Air Cargo', value: 'Special Air Cargo' },
  { label: 'Sea Shipping', value: 'Sea Shipping' },
] as const;

const shippingfrom = [
  { label: 'USA', value: 'USA' },
  { label: 'China', value: 'China' },
  { label: 'UAE', value: 'UAE' },
  { label: 'Nigeria', value: 'Nigeria' },
  { label: 'Italy', value: 'Italy' },
  { label: 'UK', value: 'UK' },
] as const;

// Define an interface for the props
interface ProductsProps {
  serialNumber: number;
  id: number;
  pidShippingOnly: string;
  pidUser: string;
  whatsappNumber: string;
  shippingName: string;
  shippingTo: string;
  grossWeight: string;
  trackingNumber: string;
  shippingPlan: string;
  expectedShipments: string;
  wantProductVerification: string;
  wantConsolidation: string;
  multipleSuppliers: string;
  description: string;
  status: string;
  createdAt: string;
}

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

// Use the interface to annotate the props of the component
//const OrderCard: React.FC<ProductsProps> = ({ products }) => {
const OrderCard: React.FC<ProductsProps> = ({
  serialNumber,
  id,
  pidShippingOnly,
  pidUser,
  whatsappNumber,
  shippingName,
  shippingTo,
  grossWeight,
  trackingNumber,
  shippingPlan,
  expectedShipments,
  wantProductVerification,
  wantConsolidation,
  multipleSuppliers,
  description,
  status,
  createdAt,
}) => {
  const url = `product-description/${pidShippingOnly}`;

  const [isOpen, setIsOpen] = useState<{ isOpen: boolean }>({ isOpen: false });
  const [isCurrencySelected, setIsCurrencySelected] = useState<true | false>(
    true,
  );
  const [amount, setAmount] = useState<number>(35000);
  const [currency, setCurrency] = useState<string>('default');
  //initialize alert system
  const navigateWithAlert = useNavigationWithAlert();
  const { user, logout } = useAuth(); //DATA FROM SESSION
  //const [userData, setUserData] = useState<userData>(); //DATA FROM API CALL
  const [pidUserx, setPidUser] = useState(user?.pidUser);
  const { isModalOpen, openModal, closeModal } = useModal();

  //let productID = 'SL' + new Date().getTime().toString();
  const [email, setEmail] = useState(user?.userEmail);
  const [message, setMessage] = React.useState('');
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pidUser: pidUser,
      pidShippingOnly: pidShippingOnly,
      whatsappNumber: '',
      shippingName: '',
      shippingTo: '',
      grossWeight: '',
      trackingNumber: '',
      shippingPlan: shippingPlan as any,
      expectedShipments,
      wantProductVerification: false,
      wantConsolidation: false,
      multipleSuppliers: false,
      description: '',
    },
  });

  const handleCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setCurrency(event.target.value);
    setIsCurrencySelected(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen({ isOpen: open });
  };

  const handleDelete = async () => {
    //console.log('deleted');

    try {
      setIsOpen({ isOpen: false });
      toast.info('Processing . . .');
      const res = await fetch(
        `/api/crud/shipping-only-delete/${pidUserx}/${pidShippingOnly}`,
      );

      //check if request was successful
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch user');
      }

      // GET & PROCESS RESPONSE FROM API
      const data: ApiResponse = await res.json();

      if (data.responsex.status == 'SUCCESS') {
        navigateWithAlert(
          '/dashboard/shipping-only/pending',
          'success',
          'Request has been deleted!',
        );
      }
      // if (data.responsex.status == 'SUCCESS') {
      //   toast.success(data.responsex.message);
      // }
      if (data.responsex.status == 'FAILED') {
        toast.warning(data.responsex.message);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      //setLoading(false);
    }
  };

  const onKeep = () => {
    console.log('kept');
    setIsOpen({ isOpen: false });
  };

  return (
    <>
      <div className="pl-4 pr-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <div className="flex flex-col items-start justify-between gap-3 rounded-xl bg-white px-5 py-5 transition-all duration-200 dark:bg-[#161629] sm:flex-row xl:h-[100px] xl:items-center">
              <div>
                <div className="flex flex-row gap-4">
                  <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg bg-slate-100 text-center text-4xl font-bold capitalize text-slate-300 dark:bg-slate-800 dark:text-white">
                    {serialNumber}
                  </div>
                  <div className="flex flex-col justify-center gap-1">
                    <div className="text-xl font-bold capitalize text-slate-800 dark:text-slate-200">
                      {shippingName}
                    </div>
                    <div className="text-base font-normal text-slate-950 dark:text-slate-100">
                      Order Id: <b>{pidShippingOnly}</b>
                      <span className="text-slate-600">
                        {' '}
                        ( Shipping To: <b>{shippingTo}</b>, Phone:
                        <b>{whatsappNumber}</b>)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 max-sm:w-full md:flex-row">
                <div className="flex gap-3">
                  <Dialog open={isOpen.isOpen} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                      <Button className="item-ceneter flex h-11 w-11 justify-center rounded-lg bg-red-100 p-0 font-normal hover:bg-red-200">
                        <Image
                          src="/icons/delete.svg"
                          alt="delete"
                          width={20}
                          height={20}
                          className="cursor-pointer"
                        />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="flex w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] flex-col items-center justify-center overflow-auto rounded-[20px] py-[30px] dark:bg-[#161629] sm:max-w-[396px]">
                      <Image
                        src="/icons/deletewarning.svg"
                        alt="delete"
                        width={100}
                        height={100}
                        className="cursor-pointer"
                      />
                      <div className="w-[280px] text-center text-2xl font-bold text-slate-800 dark:text-white">
                        Are you sure you want to delete?
                      </div>
                      <div className="flex w-80 text-center text-sm text-slate-600">
                        This will delete this record and you cannot recover it.
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={onKeep}
                          className="h-[49px] items-center justify-center gap-2.5 rounded-xl bg-slate-100 px-[30px] py-[15px] text-base text-slate-600 hover:bg-slate-200 lg:w-[162px]"
                        >
                          No! keep it
                        </Button>
                        <Button
                          onClick={handleDelete}
                          className="h-[49px] items-center justify-center gap-2.5 rounded-xl bg-red-100 px-[30px] py-[15px] text-base text-red-500 hover:bg-red-200 lg:w-[162px]"
                        >
                          {' '}
                          Yes! Remove
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <AccordionTrigger className="item-ceneter flex h-11 w-11 justify-center rounded-lg bg-slate-100 p-0 text-slate-600 hover:bg-black/10"></AccordionTrigger>
                </div>
              </div>
            </div>

            <AccordionContent className="hide-scrollbar rounded-2xl bg-white dark:bg-[#161629]">
              {/* <BankDepositForm /> */}

              {/*.................................. FORM BLOCK STARTS.................................... */}

              <div className="flex max-h-full w-96 flex-col gap-[20px] rounded-xl bg-white p-[25px] dark:bg-[#161629] max-xl:w-full xl:w-full">
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Shipment details submitted
                </div>
                <div className="text-base text-slate-600">
                  These are the details you sent to us. A member of our team is
                  already working with you.
                </div>
                <div className="">
                  <Form {...form}>
                    <form
                      //onSubmit={form.handleSubmit(onSubmit)}
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
                                  placeholder={whatsappNumber}
                                  className="w-full rounded-[10px] bg-slate-100 pl-12 text-sm xl:h-[60px]"
                                  {...field}
                                  disabled
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
                                  placeholder={shippingName}
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
                            <div className="item-center relative flex">
                              <Image
                                src="/icons/country.svg"
                                alt="search"
                                width={20}
                                height={20}
                                className="absolute m-2 xl:m-5"
                              />

                              <FormControl>
                                <Input
                                  placeholder={shippingTo}
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
                                  placeholder={grossWeight}
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
                                  placeholder={trackingNumber}
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
                            <div className="item-center relative flex">
                              <Image
                                src="/icons/shipping.svg"
                                alt="search"
                                width={20}
                                height={20}
                                className="absolute m-2 xl:m-5"
                              />

                              <FormControl>
                                <Input
                                  placeholder={shippingPlan}
                                  className="w-full rounded-[10px] bg-slate-100 pl-12 text-sm xl:h-[60px]"
                                  {...field}
                                  disabled
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="wantProductVerification"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            {/* <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                aria-checked
                              />
                            </FormControl> */}
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Want product verification?{' '}
                                {wantProductVerification ? (
                                  <div className="text-green-500"> - Yes</div>
                                ) : (
                                  <div className="text-red-500"> - No</div>
                                )}
                              </FormLabel>
                              {field.value && (
                                <p className="text-sm text-muted-foreground">
                                  You will be charged 5RMB per kg.
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
                            {/* <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl> */}
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Want consolidation?{' '}
                                {wantConsolidation ? (
                                  <div className="text-green-500"> - Yes</div>
                                ) : (
                                  <div className="text-red-500"> - No</div>
                                )}
                              </FormLabel>
                              {field.value && (
                                <p className="text-sm text-muted-foreground">
                                  You will be charged 5RMB per kg.
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
                            {/* <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl> */}
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Are you sending products from multiple
                                suppliers?{' '}
                                {multipleSuppliers ? (
                                  <div className="text-green-500">
                                    {' '}
                                    - Yes, Qty: {expectedShipments ?? 0}
                                  </div>
                                ) : (
                                  <div className="text-red-500"> - No</div>
                                )}
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      {/* {form.watch('multipleSuppliers') && (
              <FormField
                control={form.control}
                name="multipleSuppliers"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="How many shipments are we expecting?"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )} */}

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder={description}
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* <div className="flex flex-col">
              <Button type="submit" className="h-[54px]">
                Submit
              </Button>
            </div> */}
                    </form>
                  </Form>
                </div>
              </div>

              {/*.................................. FORM BLOCK ENDS .................................... */}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default OrderCard;
function setCurrency(value: string) {
  throw new Error('Function not implemented.');
}
