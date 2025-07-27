'use client';

import * as React from 'react';
import { NextPage } from 'next';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react'; // Importing the spinner icon from lucide-react

interface AccountNotActivatedPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
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
  // Add other properties as needed
}

const AccountNotActivatedPage: React.FC<AccountNotActivatedPageProps> = ({
  searchParams,
}) => {
  const router = useRouter();
  const [isLoading, setLoading] = React.useState(false);

  // Get a single string parameter
  //const name = searchParams?.name ?? 'Default Name'
  const email = searchParams.email as string | undefined;
  //const email = useSearchParams().get('email');
  const [message, setMessage] = React.useState('');

  // Get a parameter that might be a string or an array of strings
  //const category = searchParams.category as string | string[] | undefined

  const handleResendActivationEmail = async () => {
    setLoading(true);
    const userEmail = email;
    // Simulate an async operation (e.g., API call)
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    //MAKE REQUEST ATTEMPT
    try {
      //MAKE REQUEST
      const res = await fetch('/api/auth/resend-email-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail }),
      });

      // GET & PROCESS RESPONSE FROM API
      const data: ApiResponse = await res.json();

      if (data.responsex.status == 'ALREADY_VERIFIED') {
        //router.push('/auth/login');
        setMessage(data.responsex.message);
        setLoading(false);
      }

      if (data.responsex.status == 'VERIFICATION_EMAIL_SENT') {
        //router.push('/auth/login');
        setMessage(data.responsex.message);
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }

    // setLoading(false);
    // router.push('/auth/category-selection');
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center bg-white">
      <Image
        loading="lazy"
        src="/images/background.png"
        alt=""
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative flex w-full max-w-full flex-col items-center px-2 sm:px-16">
        <Card className="relative mx-auto flex max-w-lg flex-col justify-center rounded-3xl bg-white p-8 shadow-2xl max-md:px-5">
          <CardContent className="flex flex-col max-md:max-w-full">
            <Image
              loading="lazy"
              src="/icons/warning.svg"
              alt="Warning Icon"
              width={100}
              height={100}
              className="aspect-square w-[100px] max-w-full self-center"
            />
            <div className="mt-6 flex flex-col max-md:max-w-full">
              <div className="capitalize_REMOVE_ME mx-8 flex flex-col max-md:mx-2.5">
                <div className="flex flex-col">
                  <div className="self-center text-sm font-bold text-indigo-800">
                    Oops
                  </div>
                  <div className="mt-1.5 text-center text-2xl font-[860] text-slate-800">
                    We noticed you have not activated your account.
                  </div>
                </div>
                <div className="mt-4 text-center text-sm leading-6 text-slate-600">
                  If you did not receive our activation email, kindly click the
                  button below to receive a fresh activation email.
                  <br />
                  Re-Activation Email will be sent to{' '}
                  <b>{email || ': No Email available.'}</b>
                </div>
              </div>
              <Button
                className="mt-8 h-14 py-3.5"
                onClick={handleResendActivationEmail}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'Resend Activation Email'
                )}
              </Button>

              <Button
                className="mt-8 h-14 bg-slate-300 py-3.5 hover:bg-slate-400"
                onClick={() => router.push('/auth/login')}
                disabled={isLoading}
              >
                Back to Login
              </Button>

              <br />
              {message && <p className="text-blue-600">{message}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountNotActivatedPage;
