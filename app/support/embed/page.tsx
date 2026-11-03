import { notFound } from 'next/navigation';
import PublicSupport from '@/components/support/PublicSupport';
import { supportChatEnabled } from '@/lib/support/availability';
export const metadata = { title: 'Sure Imports support', robots: { index: false, follow: false } };
export default function SupportEmbed() {
  if (!supportChatEnabled) notFound();
  return <main><PublicSupport embedded /></main>;
}
