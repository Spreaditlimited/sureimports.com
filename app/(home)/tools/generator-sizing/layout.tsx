import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  "title": {
    "absolute": "Generator Sizing Calculator for Industrial Machines | Sure Imports"
  },
  "description": "Estimate generator capacity for your machine loads. Plan running power and starting requirements before confirming sizing with a qualified engineer.",
  "alternates": {
    "canonical": "https://www.sureimports.com/tools/generator-sizing"
  },
  "openGraph": {
    "title": "Generator Sizing Calculator for Industrial Machines | Sure Imports",
    "description": "Estimate generator capacity for your machine loads. Plan running power and starting requirements before confirming sizing with a qualified engineer.",
    "url": "https://www.sureimports.com/tools/generator-sizing",
    "type": "website"
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Generator Sizing Calculator for Industrial Machines | Sure Imports",
    "description": "Estimate generator capacity for your machine loads. Plan running power and starting requirements before confirming sizing with a qualified engineer."
  }
};

export default function CalculatorLayout({ children }: { children: ReactNode }) {
  return children;
}
