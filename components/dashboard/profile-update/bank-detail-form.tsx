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
  CheckCircle2,
  CreditCard,
} from 'lucide-react';
import RadFormLayout from '@/components/uix/xForm/RadFormLayout';
import RadText from '@/components/uix/xForm/RadText';
import RadSelectOption from '@/components/uix/xForm/RadSelectOption';
import { FaUserCheck } from 'react-icons/fa';
import { RiBankFill } from 'react-icons/ri';
import Loader from '@/components/uix/Loader';

interface userData {
  bank_name: string;
  bank_code: string;
  bank_account_number: string;
  bank_account_name: string;
  bank_transfer_code: string;
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

// Bank interface from Paystack API
interface PaystackBank {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string | null;
  pay_with_bank: boolean;
  active: boolean;
  is_deleted: boolean;
  country: string;
  currency: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export default function UpdateBankDetailsFrom() {
  const { user } = useAuth(); //DATA FROM SESSION
  const [userData, setUserData] = useState<userData>(); //DATA FROM API CALL
  const [pidUser] = useState(user?.pidUser);
  const [email] = useState(user?.userEmail);
  //user bank details
  const [bank_name, setBankName] = useState('');
  const [bank_code, setBankCode] = useState('');
  const [bank_account_number, setAccountNumber] = useState('');
  const [bank_account_name, setAccountName] = useState('');

  // Banks list from Paystack API
  const [banks, setBanks] = useState<PaystackBank[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);

  // Account verification states
  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false);
  const [resolvedAccountName, setResolvedAccountName] = useState('');
  const [isAccountVerified, setIsAccountVerified] = useState(false);

  // 2FA states
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Prepare bank list for dropdown
  const bankOptions = [
    { id: 0, optionName: '- Select Bank -', optionValue: '' },
    ...banks.map((bank, index) => ({
      id: index + 1,
      optionName: bank.name,
      optionValue: bank.name,
    })),
  ];

  //GET BANKS FROM PAYSTACK API
  const fetchBanks = async () => {
    setIsLoadingBanks(true);
    try {
      const res = await fetch('/api/paystack/list-banks?currency=NGN');
      const data = await res.json();

      if (data.status && data.data) {
        setBanks(data.data);
      } else {
        toast.error('Failed to load banks list');
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
      toast.error('Error loading banks list');
    } finally {
      setIsLoadingBanks(false);
    }
  };

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

  //run fetchUser and fetchBanks functions on component mount
  useEffect(() => {
    fetchBanks();
    if (pidUser) {
      fetchUser(pidUser);
    }
  }, [pidUser]);

  //CHECK IF USER DATA HAS BEEN FULLY LOADED TO DOM
  if (!userData) return <Loader />;

  // Function to verify account number with Paystack
  const verifyAccountNumber = async () => {
    if (!bank_code) {
      toast.error('Please select a bank first');
      return;
    }

    if (!bank_account_number) {
      toast.error('Please enter account number');
      return;
    }

    if (bank_account_number.length !== 10) {
      toast.error('Account number must be 10 digits');
      return;
    }

    if (!/^\d+$/.test(bank_account_number)) {
      toast.error('Account number must contain only digits');
      return;
    }

    setIsVerifyingAccount(true);
    setResolvedAccountName('');
    setIsAccountVerified(false);

    try {
      toast.info('Verifying account number...');

      const response = await fetch(
        `/api/paystack/resolve-account?account_number=${bank_account_number}&bank_code=${bank_code}`,
      );
      const data = await response.json();

      if (data.status && data.data) {
        const accountName = data.data.account_name;
        setResolvedAccountName(accountName);
        setAccountName(accountName); // Auto-populate the account name field
        setIsAccountVerified(true);
        toast.success('Account verified successfully!');
      } else {
        toast.error(data.message || 'Failed to verify account');
        setIsAccountVerified(false);
      }
    } catch (error) {
      console.error('Error verifying account:', error);
      toast.error('Error verifying account. Please try again.');
      setIsAccountVerified(false);
    } finally {
      setIsVerifyingAccount(false);
    }
  };

  // Handle bank selection change
  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBankName = e.target.value;
    setBankName(selectedBankName);

    // Find and set bank code
    const selectedBank = banks.find((bank) => bank.name === selectedBankName);
    if (selectedBank) {
      setBankCode(selectedBank.code);
    } else {
      setBankCode('');
    }

    // Reset verification when bank changes
    setResolvedAccountName('');
    setIsAccountVerified(false);
  };

  // Handle account number change
  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAccountNumber(e.target.value);
    // Reset verification when account number changes
    setResolvedAccountName('');
    setIsAccountVerified(false);
  };

  // Helper function to send verification code
  const sendVerificationCode = async () => {
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
        return true;
      } else {
        toast.error(data.responsex.message);
        return false;
      }
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      toast.error('Failed to send verification code. Please try again.');
      return false;
    } finally {
      setIsSendingCode(false);
    }
  };

  // STEP 1: Request verification code
  const requestVerificationCode = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    // Validate bank details before requesting code
    if (!bank_name || !bank_account_number || !bank_account_name) {
      toast.error('Please fill in all bank details');
      return;
    }

    // Ensure account is verified before proceeding
    if (!isAccountVerified) {
      toast.error('Please verify the account number before proceeding');
      return;
    }

    await sendVerificationCode();
  };

  // Resend verification code
  const resendVerificationCode = async () => {
    await sendVerificationCode();
  };

  // STEP 2: Verify code and update bank details
  const verifyAndUpdateBankDetails = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
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
    formData.append('bank_code', bank_code);
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
              <p>We will credit this account for all payout requests.</p>
              <br />
            </div>

            {/* CURRENT BANK DETAILS CARD */}
            {userData &&
              (userData.bank_name ||
                userData.bank_account_number ||
                userData.bank_account_name) && (
                <div className="mb-6">
                  <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-sm dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
                    <div className="mb-4 flex items-center">
                      <div className="mr-3 rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                        <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          Current Bank Details
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Your registered bank account information
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {/* Bank Name */}
                      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                        <div className="mb-2 flex items-center">
                          <Landmark className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Bank Name
                          </p>
                        </div>
                        <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                          {userData.bank_name || 'Not set'}
                        </p>
                      </div>

                      {/* Bank Code */}
                      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                        <div className="mb-2 flex items-center">
                          <FileDigit className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Bank Code
                          </p>
                        </div>
                        <p className="font-mono text-base font-semibold text-slate-900 dark:text-slate-100">
                          {userData.bank_code || 'Not set'}
                        </p>
                      </div>

                      {/* Account Number */}
                      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                        <div className="mb-2 flex items-center">
                          <FileDigit className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Account Number
                          </p>
                        </div>
                        <p className="font-mono text-base font-semibold text-slate-900 dark:text-slate-100">
                          {userData.bank_account_number || 'Not set'}
                        </p>
                      </div>

                      {/* Account Name */}
                      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                        <div className="mb-2 flex items-center">
                          <CircleUser className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Account Name
                          </p>
                        </div>
                        <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                          {userData.bank_account_name || 'Not set'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* DIVIDER */}
            {userData &&
              (userData.bank_name ||
                userData.bank_account_number ||
                userData.bank_account_name) && (
                <div className="mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 font-medium text-slate-500 dark:bg-black dark:text-slate-400">
                        Update Bank Details
                      </span>
                    </div>
                  </div>
                </div>
              )}

            {/* BANK NAME DROPDOWN */}
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/1 w-full p-2">
                <div>
                  {isLoadingBanks ? (
                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-medium text-gray-400">
                        Bank Name*
                      </label>
                      <div className="flex h-10 w-full items-center justify-center rounded-md border border-input bg-slate-200 dark:bg-slate-800 lg:h-[60px]">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin text-gray-400" />
                        <span className="text-sm text-gray-400">
                          Loading banks...
                        </span>
                      </div>
                    </div>
                  ) : (
                    <RadSelectOption
                      label={'Bank Name*'}
                      reacticon={<Landmark className="text-gray-400" />}
                      name={'bank_name'}
                      id={'bank_name'}
                      value={bank_name}
                      onChange={handleBankChange}
                      xrecords={bankOptions}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* BANK ACCOUNT NUMBER WITH VERIFY BUTTON */}
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/1 w-full p-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-400">
                    Bank Account Number* (10 digits)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span
                        className="absolute z-10 m-2 text-2xl lg:m-5"
                        style={{ color: '#404040' }}
                      >
                        <FileDigit className="text-gray-400" />
                      </span>
                      <input
                        type="text"
                        name="bank_account_number"
                        id="bank_account_number"
                        value={bank_account_number}
                        onChange={handleAccountNumberChange}
                        maxLength={10}
                        placeholder="Enter 10-digit account number"
                        className="items-centerx max-sm:w-340px flex h-10 w-full justify-between rounded-md border border-input bg-background bg-slate-200 p-5 px-3 py-2 pl-12 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 lg:h-[60px] lg:w-full [&>span]:line-clamp-1"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={verifyAccountNumber}
                      disabled={
                        isVerifyingAccount ||
                        !bank_code ||
                        bank_account_number.length !== 10
                      }
                      className="h-10 bg-indigo-600 px-6 hover:bg-indigo-700 lg:h-[60px]"
                    >
                      {isVerifyingAccount ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* VERIFIED ACCOUNT NAME DISPLAY */}
            {resolvedAccountName && isAccountVerified && (
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/1 w-full p-2">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-3 h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <h4 className="font-semibold text-green-900 dark:text-green-100">
                          Account Verified
                        </h4>
                        <p className="text-sm text-green-800 dark:text-green-200">
                          Account Name: <strong>{resolvedAccountName}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BANK ACCOUNT NAME INPUT (Auto-populated from verification) */}
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/1 w-full p-2">
                <div>
                  <RadText
                    label={
                      isAccountVerified
                        ? 'Bank Account Name (Auto-filled from verification)'
                        : 'Bank Account Name'
                    }
                    reacticon={<CircleUser className="text-gray-400" />}
                    name={'bank_account_name'}
                    id={'bank_account_name'}
                    value={bank_account_name}
                    onChange={(e) => setAccountName(e.target.value)}
                    disable={isAccountVerified}
                    placeholder={
                      isAccountVerified
                        ? resolvedAccountName
                        : 'Verify account number to auto-fill'
                    }
                  />
                  {isAccountVerified && (
                    <p className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      This field has been auto-filled with the verified account
                      name
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* INFO MESSAGE */}
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/1 w-full p-2">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                  <div className="flex items-start">
                    <Info className="mr-3 mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        To update your bank details, please:
                      </p>
                      <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-blue-800 dark:text-blue-200">
                        <li>Select your bank from the dropdown</li>
                        <li>Enter your 10-digit account number</li>
                        <li>
                          Click <strong>Verify</strong> to confirm the account
                        </li>
                        <li>
                          Click <strong>Send Verification Code</strong> to
                          receive a code via email
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/1 w-full p-2">
                  <Button
                    type="submit"
                    disabled={isSendingCode || !isAccountVerified}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
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
                  {!isAccountVerified && (
                    <p className="mt-2 text-center text-sm text-red-500">
                      Please verify your account number first
                    </p>
                  )}
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
                    Please enter the code below to complete the bank details
                    update.
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
                    onChange={(e) =>
                      setVerificationCode(e.target.value.toUpperCase())
                    }
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
                    className="text-gray-100 dark:text-gray-700"
                    onClick={() => {
                      setShowVerificationStep(false);
                      setVerificationCode('');
                    }}
                    variant="outline"
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
                onClick={resendVerificationCode}
                disabled={isSendingCode}
                className="text-sm text-blue-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-blue-400"
              >
                {isSendingCode
                  ? 'Sending...'
                  : "Didn't receive the code? Resend"}
              </button>
            </div>
          </form>
        )}
      </RadFormLayout>
      {/*.................................. FORM BLOCK ENDS .................................... */}
    </>
  );
}
