'use client';

import type React from 'react';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Popup({ isOpen, onClose, children }: PopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle clicking outside the popup
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  // Prevent scrolling when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">
      <div
        ref={popupRef}
        className="relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 dark:bg-gray-800"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Close popup"
        >
          <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        {children}
      </div>
    </div>
  );
}
