// components/MenuDrawer.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiOutlineUserCircle } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiPhoneCall } from 'react-icons/fi';

export type NavLink = {
  name: string;
  link: string;
};

interface MenuDrawerProps {
  navLinks: NavLink[];
}

export default function MenuDrawer({ navLinks }: MenuDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen((prev) => !prev);

  const pathname = usePathname();
  return (
    <div className="flex flex-1 justify-end xl:hidden">
      {/* Hamburger Icon */}
      <button
        onClick={toggleDrawer}
        className="rounded-[10px] bg-[#3730A3] px-[14px] py-1 text-3xl xl:hidden"
      >
        <HiMenuAlt3 color="#fff" size={42} />
      </button>

      {/* Overlay + Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="xl:hidden">
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/60"
              onClick={toggleDrawer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Drawer */}
            <motion.div
              className="fixed left-0 top-0 z-50 h-full w-64 overflow-y-auto bg-[#464682] p-6 text-white shadow-lg"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween' }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Menu</h2>
                <button onClick={toggleDrawer} className="text-2xl">
                  <IoClose />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.link}
                    href={link.link}
                    onClick={toggleDrawer}
                    className={`text-[18px] font-semibold leading-[155%] transition-all duration-300 ease-linear ${
                      pathname === link.link
                        ? 'text-[#F58634] underline'
                        : 'text-white hover:text-[#F58634] hover:underline'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 flex flex-col items-center gap-5">
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
