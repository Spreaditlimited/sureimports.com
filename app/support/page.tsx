import { notFound } from 'next/navigation';
import PublicSupport from '@/components/support/PublicSupport';
export const metadata = {
  title: 'Customer support',
  robots: { index: false, follow: false },
};
export default function Page() {
  if (process.env.SUPPORT_CHAT_ENABLED !== 'true') notFound();
  return <PublicSupport />;
}
