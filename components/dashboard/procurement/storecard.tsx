import Image from 'next/image';
import React from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useHref } from 'react-router-dom';

interface StoreItems {
  title: string;
  icon: string;
  href?: string;
}

function Storecard({ title, icon, href }: StoreItems) {
  const { theme } = useTheme();

  return (
    <Link href={href as any} target="_blank">
      <div className="flex h-[210px] flex-col items-center justify-center rounded-xl bg-white shadow hover:cursor-pointer dark:bg-gray-800 xl:w-[274px]">
        <div className="flex h-[152px] items-center justify-center rounded-md border border-slate-100 bg-slate-50 dark:border-gray-700 dark:bg-gray-700 max-xl:w-[200px] max-sm:w-[300px] xl:w-[250px]">
          <Image
            src={theme === 'dark' ? icon.replace('.svg', '-dark.svg') : icon}
            alt="store"
            quality={100}
            width={250}
            height={152}
          />
        </div>
        <div className="mt-[11px] text-center text-base font-semibold text-slate-950 dark:text-white">
          {title}
        </div>
      </div>
    </Link>
  );
}

export default Storecard;
