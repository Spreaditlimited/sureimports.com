'use client';
import React, { useEffect, useState } from 'react';
import commitmentBg from '@/public/images/commitmentBg.jpg';
import Image from 'next/image';
import Link from 'next/link';
import AOS from 'aos';
import user from '@/public/images/user.svg';
import email from '@/public/images/email.svg';
import lock from '@/public/images/lock.svg';
import call from '@/public/images/call.svg';
import eye from '@/public/images/eye.svg';
import closeeye from '@/public/images/closeeye.svg';
import 'aos/dist/aos.css';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
const Commitment = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <>
      <section className="relative w-auto p-[90px_0px_109px] max-xl17:p-[50px_0px_50px] max-xl:p-[40px_0px_40px] max-lg:p-[30px_0px_30px] max-sm:p-[50px_0px_50px]">
        <div className="px-[30px] max-sm:px-[20px]">
          <div className="fix-width">
            <div
              data-aos="fade-up"
              className="mx-auto mb-[30px] w-full max-w-[860px] text-center lg:mb-[50px]"
            >
              <h4 className="text-center text-[42px] font-semibold capitalize leading-tight text-buy-sourcing-white max-xl:text-[26px] max-sm:text-[36px] max-[360px]:text-[30px]">
                Why the <br className="block sm:hidden" /> Commitment Fee?
              </h4>
              <p className="mt-[10px] text-base font-normal leading-relaxed text-buy-sourcing-white max-sm:px-3 md:mt-4 md:text-lg">
                The refundable sourcing commitment fee ensures we’re only
                working with serious buyers — and it gives you access to our
                best resources, including direct communication with our China
                team. When you place your order, the fee is credited back to
                you.
              </p>
            </div>
            <div data-aos="fade-up" className="mx-auto w-full max-w-[1120px]">
              {/* <SignupForm /> */}
              <ContctForm />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-[-2] bg-buy-sourcing-darkblack/70 group-hover:bg-white/70"></div>
        <Image
          src={commitmentBg}
          alt="image"
          className="absolute inset-0 z-[-3] h-full w-full bg-buy-sourcing-darkblack/70 object-cover group-hover:bg-white/70"
        />
      </section>
    </>
  );
};

// const ContctForm = () => {
//   const [visibleField, setVisibleField] = useState<
//     'password' | 'confirm' | null
//   >(null);

const ContctForm: React.FC = () => {
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

  return (
    <div className="rounded-[30px] bg-white p-[40px_30px_45px] shadow-custom max-sm:p-[30px_25px_40px] max-[420px]:p-[25px_15px]">
      <div className="text-center">
        <h2 className="text-center text-[30px] font-semibold leading-normal text-black max-xl17:text-[26px] max-xl14:text-[20px] max-sm:block max-sm:text-[24px]">
          Join over&nbsp;
          <span className="font-bold text-buy-sourcing-blue">30,000</span>{' '}
          Customers <span className="max-md:hidden">today</span>
        </h2>
        <p className="mt-3 text-base font-semibold capitalize leading-relaxed text-black sm:text-lg">
          Guaranteed Product Sourcing
        </p>
      </div>

      {error && (
        <div className="pt-5 text-center text-sm text-red-500">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mt-[30px] xl:mt-[50px]">
        {/* First and Last Name */}
        <div className="grid grid-cols-1 gap-[30px] max-sm:gap-[10px] lg:grid-cols-3">
          {/* First Name */}
          <div className="max-sm:mb-[0px] lg:mb-[20px]">
            <label className="mb-[12px] block text-base font-normal leading-[155%] text-black md:text-[18px]">
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
          <div className="max-sm:mb-[10px] lg:mb-[20px]">
            <label className="mb-[12px] block text-base font-normal leading-[155%] text-black md:text-[18px]">
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

          {/* Email */}
          <div className="max-sm:mb-[0px] lg:mb-[20px]">
            <label className="mb-[12px] block text-base font-normal leading-[155%] text-black md:text-[18px]">
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
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 gap-[30px] max-lg:mt-[10px] max-sm:gap-[10px] lg:grid-cols-3">
          {/* Phone */}
          <div className="max-sm:mb-[10px] lg:mb-[20px]">
            <label className="mb-[12px] block text-base font-normal leading-[155%] text-black md:text-[18px]">
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

          {/* Password */}
          <div className="max-sm:mb-[0px] lg:mb-[20px]">
            <label className="mb-[12px] block text-base font-normal leading-[155%] text-black md:text-[18px]">
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
          <div className="max-sm:mb-[10px] lg:mb-[20px]">
            <label className="mb-[12px] block text-base font-normal leading-[155%] text-black md:text-[18px]">
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

        <div className="mx-auto mb-5 mt-[30px] w-full max-w-[624px]">
          <button
            type="submit"
            className="w-full rounded-[30px] bg-buy-sourcing-blue p-[10px_20px] text-base font-semibold leading-[155%] text-buy-sourcing-white transition-all hover:bg-indigo-700 md:p-[14px_20px] md:text-[18px]"
          >
            {loading ? 'Processing...' : 'SignUp'}
          </button>
        </div>
      </form>
      <p className="text-blacklight mx-auto max-w-[754px] text-center text-[15px] font-normal leading-[160%] max-xl14:mt-[20px] max-xl14:text-[14px] max-sm:text-[14px]">
        By signing up, you agree to our{' '}
        <Link href="/" className="text-buy-sourcing-blue">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/" className="text-buy-sourcing-blue">
          Privacy Policy
        </Link>
        . This site is protected by reCAPTCHA and the Google{' '}
        <Link href="/" className="text-buy-sourcing-blue">
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link href="/" className="text-buy-sourcing-blue">
          Terms of Service
        </Link>{' '}
        apply.
      </p>
    </div>
  );
};

export default Commitment;
