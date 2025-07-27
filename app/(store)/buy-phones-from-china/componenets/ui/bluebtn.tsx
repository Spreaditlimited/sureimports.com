'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type BluebtnProps = {
  href?: string;
  text?: string;
  className?: string;
  affiliateRef?: string;
};

const Bluebtn: React.FC<BluebtnProps> = ({
  href = '/auth/signup-store?affRef=na',
  text = 'Buy Now',
  className = '',
}) => {
  const searchParams = useSearchParams();

  const userAffiliateRefx = new URLSearchParams(searchParams).get('affRef');

  const affiliateLink = '/auth/signup-store?affRef=' + userAffiliateRefx;

  return (
    <Link
      href={affiliateLink || href}
      className={`duration-[0.3s] inline-flex items-center justify-center rounded-[30px] bg-store-blue p-[12px_47px] text-[18px] font-medium leading-[155%] text-store-white transition-all hover:opacity-70 max-xl14:p-[10px_30px] max-xl14:text-[16px] max-sm:p-[12px_47px] max-sm:text-[18px] ${className}`}
    >
      {text}
    </Link>
  );
};

export default Bluebtn;
