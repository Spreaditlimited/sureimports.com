import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Supplier Verification',
  description:
    'Request and track online supplier checks and physical visits in China.',
};

export default function SupplierVerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
