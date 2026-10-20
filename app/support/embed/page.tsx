import { notFound } from 'next/navigation';
import PublicSupport from '@/components/support/PublicSupport';
export const metadata = { title: 'Sure Imports support', robots: { index: false, follow: false } };
export default function SupportEmbed() {
  if (process.env.SUPPORT_CHAT_ENABLED !== 'true') notFound();
  return <main><PublicSupport embedded /></main>;
}
