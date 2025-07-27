'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input-with-dark-mode';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { ChangeEvent, useState, useEffect } from 'react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  formaInvoice: z.instanceof(File).refine((file) => file.size < 7000000, {
    message: 'upload size must be less than 7MB.',
  }),
  aliPayQR: z.optional(
    z.instanceof(File).refine((file) => file.size < 7000000, {
      message: 'upload size must be less than 7MB.',
    }),
  ),
  weChatQR: z.optional(
    z.instanceof(File).refine((file) => file.size < 7000000, {
      message: 'upload size must be less than 7MB.',
    }),
  ),
  email: z.string().email({
    message: 'Email is required',
  }),
  fullName: z
    .string()
    .min(2, {
      message: 'Name is required',
    })
    .max(500),
  contactNo: z
    .string()
    .min(10, { message: 'Please enter a valid phone number' }),
  bankAccount: z.optional(
    z.string().min(2, { message: 'Please enter a valid bank Account' }),
  ),
  bankDetails: z.optional(
    z.string().min(2, { message: 'Please enter a valid bank details' }),
  ),
  amount: z.number().min(2, { message: 'Please enter a valid amount' }),
});

interface ReportFormProps {}

const BankDepositForm: React.FC<ReportFormProps> = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formaInvoice: undefined,
      aliPayQR: undefined,
      weChatQR: undefined,
      email: '',
      fullName: '',
      contactNo: '',
      bankAccount: '',
      bankDetails: '',
    },
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileTwo, setFileTwo] = useState<File | null>(null);
  const [fileThree, setFileThree] = useState<File | null>(null);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    console.log(file, fileTwo, fileThree);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      form.setValue('formaInvoice', selectedFile);
    }
  };

  const handleFileChangeWechat = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFileTwo(selectedFile);
      form.setValue('weChatQR', selectedFile);
    }
  };

  const handleFileChangeAlipay = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFileThree(selectedFile);
      form.setValue('aliPayQR', selectedFile);
    }
  };

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      return () => URL.revokeObjectURL(objectUrl);
    }
    if (fileTwo) {
      const objectUrl = URL.createObjectURL(fileTwo);
      return () => URL.revokeObjectURL(objectUrl);
    }
    if (fileThree) {
      const objectUrl = URL.createObjectURL(fileThree);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file, fileTwo, fileThree]);

  const router = useRouter();

  return (
    <div className="pt-[25px]">
      <div className="ml-[25px] gap-3 max-sm:ml-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="max-sm:item-center flex w-full flex-col justify-center gap-3 pb-[25px]">
              <div className="flex w-full flex-col gap-3 pr-[25px] max-md:space-y-[30px] sm:pr-[25px] lg:flex-row">
                <div className="space-y-[25px] lg:w-full">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier Name</FormLabel>
                        <FormControl className="col-span-6">
                          <div className="item-center relative flex">
                            <Image
                              src="/icons/add-product/name.svg"
                              alt="search"
                              width={20}
                              height={20}
                              className="absolute m-5"
                            />
                            <Input
                              className="h-[60px] bg-slate-100 pl-12 max-sm:w-[340px] lg:w-full"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl className="col-span-6">
                          <div className="item-center relative flex">
                            <Image
                              src="/icons/add-product/email.svg"
                              alt="search"
                              width={20}
                              height={20}
                              className="absolute m-5"
                            />
                            <Input
                              className="h-[60px] bg-slate-100 pl-12 max-sm:w-[340px] lg:w-full"
                              placeholder="Enter supplier Email"
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
                    name="weChatQR"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem className="w-full text-base text-slate-800 dark:text-white">
                        <FormLabel>
                          Supplier`s WeChat Account Details (Optional)
                        </FormLabel>
                        <FormControl>
                          <div className="flex">
                            <label className="flex h-[60px] w-full items-center rounded-lg bg-slate-100 pl-5 dark:bg-slate-800 max-sm:w-[340px]">
                              <div className="hidden">
                                {value && <p>Current file</p>}
                              </div>
                              <div className="w-full">
                                <Input
                                  id="weChatQR"
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => {
                                    handleFileChangeWechat(e);
                                    onChange(e.target.files?.[0]);
                                  }}
                                  {...fieldProps}
                                />
                                <div className="flex w-full items-center justify-between dark:text-slate-400">
                                  <div className="flex">
                                    <Image
                                      src="/icons/pay-supplier/wechat.svg"
                                      alt="search"
                                      width={20}
                                      height={20}
                                      className="mr-3 opacity-75"
                                    />
                                    Upload WeChat Payment QR Code
                                  </div>
                                  <div className="item-center mr-[10px] flex justify-center rounded-xl bg-white">
                                    <Image
                                      src="/icons/pay-supplier/qr.svg"
                                      alt="search"
                                      width={20}
                                      height={20}
                                      className="m-[6px] max-sm:m-2"
                                    />
                                  </div>
                                </div>
                              </div>
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full space-y-[25px]">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier Phone</FormLabel>
                        <FormControl>
                          <div className="item-center relative flex">
                            <Image
                              src="/icons/add-product/phone.svg"
                              alt="search"
                              width={20}
                              height={20}
                              className="absolute m-5"
                            />
                            <Input
                              className="h-[60px] bg-slate-100 pl-12 max-sm:w-[340px] lg:w-full"
                              placeholder="Enter Supplier Phone"
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
                    name="aliPayQR"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem className="w-full text-base text-slate-600 dark:text-white">
                        <FormLabel>
                          Supplier`s AliPay Account Details (Optional)
                        </FormLabel>
                        <FormControl>
                          <div className="flex">
                            <label className="flex h-[60px] w-full items-center rounded-lg bg-slate-100 pl-5 dark:bg-slate-800 max-sm:w-[400px]">
                              <div className="hidden w-0">
                                {value && <p>Current file</p>}
                              </div>
                              <div className="w-full">
                                <Input
                                  id="aliPayQR"
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => {
                                    handleFileChangeAlipay(e);
                                    onChange(e.target.files?.[0]);
                                  }}
                                  {...fieldProps}
                                />
                                <div className="flex w-full items-center justify-between dark:text-slate-400">
                                  <div className="flex">
                                    <Image
                                      src="/icons/pay-supplier/alipay.svg"
                                      alt="search"
                                      width={20}
                                      height={20}
                                      className="mr-3 opacity-75"
                                    />
                                    Upload Alipay QR Code
                                  </div>

                                  <div className="mr-[10px] rounded-xl bg-white">
                                    <Image
                                      src="/icons/pay-supplier/qr.svg"
                                      alt="search"
                                      width={20}
                                      height={20}
                                      className="m-[7px]"
                                    />
                                  </div>
                                </div>
                              </div>
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="formaInvoice"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem className="w-full text-base text-slate-800 dark:text-white max-md:mb-[25px]">
                        <FormLabel>pro forma invoice</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <label className="flex h-[60px] w-full items-center rounded-lg bg-slate-100 pl-5 dark:bg-slate-800 max-sm:w-[340px]">
                              <div className="hidden">
                                {value && <p>Current file</p>}
                              </div>
                              <div className="w-full">
                                <Input
                                  id="formaInvoice"
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => {
                                    handleFileChange(e);
                                    onChange(e.target.files?.[0]);
                                  }}
                                  {...fieldProps}
                                />
                                <div className="flex items-center justify-between dark:text-slate-400 max-md:text-sm">
                                  <div className="flex">
                                    <Image
                                      src="/icons/pay-supplier/invoice.svg"
                                      alt="search"
                                      width={20}
                                      height={20}
                                      className="mr-3 opacity-75"
                                    />
                                    Upload pro forma invoice from supplier
                                  </div>
                                  <div className="mr-[5px] flex items-center justify-center rounded-lg bg-white">
                                    <Image
                                      src="/icons/pay-supplier/upload.svg"
                                      alt="search"
                                      width={20}
                                      height={20}
                                      className="m-[5px] sm:m-[7px]"
                                    />
                                  </div>
                                </div>
                              </div>
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col pr-[25px] max-md:mt-[25px] max-md:space-y-[25px]">
                <FormField
                  control={form.control}
                  name="bankAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Supplier`s Bank Account Details (Optional)
                      </FormLabel>
                      <FormControl className="col-span-6">
                        <div className="item-center relative flex">
                          <Image
                            src="/icons/pay-supplier/bank.svg"
                            alt="search"
                            width={20}
                            height={20}
                            className="absolute m-5"
                          />
                          <Input
                            className="h-[60px] bg-slate-100 pl-12 max-sm:w-[340px] lg:w-full"
                            placeholder="Provide your supplier Bank account details"
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
                  name="bankDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Supplier`s Bank Account Details (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="bg-slate-100 lg:h-32 lg:w-full"
                          placeholder="Provide your supplier Bank account details"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-span-8 flex justify-start" />
                    </FormItem>
                  )}
                />

                <div className="mb-[25px]">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount to Pay (¥ Yuan) (RMB)</FormLabel>
                        <FormControl className="col-span-6">
                          <div className="item-center relative flex">
                            <div className="absolute m-4 text-lg font-bold lg:mt-4">
                              ¥
                            </div>
                            <Input
                              type="number"
                              className="h-[60px] bg-slate-100 pl-12 max-sm:w-[340px] lg:w-full"
                              placeholder="¥1 Yuan"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="col-span-8 flex justify-start" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equivalent Amount in (₦ Naira)</FormLabel>
                      <FormControl className="col-span-6">
                        <div className="item-center relative flex">
                          <div className="absolute m-4 text-lg font-bold lg:mt-4">
                            ₦
                          </div>
                          <Input
                            type="number"
                            className="h-[60px] bg-slate-100 pl-12 max-sm:w-[340px] lg:w-full"
                            placeholder="₦1 Naira"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="col-span-8 flex justify-start" />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between border-b border-t py-[25px] max-md:flex-col max-md:gap-3">
                  <div>
                    Service Charge: <span>0%</span>
                  </div>
                  <div>
                    Exchange Rate:<span>¥1 Yuan</span>
                    <span>= ₦200 Naira</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex max-sm:flex-col max-sm:gap-3 max-sm:pr-[15px] md:justify-between lg:pr-[25px]">
              <div>
                <div className="max-md:flex max-md:flex-col max-md:gap-3">
                  <div className="text-base font-medium text-slate-800 dark:text-white">
                    Agree to{' '}
                    <Link href="/terms-and-conditions">
                      <span className="text-base text-indigo-800">
                        Terms & Condition
                      </span>
                    </Link>
                  </div>
                  <div className="flex gap-2 max-md:items-start">
                    <Checkbox />
                    <span>
                      You must agree to our Terms & Conditions before proceeding
                    </span>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                className="item-center mb-[25px] h-[49px] gap-2 text-base font-medium lg:w-[203px]"
                onClick={() => {
                  router.push('/dashboard/pay-supplier/bank-payment');
                }}
              >
                <Image
                  src="/icons/profile-update/bank-white.svg"
                  alt="search"
                  width={20}
                  height={20}
                  className="fill-white"
                />
                Bank Deposit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BankDepositForm;
