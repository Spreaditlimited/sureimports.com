import Link from 'next/link';
import React from 'react';
import { GoArrowUpRight } from 'react-icons/go';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  href?: string;
};

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-[#3730A3] text-white',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  outline: 'border border-[#3730A3] text-[#3730A3] bg-[#EFEEFF]',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

export default function Button({
  variant = 'primary',
  children,
  className = '',
  href,
  ...props
}: ButtonProps) {
  const baseClasses =
    'px-[30px]  py-2.5 rounded-[50px] font-medium leading-[175%] sm:leading-[155%] text-[16px] sm:text-[18px] transition duration-200 ease-in-out flex items-center gap-2.5 group';

  const allClasses = `${baseClasses} ${variants[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={allClasses}>
        {children}
        <GoArrowUpRight
          className="transition-all duration-200 ease-linear group-hover:rotate-45"
          size={20}
        />
      </Link>
    );
  }

  return (
    <button className={allClasses} {...props}>
      {children}
      <GoArrowUpRight
        className="transition-all duration-200 ease-linear group-hover:rotate-45"
        size={20}
      />
    </button>
  );
}
