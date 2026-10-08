import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  "title": {
    "absolute": "Air vs Sea Freight Cost Calculator | Sure Imports"
  },
  "description": "Compare estimated air and sea freight costs using your shipment weight and volume. Plan a suitable shipping method for your China imports.",
  "alternates": {
    "canonical": "https://www.sureimports.com/tools/air-vs-sea-calculator"
  },
  "openGraph": {
    "title": "Air vs Sea Freight Cost Calculator | Sure Imports",
    "description": "Compare estimated air and sea freight costs using your shipment weight and volume. Plan a suitable shipping method for your China imports.",
    "url": "https://www.sureimports.com/tools/air-vs-sea-calculator",
    "type": "website"
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Air vs Sea Freight Cost Calculator | Sure Imports",
    "description": "Compare estimated air and sea freight costs using your shipment weight and volume. Plan a suitable shipping method for your China imports."
  }
};

export default function CalculatorLayout({ children }: { children: ReactNode }) {
  return children;
}
