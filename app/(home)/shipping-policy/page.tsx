import AffiliateSection from '@/components/home/AffiliateSection';
// import MiniHeaderSection from '@/components/home/about-us/miniHeader';
import ShippingPolicy from '@/components/home/shipping-policy/shippingPolicy';
import type { Metadata } from 'next';

let titlex = 'Shipping Policy';
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

const ShippingPolicyPage = () => {
  return (
    <div>
      {/* <MiniHeaderSection
        imageUrl="/home/mini-header-bg.png"
        altText="Privacy Policy"
        title="Privacy Policy"
      /> */}
      <div className="flex justify-center pt-40 max-md:pt-32">
        <ShippingPolicy />
      </div>

      <AffiliateSection />
    </div>
  );
};

export default ShippingPolicyPage;
