import { redirect } from 'next/navigation';

export default function LegacyCreateSupplierVerificationPage() {
  redirect('/dashboard/verify-supplier/create');
}
