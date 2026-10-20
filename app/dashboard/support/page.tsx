import { notFound } from 'next/navigation';
import PublicSupport from '@/components/support/PublicSupport';
export const metadata = { title: 'Support' };
export default function SupportPage() {
  if (process.env.SUPPORT_CHAT_ENABLED !== 'true') notFound();
  return <PublicSupport />;
}
