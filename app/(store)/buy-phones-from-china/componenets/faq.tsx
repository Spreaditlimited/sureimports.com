'use client';
import React, { useState, useEffect, ReactNode } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// ✅ Props for PlusMinusIcon
interface PlusMinusIconProps {
  isOpen: boolean;
}

const PlusMinusIcon: React.FC<PlusMinusIconProps> = ({ isOpen }) => (
  <span className="faq-icon relative block h-4 w-4">
    {/* Horizontal line (always visible) */}
    <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded-[30px] bg-black" />

    {/* Vertical line (animates to disappear) */}
    <span
      className={`absolute left-1/2 top-0 h-full w-[2px] origin-center -translate-x-1/2 rounded-[30px] bg-black transition-transform duration-300 ${
        isOpen ? 'rotate-90' : 'rotate-0'
      }`}
    />
  </span>
);

// ✅ Props for FaqItem
interface FaqItemProps {
  question: string;
  answer: string | ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({
  question,
  answer,
  isOpen,
  onToggle,
}) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="border-b-solid border-b-[1px] border-b-[#CBCBCB]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-[25px] text-left max-sm:py-[20px]"
      >
        <span className="text-[18px] font-medium leading-[155%] text-black max-lg:pr-[20px] max-sm:text-[16px]">
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

// ✅ FAQ item structure
interface FaqData {
  question: string;
  answer: string | ReactNode;
}

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FaqData[] = [
    {
      question: 'Q1: How long have you been in operation?',
      answer:
        'We were incorporated in 2018 as Spreadit Limited and now answer Sure Importers Limited. So, we have been around for quite some time.',
    },
    {
      question: 'Q2: Do you have a physical office in Nigeria?',
      answer: (
        <>
          Yes we do. Our office address is: <br />
          Sure Imports
          <br />5 Olutosin Ajayi (Martins Adegboyega) Street, Ajao Estate,
          Lagos, Nigeria.
        </>
      ),
    },
    {
      question: 'Q3: Do you have a physical office in China?',
      answer: (
        <>
          Yes. Our office address is: <br />
          Room 323 3/F Mingsheng Business Centre 12-20 Guangyang road, M. Baiyun
          District, Guangzhou, China.
          <br />
          广州市白云区广源中路18号明圣商贸城明圣商贸城323档
        </>
      ),
    },
    {
      question: 'Q4: Do you source other products beyond phones and laptops?',
      answer:
        'Yes, we do. You can chat with us using the WhatsApp button on this page for more information.',
    },
    {
      question:
        'Q5: What’s the estimated timeline between ordering a device and receiving it?',
      answer: '10 business days',
    },
    {
      question: 'Q6: Do your prices include shipping and clearing costs?',
      answer:
        'Yes. The prices seen on our website include international shipping and clearing costs from China to our Lagos office. You can pick up or we Waybill to you at a separate cost.',
    },
    {
      question:
        'Q7: You give warranty on your phones, even second hand phones and laptops?',
      answer:
        'Yes, we do. Our second hand or pre-owned phones, as we love to call them, are typically sold as brand new phones in most places in Nigeria. Our second hand phones come in their boxes with all accessories that you would think they are brand new. Our laptops have a 3-month warranty and they get to you with a charger and a laptop bag',
    },
    {
      question: 'Q8: What does your warranty cover?',
      answer:
        'Our warranty covers malfunctioning due to factory fault. It does not cover falls, water damage, and general damage coming from misuse.',
    },
    {
      question: 'Q9: Do you offer pay on delivery?',
      answer:
        'No. we do not offer pay on delivery for any of our procurement services. Payment must be made in full and in advance before we procure any device; whether you are making a one time payment or using our pay small small service.',
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      className="p-[75px_0px_120px] max-xl17:p-[20px_0px_50px] max-xl:p-[20px_0px_40px] max-lg:p-[20px_0px_30px] max-sm:p-[50px_0px]"
      data-aos="fade-up"
    >
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <div className="mb-[25px] max-lg:text-center max-sm:mb-[10px]">
            <h2 className="gradient-text inline-block text-[36px] font-semibold leading-[152%] max-sm:text-[32px]">
              Frequently Asked Questions (FAQ)
            </h2>
          </div>
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
