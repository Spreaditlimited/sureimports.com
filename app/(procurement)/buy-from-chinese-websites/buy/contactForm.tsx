'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import user from '@/public/images/user.svg';
import email from '@/public/images/email.svg';
import lock from '@/public/images/lock.svg';
import call from '@/public/images/call.svg';
import eye from '@/public/images/eye.svg';
import closeeye from '@/public/images/closeeye.svg';
import contactFormBg from '@/public/images/contactFormBg.jpg';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';

const ContactForm = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <section className="relative p-[100px_0px_100px] max-xl17:p-[50px_0px_50px] max-xl:p-[40px_0px_40px] max-sm:p-[50px_0px_50px]">
      <div className="relative inset-0 z-[1] px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <div
            data-aos="fade-up"
            className="grid gap-[30px] xl:grid-cols-2 xl15:gap-0"
          >
            <div className="h-full">
              <div className="flex h-full flex-col justify-center gap-[30px] max-xl:text-center">
                <h6 className="text-[42px] font-semibold leading-tight text-buy-sourcing-white max-xl:text-[26px] max-sm:text-[32px] max-[420px]:text-[24px]">
                  Thousands have trusted Sure Imports to handle their product
                  sourcing from China. Now it’s your turn.
                </h6>
                <div className="hidden md:block">
                  <Link
                    href={'/auth/signup-procurement'}
                    className="w-fit rounded-3xl bg-white px-10 py-[11px] text-base font-normal text-black transition-all duration-300 hover:opacity-70"
                  >
                    Sign Up and Submit Your First Link Now
                  </Link>
                  <p className="mt-[30px] text-lg font-medium text-white">
                    Let us handle the hard part.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full xl15:pl-32 xl16:pl-36 xl17:pl-44">
              <div className="rounded-[20px] bg-white p-[40px_30px_45px] shadow-custom max-sm:p-[30px_20px_30px] max-[420px]:p-[25px_15px] md:rounded-[30px]">
                <h2 className="text-center text-[30px] font-semibold leading-normal text-black max-xl17:text-[26px] max-xl14:text-[20px] max-sm:block max-sm:text-[24px] max-[420px]:text-[22px] max-[374px]:text-[19px]">
                  Join over&nbsp;
                  <span className="font-bold text-buy-sourcing-blue">
                    30,000
                  </span>
                  &nbsp; Customers <br className="hidden max-sm:block" />{' '}
                  <span>Today</span>
                </h2>

                <FormContact />

                <p className="text-blacklight mx-auto mt-[30px] max-w-[470px] text-center text-[15px] font-normal leading-[160%] max-xl14:mt-[20px] max-xl14:text-[14px] max-sm:mt-[20px] max-sm:px-3 max-sm:text-[14px]">
                  By signing up, you agree to our&nbsp;
                  <Link href="/" className="text-blue">
                    Terms of Service&nbsp;
                  </Link>
                  and&nbsp;
                  <Link href="/" className="text-blue">
                    Privacy Policy&nbsp;
                  </Link>
                  . This site is protected by reCAPTCHA and the&nbsp;
                  <Link href="/" className="text-blue">
                    Google Privacy Policy&nbsp;
                  </Link>
                  and&nbsp;
                  <Link href="/" className="text-blue">
                    Terms of Service&nbsp;
                  </Link>
                  apply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-[-2] bg-buy-sourcing-darkblack/70 group-hover:bg-white/70"></div>
      <Image
        src={contactFormBg}
        alt="image"
        className="absolute inset-0 z-[-3] h-full w-full bg-buy-sourcing-darkblack/70 object-cover group-hover:bg-white/70"
      />
    </section>
  );
};

// const FormContact = () => {
//   const [visibleField, setVisibleField] = useState<
//     'password' | 'confirm' | null
//   >(null);

const FormContact: React.FC = () => {
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
    <>
      {error && (
        <div className="pt-5 text-center text-sm text-red-500">{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-[50px] max-xl14:mt-[30px] max-sm:mt-[30px]"
      >
        {/* First and Last Name */}
        <div className="grid grid-cols-1 gap-[20px] max-sm:gap-[15px] sm:grid-cols-2">
          {/* First Name */}
          <div className="mb-[20px] max-sm:mb-[0px]">
            <label className="mb-[10px] block text-base font-normal leading-none text-black md:mb-[12px] md:text-[18px]">
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
            <label className="mb-[10px] block text-base font-normal leading-none text-black md:mb-[12px] md:text-[18px]">
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
        <div className="grid grid-cols-1 gap-[20px] max-sm:gap-[15px] sm:grid-cols-2">
          {/* Email */}
          <div className="mb-[20px] max-sm:mb-[0px]">
            <label className="mb-[10px] block text-base font-normal leading-none text-black md:mb-[12px] md:text-[18px]">
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
            <label className="mb-[10px] block text-base font-normal leading-none text-black md:mb-[12px] md:text-[18px]">
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
        <div className="grid grid-cols-1 gap-[20px] max-sm:gap-[15px] sm:grid-cols-2">
          {/* Password */}
          <div className="mb-[20px] max-sm:mb-[0px]">
            <label className="mb-[10px] block text-base font-normal leading-none text-black md:mb-[12px] md:text-[18px]">
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
            <label className="mb-[10px] block text-base font-normal leading-none text-black md:mb-[12px] md:text-[18px]">
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
          type="submit"
          className="mt-[20px] w-full rounded-[30px] bg-buy-sourcing-blue p-[10px_20px] text-base font-semibold leading-[155%] text-white transition-all hover:bg-indigo-700 max-xl14:mt-[10px] max-md:mt-[20px] md:p-[14px_20px] md:text-[18px]"
        >
          {loading ? 'Processing...' : 'SignUp'}
        </button>
      </form>
    </>
  );
};

export default ContactForm;
