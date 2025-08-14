import AffiliateSection from '@/components/home/AffiliateSection';
// import MiniHeaderSection from '@/components/home/about-us/miniHeader';
import Section1 from '@/components/home/services/shippingOnly';
import type { Metadata } from 'next';

let titlex = 'Shipping Only';
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
        altText="Shipping Only"
        title="Shipping Only"
      /> */}
      <Section1
        imageUrl="/home/services/shipping-only.svg"
        imageAlt="Spreadit Limited "
        linkHref="/auth/login"
        title="Shipping Only"
        paragraphs={[
          'You have already bought your goods yourself or you wish to handle procurement yourself? No problem. We can handle only shipping for you and we have an address in China where you can send your goods to.',
          'You will need to sign into your free account on our website, select Shipping Only, and then provide details of the product you are sending to our office. You will also select if you want us to verify the correctness of what your supplier will send to us. We charge a small fee of 5RMB per kg for product verification. ',
          'When your supplier sends your shipment to us, please, share tracking information with us. Kindly ensure that your supplier writes your name, phone number and destination country on your shipment. This is very important as we receive a lot of shipment going to many countries. ',
        ]}
        linkText="Get Started"
      />
      <AffiliateSection />
    </div>
  );
};

export default ShippingOnlyPage;
