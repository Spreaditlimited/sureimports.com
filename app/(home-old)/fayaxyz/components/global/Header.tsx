'use client'; // if you're using Next.js app router

import React, { useEffect, useState } from 'react';
import logo from '@/public/assets/img/logo.svg';
import logoM from '@/public/assets/img/sure-import.png';
import Link from 'next/link';
import Image from 'next/image';
import MenuDrawer from './MenuDrawer';
import { usePathname } from 'next/navigation';
import { FiPhoneCall } from 'react-icons/fi';
import { HiOutlineUserCircle } from 'react-icons/hi2';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10); // Adjust as needed
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run on load in case user refreshes while scrolled

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', link: '/' },
    { name: 'Videos', link: '/#videos' },
    { name: 'Services', link: '/#services' },
    { name: 'Shop', link: '/#shop' },
    { name: 'Calculator', link: '/#calculator' },
  ];

  ///
  const pathname = usePathname();

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#464682] py-3 sm:py-4'
          : 'py-4 pt-[40px] sm:py-6 sm:pt-6 2xl:py-[33px] 2xl:pt-[33px]'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="w-[92%] max-w-[267px] lg:max-w-[250px] 2xl:max-w-[356px]"
          >
            <Image
              src={logo}
              alt="logo"
              className="hidden w-[92%] max-w-[267px] sm:block lg:max-w-[250px] 2xl:max-w-[356px]"
            />
            <Image
              src={logoM}
              alt="logo"
              className="w-[93%] max-w-[267px] sm:hidden"
            />
          </Link>

          <MenuDrawer navLinks={navItems} />

          <nav className="hidden xl:block">
            <ul className="flex items-center gap-8 2xl:gap-10">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    className={`border-b text-[18px] leading-[155%] transition-all duration-300 ease-linear ${
                      pathname === item.link
                        ? 'border-[#F58634] font-semibold text-[#F58634]'
                        : 'border-transparent font-normal text-white hover:border-[#F58634] hover:text-[#F58634]'
                    }`}
                    href={item.link}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-5 xl:flex">
            <button className="rounded-[10px] bg-white p-2.5 text-black transition-all duration-200 ease-linear hover:opacity-50">
              <HiOutlineUserCircle size={24} />
            </button>
            <button className="flex items-center gap-2.5 rounded-[10px] bg-[var(--dark-color)] px-[30px] py-2.5 text-white transition-all duration-200 ease-linear hover:opacity-70">
              <FiPhoneCall size={23} />
              <span className="whitespace-nowrap text-[18px] font-semibold leading-[155%]">
                Book a Call
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
