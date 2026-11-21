import { notFound } from 'next/navigation';
import PublicSupport from '@/components/support/PublicSupport';
import { supportChatEnabled } from '@/lib/support/availability';
export const metadata = {
  title: 'Customer support',
  robots: { index: false, follow: false },
};
export default function Page() {
  if (!supportChatEnabled) notFound();
  return <PublicSupport />;
}
