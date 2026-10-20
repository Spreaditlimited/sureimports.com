'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './EcosystemSupportLauncher.module.css';
type Contact = { id: string; label: string; description?: string; phone?: string; messageId?: string; defaultMessage?: string };
const fallback: Contact[] = [{ id: 'general', label: 'General enquiries', description: 'Buying, shipping and account support', messageId: 'CUR7YKW3K3RBA1' }];
const hosts = ['linescout.sureimports.com', 'affiliate.sureimports.com', 'partner.sureimports.com'];
function contactUrl(contact: Contact) {
  const phone = (typeof contact.phone === 'string' ? contact.phone : '').replace(/\D/g, '');
  const destination = /^\d{8,15}$/.test(phone) ? phone : /^[a-zA-Z0-9]+$/.test(contact.messageId || '') ? `message/${contact.messageId}` : null;
  return destination ? `https://wa.me/${destination}?text=${encodeURIComponent(contact.defaultMessage || 'Hello! I would like help with your services.')}` : null;
}
export default function EcosystemSupportLauncher() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [available, setAvailable] = useState(false);
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(fallback);
  useEffect(() => { setAvailable(hosts.includes(window.location.hostname) || window.location.hostname.endsWith('-tochukwu-nkwochas-projects.vercel.app') || window.location.hostname === 'localhost'); }, []);
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    void fetch('/api/support-contacts', { signal: controller.signal }).then(r => r.ok ? r.json() : null).then(data => {
      if (Array.isArray(data?.data)) {
        const valid = data.data.filter((c: Contact) => c && typeof c.label === 'string' && contactUrl(c));
        if (valid.length) setContacts(valid);
      }
    }).catch(() => {});
    return () => controller.abort();
  }, [open]);
  function close() { dialog.current?.close(); setOpen(false); trigger.current?.focus(); }
  useEffect(() => { dialog.current?.close(); setOpen(false); }, [pathname]);
  if (!available || pathname.startsWith('/internal') || pathname.startsWith('/agent-app/') || pathname.startsWith('/partners/storefront/')) return null;
  return <>
    <button ref={trigger} className={styles.launcher} aria-haspopup="dialog" onClick={() => { setOpen(true); dialog.current?.showModal(); }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" /></svg>Support
    </button>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="ecosystem-support-title" onCancel={close} onClose={() => { setOpen(false); trigger.current?.focus(); }}>
      <header className={styles.header}><div><h2 id="ecosystem-support-title">We’re here to help</h2><p>Get help with buying, shipping or an existing order.</p></div><button type="button" className={styles.close} aria-label="Close support" onClick={close}>×</button></header>
      {open && <iframe className={styles.frame} title="Sure Imports customer support" src="https://www.sureimports.com/support/embed" referrerPolicy="strict-origin-when-cross-origin" />}
      <footer className={styles.footer}>
        <a href="https://www.sureimports.com/support" target="_blank" rel="noopener noreferrer">Open support in a new tab</a>
        <details className={styles.contacts} data-whatsapp-placement="page"><summary>Reach us on WhatsApp</summary><div className={styles.picker}>
          <p>Choose the right team</p>{contacts.map(contact => <a key={contact.id} href={contactUrl(contact)!} target="_blank" rel="noopener noreferrer" data-whatsapp-contact="managed"><strong>{contact.label}</strong>{contact.description && <span>{contact.description}</span>}</a>)}
        </div></details>
      </footer>
    </dialog>
  </>;
}
