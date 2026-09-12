'use client';
import Image from 'next/image';
import React from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useMemo, useState } from 'react';

interface StoreItems {
  title: string;
  icon: string;
  href?: string;
}

function Storecard({ title, icon, href }: StoreItems) {
  const { theme } = useTheme();
  const prefersDarkVariant = theme === 'dark' && icon.endsWith('.svg');
  const darkVariant = useMemo(() => icon.replace('.svg', '-dark.svg'), [icon]);
  const [hasDarkVariantError, setHasDarkVariantError] = useState(false);
  const imageSrc =
    prefersDarkVariant && !hasDarkVariantError ? darkVariant : icon;

  return (
    <Link href={href as any} target="_blank" rel="noopener noreferrer" className="min-w-0">
      <div className="flex h-[210px] w-full min-w-0 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:cursor-pointer hover:shadow-md dark:border-slate-700 dark:bg-[#161629]">
        <div className="flex h-[152px] w-full min-w-0 items-center justify-center rounded-md border border-slate-100 bg-slate-50 px-3 dark:border-slate-700 dark:bg-[#f8fafc]">
          <Image
            src={imageSrc}
            alt="store"
            quality={100}
            width={250}
            height={152}
            className="h-auto max-h-[130px] w-auto max-w-full object-contain"
            onError={() => {
              if (prefersDarkVariant) setHasDarkVariantError(true);
            }}
          />
        </div>
        <div className="mt-[11px] text-center text-base font-semibold text-slate-950 dark:text-slate-100">
          {title}
        </div>
      </div>
    </Link>
  );
}

export default Storecard;
