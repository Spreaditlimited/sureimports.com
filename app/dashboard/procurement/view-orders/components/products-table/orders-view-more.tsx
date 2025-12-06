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
//import { useFlutterwave } from 'flutterwave-react-v3';
import { useAuth } from '@/app/context/AuthContext';
import { MdViewWeek } from 'react-icons/md';
import { MdDeleteForever } from 'react-icons/md';
import { RiListView } from 'react-icons/ri';
import { toast } from 'sonner';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { random } from 'lodash';
import FlutterwavePaymentButton from '@/components/FlutterwavePaymentButton';
import FlutterwavePaymentButton2 from '@/components/FlutterwavePaymentButton2';

interface FlutterTypes {
  amount: number;
  currency: string;

  email: string;
  phone_number: string;
  name: string;

  payment_type: string;
  consumer_id: string;
  service_id: string;
  service_name?: string;
  description?: string;

  className?: string;
}

interface Props {
  props: FlutterTypes;
}

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

  //get url from www.example.com/products/param1 (Where App Route is "App/products/[id]/page.tsx")
  const searchParams = useSearchParams();
  const params = useParams<{ statusx: string }>(); //id is from [id]
  const status = params.statusx;
  const status2 = params.statusx;

  //ENABLE & DISABLE VARIABLES
  const [loading, setLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabled2, setIsDisabled2] = useState(false);

  //------------------------- PRODUCTS DATA FOR CALCULATIONS --------------------------//
  const [pidOrder, setPidOrder] = useState<string>(products[0]?.pidOrder || '');
  const [pidUser, setPidUser] = useState<number>(user?.pidUser as any);

  const [message, setMessage] = useState<any>('');
  const [actionType, setActionType] = useState<string>('');

  const [getAllProducts, setGetAllProducts] = useState<any[]>([]) as any;
  const [productsTotalPrice, setProductsTotalPrice] = useState<number>(0);
  const [initialTotalCost, initialTotalCostOrder] = useState<number>(0);

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

  const [actualWeightValue, setActualWeightValue] = useState<number>(0);
  const [actualDomesticShippingCostValue, setActualDomesticShippingCostValue] =
    useState<number>(0);

  const [actualWeight, setActualWeight] = useState<number>(0);
  const [actualDomesticShippingCost, setActualDomesticShippingCost] =
    useState<number>(0);

  const [actualInternationalShippingCost, setActualInternationalShippingCost] =
    useState<number>(0);
  const [actualTotalShippingCost, setActualTotalShippingCost] =
    useState<number>(0);
  const [costDifference, setCostDifference] = useState<number>(0);

  const [destinationCountry, setDestinationCountry] = useState<string>('...');

  const [shippingPlanName, setShippingPlanName] = useState<string>('...');
  const [shippingPlanRate, setShippingPlanRate] = useState<number>(0);
  const [domesticShippingCost, setDomesticShippingCost] = useState<number>(0);
  const [internationalShippingCost, setInternationalShippingCost] =
    useState<number>(0);
  const [estimatedTotalShippingCost, setEstimatedTotalShippingCost] =
    useState<number>(0);

  const [grandTotalCost, setGrandTotalCost] = useState<number>(0);
  const [onHoldDifference, setOnHoldDifference] = useState<number>(0);

  //================OTHER VALUES===============//
  const [amountNaira, setAmountNaira] = useState<number>(0);
  const [amountNairaDifference, setAmountNairaDifference] = useState<number>(0);

  const [amountPounds, setAmountPounds] = useState<number>(0);

  //REPLACE NULL VALUES WITH ZERO
  function replaceNullWithZero<T>(value: T | null): T | number {
    return value === null ? 0 : value;
  }

  //COMPUTE ON-HOLD DIFFERENCE AFTER ORDER IS EDITIED
  //const onHoldDifference = grandTotalCost - initialTotalCost;

  //------------------------- GET ALL PRODUCTS DATA & CALCULATIONS FUNCTION --------------------------//
  async function getProductsDetails() {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/get-data/procurement-product-data?pidOrder=${pidOrder}`,
        { cache: 'no-store' },
      );

      if (!res.ok) {
        //throw new Error('Failed to fetch data');
        return <div>No Records</div>;
      }

      const data = await res.json();

      // Check if data.productsGetAll is empty or not
      if (data.productsGetAll && data.productsGetAll.length > 0) {
        //alert(JSON.stringify(data.productsGetAll));
        setGetAllProducts(data.productsGetAll) as any;
        setProductsTotalPrice(replaceNullWithZero(data.productsTotalPrice));
        initialTotalCostOrder(replaceNullWithZero(data.initialTotalCost));

        setProductsTotalCount(replaceNullWithZero(data.productsTotalCount));
        setProductsTotalWeight(replaceNullWithZero(data.productsTotalWeight));

        setActualWeightValue(replaceNullWithZero(data.actualWeight));
        setActualDomesticShippingCostValue(
          replaceNullWithZero(data.actualDomesticShippingCost),
        );
        setActualInternationalShippingCost(
          replaceNullWithZero(data.actualInternationalShippingCost),
        );
        setActualTotalShippingCost(
          replaceNullWithZero(data.actualTotalShippingCost),
        );

        setCostDifference(replaceNullWithZero(data.costDifference));

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

        setAmountNaira(
          replaceNullWithZero(data.grandTotalCost) *
            replaceNullWithZero(data.exNairaToDollar),
        );

        setAmountNairaDifference(
          replaceNullWithZero(data.onHoldDifference) *
            replaceNullWithZero(data.exNairaToDollar),
        );

        setAmountPounds(replaceNullWithZero(data.grandTotalCost) * 0.8);

        setGrandTotalCost(replaceNullWithZero(data.grandTotalCost));
        setOnHoldDifference(replaceNullWithZero(data.onHoldDifference));
      } else {
        // Set to an empty array if no records are found
        setGetAllProducts([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error appropriately (e.g., display an error message)
    } finally {
      setLoading(false); // Set loading to false when done
    }
  }

  //------------------------- RUN THE GET PRODUCT DETAILS FUNCTION --------------------------//
  useEffect(() => {
    getProductsDetails();
  }, []);

  //------------------------- PRODUCT DELETE FUNCTION --------------------------//
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

  //------------------------- UPDATE ORDER STATUS PROCESSING FUNCTION --------------------------//
  const updateOrder = async () => {
    try {
      toast.info('Processing . . .');
      return;

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

  //------------------------- PRODUCT CANCEL FUNCTION --------------------------//
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

  //////////////////////////// PDF GENERATOR START ////////////////////////////
  const contentRef = useRef<HTMLDivElement>(null);
  const generatePDF = async () => {
    if (!contentRef.current) return;

    const canvas = await html2canvas(contentRef.current, {
      scale: 2,
      useCORS: true,
      logging: true,
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(canvas, 'PNG', 0, 0, pageWidth, pageHeight);
    pdf.save('exported-content.pdf');
  };
  //////////////////////////// PDF GENERATOR END ////////////////////////////

  //RETURN ORDERS ON-HOLD WITHOUT ANY ACTION (FOR ZERO COST ORDERS EITHER ADDITIONAL PAYMENT OR REFUND)
  //ORDER IS MOVED TO PENDING ORDERS FOR ADMIN PROCESSING
  const returnOrderNoAction = async () => {
    //event.preventDefault();
    toast.info('Returning Order . . .');

    try {
      const res = await fetch(
        `/api/status-processing/procurement-onhold-orders/return-order?pidUser=${user?.pidUser}&pidOrder=${pidOrder}`,
      );

      // GET & PROCESS RESPONSE FROM API
      const data: any = await res.json();

      if (data.statusx == 'SUCCESS') {
        toast.success(data.message);
        router.push('/dashboard/procurement/view-orders/pending');
        // navigateWithAlert(
        //   '/dashboard/procurement/view-orders/pending',
        //   'success',
        //   'Order has been moved back to pending for admin processing!',
        // );
      }

      if (data.statusx == 'FAILED') {
        toast.warning(data.responsex.message);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  //ORDER IS MOVED TO PENDING ORDERS FOR ADMIN PROCESSING
  const returnOrderWithRefund = async () => {
    //event.preventDefault();
    toast.info('Returning Order & Activating Refund. . .');

    try {
      const res = await fetch(
        `/api/status-processing/procurement-onhold-orders/refund-order?pidUser=${user?.pidUser}&pidOrder=${pidOrder}&refundAmount=${onHoldDifference}`,
      );

      // GET & PROCESS RESPONSE FROM API
      const data: any = await res.json();

      if (data.statusx == 'SUCCESS') {
        toast.success(data.message);
        router.push('/dashboard/procurement/view-orders/pending');
        // navigateWithAlert(
        //   '/dashboard/procurement/view-orders/pending',
        //   'success',
        //   'Order has been moved back to pending for admin processing!',
        // );
      }

      if (data.statusx == 'FAILED') {
        toast.warning(data.responsex.message);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  ///////////////////////////////// HANDLE FORM SUBMISSION /////////////////////////////////
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    toast.info('Processing . . .');
    //return;
    let pidMessage = 'MSG' + new Date().getTime().toString();
    let currentStatus = status;

    const formData = new FormData(event.currentTarget);
    formData.append('pidOrder', pidOrder);
    formData.append('pidUser', user?.pidUser as any);
    formData.append('currentStatus', currentStatus);
    formData.append('newStatus', actionType);

    formData.append('refundAmount', (actualTotalShippingCost - estimatedTotalShippingCost) as any);
    formData.append('serviceType', 'PROCUREMENT');

    //formData.append('message', message);
    //formData.append('pidMessage', pidMessage);

    //MAKE REQUEST ATTEMPT
    try {
      //MAKE REQUEST
      const res = await fetch('/api/status-processing/procurement', {
        method: 'POST',
        body: formData,
      });

      // GET & PROCESS RESPONSE FROM API
      const data: any = await res.json();

      if (data.statusx == 'SUCCESS') {
        toast.success(data.message);
        router.push('/dashboard/procurement/view-orders/' + actionType);
      }
      // if (data.statusx == 'SUCCESS') {
      //   navigateWithAlert(
      //     '/dashboard/procurement?status=' + actionType,
      //     'success',
      //     'Process update was successful, order has been moved to ' +
      //       actionType,
      //   );
      // }
      if (data.statusx == 'SUCCESS_MESSAGE') {
        navigateWithAlert(
          '/dashboard',
          'success',
          'Message has been successfuly sent to customer. ' + actionType,
        );
      }
      if (data.statusx == 'ACTION_FAILED') {
        toast.warning(data.message);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      //setLoading(false);
    }
  };

  return (
    <>
      <div
        suppressHydrationWarning
        className="flex flex-col bg-white dark:bg-black"
      >
        <Button
          className="m-7 h-[49px] rounded-xl font-normal md:px-[30px] md:py-[15px] xl:w-[162px]"
          onClick={generatePDF}
        >
          Export to PDF
        </Button>
        <small className="ml-7">
          Convert to light mode before exporting order to pdf for better content
          visibility.
        </small>

        {/* ............................... PDF PRINT SECTION STARTS ................................ */}
        <div ref={contentRef} className="export-target">
          <div className="flex flex-row items-center justify-between p-[25px] max-md:flex-col max-md:items-start max-md:gap-3">
            <div className="text-center text-xl font-bold text-slate-800 dark:text-slate-200">
              OrderID: {pidOrder}
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
                        Unit Price ({currencyType})
                      </th>
                      <th className="px-6 py-3 text-left">Quantity</th>
                      <th className="px-6 py-3 text-left">Unit Weight</th>
                      <th className="px-6 py-3 text-left">Total Price</th>
                      {['saved', 'on-hold'].includes(status) && (
                        <>
                          <th className="px-6 py-3 text-left">Action</th>
                        </>
                      )}
                    </tr>
                  </thead>

                  <tbody key={1} className="text-sm font-light text-gray-600">
                    {/** LOOP RECORDS STARTS */}

                    {getAllProducts.map((datax: any, index: number) => {
                      return (
                        <>
                          <tr
                            key={datax.id || index}
                            className="border-b border-gray-200 font-bold hover:bg-gray-100 dark:text-gray-400"
                          >
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

                            {['saved', 'on-hold'].includes(status) && (
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
                Total Cost of Products:
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
                          (
                            ((productsTotalPrice as number) / 1) *
                            exYuanToDollar
                          )
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
                            ((productsTotalPrice as number) / 1)
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
                        (((productsTotalPrice as number) / 1) * exNairaToDollar)
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




          {/* estimated cost of order (SAVED STAGE & ON HOLD STAGE) */}
          {['saved', 'on-hold'].includes(status) && (
          <div className="flex flex-col gap-4 border border-slate-200 p-[25px]">
            <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
              Estimated Shipping Cost of Order:
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-20 text-base text-slate-950 dark:text-white">
                <p className="w-72">Domestic Shipping Cost within China:</p> $
                {
                  ((domesticShippingCost as number) / 1)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                }
              </div>
              <div className="flex gap-20 text-base text-slate-950 dark:text-white">
                <p className="w-72">International Shipping Cost:</p> $
                {
                  ((internationalShippingCost as number) / 1)
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
                      ((estimatedTotalShippingCost as number) / 1)
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
                          (
                            ((estimatedTotalShippingCost as number) / 1) *
                            exNairaToDollar
                          )
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
                If this cost is higher than the actual cost which will be
                determined later at the China office, we will refund you. If the
                actual cost is higher than this estimated cost, you will be
                required to make a balance payment.
              </div>
            </div>
          </div>
          )}





        {/* estimated shipping cost of order (OTHER STAGE) */}
        {!['saved', 'on-hold'].includes(status) && (
          <div className="flex flex-col gap-4 border border-slate-200 p-[25px]">
            <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
              Estimated Shipping Cost of Order:
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-20 text-base text-slate-950 dark:text-white">
                <p className="w-72">Domestic Shipping Cost within China:</p> $
                {
                  ((domesticShippingCost as number) / 1)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                }
              </div>
              <div className="flex gap-20 text-base text-slate-950 dark:text-white">
                <p className="w-72">International Shipping Cost:</p> $
                {
                  ((estimatedTotalShippingCost - domesticShippingCost as number) / 1)
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
                      ((estimatedTotalShippingCost as number) / 1)
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
                          (
                            ((estimatedTotalShippingCost as number) / 1) *
                            exNairaToDollar
                          )
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
                If this cost is higher than the actual cost which will be
                determined later at the China office, we will refund you. If the
                actual cost is higher than this estimated cost, you will be
                required to make a balance payment.
              </div>
            </div>
          </div>
          )}




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
            {/* {currencyType == 'CNY' && destinationCountry == 'Nigeria' && (
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
            )} */}

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

          {/* //////////////////////////// GRAND TOTAL COST //////////////////////////// */}
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

              {/* IF DESTINATION COUNTRY United Kingdom, SHOW VALUE IN Pounds */}
              {destinationCountry == 'United Kingdom' && (
                <>
                  {'  |  '}
                  <span className="text-xl font-bold text-gray-500 dark:text-gray-200">
                    {' '}
                    £
                    {
                      (amountPounds as number)
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                    }{' '}
                    Pounds
                  </span>{' '}
                </>
              )}

              {/* EXTRA CHARGES */}
            </div>
          </div>

          {/* //////////////////////////// ON-HOLD ADDITIONAL COST //////////////////////////// */}
          {status2 == 'on-hold' && onHoldDifference > 0 && (
            <div className="flex items-center gap-4 border border-slate-200 p-[25px]">
              <p className="text-base font-bold text-red-600 md:pr-[84px]">
                Additional cost to Pay:
              </p>

              <div>
                {/* GRAND TOTAL */}

                {/* IF IN YAUN DOLLAR VALUE */}
                {currencyType == 'USD' && (
                  <>
                    <span className="text-base font-bold dark:text-blue-400">
                      {' '}
                      $
                      {
                        onHoldDifference
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                      }{' '}
                      USD
                    </span>
                  </>
                )}

                {/* IF IN YAUN DOLLAR VALUE */}
                {currencyType == 'CNY' && (
                  <>
                    <span className="text-base font-bold dark:text-blue-400">
                      {' '}
                      ¥
                      {
                        (((onHoldDifference as number) / 1) * exYuanToDollar)
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                      }{' '}
                      Yuan
                    </span>{' '}
                    {'  |  '}
                    <span className="text-base font-bold text-gray-500 dark:text-gray-200">
                      {' '}
                      $
                      {
                        ((onHoldDifference as number) / 1)
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
                    <span className="text-base font-bold text-gray-500 dark:text-gray-200">
                      {' '}
                      ₦
                      {
                        (((onHoldDifference as number) / 1) * exNairaToDollar)
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                      }{' '}
                      Naira
                    </span>{' '}
                  </>
                )}

                {/* IF DESTINATION COUNTRY United Kingdom, SHOW VALUE IN Pounds */}
                {destinationCountry == 'United Kingdom' && (
                  <>
                    {'  |  '}
                    <span className="text-base font-bold text-gray-500 dark:text-gray-200">
                      {' '}
                      £
                      {
                        ((onHoldDifference as number) / 1)
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                      }{' '}
                      Pounds
                    </span>{' '}
                  </>
                )}

                {/* EXTRA CHARGES */}
              </div>
            </div>
          )}

          {/* //////////////////////////// ON-HOLD ADDITIONAL REFUND //////////////////////////// */}
          {onHoldDifference < 0 && (
            <div className="flex items-center gap-4 border border-slate-200 p-[25px]">
              <p className="text-base font-bold text-green-600 md:pr-[84px]">
                Refund Amount:
              </p>
              <div>
                {/* GRAND TOTAL */}

                {/* IF IN YAUN DOLLAR VALUE */}
                {currencyType == 'USD' && (
                  <>
                    <span className="text-base font-bold dark:text-blue-400">
                      {' '}
                      $
                      {
                        (onHoldDifference * -1)
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                      }{' '}
                      USD
                    </span>
                  </>
                )}

                {/* IF IN YAUN DOLLAR VALUE */}
                {currencyType == 'CNY' && (
                  <>
                    <span className="text-base font-bold dark:text-blue-400">
                      {' '}
                      ¥
                      {
                        (
                          (((onHoldDifference * -1) as number) / 1) *
                          exYuanToDollar
                        )
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                      }{' '}
                      Yuan
                    </span>{' '}
                    {'  |  '}
                    <span className="text-base font-bold text-gray-500 dark:text-gray-200">
                      {' '}
                      $
                      {
                        (((onHoldDifference * -1) as number) / 1)
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
                    <span className="text-base font-bold text-gray-500 dark:text-gray-200">
                      {' '}
                      ₦
                      {
                        (
                          (((onHoldDifference * -1) as number) / 1) *
                          exNairaToDollar
                        )
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                      }{' '}
                      Naira
                    </span>{' '}
                  </>
                )}

                {/* IF DESTINATION COUNTRY United Kingdom, SHOW VALUE IN Pounds */}
                {destinationCountry == 'United Kingdom' && (
                  <>
                    {'  |  '}
                    <span className="text-base font-bold text-gray-500 dark:text-gray-200">
                      {' '}
                      £
                      {
                        (((onHoldDifference * -1) as number) / 1)
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                      }{' '}
                      Pounds
                    </span>{' '}
                  </>
                )}

                {/* EXTRA CHARGES */}
              </div>
            </div>
          )}
          {/* ---------------------------- on-hols ENDS -------------------------------- */}

          {/* /////////////////////// PAY FOR SHIPPING ACTUAL DETAILS /////////////////////// */}
          {status == 'pay-for-shipping' && (
            <div className="flex flex-col gap-4 border border-slate-200 p-[25px]">
              <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                Actual Shipping Cost of Order Details:
              </div>
              <br />
              <div className="flex flex-col gap-3">
                <div className="flex gap-20 text-base text-slate-950 dark:text-white">
                  <p className="w-72">Actual (Real) Weight of Order:</p> $
                  {
                    ((actualWeightValue as number) / 1)
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                  }{' '}
                  &nbsp; Kg
                </div>

                <div className="flex gap-20 text-base text-slate-950 dark:text-white">
                  <p className="w-72">Selected Shipping Plan Rate:</p>$
                  {
                    ((shippingPlanRate as number) / 1)
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                  }{' '}
                  / Kg
                </div>

                <hr />

                <div className="flex gap-20 text-base text-slate-950 dark:text-white">
                  <p className="w-72">
                    Actual Domestic Shipping Cost within China:
                  </p>{' '}
                  $
                  {
                    ((actualDomesticShippingCostValue as number) / 1)
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                  }{' '}
                  USD
                </div>

                <div className="flex gap-20 text-base text-slate-950 dark:text-white">
                  <p className="w-72">Actual International Shipping Cost:</p>$
                  {
                    ((actualInternationalShippingCost as number) / 1)
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                  }{' '}
                  USD
                </div>

                <hr />

                <div className="flex gap-20 text-base text-slate-950 dark:text-white">
                  <p className="w-72">
                    <b>Actual Total Shipping Cost:</b>
                  </p>
                  <b>
                    $
                    {
                      ((actualTotalShippingCost as number) / 1)
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                    }{' '}
                    USD
                  </b>
                

                <span className="font-semibold">
                  {/* IF DESTINATION COUNTRY NIGERIA, SHOW VALUE IN NAIRA */}
                  {destinationCountry == 'Nigeria' && (
                    <>
                      {'  |  '}&nbsp;
                      <span className="">
                        ₦
                        {
                          (
                            ((actualTotalShippingCost as number) / 1) *
                            exNairaToDollar
                          )
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
              {/* <small>
              <div className="text-sm font-semibold text-red-400">
                Important Notice:
              </div>
              <div className="text-sm font-normal text-red-400">
                If this cost is higher than the actual cost which will be
                determined later at the China office, we will refund you. If the
                actual cost is higher than this estimated cost, you will be
                required to make a balance payment.
              </div>
            </small> */}
            </div>
          )}

          {/* /////////////////////// PAY FOR SHIPPING ACTUAL CALCULATION /////////////////////// */}
          {status == 'pay-for-shipping' && (
            <div className="flex flex-col gap-4 border border-slate-200 p-[25px]">
              <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                Sipping Refund or Balance Payment Calculation:
              </div>
              <br />
              <div className="flex flex-col gap-3">
                <div className="flex gap-20 text-base text-slate-950 dark:text-white">
                  <p className="w-72">Actual Total Shipping Cost:</p> $
                  {
                    ((actualTotalShippingCost as number) / 1)
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                  }{' '}
                  USD
                </div>

                <div className="flex gap-20 text-base text-slate-950 dark:text-white">
                  <p className="w-72">Initial Estimated Shipping Cost:</p>$
                  {
                    ((estimatedTotalShippingCost as number) / 1)
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                  }{' '}
                  USD
                </div>

                <hr />

                {(actualTotalShippingCost - estimatedTotalShippingCost) > 0 && (
                  <div className="flex gap-20 text-base text-red-700 dark:text-red-500">
                    <p className="w-72">Amount to Pay:</p>
                    <b>
                      $
                      {
                        ((actualTotalShippingCost - estimatedTotalShippingCost as number) / 1)
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                      }{' '}
                      USD
                    </b>

                <span className="font-semibold">
                  {/* IF DESTINATION COUNTRY NIGERIA, SHOW VALUE IN NAIRA */}
                  {destinationCountry == 'Nigeria' && (
                    <>
                      {'  |  '}&nbsp;
                      <span className="">
                        ₦
                        {
                          (
                            ((actualTotalShippingCost - estimatedTotalShippingCost as number) / 1) *
                            exNairaToDollar
                          )
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
                )}

                {(actualTotalShippingCost - estimatedTotalShippingCost) < 0 && (
                  <div className="flex gap-20 text-base text-green-700 dark:text-green-500">
                    <p className="w-72"> Refund Amount:</p>
                    <b>
                      $
                      {
                        ((((actualTotalShippingCost - estimatedTotalShippingCost) as number) * -1) / 1)
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                      }{' '}
                      USD
                    </b>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* ............................... PDF PRINT SECTION ENDS ................................ */}

        {/* ............................... PAYMENT SECTION FOR PAY FOR SHIPPING................................ */}
        {status == 'pay-for-shipping' && (actualTotalShippingCost - estimatedTotalShippingCost) > 0 && (
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
                {/* <div className="dark:text-yellow-200d text-sm text-blue-800">
                  Please note that card payment cannot exceed $1,000 USD or
                  N500,000 Naira
                </div>
                <br /> */}
              </div>

              <div className="flex flex-col gap-[15px] lg:flex-row">
                {/* *********************************************************************************************************** */}
                <FlutterwavePaymentButton
                  amount={(actualTotalShippingCost - estimatedTotalShippingCost)}
                  amountNaira={((actualTotalShippingCost - estimatedTotalShippingCost)) * exNairaToDollar}
                  destinationCountry={destinationCountry}
                  totalWeight={productsTotalWeight}
                  email={user?.userEmail as string}
                  name={user?.userFirstname as string}
                  phone_number={''}
                  currency={'USD'}
                  payment_type={'CARD'}
                  consumer_id={user?.pidUser as string}
                  service_id={pidOrder}
                  service_name={'PROCUREMENT'}
                  description={'This is General Procuremnt & Shipping Service'}
                  isDisabled={isDisabled}
                  className={
                    isDisabled
                      ? 'flex items-center gap-2 rounded-2xl bg-indigo-800 pb-2 pl-5 pr-5 pt-2 hover:bg-indigo-700'
                      : 'flex items-center gap-2 rounded-2xl bg-[#c9d1db] pb-2 pl-5 pr-5 pt-2 text-[#ffffff] hover:bg-[#c9d1db] dark:bg-[#555d70] dark:text-[#8b8b94]'
                  }
                />
                {/* *********************************************************************************************************** */}

                <Button
                  className={
                    isDisabled
                      ? 'flex items-center gap-2 rounded-2xl bg-indigo-800 pb-2 pl-5 pr-5 pt-2 hover:bg-indigo-700'
                      : 'flex items-center gap-2 rounded-2xl bg-slate-400 pb-2 pl-5 pr-5 pt-2 hover:bg-slate-500'
                  }
                  onClick={() => {
                    let amount = (actualTotalShippingCost - estimatedTotalShippingCost) as any;
                    let amountNairax = ((actualTotalShippingCost - estimatedTotalShippingCost) / exNairaToDollar*
                      exNairaToDollar) as any;
                    let totalWeightx = productsTotalWeight as any;
                    let destinationCountryx = destinationCountry as any;

                    //check minimum amount limit in dollars
                    // if (amount < 200 && destinationCountryx != 'Nigeria') {
                    //   alert(
                    //     'We cannot process orders of less than $200 for orders going to your destination. Please, edit your order',
                    //   );
                    //   return;
                    // }

                    //check minimum amount limit in naira
                    // if (
                    //   amountNairax < 100000 &&
                    //   destinationCountryx == 'Nigeria'
                    // ) {
                    //   alert(
                    //     'We do not process orders less than N100,000. Please, edit your order.',
                    //   );
                    //   return;
                    // }

                    //check amount limit in naira
                    if (totalWeightx < 10 && destinationCountryx != 'Nigeria') {
                      alert(
                        'We cannot ship orders with weight less than 10kg to your destination. Please, edit your order.',
                      );
                      return;
                    }

                    router.push(
                      '/dashboard/bank-payment/?service=procurement&amount=' +
                        (actualTotalShippingCost - estimatedTotalShippingCost) +
                        '&amountNaira=' +
                        (actualTotalShippingCost - estimatedTotalShippingCost) * exNairaToDollar +
                        '&currencyType=' +
                        currencyType +
                        '&exNairaToDollar=' +
                        exNairaToDollar +
                        '&destinationCountry=' +
                        destinationCountry +
                        '&status=' +
                        status +
                        '&newEstimatedTotalShippingCost=' +
                        estimatedTotalShippingCost +
                        '&newTotalAmount=' +
                        grandTotalCost +
                        '&newTotalWeight=' +
                        totalWeightx +
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
                  Direct Bank Deposit
                </Button>
              </div>
            </div>
          </>
        )}

        {/* ............................... PAYMENT SECTION FOR PAY FOR SHIPPING................................ */}
        {status == 'pay-for-shipping' && (actualTotalShippingCost - estimatedTotalShippingCost) < 0 && (
          <>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col justify-between border border-slate-200 p-[25px] max-xl:gap-4 xl:flex-row xl:items-center">
                <div className="flex flex-col items-center text-base text-slate-800 dark:text-slate-200 max-md:items-start max-md:gap-3 lg:items-start">
                  <div className="pb-3">
                    Agree to{' '}
                    <Link href="/terms-and-conditions" target="_blank">
                      <span className="pb-5 text-indigo-800">
                        Terms & Condition
                      </span>
                    </Link>
                  </div>

                  <div className="flex items-center">
                    <label className="flex cursor-pointer items-center">
                      <input
                        required
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={isDisabled}
                        onChange={(e) => setIsDisabled(e.target.checked)}
                      />
                      <span className="ml-2 text-gray-500">
                        You must agree to our Terms & Conditions before
                        proceeding
                      </span>
                    </label>
                  </div>

                  {/* Message to Admin */}

                  {/* <div>
                    <textarea
                      className="form-textarea w-full p-3 border rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      rows={3}
                      placeholder="Send Message to Buyer"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                  </div><br /> */}

                  <div className="container mx-auto px-2 py-2">
                    <div className="flex flex-col gap-6 md:flex-row">
                      {/* Left Column */}
                      {/* <div className="md:w-1/ rounded-lg p-3">
                        <p className="text-gray-400">
                          <button
                            type="submit"
                            name="action"
                            value="decline"
                            onClick={() => setActionType('on-hold')}
                            className="btn btn-dark mt-4 w-full rounded-md bg-gray-700 py-3 text-sm text-white shadow hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700"
                          >
                            DECLINE (Place On-Hold)
                          </button>
                          <small>
                            Decline Order if there are issues or if you want to
                            edit your order products.
                          </small>
                        </p>
                      </div> */}

                      {/* Right Column */}
                      <div className="md:w-3/3 rounded-lg p-3 shadow-md">
                        <p className="text-gray-400">
                          <button
                            type="submit"
                            name="action"
                            value="in-transit"
                            onClick={() => setActionType('in-transit')}
                            className="btn btn-secondary mt-4 w-full rounded-md bg-indigo-600 py-3 text-sm text-white shadow hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                          >
                            Create Refund & Move Order for Shipping
                          </button>
                          <small>
                            This action also approves this Order for Shipping
                          </small>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </>
        )}

        {/* --------------------------on-hold-------------------------- */}

        {/* RETURN TO PENDING WITHOUT ANY ACTION */}
        {status2 == 'on-hold' && onHoldDifference == 0 && (
          <div className="grid gap-[15px] p-5 lg:flex lg:flex-col">
            <div className="flex items-center gap-[15px] p-5 lg:flex-row">
              <input
                id="checkbox2"
                type="checkbox"
                checked={isDisabled2}
                onChange={(e) => setIsDisabled2(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="checkbox2" className="text-sm text-gray-700">
                Confirm your actions before proceeding
              </label>
            </div>

            <Button
              type="button"
              className={`flex items-center gap-2 rounded-2xl pb-2 pl-5 pr-5 pt-2 ${
                isDisabled2
                  ? 'bg-indigo-800 hover:bg-indigo-700'
                  : 'cursor-not-allowed bg-slate-400 hover:bg-slate-500'
              }`}
              onClick={() => returnOrderNoAction()}
              disabled={!isDisabled2}
            >
              Return Order for Processing
            </Button>
          </div>
        )}

        {/* RETURN TO PENDING WITH ADDITIONAL PAYMENT */}
        {status2 == 'on-hold' && onHoldDifference > 0 && (
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
                {/* <div className="dark:text-yellow-200d text-sm text-blue-800">
                Please note that card payment cannot exceed $1,000 USD or
                N500,000 Naira
              </div>
              <br /> */}
              </div>

              <div className="flex flex-col gap-[15px] lg:flex-row">
                {/* *********************************************************************************************************** */}
                <FlutterwavePaymentButton2
                  amount={onHoldDifference}
                  amountNaira={amountNairaDifference}
                  destinationCountry={destinationCountry}
                  totalWeight={productsTotalWeight}
                  email={user?.userEmail as string}
                  name={user?.userFirstname as string}
                  phone_number={''}
                  currency={'USD'}
                  payment_type={'CARD'}
                  consumer_id={user?.pidUser as string}
                  service_id={pidOrder}
                  service_name={'PROCUREMENT'}
                  description={'This is General Procuremnt & Shipping Service'}
                  isDisabled={isDisabled}
                  className={
                    isDisabled
                      ? 'flex items-center gap-2 rounded-2xl bg-indigo-800 pb-2 pl-5 pr-5 pt-2 hover:bg-indigo-700'
                      : 'flex items-center gap-2 rounded-2xl bg-[#c9d1db] pb-2 pl-5 pr-5 pt-2 text-[#ffffff] hover:bg-[#c9d1db] dark:bg-[#555d70] dark:text-[#8b8b94]'
                  }
                />
                {/* *********************************************************************************************************** */}

                <Button
                  className={
                    isDisabled
                      ? 'flex items-center gap-2 rounded-2xl bg-indigo-800 pb-2 pl-5 pr-5 pt-2 hover:bg-indigo-700'
                      : 'flex items-center gap-2 rounded-2xl bg-slate-400 pb-2 pl-5 pr-5 pt-2 hover:bg-slate-500 dark:bg-slate-400'
                  }
                  onClick={() => {
                    let amount = onHoldDifference as any;
                    let amountNairax = amountNaira as any;
                    let totalWeightx = productsTotalWeight as any;
                    let destinationCountryx = destinationCountry as any;

                    //check minimum amount limit in dollars
                    // if (amount < 200 && destinationCountryx != 'Nigeria') {
                    //   alert(
                    //     'We cannot process orders of less than $200 for orders going to your destination. Please, edit your order',
                    //   );
                    //   return;
                    // }

                    //check minimum amount limit in naira
                    // if (
                    //   amountNairax < 100000 &&
                    //   destinationCountryx == 'Nigeria'
                    // ) {
                    //   alert(
                    //     'We do not process orders less than N100,000. Please, edit your order.',
                    //   );
                    //   return;
                    // }

                    //check amount limit in naira
                    if (totalWeightx < 10 && destinationCountryx != 'Nigeria') {
                      alert(
                        'We cannot ship orders with weight less than 10kg to your destination. Please, edit your order.',
                      );
                      return;
                    }

                    router.push(
                      '/dashboard/bank-payment/?service=procurement&amount=' +
                        onHoldDifference +
                        '&amountNaira=' +
                        amountNaira +
                        '&currencyType=' +
                        currencyType +
                        '&exNairaToDollar=' +
                        exNairaToDollar +
                        '&destinationCountry=' +
                        destinationCountry +
                        '&status=' +
                        status +
                        '&newEstimatedTotalShippingCost=' +
                        estimatedTotalShippingCost +
                        '&newTotalAmount=' +
                        grandTotalCost +
                        '&newTotalWeight=' +
                        totalWeightx +
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
                  Direct Bank Deposit
                </Button>
              </div>
            </div>
          </>
        )}

        {/* RETURN TO PENDING WITH A REFUND */}
        {status2 == 'on-hold' && onHoldDifference < 0 && (
          <div className="grid gap-[15px] p-5 lg:flex lg:flex-col">
            <div className="flex items-center gap-[15px] p-5 lg:flex-row">
              <input
                id="checkbox2"
                type="checkbox"
                checked={isDisabled2}
                onChange={(e) => setIsDisabled2(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="checkbox2" className="text-sm text-gray-700">
                Confirm your actions before proceeding
              </label>

              <p className="text-red-600">
                Important Note:
                <i>
                  {' '}
                  You will be refunded 2.5% inconvenience less the actual refund
                  amount.
                </i>
              </p>
            </div>

            <Button
              type="button"
              className={`flex items-center gap-2 rounded-2xl pb-2 pl-5 pr-5 pt-2 ${
                isDisabled2
                  ? 'bg-indigo-800 hover:bg-indigo-700'
                  : 'cursor-not-allowed bg-slate-400 hover:bg-slate-500'
              }`}
              onClick={() => returnOrderWithRefund()}
              disabled={!isDisabled2}
            >
              Activate Refund and Return Order for Processing
            </Button>
          </div>
        )}

        {/* ............................... PAYMENT SECTION FOR SAVED ORDERS ................................ */}
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
                {/* <div className="dark:text-yellow-200d text-sm text-blue-800">
                  Please note that card payment cannot exceed $1,000 USD or
                  N500,000 Naira
                </div>
                <br /> */}
              </div>

              <div className="flex flex-col gap-[15px] lg:flex-row">
                {/* *********************************************************************************************************** */}
                <FlutterwavePaymentButton
                  amount={grandTotalCost}
                  amountNaira={amountNaira}
                  destinationCountry={destinationCountry}
                  totalWeight={productsTotalWeight}
                  email={user?.userEmail as string}
                  name={user?.userFirstname as string}
                  phone_number={''}
                  currency={'USD'}
                  payment_type={'CARD'}
                  consumer_id={user?.pidUser as string}
                  service_id={pidOrder}
                  service_name={'PROCUREMENT'}
                  description={'This is General Procuremnt & Shipping Service'}
                  isDisabled={isDisabled}
                  className={
                    isDisabled
                      ? 'flex items-center gap-2 rounded-2xl bg-indigo-800 pb-2 pl-5 pr-5 pt-2 hover:bg-indigo-700'
                      : 'flex items-center gap-2 rounded-2xl bg-[#c9d1db] pb-2 pl-5 pr-5 pt-2 text-[#ffffff] hover:bg-[#c9d1db] dark:bg-[#555d70] dark:text-[#8b8b94]'
                  }
                />
                {/* *********************************************************************************************************** */}

                <Button
                  className={
                    isDisabled
                      ? 'flex items-center gap-2 rounded-2xl bg-indigo-800 pb-2 pl-5 pr-5 pt-2 hover:bg-indigo-700'
                      : 'flex items-center gap-2 rounded-2xl bg-slate-400 pb-2 pl-5 pr-5 pt-2 hover:bg-slate-500 dark:bg-slate-400'
                  }
                  onClick={() => {
                    let amount = grandTotalCost as any;
                    let amountNairax = amountNaira as any;
                    let totalWeightx = productsTotalWeight as any;
                    let destinationCountryx = destinationCountry as any;

                    //check minimum amount limit in dollars
                    if (amount < 200 && destinationCountryx != 'Nigeria') {
                      alert(
                        'We cannot process orders of less than $200 for orders going to your destination. Please, edit your order',
                      );
                      return;
                    }

                    //check minimum amount limit in naira
                    if (
                      amountNairax < 100000 &&
                      destinationCountryx == 'Nigeria'
                    ) {
                      alert(
                        'We do not process orders less than N100,000. Please, edit your order.',
                      );
                      return;
                    }

                    //check amount limit in naira
                    if (totalWeightx < 10 && destinationCountryx != 'Nigeria') {
                      alert(
                        'We cannot ship orders with weight less than 10kg to your destination. Please, edit your order.',
                      );
                      return;
                    }

                    router.push(
                      '/dashboard/bank-payment/?service=procurement&amount=' +
                        grandTotalCost +
                        '&amountNaira=' +
                        amountNaira +
                        '&currencyType=' +
                        currencyType +
                        '&exNairaToDollar=' +
                        exNairaToDollar +
                        '&destinationCountry=' +
                        destinationCountry +
                        '&status=' +
                        status +
                        '&newEstimatedTotalShippingCost=' +
                        estimatedTotalShippingCost +
                        '&newTotalAmount=' +
                        grandTotalCost +
                        '&newTotalWeight=' +
                        totalWeightx +
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
                  Direct Bank Deposit
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
    </>
  );
}

export default MoreOrders;
function navigateWithAlert(arg0: string, arg1: string, arg2: string) {
  throw new Error('Function not implemented.');
}
