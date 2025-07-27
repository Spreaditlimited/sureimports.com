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
import {
  Banknote,
  BoxesIcon,
  BoxIcon,
  CircleDollarSign,
  Layers3,
  Link,
  Link2,
  TagIcon,
  Weight,
  WeightIcon,
} from 'lucide-react';
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';
import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useParams, useSearchParams } from 'next/navigation';
import { useModal } from '@/app/context/ModalContext';
import Modal from '@/components/uix/ModalLarge';
import { MdProductionQuantityLimits } from 'react-icons/md';

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

const formSchema = z.object({
  pidUser: z.string(),
  pidProduct: z.string(),
  pidOrder: z.string(),
  emailUser: z.string(),
  productName: z
    .string()
    .min(2, {
      message: 'Product Name is required',
    })
    .max(500),
  productLink: z
    .string()
    .min(10, { message: 'Please enter a valid product link' }),

  //productCategory: z.string().min(2, { message: 'Please select a category' }),
  productPrice: z.string().min(1, { message: 'Please enter product price' }),
  productWeight: z.string().min(1, { message: 'Please enter product weight' }),
  productQuantity: z
    .string()
    .min(1, { message: 'Please enter product quantity' }),
  productInfo: z
    .string()
    .min(1, { message: 'Please enter product information' }),
});

interface ReportFormProps {}

const AddProductForm: React.FC<ReportFormProps> = () => {
  const { isModalOpen, openModal, closeModal } = useModal();

  // Get route parameter
  const params = useParams();
  const searchParams = useSearchParams();
  const pidOrderx = params?.pidOrder as string;

  //initialize alert system
  let productID = 'PRD' + new Date().getTime().toString();
  const navigateWithAlert = useNavigationWithAlert();
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const [pidProduct, setPidProduct] = useState(productID);
  const [pidOrder, setPidOrder] = useState(pidOrderx);
  const [email, setEmail] = useState(user?.userEmail);
  const [message, setMessage] = React.useState('');
  const [currency, setCurrencyType] = useState<string>('');
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pidUser: pidUser,
      pidProduct: pidProduct,
      pidOrder: pidOrder,
      emailUser: email,
      productName: '',
      productLink: '',
      //productCategory: '',
      productPrice: '',
      productWeight: '',
      productQuantity: '',
      productInfo: '',
    },
  });

  //GET RECORDS FROM DATABASE
  async function fetchDataOrder() {
    try {
      const res = await fetch(`/api/get-data/order-one?pidOrder=${pidOrder}`);
      const data = await res.json();
      setCurrencyType(data.getOneRecord.currencyType);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error appropriately (e.g., display an error message)
    } finally {
      // setLoading(false); // Set loading to false when done
    }
  }

  useEffect(() => {
    fetchDataOrder();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    if (parseFloat(values.productPrice) < 0.001) {
      alert(
        'Please enter a valid price. Minimum price for any purchase is $0.01.',
      );
      return;
    }
    if (parseFloat(values.productQuantity) < 1) {
      alert('You must have at least a product.');
      return;
    }

    toast.info('Processing . . .');
    //await new Promise((resolve) => setTimeout(resolve, 3000));

    const pidUser = values.pidUser;
    const pidProduct = values.pidProduct;
    const pidOrder = values.pidOrder;
    const emailUser = values.emailUser;
    const productName = values.productName;
    const productLink = values.productLink;
    //const productCategory = values.productCategory;
    const productPrice = values.productPrice;
    const productWeight = values.productWeight;
    const productQuantity = values.productQuantity;
    const productInfo = values.productInfo;

    //MAKE REQUEST ATTEMPT
    try {
      //MAKE REQUEST
      const res = await fetch('/api/crud/procurement-add-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pidUser,
          pidProduct,
          pidOrder,
          emailUser,
          productName,
          productLink,
          //productCategory,
          productPrice,
          productWeight,
          productQuantity,
          productInfo,
        }),
      });

      const data: ApiResponse = await res.json();

      if (data.responsex.status == 'SUCCESS') {
        navigateWithAlert(
          '/dashboard/procurement/view-orders/saved',
          'success',
          'A Product has been added',
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
    <>
      {/* MODAL VIEW STARTS */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="p-3 text-xl font-bold text-gray-700">
          Tips on getting the weight of a product
        </h2>
        <hr />
        <br />

        <div className="relative h-0 w-full pb-[56.25%]">
          <iframe
            className="absolute left-0 top-0 h-full w-full"
            src={`https://www.youtube.com/embed/${'ZTgoROlS5NY'}`}
            title="YouTube Video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="p-3 text-gray-700">
          <p className="w-full text-center">- or -</p>
          <p>
            Chat with a product sourcing specialist in our China office to get
            the exact weight of the product you want to order. You will need to
            share the product link with the specialist. Response may take up to
            24 hours. <br />
            <br />
            {/* <a
              href="https://wa.me/message/TZOKMEAUXVSCG1"
              className="flex rounded-xl bg-indigo-800 px-[25px] py-[15px] text-center font-medium text-white hover:bg-indigo-700 sm:w-auto lg:w-1/3"
              target="_blank"
            >
              <Weight className="text-xl text-gray-400" />
              &nbsp; Confirm Weight
            </a> */}
            <a
              href="https://wa.me/message/TZOKMEAUXVSCG1"
              className="flex items-center justify-center rounded-xl bg-indigo-800 px-[25px] py-[15px] font-medium text-white hover:bg-indigo-700 sm:w-auto lg:w-1/3"
              target="_blank"
            >
              <Weight className="text-xl text-gray-400" />  Confirm Weight
            </a>
          </p>
          <br />
          <br />
          <p>
            On 1688, most suppliers do not provide the weight of products,
            however some do. Take your time to study the product page of any
            product you intend to import to see if the supplier provided it's
            weight.
          </p>
          <br />
          <p>
            If you don't find the weight of the product on 1688, look for that
            same product on Alibaba.com. You can do an image search of the
            product on Alibaba.com just like on 1688.com. On Alibaba, you will
            most likely see the weight.
          </p>
          <br />
          <p>
            If you still don't find the weight on Alibaba, check for the same
            product on Amazon.com. Here you most likely will see the weight.
          </p>
        </div>

        <hr />

        <div className="p-3 text-gray-700">
          <p>
            <i>
              For General Products frequently bought by many of our customers,
              the following estimated net weights apply:
            </i>
          </p>

          <br />

          <p>
            Sneakers - 0.6kg.
            <br />
            Corporate shoes - 1kg
            <br />
            Boots - 2kg
            <br />
            Canvas - 1kg
            <br />
            Female heel shoes - 0.6kg
            <br />
            Female flat shoes - 0.5kg
            <br />
            Slippers - 0.4kg
            <br />
          </p>

          <br />
          <p>
            Wristwatch - 0.2kg
            <br />
            Necklace - 0.1kg
            <br />
          </p>

          <br />
          <p>
            Handbags
            <br />
            Big Handbags - 1kg
            <br />
            Small handbags - 0.6kg.
            <br />
            Many in one handbags - 1.5kg
            <br />
            Wallets - 0.2kg
            <br />
            Purse - 0.3kg
            <br />
          </p>

          <br />
          <p>
            Hair Wigs - 0.3kg
            <br />
            Hair Attachment (1 bundle) - 0.2kg
            <br />
          </p>

          <br />
          <p>
            Shirts - 0.3kg
            <br />
            Gowns - 0.3kg
            <br />
            Trousers - 0.3kg
            <br />
            Shorts - 0.3kg
            <br />
            Suits - 2kg
            <br />
            Jeans - 0.5kg
            <br />
          </p>
        </div>
      </Modal>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="border-b py-5 pl-6 text-xl font-bold text-slate-800 dark:text-slate-300">
            Order ID: {pidOrder}
          </div>

          <div className="flex w-full flex-col gap-3 border-b pb-[25px]">
            <div className="flex flex-col lg:flex-row">
              <div className="w-11/12 space-y-8 lg:w-[]">
                {/* ************************* PRODUCT NAME ************************* */}
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl className="col-span-6">
                        <div className="item-center relative flex">
                          <TagIcon
                            width={20}
                            height={20}
                            className="absolute m-2 lg:m-5"
                          />
                          <Input
                            className="bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px] lg:w-11/12"
                            placeholder="Enter product name"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="col-span-8 flex justify-start" />
                    </FormItem>
                  )}
                />

                {/* ************************* PRODUCT WEIGHT ************************* */}
                <FormField
                  control={form.control}
                  name="productWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Weight (Kg)</FormLabel>
                      <FormControl>
                        <div className="item-center relative flex">
                          <WeightIcon
                            width={20}
                            height={20}
                            className="absolute m-2 lg:m-5"
                          />
                          <Input
                            className="bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px] lg:w-11/12"
                            placeholder="Enter product weight"
                            {...field}
                            type="number"
                          />
                        </div>
                      </FormControl>

                      {/* *************************info************************* */}
                      <div className="gap-[22.5px max-lg:hiddenx flex flex-col">
                        <div className="text-sm text-slate-500">
                          Inputting the right weight{' '}
                          <span>(This determines your shipping cost)</span>
                        </div>
                        <div>
                          <Button
                            type="button"
                            onClick={openModal}
                            className="mt-3 bg-red-400 text-xs font-medium hover:bg-red-300"
                          >
                            Important weight information, Click here
                          </Button>
                        </div>
                      </div>

                      <FormMessage className="col-span-8 flex justify-start" />
                    </FormItem>
                  )}
                />

                {/* ************************* PRODUCT QUANTITY ************************* */}
                <FormField
                  control={form.control}
                  name="productQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Product Quantity -{' '}
                        <small>
                          <i>(Minimum of 1 Product)</i>
                        </small>
                      </FormLabel>
                      <FormControl>
                        <div className="item-center relative mb-5 flex">
                          <BoxesIcon
                            width={20}
                            height={20}
                            className="absolute m-2 lg:m-5"
                          />
                          <Input
                            className="bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px] lg:w-11/12"
                            placeholder="Enter product quantity"
                            {...field}
                            type="number"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="col-span-8 flex justify-start" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-11/12 space-y-8 max-md:mt-3 lg:w-10/12">
                {/* ************************* PRODUCT LINK ************************* */}
                <FormField
                  control={form.control}
                  name="productLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Link</FormLabel>
                      <FormControl>
                        <div className="item-center relative flex">
                          <Link
                            width={20}
                            height={20}
                            className="absolute m-2 lg:m-5"
                          />
                          <Input
                            className="bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px] lg:w-11/12"
                            placeholder="Enter product link"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="col-span-8 flex justify-start" />
                    </FormItem>
                  )}
                />

                {/* ************************* PRODUCT UNIT PRICE ************************* */}
                <FormField
                  control={form.control}
                  name="productPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Product Unit Price ({currency ?? ''}){' '}
                      </FormLabel>
                      <FormControl>
                        <div className="item-center relative flex">
                          <Banknote
                            width={20}
                            height={20}
                            className="absolute m-2 lg:m-5"
                          />
                          <Input
                            className="bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px] lg:w-11/12"
                            placeholder="Enter the price of the product"
                            {...field}
                            type="number"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="col-span-8 flex justify-start" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col pt-6 max-lg:w-11/12 max-md:mt-[25px] lg:pr-8 xl:pl-0">
              {/* ************************* PRODUCT INFO ************************* */}
              <FormField
                control={form.control}
                name="productInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Info</FormLabel>
                    <FormControl>
                      <Textarea
                        className="w-full bg-slate-100 lg:h-32"
                        placeholder="Provide any additional information for this product"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-8 flex justify-start" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* <div className="mt-[16px] flex w-11/12 flex-wrap text-sm font-normal text-red-400 lg:text-sm">
            <div className="pb-3 text-slate-600">
              Important Note: for countries outside nigeria
            </div>
            We are only able to ship directly to you, orders with a minimum
            total estimated weight of 10kg. That is; the total estimated weight
            of all the products in your order must be at least 10kg. Ensure you
            input the right unit weight for each product as stated by the
            supplier. Our order approval team will check to ensure correctness
            and will only approve correctly placed orders for processing.
          </div> */}
          <div className="flex pr-12 pt-11 md:justify-end">
            <Button
              type="submit"
              className="item-center my-[25px] h-[49px] w-[162px] gap-2 text-base font-medium"
            >
              <Image
                src="/icons/add-product/cart.svg"
                alt="search"
                width={20}
                height={20}
                className="fill-white"
              />
              Add product
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AddProductForm;
