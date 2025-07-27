'use client';

import Link from 'next/link';

type BluebtnProps = {
  href?: string;
  text?: string;
  className?: string;
};

const Bluebtn: React.FC<BluebtnProps> = ({
  href = '/',
  text = 'Buy Now',
  className = '',
}) => {
  return (
    <Link
      href={href}
      className={`bg-blue duration-[0.3s] inline-flex items-center justify-center rounded-[30px] p-[12px_47px] text-[18px] font-medium leading-[155%] text-white transition-all hover:opacity-70 max-xl14:p-[10px_30px] max-xl14:text-[16px] max-sm:p-[12px_47px] max-sm:text-[18px] ${className}`}
    >
      {text}
    </Link>
  );
};

export default Bluebtn;
