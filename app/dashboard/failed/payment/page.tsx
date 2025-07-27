'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/uix/BackButton';

const Page: React.FC = () => {
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
              src="/icons/warning.svg"
              alt="Warning Icon"
              width={100}
              height={100}
              className="aspect-square w-[100px] max-w-full self-center"
            />
            <div className="mt-6 flex flex-col max-md:max-w-full">
              <div className="capitalizeREMOVE_ME mx-8 flex flex-col max-md:mx-2.5">
                <div className="flex flex-col">
                  <div className="self-center text-sm font-bold text-indigo-800">
                    Payment Failed!
                  </div>
                  <div className="mt-1.5 text-center text-2xl font-[860] text-slate-800">
                    Payment process failed / or was cancelled!
                  </div>
                </div>
                <div className="mt-4 text-center text-sm leading-6 text-slate-600">
                  Please contact Sure Imports Admin Team at{' '}
                  <b>hello@sureimports.com</b> for support if you are having
                  problem making payment.
                </div>
              </div>
              <BackButton />
              {/* <Button
                className="mt-8 h-14 py-3.5"
                onClick={() => router.push('/dashboard')}
              >
                Back to Dashbaord
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
