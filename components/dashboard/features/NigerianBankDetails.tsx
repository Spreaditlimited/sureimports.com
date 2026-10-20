import { checkAuth } from '@/lib/auth/checkAuth';
import { getAccountCountry } from '@/lib/features/server';
import InternationalPayoutDetails from '@/components/dashboard/profile-update/InternationalPayoutDetails';
import UpdateBankDetailsFrom from '@/components/dashboard/profile-update/bank-detail-form';
export default async function NigerianBankDetails({ className }: { className?: string }) {
  const user = await checkAuth();
  if (!user) return null;
  const country = await getAccountCountry(user.pidUser);
  if (!country) return null;
  return <div className={className}>{country === 'Nigeria' ? <UpdateBankDetailsFrom /> : <InternationalPayoutDetails key={country} country={country} />}</div>;
}
