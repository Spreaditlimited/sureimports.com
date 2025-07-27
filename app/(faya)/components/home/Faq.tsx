'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { LuPlus } from 'react-icons/lu';
import { FiMinus } from 'react-icons/fi';
import Image from 'next/image';
import faya from '@/public/assets/img/faya-dark.png';

type FAQItem = {
  question: string;
  answer: string[];
  hasImage?: boolean;
};

// This is the FAQ component for the FAYA product page
const faqData: FAQItem[] = [
  {
    question: 'Is this cable compatible with my phone?',
    answer: [
      "Yes, if your phone or device supports USB-C, the FAYA cable will work seamlessly - whether it's a smartphone, tablet, iPad, or even some laptops.",
    ],
  },
  {
    question: 'Do I need a special charger to use this cable?',
    answer: [
      'To get the best performance (fast charging), use it with a PD (Power Delivery) charger. The cable is optimized for 60W PD charging, but works with standard chargers too.',
    ],
  },
  {
    question: 'How fast does it charge?',
    answer: [
      'When your battery is below 20-25%, it can charge up to 75-80% within 30 minutes, then automatically switches to standard charging for safety.',
    ],
  },
  {
    question: 'What makes this cable better than regular Type-C cables?',
    answer: [
      "- It's engineered with 5 chips and 5-core wiring for intelligent, efficient energy delivery.",
      '- Can handle up to 60W - ideal for more power-hungry devices.',
      '- Comes with a full year warranty.',
    ],
  },
  {
    question: 'Can I resell cables?', // Plain text, we'll insert image dynamically
    hasImage: true,
    answer: [
      "Absolutely! We offer up to 40% discount for bulk orders (100 units or more). You'll also get marketing support and verified stock.",
    ],
  },
  {
    question: 'What if my cable develops a fault?',
    answer: [
      'Every FAYA cable comes with a 1-year replacement warranty. Just reach out to us through hello@sureimports.com for support.',
    ],
  },
  {
    question: 'When do I receive my FAYA cable after ordering?',
    answer: [
      'Here are our estimated delivery timelines:',
      '- Lagos: Delivery is typically completed within 1 business day.',
      '- South West: Expect a delivery time of 1-3 working days.',
      '- Rest of Nigeria: Deliveries to other parts of Nigeria usually take 3-5 working days.',
      'All deliveries are handled by our logistics partners, Fez Logistics.',
    ],
  },
  // {
  //   question: 'Do you accept pay on delivery?',
  //   answer: [
  //     'Yes, we offer Pay on Delivery across Nigeria - so you can order with confidence.',
  //   ],
  // },
  {
    question: 'Do you accept pay on delivery?',
    answer: [
      'No, we do not accept pay on delivery.',
      'If you are in Lagos, you can choose the Pay and Pick up option or simply come to our office to pay and pick up. Our office is at:',
      '- Sure Imports, 5 Olutosin Ajayi (Martins Adegboyega) Street, Ajao Estate, Lagos. 0806 839 7263',
    ],
  },
  {
    question: 'What does 60W maximum capacity mean for this cable?',
    answer: [
      '- 60W is the maximum power capacity the cable can handle - suitable even for larger devices like some laptops.',
    ],
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const renderQuestion = (item: FAQItem) => {
    if (item.hasImage) {
      return (
        <span className="flex items-center gap-1.5">
          Can I resell
          <Image
            src={faya}
            alt="Faya Logo"
            width={53}
            height={18}
            className="mb-[2px] inline-block w-[43px] sm:w-[53px]"
          />
          cables?
        </span>
      );
    }
    return item.question;
  };

  return (
    <section className="sm:py-15 xl:py-30 bg-white py-[50px] xl:mt-0">
      <div className="container">
        <div className="mx-auto max-w-[1592px]">
          <h2 className="text-gradient-dark mx-auto mb-[30px] w-fit text-center text-[32px] font-semibold leading-[131%] md:text-[36px] md:leading-[152%] lg:mx-0 lg:text-start">
            Frequently Asked Questions (FAQ)
          </h2>
          <div className="flex flex-col gap-0">
            {faqData.map((item, index) => {
              const ref = useRef(null);
              const isInView = useInView(ref, { once: true, margin: '-100px' }); // triggers a bit before fully visible

              return (
                <motion.div
                  key={index}
                  ref={ref}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`overflow-hidden border-[#CBCBCB] py-5 md:py-[30px] ${
                    index === 0 ? '' : 'border-t'
                  }`}
                >
                  <motion.div initial={false} transition={{ duration: 0.3 }}>
                    <button
                      className="flex w-full items-center justify-between text-left text-[16px] font-medium leading-[150%] text-black transition-colors duration-200 sm:text-[18px] sm:leading-[155%]"
                      onClick={() => toggleIndex(index)}
                    >
                      <motion.span
                        className="flex items-center gap-1"
                        animate={{
                          color: openIndex === index ? '#000' : '#000',
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        Q{index + 1}: {renderQuestion(item)}
                      </motion.span>

                      {openIndex === index ? (
                        <FiMinus size={20} />
                      ) : (
                        <LuPlus size={20} />
                      )}
                    </button>
                    <AnimatePresence initial={false}>
                      {openIndex === index && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex max-w-[1153px] flex-col gap-2 pt-2.5 text-[14px] leading-[142.857%] text-[#475569] sm:pt-5 sm:text-[16px] sm:leading-[175%]">
                            {item.answer.map((text, i) => (
                              <p key={i}>{text}</p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
