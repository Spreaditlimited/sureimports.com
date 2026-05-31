'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // React automatically bails out of re-renders if the state value hasn't changed.
      // So this will only trigger a render exactly when crossing the 300px threshold.
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    
    // Initial check in case the user reloads halfway down the page
    toggleVisibility();

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Back to top"
      // Instead of conditionally unmounting the button, we use CSS transforms and opacity.
      // This allows for a beautiful, smooth entrance and exit animation.
      className={`fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 transition-all duration-300 hover:scale-110 hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:shadow-indigo-900/20 dark:hover:bg-indigo-400 sm:bottom-10 sm:right-10 ${
        isVisible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-10 opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5 stroke-[2.5px]" />
    </button>
  );
};