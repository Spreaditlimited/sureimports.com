'use client';
import AffiliateSection from '@/components/home/AffiliateSection';
// import MiniHeaderSection from '@/components/home/about-us/miniHeader';
import Section1 from '@/components/home/services/sectionPaySupplier';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export const Block = () => {
  return (
    <div>
      <Section1
        imageUrl="/home/about-us/section-1.svg"
        imageAlt="Sure Importers Limited "
        linkHref="/auth/login"
        title={['Do you have  ', 'suppliers', 'in China']}
        paragraphs={[
          'and want to pay them as fast as possible? We will help you achieve that within 1 business day and in Chinese Yuan. We guarantee that once you remit funds for your supplier to us; we will remit to him or her within 1 business day. This way, there will be no delays in the processing and shipping of your goods to you.',
          'Or you are traveling and want to receive your funds in Yuan when you arrive in China, we have got you covered. Simply give us Naira and we will make the Yuan equivalent available to you once you arrive in China. No stories.',
        ]}
        linkText="Get Started"
      />
      <Banner />
      <AffiliateSection />
    </div>
  );
};

import React from 'react';

interface InfoSectionProps {
  description: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ description }) => (
  <section className="flex shrink-0 grow basis-0 flex-col max-lg:mb-3 max-md:max-w-full">
    <p className="text-base leading-6 tracking-normal text-slate-600 max-md:max-w-full">
      {description}
    </p>
  </section>
);

const Banner: React.FC = () => {
  const router = useRouter();
  return (
    <main className="mx-20 flex flex-col gap-5 rounded-xl bg-slate-50 px-8 py-6 max-xl:mx-10 max-lg:mx-3 max-md:mx-0 max-md:flex-wrap max-md:px-5">
      <div className="w-full justify-center border-l-[3px] border-solid border-indigo-800 px-2.5 text-lg font-semibold capitalize leading-5 tracking-normal text-slate-900 max-md:max-w-full">
        To start creating a Pay Supplier Request – Login or Sign up then click
        Pay Supplier to create a request.
      </div>
      <div className="flex max-lg:flex-col">
        <InfoSection description="For more information on this service, send an email to hello@sureimports.com or call +234-806-458-3664 or visit us at 5 Olutosin Ajayi Street by CPM Headquarters Ajao Estate Lagos; Monday to Friday, 9am to 5pm." />
        <Button
          className="h-12 w-32"
          onClick={() => router.push('/auth/signup')}
        >
          Sign Up
        </Button>
      </div>
    </main>
  );
};
