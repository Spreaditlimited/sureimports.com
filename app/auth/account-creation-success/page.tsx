'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

const AccountCreationSuccessPage: React.FC = () => {
  const router = useRouter();
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-white">
      <Image
        loading="lazy"
        src="/images/background.png"
        alt=""
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative flex w-full max-w-full flex-col items-center px-2 sm:px-16">
        <Card className="relative mx-auto my-5 flex max-w-[485px] flex-col justify-center rounded-3xl bg-white p-8 shadow-2xl max-md:px-5">
          <CardContent className="flex flex-col max-md:max-w-full">
            <Image
              loading="lazy"
              src="/icons/green-tick.svg"
              alt="Success Icon"
              width={100}
              height={100}
              className="aspect-square w-[100px] max-w-full self-center"
            />
            <div className="mt-6 flex flex-col max-md:max-w-full">
              <div className="mx-8 flex flex-col capitalize max-md:mx-2.5">
                <div className="flex flex-col">
                  <div className="self-center text-sm font-bold text-indigo-800">
                    Thank you
                  </div>
                  <div className="mt-1.5 text-center text-2xl font-[860] text-slate-800">
                    For Creating An Account With Us.
                  </div>
                </div>
                <div className="mt-4 text-center text-sm leading-6 text-slate-600">
                  We have sent an account activation email to the email address
                  you provided. Check your spam folder if it’s not in your
                  primary folder.
                </div>
              </div>
              <Button
                className="mt-8 h-14 py-3.5"
                onClick={() => router.push('/auth/login')}
              >
                Ok! Got it
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountCreationSuccessPage;
