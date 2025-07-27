'use client';

import Link from 'next/link';

interface WhitebtnProps {
  href?: string;
  text?: string;
  className?: string;
}

const Whitebtn: React.FC<WhitebtnProps> = ({
  href = '/',
  text = 'Click Me',
  className = '',
}) => {
  return (
    <Link
      href={href}
      className={`duration-[0.3s] inline-flex items-center justify-center rounded-[30px] bg-white p-[11px_33px] text-[18px] font-medium leading-[155%] text-black transition-all hover:opacity-70 ${className}`}
    >
      {text}
    </Link>
  );
};

export default Whitebtn;
