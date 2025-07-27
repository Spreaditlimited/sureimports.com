'use client';

import React, { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input-with-dark-mode';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  productImage: z.instanceof(File).refine((file) => file.size < 7000000, {
    message: 'picture must be less than 7MB.',
  }),
  productName: z
    .string()
    .min(2, {
      message: 'Description is required',
    })
    .max(500),
  whatsappNumber: z
    .string()
    .min(10, { message: 'WhatsApp Number must not be empty' })
    .regex(/^\d+$/, { message: 'WhatsApp Number must be a number' }),
  productQualityRatings: z
    .string()
    .min(10, 'Product Quantity must not be empty'),
  targetProductQuantity: z
    .string()
    .min(10, 'Product Quantity must not be empty'),
  targetUnitPrice: z.string().min(10, 'Target unit price must not be empty'),
  description: z.string().min(10, 'Description must not be empty'),
});

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

function SpecialSourcingForm() {
  const { user, logout } = useAuth(); //DATA FROM SESSION
  //const [userData, setUserData] = useState<userData>(); //DATA FROM API CALL
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const [email, setEmail] = useState(user?.email);
  const [isLoading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productImage: undefined,
      productName: '',
      whatsappNumber: '',
      targetProductQuantity: '',
      productQualityRatings: '',
      targetUnitPrice: '',
    },
  });

  //FORM SUBMISSION
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setLoading(true);
    //await new Promise((resolve) => setTimeout(resolve, 3000));

    const formData = new FormData() as any;
    formData.append('pidUser', pidUser);
    formData.append('email', email);
    formData.append('productImage', values.productImage);
    formData.append('productName', values.productName);
    formData.append('whatsappNumber', values.whatsappNumber);
    formData.append('productQualityRatings', values.productQualityRatings);
    formData.append('whatsappNumber', values.whatsappNumber);
    formData.append('targetUnitPrice', values.targetUnitPrice);

    //MAKE REQUEST ATTEMPT
    try {
      toast.info('Creating Special Sourcing Product. . .');
      //MAKE REQUEST
      const res = await fetch('/api/shipping-only/create', {
        method: 'POST',
        body: formData,
      });

      // GET & PROCESS RESPONSE FROM API
      const data: ApiResponse = await res.json();

      //alert(data.responsex.status);
      //if (!file) {toast.error('No Product Image selected'); setIsLoading(false); return;}else{}

      if (data.responsex.status == 'NO_IMAGE') {
        toast.info(data.responsex.message);
        // setMessage(data.responsex.message);
        // setLoading(false);
        //await new Promise((resolve) => setTimeout(resolve, 5000));
        //router.push('/auth/login');
      }

      if (data.responsex.status == 'ACTION_SUCCESSFUL') {
        toast.success(data.responsex.message);
        //router.push('/auth/login');
        // setMessage(data.responsex.message);
        // setLoading(false);
      }

      if (data.responsex.status == 'ACTION_FAILED') {
        toast.error(data.responsex.message);
        //router.push('/auth/login');
        setMessage(data.responsex.message);
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const [isOpen, setIsOpen] = useState<{ isOpen: boolean }>({ isOpen: false });
  const [isAgreed, setIsAgreed] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen({ isOpen: open });
  };
  const handleDelete = () => {
    if (isAgreed) {
      setIsOpen({ isOpen: false });
    }
  };

  return (
    <div className="flex max-h-full flex-col gap-[20px] rounded-xl bg-white p-[25px] dark:bg-[#161629] xl:w-full">
      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Source Product
      </div>
      <div className="text-base text-slate-600">
        Even if you want us to source more than one product, kindly provide the
        details of just one product.
      </div>
      <div className="">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="productImage"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex w-full items-center justify-center">
                      <label className="dark:hover:bg-bray-800 flex h-72 w-full cursor-pointer flex-col justify-center rounded-[10px] border border-dashed border-indigo-800 bg-indigo-800/10">
                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                          <Image
                            src="/icons/sourcingfileInput.svg"
                            alt="Upload"
                            width={60}
                            height={60}
                          />
                          <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                            Upload image
                          </p>
                          {value && <p>Current file</p>}
                          <p className="text-center text-base font-normal text-slate-600 xl:w-[323px]">
                            Click here or drag your product image here to upload
                          </p>
                        </div>
                        <Input
                          id="productImage"
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file);
                            }
                          }}
                          {...fieldProps}
                        />
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="item-center flex">
                      <Image
                        src="/icons/specialsourcing/productName.svg"
                        alt="search"
                        width={20}
                        height={20}
                        className="absolute m-2 xl:m-5"
                      />
                      <Input
                        placeholder="Enter Product Name"
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
              name="whatsappNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="item-center relative flex">
                      <Image
                        src="/icons/specialsourcing/phone.svg"
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
              name="productQualityRatings"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="item-center relative flex">
                      <Image
                        src="/icons/specialsourcing/selectQuantity.svg"
                        alt="search"
                        width={20}
                        height={20}
                        className="absolute m-2 xl:m-5"
                      />
                      <Input
                        placeholder="Enter target product quantity"
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
              name="targetUnitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="item-center relative flex">
                      <Image
                        src="/icons/currency.svg"
                        alt="search"
                        width={20}
                        height={20}
                        className="absolute m-2 xl:m-5"
                      />
                      <Input
                        placeholder="Enter target unit price in RMB"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="w-full rounded-[10px] bg-slate-100 text-sm"
                      placeholder="Describe what exactly you want. "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-8 flex justify-start" />
                </FormItem>
              )}
            />
            <div className="flex flex-col">
              <Dialog open={isOpen.isOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                  <Button variant="link" type="button">
                    view terms and conditions
                  </Button>
                </DialogTrigger>
                <DialogContent className="flex h-[60vh] flex-col overflow-hidden p-0 dark:bg-[#161629] max-md:h-[90vh] lg:max-w-[800px]">
                  <DialogHeader className="sticky top-0 bg-white px-6 py-4 dark:bg-[#161629]">
                    <DialogTitle>Read Our Terms</DialogTitle>
                  </DialogHeader>
                  <div className="dark flex flex-grow flex-col gap-5 overflow-y-auto px-6 py-4 text-sm">
                    <div>
                      In buying from China, MOQ (Minimum Order Quantity) is
                      extremely important.
                    </div>
                    <div>
                      Unit prices drop when quantity increases. Someone
                      importing a 40 ft container of an item will sell cheaper
                      than you if you wish to import a smaller quantity.
                    </div>
                    <div>
                      Also, you must consider if the product you wish to import
                      is already ubiquitous in your local market. If it is,
                      please, consider buying from your local market as we may
                      not be able to get you a better price.
                    </div>
                    <div className="font-medium">
                      We are here to serve you if:
                    </div>
                    <div className="flex flex-col gap-2">
                      <div>
                        1. you are not satisfied with the quality of the product
                        in your local market and want to get the best.
                      </div>
                      <div>
                        2. the products you wish to import are scarce or
                        unavailable in your local market.
                      </div>
                      <div>
                        3. you wish to import a large quantity of a product so
                        as to compete favorably in your local market.
                      </div>
                    </div>
                    <div>
                      The product sourcing commitment fee you{"'"}ll pay will
                      only be refunded when you go ahead to place an order based
                      on the best quote we give you.
                    </div>
                  </div>
                  <DialogFooter className="sticky bottom-0 flex justify-between bg-white px-6 py-4 dark:bg-[#161629]">
                    <div className="flex w-full justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="terms"
                          checked={isAgreed}
                          onCheckedChange={(checked) =>
                            setIsAgreed(checked === true)
                          }
                        />
                        <label htmlFor="terms">
                          I have read and agree with your terms
                        </label>
                      </div>
                      <Button type="submit" onClick={handleDelete}>
                        Save
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                type="submit"
                className="h-[54px] font-medium"
                disabled={!isAgreed}
              >
                Pay and Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default SpecialSourcingForm;
