'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface WhitebtnProps {
  href?: string;
  text?: string;
  className?: string;
}

const Whitebtn: React.FC<WhitebtnProps> = ({
  href = '/auth/signup-store',
  text = 'Click Me',
  className = '',
}) => {
  const searchParams = useSearchParams();
  const userAffiliateRefx = new URLSearchParams(searchParams).get('affRef');

  const affiliateLink = '/auth/signup-store?affRef=' + userAffiliateRefx;

  return (
    <Link
      href={affiliateLink ?? href}
      className={`duration-[0.3s] inline-flex items-center justify-center rounded-[30px] bg-white p-[11px_33px] text-[18px] font-medium leading-[155%] text-black transition-all hover:opacity-70 ${className}`}
    >
      {text}
    </Link>
  );
};

export default Whitebtn;
