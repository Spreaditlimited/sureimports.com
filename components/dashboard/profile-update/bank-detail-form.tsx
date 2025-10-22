'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import {
  CircleUser,
  FileDigit,
  Info,
  Landmark,
  Loader2,
} from 'lucide-react';
import RadFormLayout from '@/components/uix/xForm/RadFormLayout';
import RadText from '@/components/uix/xForm/RadText';
import { FaUserCheck } from 'react-icons/fa';
import { RiBankFill } from 'react-icons/ri';
import Loader from '@/components/uix/Loader';

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
  const { user } = useAuth(); //DATA FROM SESSION
  const [userData, setUserData] = useState<userData>(); //DATA FROM API CALL
  const [pidUser] = useState(user?.pidUser);
  const [email] = useState(user?.userEmail);
  //user bank details
  const [bank_name, setBankName] = useState('');
  const [bank_account_number, setAccountNumber] = useState('');
  const [bank_account_name, setAccountName] = useState('');

  // 2FA states
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

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

  // STEP 1: Request verification code
  const requestVerificationCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate bank details before requesting code
    if (!bank_name || !bank_account_number || !bank_account_name) {
      toast.error('Please fill in all bank details');
      return;
    }

    setIsSendingCode(true);

    const formData = new FormData();
    formData.append('pidUser', pidUser as string);
    formData.append('email', email as string);

    try {
      toast.info('Sending verification code to your email...');

      const res = await fetch('/api/bank-details-2fa/send-code', {
        method: 'POST',
        body: formData,
      });

      const data: ApiResponse = await res.json();

      if (data.responsex.status === 'CODE_SENT') {
        toast.success(data.responsex.message);
        setShowVerificationStep(true);
      } else {
        toast.error(data.responsex.message);
      }
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      toast.error('Failed to send verification code. Please try again.');
    } finally {
      setIsSendingCode(false);
    }
  };

  // STEP 2: Verify code and update bank details
  const verifyAndUpdateBankDetails = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit verification code');
      return;
    }

    setIsVerifying(true);

    const formData = new FormData();
    formData.append('pidUser', pidUser as string);
    formData.append('email', email as string);
    formData.append('verificationCode', verificationCode);
    formData.append('bank_name', bank_name);
    formData.append('bank_account_number', bank_account_number);
    formData.append('bank_account_name', bank_account_name);

    try {
      toast.info('Verifying code and updating bank details...');

      const res = await fetch('/api/bank-details-2fa/verify-and-update', {
        method: 'POST',
        body: formData,
      });

      const data: ApiResponse = await res.json();

      if (data.responsex.status === 'ACTION_SUCCESSFUL') {
        toast.success(data.responsex.message);
        setShowVerificationStep(false);
        setVerificationCode('');
        // Refresh user data
        if (pidUser) {
          fetchUser(pidUser);
        }
      } else if (data.responsex.status === 'INVALID_CODE') {
        toast.error(data.responsex.message);
      } else if (data.responsex.status === 'CODE_EXPIRED') {
        toast.warning(data.responsex.message);
        setShowVerificationStep(false);
        setVerificationCode('');
      } else {
        toast.error(data.responsex.message);
      }
    } catch (error: any) {
      console.error('Error verifying code:', error);
      toast.error('Failed to verify code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      {/*.................................. FORM BLOCK STARTS.................................... */}
      <RadFormLayout title="Bank Payment Details" subtitle="">
        {!showVerificationStep ? (
          // STEP 1: Bank Details Form
          <form onSubmit={requestVerificationCode}>
            <div>
              <p>If you have a refund, we will pay it into this account.</p>
              <br />
            </div>

            {/* TWO COLUMN: BANK NAME & ACCOUNT NUMBER */}
            <div className="flex flex-col md:flex-row">
              <div className="w-fullx p-2 md:w-1/2">
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
                <div className=" p-2">
To update your bank details after making changes, please click the button <b>Send Verification Code</b> button to send a verification code to your email.
                
                </div>
                <div className="md:w-1/1 w-full p-2">
                  <Button
                    type="submit"
                    disabled={isSendingCode}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isSendingCode ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Code...
                      </>
                    ) : (
                      <>
                        <RiBankFill className="mr-2" />
                        Send Verification Code
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          // STEP 2: Verification Code Form
          <form onSubmit={verifyAndUpdateBankDetails}>
            <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="flex items-start">
                <Info className="mr-3 mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                    Verification Required
                  </h3>
                  <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
                    A 6-digit verification code has been sent to your email:{' '}
                    <strong>{email}</strong>
                  </p>
                  <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
                    Please enter the code below to complete the bank details update.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/1 w-full p-2">
                <div>
                  <RadText
                    label={'Verification Code (6 digits)'}
                    reacticon={<FaUserCheck className="text-gray-400" />}
                    name={'verificationCode'}
                    id={'verificationCode'}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                    disable={false}
                    placeholder="Enter 6-digit code"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/1 w-full p-2">
                  <Button
                    type="button"
                    onClick={() => {
                      setShowVerificationStep(false);
                      setVerificationCode('');
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/1 w-full p-2">
                  <Button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <FaUserCheck className="mr-2" />
                        Verify & Update
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={(e) => {
                  setShowVerificationStep(false);
                  setVerificationCode('');
                  const form = e.currentTarget.closest('form');
                  if (form) {
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    requestVerificationCode(submitEvent as any);
                  }
                }}
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                Didn't receive the code? Resend
              </button>
            </div>
          </form>
        )}
      </RadFormLayout>
      {/*.................................. FORM BLOCK ENDS .................................... */}
    </>
  );
}
