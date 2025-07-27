import AffiliateSection from '@/components/home/AffiliateSection';
// import MiniHeaderSection from '@/components/home/about-us/miniHeader';
import Section1 from '@/components/home/services/generalProcurement';
import type { Metadata } from 'next';

let titlex = 'General Procurement';
let descriptionx =
  'Import from China. We guarantee the quality and accuracy of every product we source for you from China.';
export const metadata: Metadata = {
  title: titlex,
  description: descriptionx,
  openGraph: {
    title: titlex,
    description: descriptionx,
    images: [
      {
        url: 'https://www.sureimports.com/images/svg-logo-white.svg',
        width: 1200,
        height: 630,
        alt: 'Sure Imports',
      },
    ],
  },
};

const ShippingOnlyPage = () => {
  return (
    <div>
      {/* <MiniHeaderSection
        imageUrl="/home/mini-header-bg.png"
        altText="General Procurement"
        title="General Procurement"
      /> */}
      <Section1
        imageUrl="/home/services/gen-proc.svg"
        imageAlt="Spreadit Limited "
        linkHref="/auth/login"
        title="General Procurement"
        subtitle="These are some of the stores we can buy products from…"
        paragraphs={[
          'Visit any of the hundreds of e-commerce websites in China to search for products. When you find what you want, create an order for the products, we buy and ship to you.',
          'To create an order, you will need the web link of the product, the weight of the product, the quantity you want, and then any other information we need to get exactly what you want. ',
        ]}
        linkText="Create an Order"
        linkhref2="/dashboard"
        linktext2="Learn How To"
        images={[
          {
            src: '/home/services/1688.svg',
            alt: '',
            className: 'w-[160px]',
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
          {
            src: '/home/services/alibaba.svg',
            alt: '',
            className: 'w-[231px]',
          },
          {
            src: '/home/services/dhgate.svg',
            alt: '',
            className: 'w-[160px]',
          },
        ]}
        imageWrapperClasses="max-md:mt-10"
      />
      <AffiliateSection />
    </div>
  );
};

export default ShippingOnlyPage;
