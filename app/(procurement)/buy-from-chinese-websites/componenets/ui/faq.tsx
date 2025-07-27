'use client';
import React, { useState, useEffect, ReactNode } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// ✅ Types
export interface FaqEntry {
  question: string;
  answer: string | ReactNode;
}

interface FaqProps {
  faqs: FaqEntry[];
  title?: string;
  initialOpenIndex?: number | null;
}

// ✅ PlusMinusIcon Component
const PlusMinusIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <span className="faq-icon relative block h-4 w-4">
    <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded-[30px] bg-black" />
    <span
      className={`absolute left-1/2 top-0 h-full w-[2px] origin-center -translate-x-1/2 rounded-[30px] bg-black transition-transform duration-300 ${
        isOpen ? 'rotate-90' : 'rotate-0'
      }`}
    />
  </span>
);

// ✅ FaqItem Component
const FaqItem: React.FC<{
  question: string;
  answer: string | ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ question, answer, isOpen, onToggle }) => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="border-b-solid border-b-[1px] border-b-[#CBCBCB]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-[25px] text-left max-sm:py-[20px]"
      >
        <span className="text-[18px] font-medium leading-[155%] text-black max-lg:pr-[20px] max-sm:pr-7 max-sm:text-[16px]">
          {question}
        </span>
        <PlusMinusIcon isOpen={isOpen} />
      </button>
      {isOpen && (
        <div className="text-gray pb-[30px] text-[16px] font-normal leading-[175%] max-sm:pb-[20px] max-sm:text-[14px]">
          {answer}
        </div>
      )}
    </div>
  );
};

// ✅ Faq Main Component
const Faq: React.FC<FaqProps> = ({
  faqs,
  title = 'Frequently Asked Questions (FAQ)',
  initialOpenIndex = null,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(initialOpenIndex);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      className="p-[120px_0px_120px] max-xl17:p-[50px_0px_50px] max-xl:p-[40px_0px_40px] max-lg:p-[30px_0px_30px] max-sm:p-[50px_0px]"
      data-aos="fade-up"
    >
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          {title && (
            <div className="mb-[25px] max-lg:text-center max-sm:mb-[10px]">
              <h2 className="gradient-text inline-block text-[36px] font-semibold leading-[152%] max-[360px]:text-[32px]">
                {title}
              </h2>
            </div>
          )}
          <div className="faq-block">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
