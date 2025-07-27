import AffiliateSection from '@/components/home/AffiliateSection';
// import MiniHeaderSection from '@/components/home/about-us/miniHeader';
import Section1 from '@/components/home/services/generalProcurement';
import type { Metadata } from 'next';

let titlex = 'Buy Phones from China';
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

const BuyPhonesFromChina = () => {
  return (
    <div>
      {/* <MiniHeaderSection
        imageUrl="/home/mini-header-bg.png"
        altText="Buy Phones From China"
        title="Buy Phones From China"
      /> */}
      <Section1
        imageUrl="/home/services/buy-phone-from-china.svg"
        imageAlt="Spreadit Limited "
        linkHref="/auth/login"
        title="Buy Phones From China"
        subtitle="BRANDS WE DEAL WITH"
        paragraphs={[
          'At the moment, we ship only iPhones and Samsung phones from China. We will start shipping other phones when we get better deals from verified suppliers in China. ',
          'Our phones come with a one year warranty, whether used or brand new. They also come with all accessories for the model of phone you are buying and in their boxes. ',
          'Click the button below to sign up or sign into your account on our website. Click “Buy Phone” in the side menu to start ordering phones. Our prices are in RMB but automatically converted to USD and Naira. ',
        ]}
        linkText="Get Started"
        linkhref2=""
        linktext2=""
        images={[
          {
            src: '/home/shop/apple-logo.svg',
            alt: '',
            className: 'w-[155px]',
          },
          {
            src: '/home/shop/samsung-logo.svg',
            alt: '',
            className: 'w-[175px]',
          },
        ]}
        imageWrapperClasses="max-md:mt-10"
      />
      <AffiliateSection />
    </div>
  );
};

export default BuyPhonesFromChina;
