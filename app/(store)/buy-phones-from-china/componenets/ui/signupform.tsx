'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import user from '@/public/images/user.svg';
import email from '@/public/images/email.svg';
import lock from '@/public/images/lock.svg';
import call from '@/public/images/call.svg';
import eye from '@/public/images/eye.svg';
import closeeye from '@/public/images/closeeye.svg';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
//import { useNavigationWithAlert } from '@/app/hooks/useNavigationWithAlert';

const SignupForm: React.FC = () => {
  const [visibleField, setVisibleField] = useState<
    'password' | 'confirm' | null
  >(null);

  const router = useRouter();
  //const navigateWithAlert = useNavigationWithAlert();

  //get url parameters
  const searchParams = useSearchParams();
  const userAffiliateRefx = new URLSearchParams(searchParams).get('affRef');

  const [userFirstname, setUserFirstname] = useState('');
  const [userLastname, setUserLastname] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userAffiliateRef, setUserAffiliateRef] = useState(
    userAffiliateRefx || '',
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register_store } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      toast.success('Processing . . .'); //return;
      setLoading(true);
      const response: any = await register_store(
        userFirstname,
        userLastname,
        userEmail,
        userPhone,
        userPassword,
        confirmPassword,
        userAffiliateRef,
      );

      //if (response.statusx == 'SUCCESS'){navigateWithAlert('/success-registration', 'success', response.message); setError(response.message)}
      if (response.statusx == 'SUCCESS') {
        toast.success(response.message);
        setError(response.message);
        router.push('/auth/account-creation-success');
      }
      if (response.statusx == 'FAILED_VALIDATION') {
        toast.warning(response.message);
        setError(response.message);
        setLoading(false);
      }
      if (response.statusx == 'FAILED') {
        toast.error(response.message);
        setError(response.message);
        setLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   // your form submit logic
  //   console.log('Form submitted');
  // };

  return (
    <div className="rounded-[30px] bg-store-white p-[40px_30px_45px] shadow-custom max-sm:p-[30px_25px_40px] max-[420px]:p-[25px_15px]">
      <h2 className="text-center text-[30px] font-semibold leading-normal text-black max-xl17:text-[26px] max-xl14:text-[20px] max-sm:hidden max-sm:text-[24px]">
        Join over <span className="font-bold text-store-blue">30,000</span>{' '}
        Customers today
      </h2>
      <h2 className="hidden text-center text-[30px] font-semibold leading-normal text-black max-xl17:text-[26px] max-xl14:text-[20px] max-sm:block max-sm:text-[24px]">
        Join over <span className="font-bold text-store-blue">30,000</span>{' '}
        Customers
      </h2>

      {error && (
        <div className="pt-5 text-center text-sm text-red-500">{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-[50px] max-xl14:mt-[30px] max-sm:mt-[30px]"
      >
        {/* First and Last Name */}
        <div className="grid grid-cols-1 gap-[20px] max-sm:gap-[10px] sm:grid-cols-2">
          {/* First Name */}
          <div className="mb-[20px] max-sm:mb-[0px]">
            <label className="mb-[12px] block text-[18px] font-normal leading-[155%] text-black">
              First Name
            </label>
            <div className="relative">
              <span className="border-r-lightblack absolute left-[15px] top-1/2 -translate-y-1/2 border-r pr-[15px]">
                <Image src={user} alt="user" />
              </span>

              <input
                name="userFirstname"
                onChange={(e) => setUserFirstname(e.target.value)}
                type="text"
                placeholder="Enter First Name"
                className="placeholder:text-lightblack w-full rounded-[10px] bg-[#F1F5F9] p-[16px_30px_16px_64px] placeholder:text-[16px] focus:outline-none"
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="mb-[20px] max-sm:mb-[10px]">
            <label className="mb-[12px] block text-[18px] font-normal leading-[155%] text-black">
              Last Name
            </label>
            <div className="relative">
              <span className="border-r-lightblack absolute left-3 top-1/2 -translate-y-1/2 border-r pr-[15px]">
                <Image src={user} alt="user" />
              </span>
              <input
                name="userLastname"
                onChange={(e) => setUserLastname(e.target.value)}
                type="text"
                placeholder="Enter Last Name"
                className="placeholder:text-lightblack w-full rounded-[10px] bg-[#F1F5F9] p-[16px_30px_16px_64px] placeholder:text-[16px] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 gap-[20px] max-sm:gap-[10px] sm:grid-cols-2">
          {/* Email */}
          <div className="mb-[20px] max-sm:mb-[0px]">
            <label className="mb-[12px] block text-[18px] font-normal leading-[155%] text-black">
              Email Address
            </label>
            <div className="relative">
              <span className="border-r-lightblack absolute left-3 top-1/2 -translate-y-1/2 border-r pr-[15px]">
                <Image src={email} alt="email" />
              </span>
              <input
                name="userEmail"
                onChange={(e) => setUserEmail(e.target.value)}
                type="email"
                placeholder="Enter your Email"
                className="placeholder:text-lightblack w-full rounded-[10px] bg-[#F1F5F9] p-[16px_30px_16px_64px] placeholder:text-[16px] focus:outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="mb-[20px] max-sm:mb-[10px]">
            <label className="mb-[12px] block text-[18px] font-normal leading-[155%] text-black">
              Phone Number
            </label>
            <div className="relative">
              <span className="border-r-lightblack absolute left-3 top-1/2 -translate-y-1/2 border-r pr-[15px]">
                <Image src={call} alt="phone" />
              </span>
              <input
                name="userPhone"
                onChange={(e) => setUserPhone(e.target.value)}
                type="tel"
                placeholder="Enter Phone number"
                className="placeholder:text-lightblack w-full rounded-[10px] bg-[#F1F5F9] p-[16px_30px_16px_64px] placeholder:text-[16px] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Password and Confirm */}
        <div className="grid grid-cols-1 gap-[20px] max-sm:gap-[10px] sm:grid-cols-2">
          {/* Password */}
          <div className="mb-[20px] max-sm:mb-[0px]">
            <label className="mb-[12px] block text-[18px] font-normal leading-[155%] text-black">
              Password
            </label>
            <div className="relative">
              <span className="border-r-lightblack absolute left-3 top-1/2 -translate-y-1/2 border-r pr-[15px]">
                <Image src={lock} alt="lock" />
              </span>
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() =>
                  setVisibleField(
                    visibleField === 'password' ? null : 'password',
                  )
                }
              >
                <Image
                  src={visibleField === 'password' ? eye : closeeye}
                  alt="eye"
                />
              </span>

              <input
                name="userPassword"
                onChange={(e) => setUserPassword(e.target.value)}
                type={visibleField === 'password' ? 'text' : 'password'}
                placeholder="********"
                className="placeholder:text-lightblack w-full rounded-[10px] bg-[#F1F5F9] p-[16px_30px_16px_64px] placeholder:text-[16px] focus:outline-none"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-[20px] max-sm:mb-[10px]">
            <label className="mb-[12px] block text-[18px] font-normal leading-[155%] text-black">
              Confirm Password
            </label>
            <div className="relative">
              <span className="border-r-lightblack absolute left-3 top-1/2 -translate-y-1/2 border-r pr-[15px]">
                <Image src={lock} alt="lock" />
              </span>
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() =>
                  setVisibleField(visibleField === 'confirm' ? null : 'confirm')
                }
              >
                <Image
                  src={visibleField === 'confirm' ? eye : closeeye}
                  alt="eye"
                />
              </span>
              <input
                name="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={visibleField === 'confirm' ? 'text' : 'password'}
                placeholder="********"
                className="placeholder:text-lightblack w-full rounded-[10px] bg-[#F1F5F9] p-[16px_30px_16px_64px] placeholder:text-[16px] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="mt-[20px] w-full rounded-[30px] bg-store-blue p-[14px_20px] text-[18px] font-semibold leading-[155%] text-store-white transition-all hover:bg-indigo-700 max-xl14:mt-[10px] max-sm:mt-[15px]"
        >
          {loading ? 'Processing...' : 'SignUp'}
        </button>
      </form>

      <p className="text-blacklight mx-auto mt-[30px] max-w-[470px] text-center text-[15px] font-normal leading-[160%] max-xl14:mt-[20px] max-xl14:text-[14px] max-sm:mt-[20px] max-sm:text-[14px]">
        By signing up, you agree to our{' '}
        <Link href="/terms-and-conditions" className="text-store-blue">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy-policy" className="text-store-blue">
          Privacy Policy
        </Link>
        . This site is protected by reCAPTCHA and the Google{' '}
        <Link
          href="https://policies.google.com/privacy?hl=en-US"
          target="_blank"
          className="text-store-blue"
        >
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link
          href="https://policies.google.com/terms?hl=en"
          target="_blank"
          className="text-store-blue"
        >
          Terms of Service
        </Link>{' '}
        apply.
      </p>
    </div>
  );
};

export default SignupForm;
