import AffiliateSection from '@/components/home/AffiliateSection';
// import MiniHeaderSection from '@/components/home/about-us/miniHeader';
import TermsConditions from '@/components/home/terms-conditions/termsConditions';
import type { Metadata } from 'next';

let titlex = 'Terms and Conditions';
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

const TermsAndConditionsPage = () => {
  return (
    <div>
      {/* <MiniHeaderSection
        imageUrl="/home/mini-header-bg.png"
        altText="Terms & Conditions"
        title="Terms & Conditions"
      /> */}
      <div className="flex justify-center pt-40 max-md:pt-32">
        <TermsConditions />
      </div>
      <AffiliateSection />
    </div>
  );
};

export default TermsAndConditionsPage;
