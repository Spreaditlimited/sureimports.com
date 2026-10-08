import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  "title": {
    "absolute": "Import Landed Cost Calculator for Nigeria | Sure Imports"
  },
  "description": "Estimate product, freight and other import costs before buying from China. Calculate an indicative landed cost per unit for your Nigerian business.",
  "alternates": {
    "canonical": "https://www.sureimports.com/tools/landed-cost-estimator"
  },
  "openGraph": {
    "title": "Import Landed Cost Calculator for Nigeria | Sure Imports",
    "description": "Estimate product, freight and other import costs before buying from China. Calculate an indicative landed cost per unit for your Nigerian business.",
    "url": "https://www.sureimports.com/tools/landed-cost-estimator",
    "type": "website"
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Import Landed Cost Calculator for Nigeria | Sure Imports",
    "description": "Estimate product, freight and other import costs before buying from China. Calculate an indicative landed cost per unit for your Nigerian business."
  }
};

export default function CalculatorLayout({ children }: { children: ReactNode }) {
  return children;
}
