import SEO from '@/components/SEO';
import AffiliateSection from '@/components/home/AffiliateSection';
// import MiniHeaderSection from '@/components/home/about-us/miniHeader';
import Section1 from '@/components/home/about-us/section1';
import Section2 from '@/components/home/about-us/section2';
import Section3 from '@/components/home/about-us/section3';
import type { Metadata } from 'next';

let titlex = 'About Us';
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

const AboutUsPage = () => {
  return (
    <>
      <div>
        {/* <MiniHeaderSection
        imageUrl="/home/mini-header-bg.png"
        altText="About Sure Importers Limited"
        title="About Sure Importers Limited"
      /> */}

        <Section1
          imageUrl="/home/about-us/section-1.svg"
          imageAlt="Sure Importers Limited "
          linkHref="/auth/login"
          title="Sure Importers Limited"
          paragraphs={[
            'is a leading product sourcing company with a global presence, specializing in facilitating the procurement and shipping of goods from China, the USA, South Korea, and the UAE.',
            'With a diverse clientele of over 30,000 individuals and businesses worldwide, Sure Importers Limited has established itself as a trusted partner in the international trade arena.',
          ]}
          linkText="Get Started"
        />
        <Section2 />
        <Section3 />
        <AffiliateSection />
      </div>
    </>
  );
};

export default AboutUsPage;
