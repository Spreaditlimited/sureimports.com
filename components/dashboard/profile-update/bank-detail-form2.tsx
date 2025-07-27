'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

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
import { Loader2 } from 'lucide-react';

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

function UpdateBankDetailsFrom() {
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const [userData, setUserData] = useState<userData>(); //DATA FROM API CALL
  const [pidUser, setPidUser] = useState(user?.pidUser);
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
      alert(data.bank_name);
      //update user records variables
      setUserData(data);
      setBankName(data.bank_name);
      setAccountNumber(data.bank_account_number);
      setAccountName(data.bank_account_name);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
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
  if (!userData) return <p>Loading...</p>;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="p-[25px]">
      <div className="border-b pb-[20px] text-xl font-bold text-slate-800 dark:text-white">
        Bank Payment Details
      </div>
      <div className="w-full pt-[25px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex w-full flex-col">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <div className="item-center relative flex">
                            <Image
                              src="/icons/profile-update/bank.svg"
                              alt="search"
                              width={20}
                              height={20}
                              className="absolute m-2 lg:m-5"
                            />
                            <Input
                              className="bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px] lg:w-full"
                              placeholder="GTB"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="col-span-8 flex justify-start" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="accountNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <div className="item-center relative flex">
                            <Image
                              src="/icons/profile-update/cal.svg"
                              alt="search"
                              width={20}
                              height={20}
                              className="absolute m-2 lg:m-5"
                            />
                            <Input
                              className="bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px] lg:w-full"
                              placeholder="Account Number"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="col-span-8 flex justify-start" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="accountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl className="col-span-6">
                      <div className="item-center relative flex">
                        <Image
                          src="/icons/name.svg"
                          alt="search"
                          width={20}
                          height={20}
                          className="absolute ml-2 mt-5 lg:m-5 lg:mt-[30px]"
                        />
                        <Input
                          className="mb-[16px] mt-[10px] bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px]"
                          placeholder="Tochukwu Daniel Nkemjika Nkwocha"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="col-span-8 flex justify-start" />
                  </FormItem>
                )}
              />

              <div className="flex md:justify-end">
                <Button
                  type="submit"
                  className="mt-[25px] flex h-[49px] gap-[10px] font-medium"
                >
                  <Image
                    src="/icons/profile-update/bank-white.svg"
                    alt="arrow"
                    width={20}
                    height={20}
                  />
                  Update Bank Details
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default UpdateBankDetailsFrom;
function setError(arg0: any) {
  throw new Error('Function not implemented.');
}
