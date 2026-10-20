'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import * as Dialog from '@radix-ui/react-dialog';
import { MessageCircle, X } from 'lucide-react';
import styles from './support.module.css';
import SupportWhatsApp from './SupportWhatsApp';
const PublicSupport = dynamic(() => import('./PublicSupport'), {
  loading: () => <p role="status">Opening support…</p>,
  ssr: false,
});
export default function SupportLauncher() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => { setOpen(false); }, [pathname]);
  if (pathname.startsWith('/support') || pathname === '/dashboard/support') return null;
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={styles.launcher}>
        <MessageCircle size={22} /> <span>Support</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <Dialog.Title>We’re here to help</Dialog.Title>
              <Dialog.Description>
                Get help with buying, shipping or an existing order.
              </Dialog.Description>
            </div>
            <Dialog.Close aria-label="Close support" className={styles.close}>
              <X />
            </Dialog.Close>
          </div>
          <div className={styles.panelBody}>
            <PublicSupport onSignIn={() => setOpen(false)} />
          </div>
          <div className={styles.fallback}>
            <span>Chat unavailable?</span>
            <SupportWhatsApp />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
