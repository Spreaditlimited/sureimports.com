import { notFound } from 'next/navigation';
import PublicSupport from '@/components/support/PublicSupport';
import { supportChatEnabled } from '@/lib/support/availability';
export const metadata = { title: 'Support' };
export default function SupportPage() {
  if (!supportChatEnabled) notFound();
  return <PublicSupport />;
}
