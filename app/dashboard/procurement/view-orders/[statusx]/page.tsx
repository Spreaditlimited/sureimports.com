'use client';

import React, { useEffect, useState } from 'react';
import OrderSection from '../../view-orders/components/order-section';
import Orders from '../content/approved-orders.json';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { useRecord } from '@/app/context/CountRecordsSpecialSourcingContext';
import Loader from '@/components/uix/Loader';

interface OrderData {
  id: any;
  pidOrder: string;
  pidUser: string;
  orderName: string;
  destinationCountry: string;
  currencyType: string;
  shippingPlan: string;
  orderCategory: string;
  shippingAddress: string;
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
interface OrderCount {
  responsex: any;
  successx: boolean;
  userx: User;
}

// interface orderStatus {
//   params: {
//     statusx: string;
//   };
// }

interface orderStatus {
  params: Promise<{ statusx: string }>;
}

//const ViewOrders: React.FC<orderStatus> = ({ params }) => {
export function ViewOrders({ params }: orderStatus) {
  //USER DATA
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const [orderData, setOrderData] = useState<OrderData>(); //DATA FROM API CALL
  const [orderCount, setOrderCount] = useState<OrderCount>(); //DATA FROM API CALL
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const statusx = React.use(params).statusx;

  //const { statusx } = params; // Extracting the 'id' param from URL
  //alert('GREAT!'); return;
  // Unwrap the params Promise

  //const { recordx } = useRecord() as any;

  //alert(recordx);
  //alert('GREAT!'); return;

  const fetchOrder = async (pidUser: string, statusx: string) => {
    try {
      //request for users
      const res = await fetch(
        `/api/get-data/procurement/${pidUser}/${statusx}`,
      );

      //check if request was successful
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch user');
      }

      //fetch json records into userData
      const data: OrderData = await res.json();

      //update user records variables
      setOrderData(data);
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
      fetchOrder(pidUser, statusx);
      //fetchProductCount(pidUser, status);
    }
  }, [pidUser]);

  //const product: ProductData[] = productData; //ARRAY FORMAT
  //const jsonData = JSON.stringify(productData, null, 2); //JSON FORMAT
  //CHECK IF USER DATA HAS BEEN FULLY LOADED TO DOM

  //GET RECORDS INTO ARRAY FOR COUNT
  const countRecords: OrderData[] = [];

  for (const key in orderData) {
    if (Object.prototype.hasOwnProperty.call(orderData, key)) {
      countRecords.push(orderData[key as keyof typeof orderData]);
    }
  }

  if (!orderData) return <Loader />;

  if (countRecords.length == 0)
    return (
      <div className="m-7 flex border-spacing-1 items-center justify-center p-7 font-bold">
        <div className="rounded border-2 border-dotted border-gray-500 p-4">
          <p className="text-center text-gray-500">
            No {statusx} request available
          </p>
        </div>
      </div>
    ); //CHECK IF RECORD IS EMPTY

  return (
    <div className="hide-scrollbar flex px-[25px] 2xl:justify-center">
      <OrderSection initialOrders={orderData} />
    </div>
  );
}

export default ViewOrders;
