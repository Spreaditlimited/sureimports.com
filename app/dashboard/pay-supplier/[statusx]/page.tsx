'use client';

import React, { useEffect, useState } from 'react';
import Orders from '@/app/dashboard/pay-supplier/components/orders';
import PaymentData from '@/content/payments.json';
//import { useAuthProductCount } from '@/app/context/OrderCountContext';
import { useAuth } from '@/app/context/AuthContext';
import Loader from '@/components/uix/Loader';
import { useRecord } from '@/app/context/RecordCountPaySupplierContext';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/_lib/utils';
import OrderCount from '../components/OrderCountPaySupplier';
import { isEmpty } from 'lodash';

interface ProductData {
  [x: string]: any;
  id: any;
  pidPaySupplier: true;
  pidUser: true;
  supplierName: true;
  supplierPhone: true;
  supplierEmail: true;
  aliPayAccountQRCodeImage: true;
  weChatAccountQRCodeImage: true;
  proformaInvoiceImage: true;
  supplierBankAccountDetails: true;
  amountToPayInYuan: true;
  amountToPayInNaira: true;
  serviceCharge: true;
  status: true;
  createdAt: true;
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

//API RESPONSE PRODUCT COUNT
interface ProductCount {
  responsex: any;
  successx: boolean;
  userx: User;
}

interface orderStatus {
  params: Promise<{ statusx: string }>;
}

//const OrderList: React.FC<productStatus> = ({ params }) => {
export function OrderList({ params }: orderStatus) {
  // Unwrap the params Promise
  const unwrappedParams = React.use(params);

  // Access the property
  const statusx = unwrappedParams.statusx;

  //USER DATA
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const { recordx } = useRecord();

  const [productData, setProductData] = useState<ProductData>(); //DATA FROM API CALL
  const [productCount, setProductCount] = useState<ProductCount>(); //DATA FROM API CALL
  const pidUser = user?.pidUser;
  const [loadError, setLoadError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!pidUser) return;
    const controller = new AbortController();
    setProductData(undefined); setLoadError(false);
    async function load() {
      try {
        const response = await fetch(`/api/get-data/pay-supplier/${pidUser}/${statusx}`, { signal: controller.signal });
        if (!response.ok) throw Error('Unable to load requests');
        const data = await response.json();
        if (!controller.signal.aborted) setProductData(data);
      } catch { if (!controller.signal.aborted) setLoadError(true); }
    }
    void load();
    return () => controller.abort();
  }, [pidUser, statusx, retry]);

  //const product: ProductData[] = productData; //ARRAY FORMAT
  //const jsonData = JSON.stringify(productData, null, 2); //JSON FORMAT
  //CHECK IF USER DATA HAS BEEN FULLY LOADED TO DOM

  //GET RECORDS INTO ARRAY FOR COUNT
  const countRecords: ProductData[] = [];
  for (const key in productData) {
    if (Object.prototype.hasOwnProperty.call(productData, key)) {
      countRecords.push(productData[key as keyof typeof productData]);
    }
  }

  if (loadError) return <div role="alert" className="rounded-xl border border-slate-200 p-6 dark:border-slate-700"><h2 className="font-semibold">We couldn’t load your supplier payments</h2><p className="mt-2 text-sm">Your requests haven’t changed. Try loading them again.</p><button type="button" onClick={() => setRetry(value => value + 1)} className="mt-4 min-h-11 rounded-lg bg-[var(--si-primary)] px-5 py-3 text-[var(--si-on-primary)]">Try again</button></div>;
  if (!productData) return <Loader />;
  if (countRecords.length == 0)
    return (
      <div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-700 dark:bg-[#161629]">
          <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
            <Image
              src="/icons/pay-supplier/bank.svg"
              alt=""
              width={32}
              height={32}
            />
          </div>
          <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            No {statusx.replace(/-/g, ' ')} requests available
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            New supplier payment requests will appear here.
          </p>
        </div>
      </div>
    ); //CHECK IF RECORD IS EMPBY

  return (
    <>
      <div>
        <Orders initialOrders={productData as any} statusx={statusx} />
      </div>
    </>
  );
}

export default OrderList;
