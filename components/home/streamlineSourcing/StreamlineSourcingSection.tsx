import * as React from 'react';
import SectionType1 from './SectionType1';
import CustomImage from './CustomImage';
import SectionType2 from './SectionType2';
import { SectionType3 } from './SectionType3';
import { SectionType4 } from './SectionType4';
import LandingCostCalculator from './SectionType6';
import Link from 'next/link';

const StreamlineSourcingSection: React.FC = () => {
  return (
    <main className="mt-24 flex flex-col">
      <header className="flex flex-col self-center px-5 text-center max-md:max-w-full">
        <h1 className="self-center text-4xl font-extrabold capitalize text-slate-800 max-md:max-w-full">
          Streamlined Sourcing Solutions
        </h1>
        <p className="mt-2.5 text-base leading-6 tracking-normal text-slate-600 max-md:max-w-full">
          Here are the ways we make product sourcing from China a breeze for
          you.
        </p>
      </header>

      <section className="mb-20 mt-16 w-full self-center px-28 transition-transform duration-300 hover:scale-105 max-xl:px-20 max-lg:px-10 max-md:mt-10 max-md:max-w-full max-md:px-2">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <div className="flex w-6/12 flex-col max-md:ml-0 max-md:w-full">
            <div className="my-auto flex flex-col justify-center self-stretch text-base leading-6 tracking-normal text-slate-600 max-md:mt-10 max-md:max-w-full">
              <div className="flex flex-col px-5 max-md:max-w-full">
                <h2 className="text-3xl font-extrabold capitalize leading-10 tracking-tight text-slate-900 max-md:max-w-full">
                  Special Product Sourcing.
                </h2>
                <p className="mt-3 text-slate-600 max-md:max-w-full">
                  We can source any product from China for you whilst
                  guaranteeing the quality you will receive. To do this, we will
                  create a WhatsApp group with our China team who will handle
                  the sourcing for you.
                </p>
                <p className="mt-3 text-slate-600 max-md:hidden max-md:max-w-full">
                  We have a team with extensive experience in negotiating and
                  buying products from Chinese suppliers. We will work with you
                  until we get exactly what you want.
                </p>
                <Link
                  className="mt-3 font-semibold leading-6 text-indigo-800 underline max-md:max-w-full"
                  href="/services/special-sourcing"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
          <div className="ml-5 flex w-6/12 flex-col max-md:ml-0 max-md:w-full">
            <CustomImage
              src="/home/streamline/special-product-sourcing.svg"
              alt="Special Product Sourcing Image"
              className="aspect-[1.16] w-full grow max-md:mt-10 max-md:max-w-full"
            />
          </div>
        </div>
      </section>
      <div className="flex max-md:flex-col max-md:gap-0">
        <SectionType3
          title="General Product Procurement."
          description="You can search for products on Chinese websites and place an order right here. We can buy products from over 100 websites in China."
          linkText="Learn More"
          linkHref="/services/general-procurement"
          images={[
            {
              src: '/home/streamline/gps-1688.svg',
              alt: '',
              className: 'w-[160px]',
            },
            {
              src: '/home/streamline/gps-alibaba.svg',
              alt: '',
              className: 'w-[231px]',
            },
            {
              src: '/home/streamline/gps-dhgate.svg',
              alt: '',
              className: 'w-[160px]',
            },
            {
              src: '/home/streamline/gps-mbaobao.svg',
              alt: '',
              className: 'w-[118px]',
            },
            {
              src: '/home/streamline/gps-pinduoduo.svg',
              alt: '',
              className: 'w-[163px]',
            },
            {
              src: '/home/streamline/gps-koala.svg',
              alt: '',
              className: 'w-[136px]',
            },
          ]}
          containerClasses="flex flex-col w-6/12 max-md:ml-0 max-md:w-full pl-20 max-lg:px-8 max-lg:pr-5 py-11 bg-orange-400 bg-opacity-10 max-md:px-5"
          imageWrapperClasses="max-md:mt-10"
        />
        <SectionType4
          title="Shipping Only"
          description="We’re able to ship products from China to any country. If you already have a supplier and have made payment to them..."
          linkText="Learn More"
          linkHref="/services/shipping-only"
          images={[
            {
              src: '/home/streamline/ship-circle.svg',
              alt: '',
              className: 'w-20 max-xl:w-12 max-lg:w-14 max-md:w-14',
            },
            {
              src: '/home/streamline/ship-we-only-need.svg',
              alt: '',
              className:
                'w-[535px] max-xl:w-[360px] max-lg:w-full max-md:w-full',
            },
            {
              src: '/home/streamline/ship-fullname.svg',
              alt: '',
              className: 'w-40 max-xl:w-32 max-lg:w-32 max-md:w-32',
            },
            {
              src: '/home/streamline/ship-phone-number.svg',
              alt: '',
              className: 'w-52 max-xl:w-44 max-lg:w-44 max-md:w-44',
            },
            {
              src: '/home/streamline/ship-del-address.svg',
              alt: '',
              className: 'w-56 max-xl:w-44 max-lg:w-44 max-md:w-44',
            },
          ]}
          containerClasses="flex flex-col w-6/12 max-md:ml-0 max-md:w-full py-10 px-8 bg-indigo-800 bg-opacity-10 max-md:px-5"
          imageWrapperClasses="mt-10"
        />
      </div>

      <SectionType1
        title="Deal directly with Suppliers"
        content={[
          'You can visit our shop to buy our supplier contacts documents for various products. This way you can deal directly with suppliers in China. Your suppliers will ship to our China office and then we ship to you.',
          'We can also help you to verify the products you buy from them. We do this at 5% of the product cost',
        ]}
        linkText="Learn More"
        linkHref="/shop/deal-directly-with-suppliers"
        imageUrl="/home/streamline/deal-directly.svg"
        imageAlt="Deal directly with Suppliers Image"
      />

      <SectionType2
        imageUrl="/home/streamline/streamline-pay-supplier.svg"
        imageAlt="Pay Supplier Image"
        linkHref="/services/pay-supplier"
        title="Pay Supplier"
        paragraphs={[
          'We help thousands of people across the world to safely pay their suppliers in China. If you are worried about whether you are dealing with the right supplier and the safety of your funds.',
          'We will assist by verifying and paying your suppliers on your behalf. Your suppliers will be credited within one business day. Note that we can pay suppliers in Chinese Yuan only',
        ]}
        linkText="Learn More"
      />

      <LandingCostCalculator />
    </main>
  );
};

export default StreamlineSourcingSection;
