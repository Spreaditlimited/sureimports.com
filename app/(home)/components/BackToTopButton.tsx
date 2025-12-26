'use client';

import { useEffect, useState } from 'react';

export const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const [angle, setAngle] = useState(45); // gradient rotation

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y > 200);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setAngle((prev) => (prev + 1) % 360);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-20 right-6 z-50 rounded-full p-3 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
      aria-label="Back to top"
      style={{
        background: `linear-gradient(${angle}deg, #6366f1, #a855f7, #3b82f6)`,
      }}
    >
      <div
        className="relative"
        style={{
          background: `linear-gradient(${angle}deg, #6366f1, #a855f7, #3b82f6)`,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 01.707.293l5 5a1 1 0 11-1.414 1.414L11 7.414V17a1 1 0 11-2 0V7.414L5.707 9.707A1 1 0 114.293 8.293l5-5A1 1 0 0110 3z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </button>
  );
};
