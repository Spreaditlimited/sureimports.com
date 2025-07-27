'use client';
import React, { useEffect, useState } from 'react';
import Orders from '@/app/dashboard/shipping-only/components/orders';
import PaymentData from '@/content/payments.json';
//import { useAuthProductCount } from '@/app/context/OrderCountContext';
import { useAuth } from '@/app/context/AuthContext';
import Loader from '@/components/uix/Loader';
import { useRecord } from '@/app/context/RecordCountShippingOnlyContext';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/_lib/utils';
import OrderCount from '@/app/dashboard/shipping-only/components/OrderCountShippingOnly';
import { isEmpty } from 'lodash';

interface ProductData {
  //[x: string]: any;
  id: any;
  pidShippingOnly: string;
  pidUser: string;
  whatsappNumber: string;
  shippingName: string;
  shippingTo: string;
  grossWeight: string;
  trackingNumber: string;
  shippingPlan: string;
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
  const [pidUser, setPidUser] = useState(user?.pidUser);

  const fetchProduct = async (pidUser: string, statusx: string) => {
    try {
      //request for users
      const res = await fetch(
        `/api/get-data/shipping-only/${pidUser}/${statusx}`,
      );

      //check if request was successful
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch user');
      }

      //fetch json records into userData
      const data: ProductData = await res.json();

      //update user records variables
      setProductData(data);
      //setPidUser(data.pidUser);
    } catch (err: any) {
      //setError(err.message || 'An error occurred');
    } finally {
      //setLoading(false);
    }
  };

  //run fetchUser function to get user records
  useEffect(() => {
    if (pidUser) {
      fetchProduct(pidUser, statusx);
      //fetchProductCount(pidUser, status);
    }
  }, [pidUser]);

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

  if (!productData) return <Loader />;
  if (countRecords.length == 0)
    return (
      <div className="m-7 flex border-spacing-1 items-center justify-center p-7 font-bold">
        <div className="rounded border-2 border-dotted border-gray-500 p-4">
          <p className="text-center text-gray-500">
            No {statusx} request available
          </p>
        </div>
      </div>
    ); //CHECK IF RECORD IS EMPBY

  return (
    <>
      <div>
        {/* God is Good */}
        <Orders initialOrders={productData as any} statusx={statusx} />
      </div>
    </>
  );
}

export default OrderList;
