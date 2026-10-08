import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  "title": {
    "absolute": "Retail Price & Profit Margin Calculator | Sure Imports"
  },
  "description": "Build an indicative selling price from landed cost, expenses and target margin. Compare pricing assumptions for products imported into Nigeria.",
  "alternates": {
    "canonical": "https://www.sureimports.com/tools/retail-price-builder"
  },
  "openGraph": {
    "title": "Retail Price & Profit Margin Calculator | Sure Imports",
    "description": "Build an indicative selling price from landed cost, expenses and target margin. Compare pricing assumptions for products imported into Nigeria.",
    "url": "https://www.sureimports.com/tools/retail-price-builder",
    "type": "website"
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Retail Price & Profit Margin Calculator | Sure Imports",
    "description": "Build an indicative selling price from landed cost, expenses and target margin. Compare pricing assumptions for products imported into Nigeria."
  }
};

export default function CalculatorLayout({ children }: { children: ReactNode }) {
  return children;
}
