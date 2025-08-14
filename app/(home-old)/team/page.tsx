import AffiliateSection from '@/components/home/AffiliateSection';
// import MiniHeaderSection from '@/components/home/about-us/miniHeader';
import TeamSection from '@/components/home/team/TeamSection';
import type { Metadata } from 'next';

let titlex = 'Team';
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

const PrivacyPolicyPage = () => {
  return (
    <div>
      {/* <MiniHeaderSection
        imageUrl="/home/mini-header-bg.png"
        altText="Team"
        title="Our Team"
      /> */}
      <div className="flex justify-center pt-40 max-md:pt-32">
        <TeamSection />
      </div>

      <AffiliateSection />
    </div>
  );
};

export default PrivacyPolicyPage;
