import AffiliateSection from '@/components/home/AffiliateSection';
// import MiniHeaderSection from '@/components/home/about-us/miniHeader';
import Section1 from '@/components/home/services/sectionPaySupplier';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import type { Metadata } from 'next';
import { Block } from './components/block';

let titlex = 'Pay Supplier';
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

const PaySupplierPage = () => {
  return (
    <div>
      <Block />
    </div>
  );
};

export default PaySupplierPage;
