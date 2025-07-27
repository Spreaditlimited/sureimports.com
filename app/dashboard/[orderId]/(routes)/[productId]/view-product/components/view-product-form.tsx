'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';

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
import { CircleDollarSign, Layers3, Link } from 'lucide-react';

const formSchema = z.object({
  productName: z
    .string()
    .min(2, {
      message: 'Product Name is required',
    })
    .max(500),
  productLink: z
    .string()
    .min(10, { message: 'Please enter a valid product link' }),

  productCatagory: z.string().min(2, { message: 'Please select a currency' }),
  productPrice: z.number(),
  productWeight: z.string().min(2, { message: 'Please select a plan' }),
  productQuantity: z.number().min(2, { message: 'Please enter an address' }),
  address: z.string().min(10, { message: 'Please enter an address' }),
});

interface ReportFormProps {
  product: {
    id: number;
    name: string;
    info: string;
    quantity: number;
    price: number;
    weight: number;
    total: number;
  };
}

const AddProductForm: React.FC<ReportFormProps> = ({ product }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '',
      productLink: '',
      productCatagory: '',
      productWeight: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col gap-3 border-b pb-[25px]">
          <div className="flex flex-col lg:flex-row">
            <div className="w-11/12 space-y-8 lg:w-[]">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl className="col-span-6">
                      <div className="item-center relative flex">
                        <Image
                          src="/icons/add-product/name.svg"
                          alt="search"
                          width={20}
                          height={20}
                          className="absolute m-2 lg:m-5"
                        />
                        <Input
                          disabled={true}
                          className="bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px] lg:w-11/12"
                          placeholder={`${product.name}`}
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
                name="productCatagory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Category</FormLabel>
                    <FormControl>
                      <div className="item-center relative flex">
                        <div className="absolute m-2 lg:m-5">
                          <Layers3 className="w-4" />
                        </div>

                        <Input
                          disabled={true}
                          className="bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px] lg:w-11/12"
                          placeholder="product catagory"
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
                name="productWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Weight</FormLabel>
                    <FormControl>
                      <div className="item-center relative flex">
                        <Image
                          src="/icons/specialsourcing/weight.svg"
                          alt="search"
                          width={20}
                          height={20}
                          className="absolute m-2 lg:m-5"
                        />
                        <Input
                          disabled={true}
                          className="bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px] lg:w-11/12"
                          placeholder={`${product.weight}`}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="col-span-8 flex justify-start" />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-[22.5px] pb-4 lg:hidden">
                <div className="text-sm text-slate-600">
                  Inputting the right weight{' '}
                  <span>(This determines your shipping cost)</span>
                </div>
                <div>
                  <Button
                    type="button"
                    className="bg-red-400 text-xs font-medium hover:bg-red-300"
                  >
                    Important weight information, Click here
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-11/12 space-y-8 max-md:mt-3 lg:w-10/12">
              <FormField
                control={form.control}
                name="productLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Link</FormLabel>
                    <FormControl>
                      <div className="item-center relative flex">
                        <div className="absolute m-2 lg:m-5">
                          <Link className="w-4" />
                        </div>
                        <Input
                          disabled={true}
                          className="bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px] lg:w-11/12"
                          placeholder="product link"
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
                name="productPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Price(₦ Naira)</FormLabel>
                    <FormControl>
                      <div className="item-center relative flex">
                        <CircleDollarSign
                          className="absolute m-2 lg:m-5"
                          size={20}
                        />
                        <Input
                          disabled={true}
                          className="bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px] lg:w-11/12"
                          placeholder={`${product.price}`}
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
                name="productQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Quantity</FormLabel>
                    <FormControl>
                      <div className="item-center relative flex">
                        <Image
                          src="/icons/add-product/quantity.png"
                          alt="search"
                          width={20}
                          height={20}
                          className="absolute m-2 lg:m-5"
                        />
                        <Input
                          disabled={true}
                          className="bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px] lg:w-11/12"
                          placeholder={`${product.quantity}`}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="col-span-8 flex justify-start" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col max-lg:w-11/12 max-md:mt-[25px] lg:pr-8 xl:pl-0">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Info</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={true}
                      className="w-full bg-slate-100 lg:h-32"
                      placeholder={
                        `${product.info}` ||
                        'Red colour - size 45, Black colour - size 44'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-8 flex justify-start" />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="mt-[16px] flex w-11/12 flex-wrap text-sm font-normal text-red-400 lg:text-sm">
          <div className="pb-3 text-slate-600">
            Important Note: for countries outside nigeria
          </div>
          We are only able to ship directly to you, orders with a minimum total
          estimated weight of 10kg. That is; the total estimated weight of all
          the products in your order must be at least 10kg. Ensure you input the
          right unit weight for each product as stated by the supplier. Our
          order approval team will check to ensure correctness and will only
          approve correctly placed orders for processing.
        </div>
        <div className="flex pr-12 pt-11 md:justify-end"></div>
      </form>
    </Form>
  );
};

export default AddProductForm;
