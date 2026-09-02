import type { Metadata } from 'next';
import SupplierVerificationDashboard from '../../components/SupplierVerificationDashboard';

export const metadata: Metadata = {
  title: 'Request Supplier Verification',
  description:
    'Submit a Chinese supplier for online verification or a physical visit.',
};

export default function CreateSupplierVerificationPage() {
  return <SupplierVerificationDashboard mode="create" />;
}
