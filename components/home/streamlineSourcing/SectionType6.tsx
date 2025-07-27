import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type CardProps = {
  imgSrc: string;
  imgAlt: string;
  heading: string;
  content: string;
  link: string;
  width?: number; // Image width
  className: React.HTMLProps<HTMLElement>['className'];
  imgClassName?: React.HTMLProps<HTMLElement>['className'];
};

const Card: React.FC<CardProps> = ({
  imgSrc,
  imgAlt,
  heading,
  content,
  link,
  width,
  className,
  imgClassName,
}) => (
  <section
    className={`flex grow flex-col justify-between bg-opacity-10 text-base tracking-normal transition-transform duration-300 hover:scale-105 max-md:max-w-full ${className}`}
  >
    <div className="relative flex min-h-[406px] w-full flex-col justify-around overflow-hidden px-16 pt-10 max-xl:px-8 max-lg:px-2 max-md:max-w-full max-md:px-0">
      <div className="relative flex w-full flex-col px-5 max-md:mb-10 max-md:px-5">
        <h2 className="text-3xl font-[860] capitalize leading-10 tracking-tight text-slate-900 max-xl:pr-40 max-lg:pr-0 max-md:max-w-full">
          {heading}
        </h2>
        <p className="mt-3 leading-6 text-slate-600 max-md:max-w-full">
          {content}
        </p>
        <Link
          href={link}
          className="mt-3 font-[590] leading-[150%] text-indigo-800 underline max-md:max-w-full"
        >
          Learn More
        </Link>
      </div>
      <div className="flex justify-end align-bottom max-md:justify-center">
        <div className={`relative ${imgClassName}`}>
          <Image
            loading="lazy"
            src={imgSrc}
            alt={imgAlt}
            layout="responsive"
            width={width || 0}
            height={0}
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  </section>
);

const LandingCostCalculator: React.FC = () => (
  <main>
    <section className="flex max-md:flex-col">
      <Card
        imgSrc="/home/streamline/calculator.png"
        imgAlt="Landing Cost Calculator Image"
        heading="Use our Landing Cost Calculator"
        content="If you are new to importing from China, our landing cost calculator will serve you well. Our landing cost calculator..."
        link="https://spreaditglobal.com/calculator"
        className="w-6/12 bg-indigo-800 max-md:w-full"
        width={160}
        imgClassName="w-[165px] max-h-[213px] right-10"
      />
      <Card
        imgSrc="/home/streamline/buy-phones-from-china.png"
        imgAlt="Phones from China Image"
        heading="Buy Phones from China"
        content="We ship the best brand new and used phones from China. Phones are delivered within 10 business days after payment."
        link="/services/general-procurement"
        className="w-6/12 bg-orange-400 max-md:w-full"
        width={420}
        imgClassName="max-2xl:w-[420px] max-lg:w-[300px]"
      />
    </section>
  </main>
);

export default LandingCostCalculator;
