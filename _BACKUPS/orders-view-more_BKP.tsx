'use client';

import React, { useEffect, useRef, useState } from 'react';
//import SearchPage from './order-table-search';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { Input } from '@/components/ui/input-with-dark-mode';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import Link from 'next/link';
import Loader from '@/components/uix/Loader';
//import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { useFlutterwave } from 'flutterwave-react-v3';
import { useAuth } from '@/app/context/AuthContext';
import { MdViewWeek } from 'react-icons/md';
import { MdDeleteForever } from 'react-icons/md';
import { RiListView } from 'react-icons/ri';
import { toast } from 'sonner';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { random } from 'lodash';
import FlutterwavePaymentButton from '@/_BACKUPS/FlutterwavePaymentButton_BKP';

interface ProductData {
  id: number;
  pidUser: string;
  pidProduct: string;
  pidOrder: string;
  productName: string;
  productLink: string;
  productCategory: string;
  productPrice: string;
  productWeight: string;
  productQuantity: string;
  productInfo: string;
  createdAt: string;
}

interface MoreOrdersProps {
  products: ProductData[];
}

//USER DATA
interface User {
  pidUser: string;
  email: string;
  name: string;
  userImage: string;
  userStatus: string;
}

//API RESPONSE
interface ApiResponse {
  responsex: any;
  successx: boolean;
  userx: User;
}

function MoreOrders({ products }: MoreOrdersProps) {
  const { user, logout } = useAuth(); //DATA FROM SESSION

  const router = useRouter();

  const searchParams = useSearchParams();
  // const status = searchParams.get('statusx');
  // const [param1, setParam1] = useState(
  //   searchParams.get('statusx') || '',
  // ) as any;

  //LOADERS FOR ORDERS AND PRODUCTS LOADING
  // if (!products) return <Loader />;
  // if (products.length === 0) {
  //   return (
  //     <div className="m-7 flex border-spacing-1 items-center justify-center p-7 font-bold">
  //       <div className="rounded border-2 border-dotted border-gray-500 p-4">
  //         <p className="text-center text-gray-500">No products available</p>
  //       </div>
  //     </div>
  //   ); //CHECK IF RECORD IS EMPTY
  // }

  //get url from www.example.com/products/param1 (Where App Route is "App/products/[id]/page.tsx")
  const params = useParams<{ statusx: string }>(); //id is from [id]
  const status = params.statusx;
  const status2 = params.statusx;

  //  const productx = products[0].pidOrder;

  //const valuex = !products ? <Loader /> : products[0].pidOrder;

  //ENABLE & DISABLE VARIABLES
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabled2, setIsDisabled2] = useState(false);

  //alert(products[0].pidOrder);
  //------------------------- PRODUCTS DATA FOR CALCULATIONS --------------------------//

  //const [pidOrder, setPidOrder] = useState<string>('DR1737651403759');
  //const [pidOrder, setPidOrder] = useState<string>(productx);
  const [pidOrder, setPidOrder] = useState<string>(products[0]?.pidOrder || '');

  const [getAllProducts, setGetAllProducts] = useState<any[]>([]);
  const [productsTotalPrice, setProductsTotalPrice] = useState<number>(0);
  const [productsTotalCount, setProductsTotalCount] = useState<number>(0);
  const [productsTotalWeight, setProductsTotalWeight] = useState<number>(0);

  const [currencyType, setCurrencyType] = useState<string>('...');
  const [currencyName, setCurrencyName] = useState<string>('...');
  const [currencyLogo, setCurrencyLogo] = useState<string>('...');

  const [exNairaToDollar, setExNairaToDollar] = useState<number>(0);
  const [exYuanToDollar, setExYuanToDollar] = useState<number>(0);
  const [exNairaToYuan, setExNairaToYuan] = useState<number>(0);

  const [serviceCharge, setServiceCharge] = useState<number>(0);
  const [serviceChargeValue, setServiceChargeValue] = useState<number>(0);
  const [vat, setVat] = useState<number>(0);
  const [vatValue, setVatValue] = useState<number>(0);

  const [destinationCountry, setDestinationCountry] = useState<string>('...');

  const [shippingPlanName, setShippingPlanName] = useState<string>('...');
  const [shippingPlanRate, setShippingPlanRate] = useState<number>(0);
  const [domesticShippingCost, setDomesticShippingCost] = useState<number>(0);
  const [internationalShippingCost, setInternationalShippingCost] =
    useState<number>(0);
  const [estimatedTotalShippingCost, setEstimatedTotalShippingCost] =
    useState<number>(0);

  const [grandTotalCost, setGrandTotalCost] = useState<number>(0);

  //REPLACE NULL VALUES WITH ZERO
  function replaceNullWithZero<T>(value: T | null): T | number {
    return value === null ? 0 : value;
  }

  //------------------------- GET ALL PRODUCTS DATA & CALCULATIONS --------------------------//
  async function getProductsDetails() {
    try {
      setLoading(true);
      // Pull Records from database
      const res = await fetch(
        `/api/get-data/procurement-product-data?pidOrder=${pidOrder}`,
      );

      const data: any = await res.json();

      setGetAllProducts(data.productsGetAll) as any;
      setProductsTotalPrice(replaceNullWithZero(data.productsTotalPrice));
      setProductsTotalCount(replaceNullWithZero(data.productsTotalCount));
      setProductsTotalWeight(replaceNullWithZero(data.productsTotalWeight));

      setCurrencyType(data.currencyType);
      setCurrencyName(data.currencyName);
      setCurrencyLogo(data.currencyLogo);

      setExNairaToDollar(replaceNullWithZero(data.exNairaToDollar));
      setExYuanToDollar(replaceNullWithZero(data.exYuanToDollar));
      setExNairaToYuan(replaceNullWithZero(data.exNairaToYuan));

      setServiceCharge(replaceNullWithZero(data.serviceCharge));
      setServiceChargeValue(replaceNullWithZero(data.serviceChargeValue));
      setVat(replaceNullWithZero(data.vat));
      setVatValue(replaceNullWithZero(data.vatValue));

      setDestinationCountry(data.destinationCountry);

      setShippingPlanName(data.shippingPlanName);
      setShippingPlanRate(replaceNullWithZero(data.shippingPlanRate));
      setDomesticShippingCost(replaceNullWithZero(data.domesticShippingCost));
      setInternationalShippingCost(
        replaceNullWithZero(data.internationalShippingCost),
      );
      setEstimatedTotalShippingCost(
        replaceNullWithZero(data.estimatedTotalShippingCost),
      );

      setGrandTotalCost(replaceNullWithZero(data.grandTotalCost));
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error appropriately (e.g., display an error message)
    } finally {
      setLoading(false); // Set loading to false when done
    }
  }

  // Conditional rendering after all Hooks
  // if (!products) return <Loader />;
  // if (products.length === 0) {
  //   return <div>No products available</div>;
  // }

  useEffect(() => {
    getProductsDetails();
  }, [pidOrder]);

  //------------------------- RUN THE GET PRODUCT DETAILS FUNCTION --------------------------//
  // useEffect(() => {
  //   getProductsDetails();
  // }, []);

  // return <div>{getAllProducts['productsTotalPrice']}</div>;
  //     return (
  //       <>
  //   {
  //   getAllProducts.map((datax: any, index) => (

  //         <tr className="border-b border-gray-200 font-bold hover:bg-gray-100 dark:text-gray-400">
  //           <td className="px-6 py-3 text-left">{index + 1}</td>
  //           <td className="px-6 py-3 text-left">
  //             <Link
  //               href={datax.productLink}
  //               //target="_blank"
  //             >
  //               {datax.productName}
  //             </Link>
  //           </td>
  //         </tr>

  //   ))
  // }
  //   </>
  //   );

  const actionProductDelete = async (pidProductx: string) => {
    try {
      toast.info('Processing . . .');
      setLoading(true);
      const res = await fetch(
        `/api/crud/procurement-delete-product/${user?.pidUser}/${pidProductx}`,
      );

      //check if request was successful
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch user');
      }

      // GET & PROCESS RESPONSE FROM API
      const data: ApiResponse = await res.json();

      if (data.responsex.status == 'SUCCESS') {
        toast.success(data.responsex.message);
        getProductsDetails();
        setLoading(false);
      }
      if (data.responsex.status == 'FAILED') {
        toast.warning(data.responsex.message);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    try {
      toast.info('Processing . . .');

      const res = await fetch(
        `/api/crud/procurement-cancel-order?pidUser=${user?.pidUser}&pidOrder=${pidOrder}`,
      );

      // GET & PROCESS RESPONSE FROM API
      const data: ApiResponse = await res.json();

      if (data.responsex.status == 'SUCCESS') {
        toast.success(data.responsex.message);
        router.push('/dashboard/procurement/view-orders/cancelled');
        navigateWithAlert(
          '/dashboard/procurement/view-orders/cancelled',
          'success',
          'Order has been cancelled!',
        );
      }
      // if (data.responsex.status == 'SUCCESS') {
      //   toast.success(data.responsex.message);
      //   getProducts();
      //   setLoading(false);
      // }
      if (data.responsex.status == 'FAILED') {
        toast.warning(data.responsex.message);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  ////////////////////////// FLUTTERWAVE PAYMENT //////////////////////////
  const currencyTypeX = 'USD';
  //const currencyTypeX = currencyType;

  const config = {
    public_key: 'FLWPUBK-7ecbd7ff5bae8311218f66d77e0e6cae-X',
    //public_key: 'FLWPUBK_TEST-d3f6aba70bb7bf1fb8d75b46ee3bcab8-X',
    //public_key: process.env.FLUTTERWAVE_PUBLIC_KEY_TEST,
    tx_ref: Date.now(),
    amount: grandTotalCost,
    currency: currencyTypeX,
    payment_options: 'card,mobilemoney,ussd',
    redirect_url:
      process.env.NEXT_PUBLIC_MAIN_SITE_URL + '/dashboard/success/payment',
    meta: {
      order_id: pidOrder,
      description: 'Payment for Procurement Order',
    },
    customer: {
      email: user?.email,
      phone_number: '',
      name: user?.name,
    },
    customizations: {
      title: 'OrderID:' + pidOrder,
      description: 'Payment for Procurement Order',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  } as any;

  const handleFlutterPayment = useFlutterwave(config);
  ////////////////////////// FLUTTERWAVE PAYMENT //////////////////////////

  const sectionRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!sectionRef.current) {
      console.error('Section reference is null');
      return;
    }

    console.log(sectionRef.current); // Check if the element contains the expected content
    const canvas = await html2canvas(sectionRef.current, {
      scale: 2,
    });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('section.pdf');
  };

  return (
    <div className="flex flex-col bg-white dark:bg-[#161629]">
      <div className="flex flex-row items-center justify-between p-[25px] max-md:flex-col max-md:items-start max-md:gap-3">
        <div className="text-center text-xl font-bold text-slate-800 dark:text-slate-200">
          {/* {products.length} Products */}
        </div>
      </div>

      <FlutterwavePaymentButton />

      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <>
          {/* <!-- Responsive Table Wrapper --> */}
          <div className="overflow-x-auto">
            <table className="min-w-full overflow-hidden bg-white font-bold shadow-md dark:bg-slate-900 dark:text-gray-300">
              <thead className="bg-gray-200 text-sm uppercase leading-normal text-gray-600 dark:bg-gray-200">
                <tr className="dark:bg-gray-800 dark:text-gray-300">
                  <th className="px-6 py-3 text-left">S/N</th>
                  <th className="px-6 py-3 text-left">Product Name</th>
                  <th className="px-6 py-3 text-left">Product Link</th>
                  <th className="px-6 py-3 text-left">
                    Amount ({currencyType})
                  </th>
                  <th className="px-6 py-3 text-left">Quantity</th>
                  <th className="px-6 py-3 text-left">Unit Weight</th>
                  <th className="px-6 py-3 text-left">Total Price</th>
                  {status == 'saved' && (
                    <>
                      <th className="px-6 py-3 text-left">Action</th>
                    </>
                  )}
                </tr>
              </thead>

              {/* <tbody className="text-sm font-light text-gray-600">
  {getAllProducts.map((datax: any, index: number) => (
    <tr key={datax.id || index}>
      <td className="whitespace-nowrap px-4 py-4">
        <Checkbox />
      </td>
      <td className="whitespace-nowrap px-4 py-4">{datax.productName}</td>
      <td className="whitespace-nowrap px-4 py-4">{datax.productLink}</td>
      <td className="whitespace-nowrap px-4 py-4">{datax.productCategory}</td>
      <td className="whitespace-nowrap px-4 py-4">{datax.productPrice}</td>
      <td className="whitespace-nowrap px-4 py-4">{datax.productWeight}</td>
      <td className="whitespace-nowrap px-4 py-4">{datax.productQuantity}</td>
      <td className="whitespace-nowrap px-4 py-4">{datax.productInfo}</td>
      <td className="whitespace-nowrap px-4 py-4">{datax.createdAt}</td>
    </tr>
  ))}
</tbody> */}

              <tbody className="text-sm font-light text-gray-600">
                {/** LOOP RECORDS STARTS */}
                {getAllProducts.map((datax: any, index: number) => {
                  return (
                    <>
                      <tr className="border-b border-gray-200 font-bold hover:bg-gray-100 dark:text-gray-400">
                        <td className="px-6 py-3 text-left">{index + 1}</td>

                        <td className="px-6 py-3 text-left">
                          <Link
                            href={datax.productLink}
                            //target="_blank"
                          >
                            {datax.productName}
                          </Link>
                        </td>

                        <td className="px-6 py-3 text-left">
                          <Link
                            href={datax.productLink}
                            //target="_blank"
                          >
                            {datax.productLink}
                          </Link>
                        </td>

                        <td className="px-6 py-3 text-left">
                          {datax.productPrice}
                        </td>

                        <td className="px-6 py-3 text-left">
                          {datax.productQuantity}
                        </td>

                        <td className="px-6 py-3 text-left">
                          {datax.productWeight}
                        </td>

                        <td className="px-6 py-3 text-left">
                          {datax.productPrice * datax.productQuantity}
                        </td>

                        {status == 'saved' && (
                          <>
                            <td className="flex px-6 py-3 text-left">
                              <Link
                                className="p-2 text-xl"
                                href={
                                  '/dashboard/procurement/edit-product/' +
                                  datax.pidProduct
                                }
                                target="_blank"
                              >
                                <RiListView />
                              </Link>
                              {'   '}

                              <div className="p-2 text-xl">
                                <button
                                  className=""
                                  type="button"
                                  onClick={() =>
                                    actionProductDelete(datax.pidProduct)
                                  }
                                >
                                  <MdDeleteForever />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    </>
                  );
                })}
                {/** LOOP RECORDS ENDS */}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div>{/* <TableData products={products as any} /> */}</div>

      {/* total cost of order */}
      <div className="flex flex-col gap-4 rounded-t-sm border border-slate-200 p-[25px]">
        <div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Total Cost of Order:
          </div>
          <div className="text-base text-slate-600 dark:text-slate-300 lg:flex lg:gap-3">
            {/* IF IN YAUN DOLLAR VALUE */}
            {currencyType == 'USD' && (
              <>
                <span className="font-medium text-slate-600">
                  <span className="font font-bold text-gray-800 dark:text-blue-400">
                    {' '}
                    $
                    {
                      (productsTotalPrice as number)
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                    }{' '}
                    USD
                  </span>

                  {/* {'  |  '}

                  <span className="font-medium text-slate-600 dark:text-gray-400">
                    {' '}
                    ¥
                    {
                      (productsTotalPriceCNY as number)
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                    }{' '}
                    Yuan
                  </span> */}
                </span>
              </>
            )}

            {/* IF IN YAUN DOLLAR VALUE */}
            {currencyType == 'CNY' && (
              <>
                <span className="font-medium text-slate-600">
                  <span className="font font-bold text-gray-800 dark:text-blue-400">
                    {' '}
                    ¥
                    {
                      ((productsTotalPrice as number) * exYuanToDollar)
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                    }{' '}
                    Yuan
                  </span>

                  <>
                    {'  |  '}
                    <span className="font-medium text-slate-600 dark:text-gray-400">
                      {' '}
                      $
                      {
                        (productsTotalPrice as number)
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                      }{' '}
                      USD
                    </span>
                  </>
                </span>
              </>
            )}

            {/* IF DESTINATION COUNTRY NIGERIA, SHOW VALUE IN NAIRA */}
            {destinationCountry == 'Nigeria' && (
              <>
                {'  |  '}
                <span className="font-medium text-slate-600 dark:text-gray-400">
                  {' '}
                  ₦
                  {
                    ((productsTotalPrice as number) * exNairaToDollar)
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                  }{' '}
                  Naira
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      {/* estimated cost of order */}

      <div className="flex flex-col gap-4 border border-slate-200 p-[25px]">
        <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
          Estimated Shipping Cost of Order:
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-20 text-base text-slate-950 dark:text-white">
            <p className="w-72">Domestic Shipping Cost within China:</p> $
            {
              (domesticShippingCost as number)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
            }
          </div>
          <div className="flex gap-20 text-base text-slate-950 dark:text-white">
            <p className="w-72">International Shipping Cost:</p> $
            {
              (internationalShippingCost as number)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
            }
          </div>

          <hr />

          <div className="flex gap-4 text-base text-slate-600 dark:text-white">
            <span className="font-semibold">
              $
              <b>
                {
                  (estimatedTotalShippingCost as number)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                }
              </b>
              USD
            </span>

            <span className="font-semibold">
              {/* IF DESTINATION COUNTRY NIGERIA, SHOW VALUE IN NAIRA */}
              {destinationCountry == 'Nigeria' && (
                <>
                  {'  |  '}&nbsp;
                  <span className="">
                    ₦
                    {
                      ((estimatedTotalShippingCost as number) * exNairaToDollar)
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                    }{' '}
                    Naira
                  </span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* important notice */}
        <div>
          <div className="text-sm font-semibold text-red-400">
            Important Notice:
          </div>
          <div className="text-sm font-normal text-red-400">
            If this cost is higher than the actual cost which will be determined
            later at the China office, we will refund you. If the actual cost is
            higher than this estimated cost, you will be required to make a
            balance payment.
          </div>
        </div>
      </div>

      {/* details */}
      <div className="flex flex-col gap-4 border border-slate-200 p-[25px]">
        <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
          Shipping Details:
        </div>
        <div className="flex max-md:justify-between md:gap-20">
          <p className="md:w-64">Estimated Total Weight of Order:</p>{' '}
          <p>
            {
              ((productsTotalWeight as number) / 1)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
            }
            {' Kg'}
          </p>
        </div>

        {/* SHIPPING DETAILS 1 */}
        {shippingPlanName == 'NORMAL_SHIPPING' && (
          <>
            <div className="flex max-md:justify-between md:gap-20">
              <p className="md:w-64"> Shipping Type:</p>
              <p>Normal Shipping</p>
            </div>
            <div className="flex max-md:justify-between md:gap-20">
              <p className="md:w-64"> Rate:</p>
              <p>${shippingPlanRate} (per Kg)</p>
            </div>
          </>
        )}

        {/* SHIPPING DETAILS 2 */}
        {shippingPlanName == 'EXPRESS_SHIPPING' && (
          <>
            <div className="flex max-md:justify-between md:gap-20">
              <p className="md:w-64"> Shipping Type:</p>
              <p>Express Shipping</p>
            </div>
            <div className="flex max-md:justify-between md:gap-20">
              <p className="md:w-64"> Rate:</p>
              <p>${shippingPlanRate} (per Kg)</p>
            </div>
          </>
        )}

        {/* SHIPPING DETAILS 3 */}
        {shippingPlanName == 'SPECIAL_SHIPPING' && (
          <>
            <div className="flex max-md:justify-between md:gap-20">
              <p className="md:w-64"> Shipping Type:</p>
              <p>Special Shipping</p>
            </div>
            <div className="flex max-md:justify-between md:gap-20">
              <p className="md:w-64"> Rate:</p>
              <p>${shippingPlanRate} (per Kg)</p>
            </div>
          </>
        )}

        {/* SHIPPING DETAILS 4 */}
        {shippingPlanName == 'SEA_SHIPPING' && (
          <>
            <div className="flex max-md:justify-between md:gap-20">
              <p className="md:w-64"> Shipping Type:</p>
              <p>Sea Shipping</p>
            </div>
            <div className="flex max-md:justify-between md:gap-20">
              <p className="md:w-64"> Rate:</p>
              <p>${shippingPlanRate} (N500,000/CBM)</p>
            </div>
          </>
        )}

        <div className="flex max-md:justify-between md:gap-20">
          <p className="md:w-64">Destination Country:</p>
          <p>{destinationCountry}</p>
        </div>
        <div className="flex max-md:justify-between md:gap-20">
          <p className="md:w-64">Port of Exit:</p>
          <p>HONG KONG</p>
        </div>
      </div>
      <div className="flex items-center gap-4 border border-slate-200 p-[25px]">
        <p className="text-xl font-bold md:pr-[84px]">Grand total cost:</p>
        <div>
          {/* GRAND TOTAL */}

          {/* IF IN YAUN DOLLAR VALUE */}
          {currencyType == 'USD' && (
            <>
              <span className="text-2xl font-bold dark:text-blue-400">
                {' '}
                $
                {
                  (grandTotalCost as number)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                }{' '}
                USD
              </span>
              {/* {'  |  '}
              <span className="text-xl font-bold text-gray-500 dark:text-gray-200">
                {' '}
                ¥
                {
                  (productsGrandTotalPriceCNY as number)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                }{' '}
                Yuan
              </span>{' '} */}
            </>
          )}

          {/* IF IN YAUN DOLLAR VALUE */}
          {currencyType == 'CNY' && (
            <>
              <span className="text-2xl font-bold dark:text-blue-400">
                {' '}
                ¥
                {
                  ((grandTotalCost as number) * exYuanToDollar)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                }{' '}
                Yuan
              </span>{' '}
              {'  |  '}
              <span className="text-xl font-bold text-gray-500 dark:text-gray-200">
                {' '}
                $
                {
                  (grandTotalCost as number)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                }{' '}
                USD
              </span>{' '}
            </>
          )}

          {/* IF DESTINATION COUNTRY NIGERIA, SHOW VALUE IN NAIRA */}
          {destinationCountry == 'Nigeria' && (
            <>
              {'  |  '}
              <span className="text-xl font-bold text-gray-500 dark:text-gray-200">
                {' '}
                ₦
                {
                  ((grandTotalCost as number) * exNairaToDollar)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                }{' '}
                Naira
              </span>{' '}
            </>
          )}

          {/* GRAND TOTAL */}
        </div>
      </div>
      <div className="flex flex-col gap-4 border-slate-200 p-[25px] dark:border">
        {/* SERVICE & VAT CHARGE */}
        <p>
          {serviceCharge}% Service Charge of{' '}
          <span className="font-semibold text-slate-600 dark:text-slate-500">
            $
            {
              ((serviceChargeValue as number) / 1)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
            }{' '}
            USD
          </span>{' '}
          inclusive.<span></span>
        </p>

        <p>
          {vat}% VAT of{' '}
          <span className="font-semibold text-slate-600 dark:text-slate-500">
            $
            {
              (vatValue as number)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
            }{' '}
            USD
          </span>{' '}
          inclusive.
        </p>

        {/* EXCHANGE RATE FOR USD | YUAN */}
        {currencyType == 'CNY' && (
          <p>
            Exchange Rate (USD | Yuan):
            <span className="font-semibold text-slate-600 dark:text-slate-500">
              {' '}
              $1 USD{' '}
            </span>
            <span className="font-semibold text-slate-600 dark:text-slate-500">
              {' '}
              = ¥{exYuanToDollar} Yuan
            </span>
          </p>
        )}

        {/* EXCHANGE RATE FOR YUAN | NAIRA */}
        {currencyType == 'CNY' && destinationCountry == 'Nigeria' && (
          <p>
            Exchange Rate (Yuan | Naira):
            <span className="font-semibold text-slate-600 dark:text-slate-500">
              {' '}
              ¥1 Yuan{' '}
            </span>
            <span className="font-semibold text-slate-600 dark:text-slate-500">
              {' '}
              = ₦240 Naira
            </span>
          </p>
        )}

        {/* EXCHANGE RATE FOR USD | NAIRA */}
        {destinationCountry == 'Nigeria' && (
          <p>
            Exchange Rate (USD | Naira):
            <span className="font-semibold text-slate-600 dark:text-slate-500">
              {' '}
              $1 USD{' '}
            </span>
            <span className="font-semibold text-slate-600 dark:text-slate-500">
              {' '}
              = ₦{exNairaToDollar} Naira
            </span>
          </p>
        )}
      </div>
      {status == 'saved' && (
        <>
          <div className="flex flex-col justify-between border border-slate-200 p-[25px] max-xl:gap-4 xl:flex-row xl:items-center">
            <div className="flex flex-col items-center text-base text-slate-800 dark:text-slate-200 max-md:items-start max-md:gap-3 lg:items-start">
              <div className="pb-3">
                Agree to{' '}
                <Link href="/terms-and-conditions">
                  <span className="pb-5 text-indigo-800">
                    Terms & Condition
                  </span>
                </Link>
              </div>
              <div className="flex text-sm text-slate-800 dark:text-slate-400 max-md:items-start max-md:gap-3 md:text-center lg:items-center lg:gap-2">
                {/* <Checkbox  /> */}
                <input
                  type="checkbox"
                  checked={isDisabled}
                  onChange={(e) => setIsDisabled(e.target.checked)}
                  className="h-4 w-4"
                />
                You must agree to our Terms & Conditions before proceeding
              </div>
              <br />
              <div className="dark:text-yellow-200d text-sm text-blue-800">
                Please note that card payment cannot exceed $1,000 USD or
                N500,000 Naira
              </div>
              <br />
            </div>

            <div className="flex flex-col gap-[15px] lg:flex-row">
              {/* <Button className="flex items-center gap-2 bg-slate-400">
              <Image
                loading="lazy"
                src="/icons/bank.svg"
                alt="Logo"
                width={20}
                height={20}
                className="items-center self-center"
              />
              Payment via Flutterwave
            </Button> */}

              {/* *********************************************************************************************************** */}
              <button
                className={
                  isDisabled
                    ? 'flex items-center gap-2 rounded-2xl bg-indigo-800 pb-2 pl-5 pr-5 pt-2 hover:bg-indigo-700'
                    : 'flex items-center gap-2 rounded-2xl bg-slate-400 pb-2 pl-5 pr-5 pt-2 hover:bg-slate-500'
                }
                //className="flex items-center gap-2 rounded-2xl bg-slate-400 pb-2 pl-5 pr-5 pt-2 hover:bg-slate-500"
                onClick={() => {
                  if (grandTotalCost >= 500000) {
                    alert(
                      'Card Payment cannot exceed N500,000. Please make use of the Bank Payment instead.',
                    );
                  } else {
                    let pidPayment = 'PAY' + new Date().getTime().toString();
                    handleFlutterPayment({
                      callback: async (response) => {
                        //console.log(response);
                        const pidPaymentx = pidPayment;
                        const pidUserx = user?.pidUser;
                        const payerNamex = user?.name;
                        const amountx = response.amount;
                        const paymentTypex = 'CARD';
                        const currenctyx = response.currency;
                        const customerx = response.customer;
                        const flwRefx = response.flw_ref;
                        const statusx = response.status;
                        const trxIDx = response.transaction_id;
                        const trxRefx = response.tx_ref;
                        const serviceIDx = pidOrder;
                        const serviceDescriptionx = 'Procurement and Shipping';
                        const emailx = response.customer.email;
                        const namex = response.customer.name;
                        const phonex = response.customer.phonenumber;
                        //closePaymentModal(); // this will close the modal programmatically

                        //MAKE REQUEST ATTEMPT
                        try {
                          //MAKE REQUEST
                          const res = await fetch(
                            '/api/flutterwave/procurement',
                            {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                pidPaymentx,
                                pidUserx,
                                payerNamex,
                                emailx,
                                serviceIDx,
                                serviceDescriptionx,
                                amountx,
                                paymentTypex,
                                currenctyx,
                                customerx,
                                flwRefx,
                                trxIDx,
                                statusx,
                                trxRefx,
                              }),
                            },
                          );

                          const data: ApiResponse = await res.json();

                          if (data.responsex.status == 'SUCCESS') {
                            //openModal();
                            //toast.success(data.responsex.message);
                            //router.push('/dashboard');
                          }
                        } catch (error: any) {
                          console.log(error.message);
                        } finally {
                          //setLoading(false);
                        }
                      },

                      onClose: () => {
                        alert('Flutter Payment was not successful');
                      },
                    }); //end of flutterwave function
                  }
                }}
                disabled={!isDisabled}
              >
                <Image
                  loading="lazy"
                  src="/icons/bank.svg"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="items-center self-center"
                />
                Payment via Flutterwave
              </button>
              {/* *********************************************************************************************************** */}

              <Button
                className={
                  isDisabled
                    ? 'flex items-center gap-2 rounded-2xl bg-indigo-800 pb-2 pl-5 pr-5 pt-2 hover:bg-indigo-700'
                    : 'flex items-center gap-2 rounded-2xl bg-slate-400 pb-2 pl-5 pr-5 pt-2 hover:bg-slate-500'
                }
                onClick={() => {
                  router.push(
                    '/dashboard/bank-payment/?service=procurement&amount=' +
                      grandTotalCost +
                      '&currencyType=' +
                      currencyType +
                      '&destinationCountry=' +
                      destinationCountry +
                      '&serviceID=' +
                      pidOrder +
                      '&serviceDescription=Pay for General Procurement Service',
                  );
                }}
                disabled={!isDisabled}
              >
                <Image
                  loading="lazy"
                  src="/icons/bank.svg"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="items-center self-center"
                />
                Bank Deposit & Int’t Payments
              </Button>
            </div>
          </div>
        </>
      )}

      {status2 == 'pending' && (
        <div className="grid flex-col gap-[15px] p-5 lg:flex-row">
          <div className="flex flex-col gap-[15px] p-5 lg:flex-row">
            {/* <Checkbox  /> */}
            <input
              id="checkbox2"
              type="checkbox"
              checked={isDisabled2}
              onChange={(e) => setIsDisabled2(e.target.checked)}
              className="h-4 w-4"
            />
            Confirm your actions before proceeding
          </div>

          <Button
            type="button"
            className={
              isDisabled2
                ? 'flex items-center gap-2 rounded-2xl bg-indigo-800 pb-2 pl-5 pr-5 pt-2 hover:bg-indigo-700'
                : 'flex items-center gap-2 rounded-2xl bg-slate-400 pb-2 pl-5 pr-5 pt-2 hover:bg-slate-500'
            }
            onClick={() => cancelOrder()}
            disabled={!isDisabled2}
          >
            Cancel Order
          </Button>
        </div>
      )}

      {status == 'saved' && (
        <div className="flex flex-col justify-between gap-2 border border-slate-200 p-[25px] xl:flex-row xl:items-center">
          <div className="flex flex-col gap-3">
            <div>Your order is Comprehensively Insured.</div>
            <div className="flex">
              <Image
                alt="secure"
                src="/images/secure.png"
                width={300}
                height={100}
                quality={100}
              />
            </div>
          </div>
          <div className="relative flex h-20 justify-end rounded-[14px] border border-dashed border-indigo-800 bg-slate-100 lg:w-[581px]">
            <div className="flex w-full items-center">
              <Image
                loading="lazy"
                src="/icons/cupon.svg"
                alt="Logo"
                width={20}
                height={20}
                className="absolute ml-8"
              />
              <Input
                className="m-[10px] h-[60px] rounded-[10px] bg-white pl-16 max-lg:w-full max-md:pl-12 lg:w-[561px]"
                placeholder="Enter coupon code"
              />
            </div>
            <Button type="submit" className="absolute m-5">
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoreOrders;
function navigateWithAlert(arg0: string, arg1: string, arg2: string) {
  throw new Error('Function not implemented.');
}
