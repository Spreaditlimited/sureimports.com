'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import banks from '@/lib/data/banks';

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

const formSchema = z.object({
  amount: z.number(),
  bankname: z
    .string()
    .min(2, {
      message: 'Name is required',
    })
    .max(500),
  depositerName: z.string().min(2, { message: 'Depositor Name is required' }),
});

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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      bankname: '',
      depositerName: '',
    },
  });

  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState<string>('');
  const [depositor, setDepositerName] = useState<string>('');
  const [serviceID, setServiceID] = useState<string>('');
  const [serviceDescription, setServiceDescription] = useState<string>('');

  //FORM DATA SUBMISSION
  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //await new Promise((resolve) => setTimeout(resolve, 3000));

    const formData = new FormData() as any;
    formData.append('amount', amount);
    formData.append('bank', bank);
    formData.append('depositor', depositor);
    formData.append('serviceID', serviceID);
    formData.append('serviceDescription', serviceDescription);

    //MAKE REQUEST ATTEMPT
    try {
      toast.info('Processing . . .');
      //MAKE REQUEST
      const res = await fetch('/api/profile-update', {
        method: 'POST',
        body: formData,
      });

      // GET & PROCESS RESPONSE FROM API
      const data: ApiResponse = await res.json();

      //if (data.responsex.status == 'SUCCESS'){navigateWithAlert('/dashboard', 'success', 'Action was successfully!');}
      if (data.responsex.status == 'SUCCESS') {
        toast.success(data.responsex.message);
      }
      if (data.responsex.status == 'INVALID_IMAGE_UPLOAD') {
        toast.warning(data.responsex.message);
      }
      if (data.responsex.status == 'IMAGE_UPLOAD_FAILED') {
        toast.warning(data.responsex.message);
      }
      if (data.responsex.status == 'NO_IMAGE_SELECTED') {
        toast.warning(data.responsex.message);
      }
      if (data.responsex.status == 'EMPTY_DETAILS') {
        toast.warning(data.responsex.message);
      }
      if (data.responsex.status == 'FAILED_PROFILE_UPDATE') {
        toast.error(data.responsex.message);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      //setLoading(false);
    }

    //FORM SUBMISSION ENDS
  };

  return (
    <div className="p-[25px]">
      <div className="pt-[25px]">
        <form onSubmit={submitForm}>
          <div className="item-center flex gap-[74px] border-b p-[20px] text-slate-800 dark:border-slate-300 dark:text-white max-sm:flex-col max-sm:gap-[20px]">
            <p className="w-36">Amount to be paid</p>
            <div className="text-2xl font-bold text-indigo-800">
              ₦0.00 Naira{' '}
            </div>
          </div>

          {/* SINGLE COLUMN: PRODUCT NAME */}
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/1 w-full p-2">
              {/* COL 2 */}
              <div>
                <RadSelectOption
                  label={'Bank'}
                  reacticon={<BuildingOfficeIcon />}
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
                  reacticon={<FaUser />}
                  name={'depositor'}
                  id={'depositor'}
                  value={depositor}
                  onChange={(e) => setDepositerName(e.target.value)}
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
              <Image
                src="/icons/profile-update/bank-white.svg"
                alt="arrow"
                width={20}
                height={20}
              />
              Submit Bank Deposit details
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BankPaymentForm;
