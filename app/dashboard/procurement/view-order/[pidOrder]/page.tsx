'use client';

import React, { useEffect, useRef, useState } from 'react';

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
import { useAuth } from '@/app/context/AuthContext';
import { MdViewWeek } from 'react-icons/md';
import { MdDeleteForever } from 'react-icons/md';
import { RiListView } from 'react-icons/ri';
import { toast } from 'sonner';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import FlutterwavePaymentButton from '@/components/FlutterwavePaymentButton';

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
  const path = usePathname();

  //LOADERS FOR ORDERS AND PRODUCTS LOADING
  if (!products) return <Loader />;
  if (products.length === 0) {
    return (
      <div className="m-7 flex border-spacing-1 items-center justify-center p-7 font-bold">
        <div className="rounded border-2 border-dotted border-gray-500 p-4">
          <p className="text-center text-gray-500">No products available</p>
        </div>
      </div>
    ); //CHECK IF RECORD IS EMPBY
  }

  // FETCH CART ITEMS
  //  async function fetchProducts()

  //  {
  //   try {
  //     // Pull Records from database
  //     const res = await fetch(`/api/show-cart-items?userCartId=${userCartId}`);
  //     //const res = await fetch(`/api/show-cart-items?userCartId=${userCartId}`);
  //     const data = await res.json();
  //     //setCartItems(data);
  //   }
  //   catch (error) {
  //     console.error('Error fetching data:', error);
  //     // Handle the error appropriately (e.g., display an error message)
  //   }
  //   finally {
  //     setLoading(false); // Set loading to false when done
  //   }
  // }

  const searchParams = useSearchParams();
  // const status = searchParams.get('statusx');
  const [param1, setParam1] = useState(
    searchParams.get('statusx') || '',
  ) as any;
  //get url from www.example.com/products/param1 (Where App Route is "App/products/[id]/page.tsx")
  const params = useParams<{ statusx: string }>(); //id is from [id]
  const status = params.statusx;
  const status2 = params.statusx;

  const [loading, setLoading] = useState(false);

  //REPLACE NULL VALUES WITH ZERO
  function replaceNullWithZero<T>(value: T | null): T | number {
    return value === null ? 0 : value;
  }

  //TOTAL SUM OF PRODUCTS IN CART
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabled2, setIsDisabled2] = useState(false);
  const [getAllProducts, setGetAllProducts] = useState<ProductData[]>([]);
  const [pidOrder, setPidOrder] = useState<string>(products[0].pidOrder);
  const [productsTotalPrice, setProductsTotalPrice] = useState<number>(0);
  const [productsTotalCount, setProductsTotalCount] = useState<number>(0);
  const [currencyType, setCurrencyType] = useState<string>('');
  const [destinationCountry, setDestinationCountry] = useState<string>('');
  const [productsTotalWeight, setProductsTotalWeight] = useState<number>(0);
  const [productsStatus, setProductsStatus] = useState<string>('');

  //SHIPPING PAYMENT PLAN CHARGES
  const [normalCargoShipping, setNormalCargoShipping] = useState<number>(10); //$10 per kg
  const [expressShipping, setExpressShipping] = useState<number>(15); //$15 per kg
  const [seaFreightShipping, setSeaFreightShipping] = useState<number>(11); //$11 per kg
  const [airFreight, setAirFreight] = useState<number>(15); //N500,000/CBM (FOR ONLY NIGERIAN BOUND SHIPPING)

  const [shippingType, setShippingType] = useState<string>('NORMAL_AIR_CARGO');

  //SHIPPING DETAILS
  const [shippingRate, setShippingRate] = useState<number>(10.5); //10.5 usd per kg
  const [internationalShippingCost, setInternationalShippingCost] =
    useState<number>(productsTotalWeight * shippingRate);
  const [domesticShippingCost, setDomesticShippingCost] = useState<number>(10); //10 usd
  const [estimatedShippingCost, setEstimatedShippingCost] = useState<number>(
    internationalShippingCost + domesticShippingCost,
  );

  // alert(internationalShippingCost);
  // alert(productsTotalWeight+'---'+shippingRate);

  //PRDUCTS TOTAL COST
  const [productsTotalPriceCNY, setProductsTotalPriceCNY] = useState<number>(0);
  const [productsTotalPriceUSD, setProductsTotalPriceUSD] = useState<number>(0);
  const [productsTotalPriceNAIRA, setProductsTotalPriceNAIRA] =
    useState<number>(0);

  //SERVICE CHARGE & VAT
  const [serviceChargeCNY, setServiceChargeCNY] = useState<number>(
    0.15 * productsTotalPriceCNY,
  ); //15% of total usd per kg
  const [vatValueCNY, setVatValueCNY] = useState<number>(
    0.75 * serviceChargeCNY,
  ); // 7.5 % of service charge per kg

  const [serviceChargeUSD, setServiceChargeUSD] = useState<number>(
    0.15 * productsTotalPriceUSD,
  ); //15% of total usd per kg
  const [vatValueUSD, setVatValueUSD] = useState<number>(
    0.75 * serviceChargeUSD,
  ); // 7.5 % of service charge per kg

  const [serviceChargeNAIRA, setServiceChargeNAIRA] = useState<number>(
    0.15 * productsTotalPriceNAIRA,
  ); //15% of total usd per kg
  const [vatValueNAIRA, setVatValueNAIRA] = useState<number>(
    0.75 * serviceChargeNAIRA,
  ); // 7.5 % of service charge per kg

  //PRODUCTS GRAND TOTAL COST
  const [productsGrandTotalPriceCNY, setProductsGrandTotalPriceCNY] =
    useState<number>(productsTotalPriceCNY);
  const [productsGrandTotalPriceUSD, setProductsGrandTotalPriceUSD] =
    useState<number>(productsTotalPriceUSD);
  const [productsGrandTotalPriceNAIRA, setProductsGrandTotalPriceNAIRA] =
    useState<number>(productsTotalPriceNAIRA);

  // GET ALL PRODUCTS OF THIS ORDER
  async function getProducts() {
    try {
      setLoading(true);
      // Pull Records from database
      const res = await fetch(
        `/api/get-data/procurement-product-data?pidOrder=${pidOrder}`,
      );

      const data = await res.json();
      setGetAllProducts(data.productsGetAll);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error appropriately (e.g., display an error message)
    } finally {
      setLoading(false); // Set loading to false when done
    }
  }

  //TABLE RECORDS LOAD FUNCTION
  async function fetchProcuremetnProductData() {
    if (!products) return <Loader />;
    const res = await fetch(
      `/api/get-data/procurement-product-data?pidOrder=${pidOrder}`,
    );

    const data = await res.json();

    const totalPrice = replaceNullWithZero(data.productsTotalPrice);
    const totalCount = replaceNullWithZero(data.productsTotalCount);

    setProductsTotalPrice(totalPrice);
    setProductsTotalCount(totalCount);
    setCurrencyType(data.currencyType);
    setDestinationCountry(data.destinationCountry);
    setProductsTotalWeight(data.productsTotalWeight);
    setInternationalShippingCost(data.productsTotalWeight * shippingRate);
    setEstimatedShippingCost(internationalShippingCost + domesticShippingCost);
    //alert(data.productsTotalWeight);

    //PROCESS USD DATA
    if (data.currencyType == 'USD') {
      setProductsTotalPriceUSD(totalPrice);
      setProductsTotalPriceCNY(totalPrice * 7.13);
      setProductsTotalPriceNAIRA(totalPrice * 1745);

      setServiceChargeCNY(totalPrice * 0.15);
      setServiceChargeUSD(totalPrice * 0.15);
      setServiceChargeNAIRA(totalPrice * 0.15);

      setVatValueCNY(0.075 * serviceChargeCNY);
      setVatValueUSD(0.075 * serviceChargeUSD);
      setVatValueNAIRA(0.075 * serviceChargeNAIRA);

      setProductsGrandTotalPriceUSD(
        totalPrice + serviceChargeUSD + vatValueUSD + estimatedShippingCost,
      );

      //alert(totalPrice+'--'+serviceChargeUSD+'--'+vatValueUSD)
      setProductsGrandTotalPriceCNY(
        totalPrice * 7.13 +
          serviceChargeCNY * 7.13 +
          vatValueCNY * 7.13 +
          estimatedShippingCost * 7.13,
      );

      setProductsGrandTotalPriceNAIRA(
        totalPrice * 1745 +
          serviceChargeNAIRA * 1745 +
          vatValueNAIRA * 1745 +
          estimatedShippingCost * 1745,
      );

      const normalCargoShippingX = 10; //$10 per kg
      const expressShippingX = 15; //$15 per kg
      const seaFreightShippingX = 11; //$11 per kg
      const airFreightX = 10; //N500,000/CBM  (FOR ONLY NIGERIAN BOUND SHIPPING)

      setNormalCargoShipping(normalCargoShippingX);
      setExpressShipping(expressShippingX);
      setSeaFreightShipping(seaFreightShippingX);
      setAirFreight(airFreightX);
    }

    //PROCESS CNY DATA
    if (data.currencyType == 'CNY') {
      setProductsTotalPriceCNY(totalPrice);
      setProductsTotalPriceUSD(totalPrice * 0.14);
      setProductsTotalPriceNAIRA(totalPrice * 240);

      setServiceChargeCNY(totalPrice * 0.15);
      setServiceChargeUSD(totalPrice * 0.15);
      setServiceChargeNAIRA(totalPrice * 0.15);

      setVatValueCNY(0.075 * serviceChargeCNY);
      setVatValueUSD(0.075 * serviceChargeUSD);
      setVatValueNAIRA(0.075 * serviceChargeNAIRA);

      setProductsGrandTotalPriceCNY(
        totalPrice + serviceChargeCNY + vatValueCNY + estimatedShippingCost,
      );

      setProductsGrandTotalPriceUSD(
        totalPrice * 0.14 +
          vatValueUSD * 0.14 +
          vatValueUSD * 0.14 +
          estimatedShippingCost * 0.14,
      );

      setProductsGrandTotalPriceNAIRA(
        totalPrice * 240 +
          serviceChargeNAIRA * 240 +
          vatValueNAIRA * 240 +
          estimatedShippingCost * 1745,
      );

      const normalCargoShippingX = 10; //$10 per kg
      const expressShippingX = 15; //$15 per kg
      const seaFreightShippingX = 11; //$11 per kg
      const airFreightX = 10; //N500,000/CBM  (FOR ONLY NIGERIAN BOUND SHIPPING)

      setNormalCargoShipping(normalCargoShippingX);
      setExpressShipping(expressShippingX);
      setSeaFreightShipping(seaFreightShippingX);
      setAirFreight(airFreightX);
    }

    if (productsTotalCount === 0) {
      setProductsStatus('Cart is empty!');
    }
  }

  //FETCH PRODUCT DATA TOTAL COST & TOTAL WEIGHT
  useEffect(() => {
    fetchProcuremetnProductData();
    getProducts();
  }, []);

  // PAYABLE AMOUNT TO BE CHARGED BY PAYMENT PROCESSOR
  const payableAmount =
    currencyType === 'CNY'
      ? productsGrandTotalPriceCNY
      : currencyType === 'USD'
        ? productsGrandTotalPriceUSD
        : 0;

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

      // if (data.responsex.status == 'SUCCESS') {
      //   navigateWithAlert(
      //     '/dashboard/special-sourcing/pending',
      //     'success',
      //     'Request has been deleted!',
      //   );
      // }
      if (data.responsex.status == 'SUCCESS') {
        toast.success(data.responsex.message);
        getProducts();
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
    <div className="flex flex-col bg-white dark:bg-black">
      <div className="flex flex-row items-center justify-between p-[25px] max-md:flex-col max-md:items-start max-md:gap-3">
        <div className="text-center text-xl font-bold text-slate-800 dark:text-slate-200">
          {/* {products.length} Products */}
        </div>
      </div>

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
                  {status == 'saved' && (
                    <>
                      <th className="px-6 py-3 text-left">Action</th>
                    </>
                  )}
                </tr>
              </thead>

              <tbody className="text-sm font-light text-gray-600">
                {/** LOOP RECORDS STARTS */}
                {getAllProducts.map((datax: any, index) => {
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
            ZZZZTotal Cost of Order:
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
                      (productsTotalPriceUSD as number)
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
                      (productsTotalPriceCNY as number)
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
                        (productsTotalPriceUSD as number)
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
                    (productsTotalPriceNAIRA as number)
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
          <div className="flex gap-4 text-base text-slate-600 dark:text-white">
            <span className="font-semibold">
              $
              <b>
                {
                  (estimatedShippingCost as number)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                }
              </b>{' '}
              USD
            </span>
            {/* or{' '}
            <span className="font-semibold">₦1,870.00 Naira</span> */}
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
        <div className="flex max-md:justify-between md:gap-20">
          <p className="md:w-64">Estimated Total Weight of Order:</p>{' '}
          <p>
            {
              (productsTotalWeight as number)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
            }
            {' Kg'}
          </p>
        </div>

        {/* SHIPPING DETAILS 1 */}
        {shippingType == 'NORMAL_AIR_CARGO' && (
          <>
            <div className="flex max-md:justify-between md:gap-20">
              <p className="md:w-64"> Shipping Type:</p>
              <p>Normal Air Cargo</p>
            </div>
            <div className="flex max-md:justify-between md:gap-20">
              <p className="md:w-64"> Rate:</p>
              <p>${normalCargoShipping} (per Kg)</p>
            </div>
          </>
        )}

        {/* SHIPPING DETAILS 2 */}
        {shippingType == 'EXPRESS_AIR_CARGO' && (
          <>
            <div className="flex max-md:justify-between md:gap-20">
              <p className="md:w-64"> Shipping Type:</p>
              <p>Express Air Cargo</p>
            </div>
            <div className="flex max-md:justify-between md:gap-20">
              <p className="md:w-64"> Rate:</p>
              <p>${expressShipping} (per Kg)</p>
            </div>
          </>
        )}

        {/* SHIPPING DETAILS 3 */}
        {shippingType == 'SPECIAL_AIR_CARGO' && (
          <>
            <div className="flex max-md:justify-between md:gap-20">
              <p className="md:w-64"> Shipping Type:</p>
              <p>Special Air Cargo</p>
            </div>
            <div className="flex max-md:justify-between md:gap-20">
              <p className="md:w-64"> Rate:</p>
              <p>${seaFreightShipping} (per Kg)</p>
            </div>
          </>
        )}

        {/* SHIPPING DETAILS 4 */}
        {shippingType == 'SEA_SHIPPING' && (
          <>
            <div className="flex max-md:justify-between md:gap-20">
              <p className="md:w-64"> Shipping Type:</p>
              <p>Sea Shipping</p>
            </div>
            <div className="flex max-md:justify-between md:gap-20">
              <p className="md:w-64"> Rate:</p>
              <p>${airFreight} (N500,000/CBM)</p>
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
                  (productsGrandTotalPriceUSD as number)
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
                  (productsGrandTotalPriceCNY as number)
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
                  (productsGrandTotalPriceUSD as number)
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
                  (productsGrandTotalPriceNAIRA as number)
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
          15% Service Charge of{' '}
          <span className="font-semibold text-slate-600 dark:text-slate-500">
            $
            {
              (serviceChargeUSD as number)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
            }{' '}
            USD
          </span>{' '}
          inclusive.<span></span>
        </p>

        <p>
          7.5% VAT of{' '}
          <span className="font-semibold text-slate-600 dark:text-slate-500">
            $
            {
              (vatValueUSD as number)
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
              = ¥7.13 Yuan
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
              = ₦1,745 Naira
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
              {/* <button
                className={
                  isDisabled
                    ? 'flex items-center gap-2 rounded-2xl bg-indigo-800 pb-2 pl-5 pr-5 pt-2 hover:bg-indigo-700'
                    : 'flex items-center gap-2 rounded-2xl bg-slate-400 pb-2 pl-5 pr-5 pt-2 hover:bg-slate-500'
                }
                //className="flex items-center gap-2 rounded-2xl bg-slate-400 pb-2 pl-5 pr-5 pt-2 hover:bg-slate-500"
                onClick={() => {
                  if (productsGrandTotalPriceNAIRA >= 500000) {
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
                        const phonex = response.customer.phone_number;
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
              </button> */}
              {/* *********************************************************************************************************** */}

              {/* *********************************************************************************************************** */}

              <FlutterwavePaymentButton
                amount={10}
                email={user?.userEmail as string}
                name={user?.userFirstname as string}
                phone_number={''}
                currency={currencyType}
                payment_type={'CARD'}
                consumer_id={user?.pidUser as string}
                service_id={pidOrder}
                service_name={'PROCUREMENT'}
                description={'This is General Procuremnt & Shipping Service'}
                isDisabled={isDisabled}
                className={
                  isDisabled
                    ? 'flex items-center gap-2 rounded-2xl bg-indigo-800 pb-2 pl-5 pr-5 pt-2 hover:bg-indigo-700'
                    : 'flex items-center gap-2 rounded-2xl bg-slate-400 pb-2 pl-5 pr-5 pt-2 hover:bg-slate-500'
                }
                destinationCountry={''}
              />
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
                      payableAmount +
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
