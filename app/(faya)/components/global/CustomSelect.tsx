'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa6';
import { FiCheck } from 'react-icons/fi';

interface CustomSelectProps {
  value: string;
  setValue: (value: string) => void;
  options?: string[];
  placeholder?: string;
}

const defaultOptions = [
  'Pick up',
  'Standard Delivery - 3 to 5 days',
  'Express Delivery - 1 to 2 days',
  'Pickup at location',
];

export default function CustomSelect({
  value,
  setValue,
  options = defaultOptions,
  placeholder = 'Select delivery option',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-[10px] border border-transparent bg-[#F0F0F0] px-5 py-3 text-[16px] font-medium leading-[142.857%] text-[#363636] transition-all duration-300 ease-in-out focus:border-black md:leading-[187%]"
      >
        {value || placeholder}
        <FaChevronDown
          className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          size={16}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-2 w-full overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-lg"
          >
            {options.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => {
                    setValue(option);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-5 py-3 text-left text-sm transition-all hover:bg-gray-100 ${
                    value === option
                      ? 'font-semibold text-[#3730A3]'
                      : 'text-gray-700'
                  }`}
                >
                  {option}
                  {value === option && <FiCheck />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
