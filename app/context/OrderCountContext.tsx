// context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

interface ContextType {
  //savedOrders: number;
  pendingOrders: number;
  processingOrders: number;
  sourcedOrders: number;
  deliveredOrders: number;
}

interface ProductCountX {
  //savedOrders: number;
  pendingOrders: number;
  processingOrders: number;
  sourcedOrders: number;
  deliveredOrders: number;
}

//USER DATA
interface User {
  pidUser: string;
  email: string;
  name: string;
}

//API RESPONSE PRODUCT COUNT
interface ProductCountProps {
  responsex: any;
  //successx: boolean;
  //userx: User;
}

const OrderCountContext = createContext<ProductCountProps | undefined>(
  undefined,
);

export const OrderCountProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  //const [savedOrders, setSavedOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [processingOrders, setProcessingOrders] = useState(0);
  const [sourcedOrders, setSourcedOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [cancelledOrder, setCancelledOrder] = useState(0);
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const [responsex, setProductCount] = useState<ProductCountProps | null>(null); //DATA FROM API CALL

  const router = useRouter();

  const status = 'saved';

  const fetchProductCount = async (pidUser: string, status: string) => {
    try {
      //request for users
      const res = await fetch(
        `/api/get-data/special-sourcing-count/${pidUser}/${status}`,
      );

      //check if request was successful
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch user');
      }

      //fetch json records into userData
      const data: ProductCountProps = await res.json();

      //update user records variables
      setProductCount(data);
    } catch (err: any) {
      //setError(err.message || 'An error occurred');
    } finally {
      //setLoading(false);
    }
  };

  //run fetchUser function to get user records
  useEffect(() => {
    if (pidUser) {
      fetchProductCount(pidUser, status);
    }
  }, [router]);

  return (
    //{ savedOrders, pendingOrders, processingOrders, sourcedOrders, deliveredOrders }
    <OrderCountContext.Provider value={{ responsex }}>
      {children}
    </OrderCountContext.Provider>
  );
};

export const useAuthProductCount = () => {
  const context = useContext(OrderCountContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
