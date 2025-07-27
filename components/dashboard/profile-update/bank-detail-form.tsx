'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { HiBanknotes, HiCalculator } from 'react-icons/hi2';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input-with-dark-mode';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import {
  CircleUser,
  FileDigit,
  Info,
  InfoIcon,
  Landmark,
  Loader2,
} from 'lucide-react';
import RadFormLayout from '@/components/uix/xForm/RadFormLayout';
import RadText from '@/components/uix/xForm/RadText';
import { MdEmail } from 'react-icons/md';
import { FaUserCheck, FaUserEdit } from 'react-icons/fa';
import { RiBankFill } from 'react-icons/ri';
import RadButtonIcon from '@/components/uix/xForm/RadButtonIcon';
import Loader from '@/components/uix/Loader';

const formSchema = z.object({
  accountName: z.string().min(2, {
    message: 'Account Name is required',
  }),
  bankName: z.string().min(2, {
    message: 'bank Name is required',
  }),
  accountNo: z.string().min(2, { message: 'Account Number is required' }),
});

interface userData {
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
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

export default function UpdateBankDetailsFrom() {
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const [userData, setUserData] = useState<userData>(); //DATA FROM API CALL
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const [email, setEmail] = useState(user?.userEmail);
  const [isLoading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  //user bank details
  const [bank_name, setBankName] = useState('');
  const [bank_account_number, setAccountNumber] = useState('');
  const [bank_account_name, setAccountName] = useState('');

  //ZOD DATA RESOLVER
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountName: bank_name,
      bankName: bank_account_number,
      accountNo: bank_account_name,
    },
  });

  //GET USER PROFILE RECORDS
  const fetchUser = async (pidUser: string) => {
    try {
      //request for users
      const res = await fetch(`/api/user/${pidUser}`);

      //check if request was successful
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch user');
      }

      //fetch json records into userData
      const data: userData = await res.json();

      //update user records variables
      setUserData(data);
      setBankName(data.bank_name);
      setAccountNumber(data.bank_account_number);
      setAccountName(data.bank_account_name);
    } catch (err: any) {
      //setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  //run fetchUser function to get user records
  useEffect(() => {
    if (pidUser) {
      fetchUser(pidUser);
    }
  }, [pidUser]);

  //CHECK IF USER DATA HAS BEEN FULLY LOADED TO DOM
  if (!userData) return <Loader />;

  //FORM DATA SUBMISSION
  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    //await new Promise((resolve) => setTimeout(resolve, 3000));

    const formData = new FormData() as any;
    formData.append('pidUser', pidUser);
    formData.append('email', email);
    formData.append('bank_name', bank_name);
    formData.append('bank_account_number', bank_account_number);
    formData.append('bank_account_name', bank_account_name);

    //MAKE REQUEST ATTEMPT
    try {
      toast.info('Updating Bank details. . .');
      //MAKE REQUEST
      const res = await fetch('/api/bank-details-update', {
        method: 'POST',
        body: formData,
      });

      // GET & PROCESS RESPONSE FROM API
      const data: ApiResponse = await res.json();

      //alert(data.responsex.status);
      //if (!file) {toast.error('No Product Image selected'); setIsLoading(false); return;}else{}

      if (data.responsex.status == 'NO_IMAGE') {
        toast.info(data.responsex.message);
        // setMessage(data.responsex.message);
        // setLoading(false);
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        // router.push('/auth/login');
      }

      if (data.responsex.status == 'EMPTY_BANK_DETAILS') {
        toast.warning(data.responsex.message);
        // setMessage(data.responsex.message);
        // setLoading(false);
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        // router.push('/auth/login');
      }

      if (data.responsex.status == 'ACTION_SUCCESSFUL') {
        toast.success(data.responsex.message);
        // router.push('/auth/login');
        // setMessage(data.responsex.message);
        // setLoading(false);
      }

      if (data.responsex.status == 'ACTION_FAILED') {
        toast.error(data.responsex.message);
        //router.push('/auth/login');
        setMessage(data.responsex.message);
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }

    //FORM SUBMISSION ENDS
  };
  function onSubmit() {}

  return (
    <>
      {/*.................................. FORM BLOCK STARTS.................................... */}
      <RadFormLayout title="Bank Payment Details" subtitle="">
        <form onSubmit={submitForm}>
          {/* ////////////////////// TWO COL: BANK NAME & ACCOUNT NUMBER */}

          <div>
            <p>If you have a refund, we will pay it into this account.</p>
            <br />
          </div>

          {/* TWO COLUMN: BANK NAME & ACCOUNT NUMBER */}
          <div className="flex flex-col md:flex-row">
            <div className="w-fullx p-2 md:w-1/2">
              {/* COL 1 */}
              <div>
                <RadText
                  label={'Bank Name'}
                  reacticon={<Landmark className="text-gray-400" />}
                  name={'bank_name'}
                  id={'bank_name'}
                  value={bank_name}
                  onChange={(e) => setBankName(e.target.value)}
                  disable={false}
                />
              </div>
            </div>

            <div className="w-fullx p-2 md:w-1/2">
              {/* COL 1 */}
              <div>
                <RadText
                  label={'Bank Account Number'}
                  reacticon={<FileDigit className="text-gray-400" />}
                  name={'bank_account_number'}
                  id={'bank_account_number'}
                  value={bank_account_number}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  disable={false}
                />
              </div>
            </div>
          </div>

          {/* ONE COLUMN: BANK ACCOUNT NAME */}
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/1 w-full p-2">
              {/* COL 2 */}
              <div>
                <RadText
                  label={'Bank Account Name'}
                  reacticon={<CircleUser className="text-gray-400" />}
                  name={'bank_account_name'}
                  id={'bank_account_name'}
                  value={bank_account_name}
                  onChange={(e) => setAccountName(e.target.value)}
                  disable={false}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/1 w-full p-2">
                <RadButtonIcon
                  label="Update Bank Details"
                  reacticon={<RiBankFill />}
                  value={'formaction'}
                />
              </div>
            </div>
          </div>
        </form>
      </RadFormLayout>
      {/*.................................. FORM BLOCK ENDS .................................... */}
    </>
  );
}
