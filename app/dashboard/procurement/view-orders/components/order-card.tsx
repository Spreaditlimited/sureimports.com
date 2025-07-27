'use client';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import React, { useEffect, useState, useRef, Suspense } from 'react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import MoreOrders from './products-table/orders-view-more';
import { usePathname } from 'next/navigation';
import Loader from '@/components/uix/Loader';
import { useAuth } from '@/app/context/AuthContext';

import Link from 'next/link';
import { toast } from 'sonner';

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

interface OrderData {
  //[x: string]: any;
  id: any;
  pidOrder: string;
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

interface Orders {
  Orders: OrderData[];
}

interface Order {
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
  //Product: Product[];
}

interface OrderCardProps {
  id: number;
  order: Order;
  onDelete: (id: number) => void;
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

function OrderCard({ id, order, onDelete }: OrderCardProps) {
  const { user, logout } = useAuth(); //DATA FROM SESSION

  const router = useRouter();
  const [isOpen, setIsOpen] = useState<{ isOpen: boolean }>({ isOpen: false });
  const path = usePathname();

  const [productData, setProductData] = useState<ProductData>();
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const [pidOrder, setPidOrder] = useState(order.pidOrder);
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const handleOpenChange = (open: boolean) => {
    setIsOpen({ isOpen: open });
  };

  const handleDelete = async () => {
    try {
      toast.info('Deleting Order . . .');
      console.log('Reloading child component...');
      setReloadKey((prev) => prev + 1); // Change the key to force a re-render
      setLoading(true);
      window.location.reload();
      // const router = useRouter();
      // router.push('/specific-path');

      const res = await fetch(
        `/api/crud/procurement-delete-order/${user?.pidUser}/${pidOrder}`,
      );

      //check if request was successful
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch user');
      }

      // GET & PROCESS RESPONSE FROM API
      const data: any = await res.json();

      if (data.responsex.status == 'SUCCESS') {
        toast.success(data.responsex.message);
        navigateWithAlert(
          '/dashboard/procurement/view-orders/saved?status=success',
          'success',
          'Your request has been submitted!',
        );
        // window.location.href = '/dashboard/procurement/view-orders/saved';
        // window.location.reload();
        // const router = useRouter();
        // router.refresh();
        const timer = setTimeout(() => {
          window.location.reload();
        }, 5000); // 5000 milliseconds = 5 seconds
        return () => clearTimeout(timer);
      }
      if (data.responsex.status == 'FAILED') {
        toast.warning(data.responsex.message);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }

    //console.log('deleted');
    onDelete(id);
    setIsOpen({ isOpen: false });
  };

  const onKeep = () => {
    console.log('kept');
    setIsOpen({ isOpen: false });
  };

  const fetchProducts = async (pidUser: string, pidOrder: string) => {
    try {
      //request for users
      const res = await fetch(
        `/api/get-data/procurement-order-products/${pidUser}/${pidOrder}`,
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
      fetchProducts(pidUser, pidOrder);
      //fetchProductCount(pidUser, status);
    }
  }, [pidUser]);

  //const product: ProductData[] = productData; //ARRAY FORMAT
  //const jsonData = JSON.stringify(productData, null, 2); //JSON FORMAT
  //CHECK IF USER DATA HAS BEEN FULLY LOADED TO DOM

  //GET RECORDS INTO ARRAY FOR COUNT
  // const countRecords: OrderData[] = [];
  // for (const key in productData) {
  //   if (Object.prototype.hasOwnProperty.call(orderData, key)) {
  //     countRecords.push(orderData[key as keyof typeof orderData]);
  //   }
  // }

  if (!productData) return <div>. . .</div>;

  //if (countRecords.length == 0)

  return (
    <div key={reloadKey} className="">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <div className="flex flex-col items-start justify-between gap-3 rounded-xl bg-white px-5 py-5 transition-all duration-200 dark:bg-[#161629] lg:flex-row xl:h-[100px] xl:items-center">
            <div>
              <div className="flex flex-row gap-4">
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg bg-slate-100 text-center text-4xl capitalize text-slate-300 dark:bg-slate-800 dark:text-white">
                  {id}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-xl font-bold capitalize text-slate-800 dark:text-slate-200">
                    {order.orderName}
                  </div>
                  <div className="text-base font-normal text-slate-950 dark:text-slate-100">
                    Order Id:{' '}
                    <span className="text-slate-600">{order.pidOrder}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 max-lg:w-full sm:flex-row sm:justify-between lg:justify-normal">
              <div className="flex gap-3">
                {/* {
                    path.includes('pending-orders') ||
                    path.includes('approved-orders') ||
                    path.includes('in-transit') ||
                    path.includes('ready-for-pickup') ||
                    path.includes('completed-orders') ||
                    path.includes('on-hold-orders') ||
                    path.includes('pay-for-shipping') ? (
                  ''
                ) : ( */}

                {(order.status == 'saved' || order.status == 'on-hold') && (
                  <Button
                    className="h-[49px] rounded-xl font-normal md:px-[30px] md:py-[15px] xl:w-[162px]"
                    onClick={() => {
                      router.push(
                        `/dashboard/procurement/add-product/${order.pidOrder}`,
                      );
                    }}
                  >
                    + Add Product
                  </Button>
                )}

                {/* )
                } */}

                {/* <select
                  name="cars"
                  id="cars"
                  onChange={goToPDF}
                  className="bg-black-100 inline-flex h-[49px] items-center justify-center gap-2.5 rounded-xl px-[30px] py-[15px] text-base font-medium text-slate-600 hover:bg-[#161629]/10 dark:text-white xl:w-[201px]"
                >
                  <option value="audi">- Export Order -</option>
                  <option value="audi">PDF</option>
                </select> */}

                {/* <Select>
                  <SelectTrigger className="inline-flex h-[49px] items-center justify-center gap-2.5 rounded-xl bg-slate-100 px-[30px] py-[15px] text-base font-medium text-slate-600 hover:bg-[#161629]/10 dark:text-white xl:w-[201px]">
                    Export Order
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select> */}
              </div>
              <div className="flex gap-3">
                <Dialog open={isOpen.isOpen} onOpenChange={handleOpenChange}>
                  <DialogTrigger asChild>
                    {order.status == 'saved' && (
                      <Button className="item-ceneter flex h-11 w-11 justify-center rounded-lg bg-red-100 p-0 font-normal hover:bg-red-200">
                        <Image
                          src="/icons/delete.svg"
                          alt="delete"
                          width={20}
                          height={20}
                          className="cursor-pointer"
                        />
                      </Button>
                    )}
                  </DialogTrigger>

                  <DialogContent className="flex max-w-[396px] flex-col items-center justify-center overflow-auto rounded-[20px] py-[30px] dark:bg-[#161629]">
                    <Image
                      src="/icons/deletewarning.svg"
                      alt="delete"
                      width={100}
                      height={100}
                      className="cursor-pointer"
                    />

                    <div className="w-[280px] text-center text-2xl font-bold text-slate-800 dark:text-slate-300">
                      Are you sure you want to delete?
                    </div>
                    <div className="flex w-80 text-center text-sm text-slate-600">
                      This will delete this record and you cannot recover it.
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={onKeep}
                        className="h-[49px] items-center justify-center gap-2.5 rounded-xl bg-slate-100 px-[30px] py-[15px] text-base text-slate-600 hover:bg-slate-200 lg:w-[162px]"
                      >
                        No! keep it
                      </Button>

                      <Button
                        onClick={handleDelete}
                        className="h-[49px] items-center justify-center gap-2.5 rounded-xl bg-red-100 px-[30px] py-[15px] text-base text-red-500 hover:bg-red-200 lg:w-[162px]"
                      >
                        {' '}
                        Yes! Remove
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <AccordionTrigger className="item-ceneter flex h-11 w-11 justify-center rounded-lg bg-slate-100 p-0 text-slate-600 hover:bg-black/10"></AccordionTrigger>
              </div>
            </div>
          </div>

          <AccordionContent className="hide-scrollbar border-t-2">
            <MoreOrders products={productData as any} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default OrderCard;
function navigateWithAlert(arg0: string, arg1: string, arg2: string) {
  throw new Error('Function not implemented.');
}
