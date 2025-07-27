import * as React from 'react';

import GeneralProcurement from './GeneralProcurement';
import SpecialProductSourcing from './SpecialProductSourcing';
import DealDirectWithSuppliers from './DealDirectWithSuppliers';
import ShipingOnly from './ShipingOnly';
import PaySupplier from './PaySupplier';
import BuyPhones from './BuyPhones';
import CostCalculator from './CostCalculator';

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

      <div className="mx-5 mt-10 md:mx-10 lg:mx-10 xl:mx-20 2xl:mx-40">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:gap-0">
          <div className="flex w-full flex-col gap-5 md:w-8/12 md:gap-5">
            <div className="w-full">
              <GeneralProcurement
                imageUrl="/home/services/gen-proc.svg"
                imageAlt="Spreadit Limited "
                linkHref="/auth/login"
                title="General Product Procurement"
                subtitle="These are some of the stores we can buy products from…"
                paragraphs={[
                  'You can search for products on Chinese websites and place an order right here. We can buy products from over 100 websites in China.',
                ]}
                linkText="Create an Order"
                linkhref2="/dashboard"
                linktext2="Visit your saved orders"
                images={[
                  {
                    src: '/home/services/1688.svg',
                    alt: '',
                    className: 'w-[160px] ',
                  },
                  {
                    src: '/home/services/alibaba.svg',
                    alt: '',
                    className: 'w-[231px]',
                  },
                  {
                    src: '/home/services/pinduoduo.svg',
                    alt: '',
                    className: 'w-[163px]',
                  },
                  {
                    src: '/home/services/koala.svg',
                    alt: '',
                    className: 'w-[136px]',
                  },
                  {
                    src: '/home/services/mbaobao.svg',
                    alt: '',
                    className: 'w-[118px]',
                  },
                ]}
                // images={[
                //   {
                //     src: '/home/streamline/gps-1688.svg',
                //     alt: '',
                //     className: 'w-[160px]',
                //   },
                //   {
                //     src: '/home/streamline/gps-alibaba.svg',
                //     alt: '',
                //     className: 'w-[231px]',
                //   },
                //   // {
                //   //   src: '/home/streamline/gps-dhgate.svg',
                //   //   alt: '',
                //   //   className: 'w-[160px]',
                //   // },
                //   {
                //     src: '/home/streamline/gps-mbaobao.svg',
                //     alt: '',
                //     className: 'w-[118px]',
                //   },
                //   {
                //     src: '/home/streamline/gps-pinduoduo.svg',
                //     alt: '',
                //     className: 'w-[163px]',
                //   },
                //   {
                //     src: '/home/streamline/gps-koala.svg',
                //     alt: '',
                //     className: 'w-[136px]',
                //   },
                // ]}
                imageWrapperClasses="max-md:mt-10"
              />
            </div>
            <div className="flex flex-grow">
              <DealDirectWithSuppliers />
            </div>
          </div>
          <div className="mr-1 flex w-full flex-col gap-5 md:gap-5">
            <div>
              {' '}
              <SpecialProductSourcing />
            </div>
            <div className="flex flex-grow">
              <ShipingOnly
                title="Shipping Only"
                description="We’re able to ship products from China to any country. If you already have a supplier and have made payment to them, simply Instruct them to write your name, phone number and full delivery address on the shipment showing your COUNTRY in capital letters. Then send your shipment to our China office. We will handle the rest."
                images={[
                  {
                    src: '/home/streamline/ship-circle.svg',
                    alt: '',
                    className:
                      ' md:w-[45px] w-[50px] lg:w-[60px]   xl:w-[76px] ',
                  },
                  {
                    src: '/home/streamline/ship-we-only-need.svg',
                    alt: '',
                    className:
                      'xl:w-[606px] 2xl:w-[540px]  lg:w-[450px]  md:w-[300px] w-[250px]  xs:w-[300px]  ',
                  },
                  {
                    src: '/home/streamline/ship-fullname.svg',
                    alt: '',
                    className:
                      'xl:w-[182px] 2xl:w-[152px]    ml-0 md:w-3/12 md:w-1/2 w-[120px] mt-0  lg:mt-0  xl:mt-5',
                  },
                  {
                    src: '/home/streamline/ship-phone-number.svg',
                    alt: '',
                    className:
                      'xl:w-[236px]  2xl:w-[206px]  md:w-4/12 md:ml-1 ml-0 lg:ml-0  mt-0 w-[150px] lg:mt-0 xl:mt-5',

                    // className:
                    //   'w-52 mt-0 2xl:mt-0 xl:mt-3 max-xl:w-44 max-lg:w-44 max-md:w-44',
                  },
                  {
                    src: '/home/streamline/ship-del-address.svg',
                    alt: '',
                    className:
                      'xl:w-[247px] 2xl:w-[217px]  md:w-4/12 md:ml-1 ml-0 lg:ml-0 w-[150px] mt-0 lg:mt-0 xl:mt-5',

                    // className:
                    //   'w-56 mt-0 2xl:mt-0 xl:mt-3 max-xl:w-44 max-lg:w-44 max-md:w-44',
                  },
                ]}
                containerClasses=" rounded-3xl  max-md:ml-0  max-md:w-full py-3 pl-8 bg-white max-md:pl-5"
                imageWrapperClasses="mt-10"
              />
            </div>
          </div>
        </div>
        <div className="mb-5 mt-5 flex w-full flex-col justify-between gap-5 md:flex-row">
          <div className="flex w-full flex-col gap-5 md:w-11/12">
            <div className="">
              <PaySupplier />
            </div>
            <div className="flex flex-grow">
              <CostCalculator />
            </div>
          </div>
          <div className="mr-1 flex w-full flex-grow md:w-5/12">
            <BuyPhones />
          </div>
        </div>
      </div>
    </main>
  );
};

export default StreamlineSourcingSection;
