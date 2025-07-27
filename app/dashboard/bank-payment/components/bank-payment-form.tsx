'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import banks from '@/lib/data/banks';
import { BsBank } from 'react-icons/bs';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input-with-dark-mode';
import RadText from '@/components/uix/xForm/RadText';
import { FaBox, FaUser } from 'react-icons/fa';
import RadSelectOption from '@/components/uix/xForm/RadSelectOption';
import { BiWorld } from 'react-icons/bi';
import { BuildingOfficeIcon } from '@heroicons/react/16/solid';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';
import { useAuth } from '@/lib/AuthContext';
import Loader from '@/components/uix/Loader';
import { Landmark, User } from 'lucide-react';

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

function BankPaymentForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  let productID = 'BANK' + new Date().getTime().toString();

  //initialize alert system
  const navigateWithAlert = useNavigationWithAlert();
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const [pidBankPayment, setPidBankPayment] = useState(productID);
  const [email, setEmail] = useState(user?.userEmail);

  const [service, setService] = useState(searchParams.get('service')) as any;
  const [amount, setAmount] = useState(searchParams.get('amount')) as any;

  const [newTotalAmount, setNewTotalAmount] = useState(
    searchParams.get('newTotalAmount'),
  ) as any;
  const [newTotalWeight, setNewTotalWeight] = useState(
    searchParams.get('newTotalWeight'),
  ) as any;
  const [newEstimatedTotalShippingCost, setNewEstimatedTotalShippingCost] =
    useState(searchParams.get('newEstimatedTotalShippingCost')) as any;

  const [amountNaira, setAmountNaira] = useState(
    searchParams.get('amountNaira'),
  ) as any;
  const [exNairaToDollar, setExNairaToDollar] = useState(
    searchParams.get('exNairaToDollar'),
  ) as any;
  const [currencyType, setCurrencyType] = useState(
    searchParams.get('currencyType'),
  ) as any;
  const [destinationCountry, setDestinationCountry] = useState(
    searchParams.get('destinationCountry'),
  ) as any;
  const [bank, setBank] = useState('');
  const [depositor, setDepositor] = useState('');
  const [serviceID, setServiceID] = useState(searchParams.get('serviceID'));
  const [serviceDescription, setServiceDescription] = useState(
    searchParams.get('serviceDescription'),
  );
  const [currentStatus, setCurrentStatus] = useState(
    searchParams.get('status'),
  ) as any;

  //FORM DATA SUBMISSION
  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //await new Promise((resolve) => setTimeout(resolve, 3000));

    const formData = new FormData() as any;
    formData.append('pidUser', pidUser);
    formData.append('userEmail', user?.userEmail);
    formData.append('pidBankPayment', pidBankPayment);

    formData.append('amount', amount);
    formData.append('currencyType', currencyType);
    formData.append('destinationCountry', destinationCountry);
    formData.append('bank', bank);
    formData.append('depositor', depositor);

    formData.append('newTotalAmount', newTotalAmount);
    formData.append('newTotalWeight', newTotalWeight);
    formData.append(
      'newEstimatedTotalShippingCost',
      newEstimatedTotalShippingCost,
    );

    formData.append('serviceID', serviceID);
    formData.append('serviceDescription', serviceDescription);
    formData.append('currentStatus', currentStatus);

    //MAKE REQUEST ATTEMPT
    try {
      toast.info('Processing . . .');
      //MAKE REQUEST
      const res = await fetch('/api/bank-payment/' + service, {
        method: 'POST',
        body: formData,
      });

      // GET & PROCESS RESPONSE FROM API
      const data: any = await res.json();

      if (data.statusx == 'SUCCESS') {
        navigateWithAlert(
          '/dashboard',
          'success',
          'Payment details was successfully submited, awaiting payment status confirmation.',
        );
      }
      // if (data.responsex.status == 'SUCCESS') {
      //   toast.success(data.responsex.message);
      // }
      if (data.statusx == 'ACTION_FAILED') {
        toast.warning(data.responsex.message);
      }
      if (data.statusx == 'EMPTY_BANK_PAYMENT_DETAILS') {
        toast.warning(data.message);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      //setLoading(false);
    }

    //FORM SUBMISSION ENDS
  };

  if (!amount) return <Loader />;

  return (
    <div className="p-[25px]">
      <div className="pt-[25px]">
        <div className="item-center flex gap-[74px] border-b p-[5px] pb-10 text-slate-800 dark:border-slate-300 dark:text-white max-sm:flex-col max-sm:gap-[20px]">
          <p className="w-36">Amount to be paid</p>

          {/* USD AMOUNT */}
          {true && (
            <>
              <div className="text-2xl font-bold text-blue-800">
                $
                {
                  (amount / 1)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as any
                }
              </div>
              {' | '}
            </>
          )}

          {/* YUAN AMOUNT */}
          {/* {currencyType == 'CNY' && (
            <>
              <div className="text-white-800 text-2xl font-bold">
                ¥
                {
                  (amount * 7.13)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as any
                }
              </div>
            </>
          )} */}

          {/* USD AMOUNT */}
          {/* {currencyType == 'CNY' && (
            <>
              {' | '}
              <div className="text-2xl font-bold text-blue-800">
                $
                {
                  (amount / 7.13)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as any
                }
              </div>
              {' | '}
            </>
          )} */}

          {/* NAIRA AMOUNT */}
          {destinationCountry == 'Nigeria' && (
            <>
              <div className="text-white-800 text-2xl font-bold">
                ₦
                {
                  (amount * exNairaToDollar)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as any
                }
              </div>
            </>
          )}

          {/* ---------------------------------OTHER SERVICES LIKE PAY SUPPLIER USES THE BELOW CONDITIONS-------------------------------- */}

          {/* NAIRA AMOUNT */}
          {/* {currencyType == 'NGN' && (
            <>
              <div className="text-white-800 text-2xl font-bold">
                ₦
                {
                  (amountNaira / 1)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as any
                }
              </div>
            </>
          )} */}
        </div>

        <form onSubmit={submitForm}>
          {/* SINGLE COLUMN: PRODUCT NAME */}
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/1 w-full p-2">
              {/* COL 2 */}
              <div>
                <RadSelectOption
                  label={'Bank'}
                  reacticon={<Landmark className="text-gray-400" />}
                  name={'bank'}
                  id={'bank'}
                  xrecords={banks}
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SINGLE COLUMN: PRODUCT NAME */}
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/1 w-full p-2">
              {/* COL 2 */}
              <div>
                <RadText
                  label={'Depositors Full Name'}
                  reacticon={<User className="text-gray-400" />}
                  name={'depositor'}
                  id={'depositor'}
                  value={depositor}
                  onChange={(e) => setDepositor(e.target.value)}
                  placeholder={'Enter Depositors Fullname here'}
                  disable={false}
                />
              </div>
            </div>
          </div>

          <div className="text-sm font-normal text-slate-600 dark:text-slate-300 md:w-[700px]">
            Please, make a bank payment to any of the accounts above before
            submitting. Please Do NOT submit the same payment twice.
          </div>

          <div className="mt-[25px] flex md:justify-end">
            <Button
              type="submit"
              className="flex h-[49px] w-[300px] gap-[10px] rounded-xl bg-indigo-800 px-[25px] py-[15px] font-medium"
            >
              <Landmark className="text-gray-400" />
              Submit Bank Deposit details
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BankPaymentForm;
