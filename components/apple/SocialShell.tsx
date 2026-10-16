import type { ReactNode } from 'react';
import AuthFrame from '@/components/auth-ui/AuthFrame';
export default function SocialShell({ children }: { children: ReactNode }) {
  return <AuthFrame>{children}</AuthFrame>;
}
