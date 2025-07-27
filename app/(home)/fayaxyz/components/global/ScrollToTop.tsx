'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronUp } from 'react-icons/fa';

const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container">
      <div>
        <div className="fixed bottom-5 right-5">
          <AnimatePresence>
            {visible && (
              <motion.button
                key="scroll-to-top"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className="aspect-square rounded-full bg-[#3730A3] p-3 text-white shadow-lg transition-all duration-300 ease-linear hover:bg-[#3730A3]/90 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <FaChevronUp />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Wrapper div to constrain max-width & keep fixed position */}
    </div>
  );
};

export default ScrollToTop;
