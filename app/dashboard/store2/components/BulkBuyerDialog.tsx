"use client";

import { useState } from "react";

interface BulkBuyerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BulkBuyerDialog({ isOpen, onClose }: BulkBuyerDialogProps) {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/message/CUR7YKW3K3RBA1", "_blank");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Dialog Content */}
        <div 
          className="bg-card rounded-xl shadow-xl max-w-md w-full mx-auto p-6 relative border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V11M5 9H19L18 21H6L5 9Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12V16" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12V16" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12V16" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Bulk Purchase Discount</h2>
                <p className="text-sm text-muted-foreground">Wholesale pricing available</p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <p className="text-foreground leading-relaxed">
              If you intend to buy at least <span className="font-semibold text-purple-600 dark:text-purple-400">10 phones and/or laptops</span>, we can give you a decent discount. Chat with us to discuss your bulk order requirements and get the best pricing.
            </p>
          </div>

          {/* Benefits List */}
          <div className="mb-6">
            <h3 className="font-medium text-foreground mb-3">Bulk Purchase Benefits:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full"></div>
                Significant bulk discounts on orders of 10+ items
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full"></div>
                Priority shipping and handling
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full"></div>
                Dedicated customer support
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full"></div>
                Product financing terms available
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleWhatsAppClick}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 transition-colors text-white rounded-lg py-3 px-4 font-medium flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785"/>
              </svg>
              Chat on WhatsApp
            </button>
            
            <button
              onClick={onClose}
              className="bg-muted hover:bg-accent transition-colors text-foreground rounded-lg py-3 px-4 font-medium"
            >
              Maybe Later
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Our team is available to discuss your bulk purchase requirements and provide personalized pricing.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}