'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

import {
  type WhatsAppContact,
  whatsappContacts,
} from '@/lib/data/whatsappContacts';

interface WhatsAppButtonProps {
  waID: string;
  message?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  contacts?: WhatsAppContact[];
  variant?: 'floating' | 'inline';
  triggerClassName?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  waID,
  message = 'Hello! I have a question from your website.',
  position = 'bottom-right',
  contacts,
  variant = 'floating',
  triggerClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [managedContacts, setManagedContacts] = useState<WhatsAppContact[] | null>(
    null,
  );
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [trayPosition, setTrayPosition] = useState({ above: true, maxHeight: 420 });

  useEffect(() => {
    if (!isOpen) return;
    const dismissOutside = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const dismissEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', dismissOutside);
    document.addEventListener('keydown', dismissEscape);
    return () => {
      document.removeEventListener('pointerdown', dismissOutside);
      document.removeEventListener('keydown', dismissEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    let isMounted = true;

    const fetchManagedContacts = async () => {
      try {
        const res = await fetch('/api/admin-whatsapp', { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok || !Array.isArray(data?.data)) return;
        if (isMounted) setManagedContacts(data.data);
      } catch {
        if (isMounted) setManagedContacts(null);
      }
    };

    fetchManagedContacts();

    return () => {
      isMounted = false;
    };
  }, []);

  const configuredContacts = useMemo(() => {
    const source = contacts?.length
      ? contacts
      : managedContacts?.length
        ? managedContacts
        : whatsappContacts;

    if (source.length > 0) {
      return source;
    }

    return [
      {
        id: 'default',
        label: 'WhatsApp',
        description: 'Chat with Sure Imports',
        messageId: waID,
      },
    ];
  }, [contacts, managedContacts, waID]);

  useLayoutEffect(() => {
    if (!isOpen || variant !== 'inline') return;
    const updatePosition = () => {
      const button = triggerRef.current?.getBoundingClientRect();
      const panel = panelRef.current;
      if (!button || !panel) return;
      const viewport = window.visualViewport;
      // Leave room for the sticky navigation and the screen edges.
      const top = (viewport?.offsetTop ?? 0) + 96;
      const bottom = (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight) - 16;
      const aboveSpace = Math.max(0, button.top - top - 12);
      const belowSpace = Math.max(0, bottom - button.bottom - 12);
      const desiredHeight = Math.min(panel.scrollHeight, 420);
      const above = aboveSpace >= desiredHeight || (belowSpace < desiredHeight && aboveSpace >= belowSpace);
      const maxHeight = Math.min(420, above ? aboveSpace : belowSpace);
      setTrayPosition(previous => previous.above === above && previous.maxHeight === maxHeight
        ? previous : { above, maxHeight });
    };
    updatePosition();
    window.addEventListener('scroll', updatePosition, { passive: true, capture: true });
    window.addEventListener('resize', updatePosition);
    window.visualViewport?.addEventListener('resize', updatePosition);
    window.visualViewport?.addEventListener('scroll', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
      window.visualViewport?.removeEventListener('resize', updatePosition);
      window.visualViewport?.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, variant, configuredContacts]);

  const positionClass = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };

  const panelPositionClass = () => {
    switch (position) {
      case 'top-left':
      case 'bottom-left':
        return 'left-0';
      case 'top-right':
      case 'bottom-right':
      default:
        return 'right-0';
    }
  };

  const panelVerticalClass = () => {
    switch (position) {
      case 'top-left':
      case 'top-right':
        return 'top-20';
      case 'bottom-left':
      case 'bottom-right':
      default:
        return 'bottom-20';
    }
  };

  const buildWhatsAppUrl = (contact: WhatsAppContact) => {
    const text = contact.defaultMessage || message;

    if (contact.phone) {
      const phone = contact.phone.replace(/\D/g, '');
      return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    }

    if (contact.messageId) {
      return `https://wa.me/message/${contact.messageId}?text=${encodeURIComponent(text)}`;
    }

    return '#';
  };

  const closeWithDelay = () => {
    closeTimeoutRef.current = setTimeout(() => setIsOpen(false), 120);
  };

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  };

  return (
    <div
      ref={containerRef}
      data-whatsapp-placement={variant === 'inline' ? 'contact-page' : 'floating'}
      className={variant === 'inline' ? 'relative' : `fixed ${positionClass()} z-20`}
      onMouseEnter={cancelClose}
      onMouseLeave={variant === 'floating' ? closeWithDelay : undefined}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className={variant === 'inline' ? triggerClassName : 'flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-900/20 transition hover:bg-green-600'}
        aria-expanded={isOpen}
        aria-label={variant === 'inline' ? 'Chat on WhatsApp' : 'Contact us on WhatsApp'}
        title="Contact us on WhatsApp"
      >
        {variant === 'inline' ? 'Chat on WhatsApp' : <span className="relative flex items-center">
          <FaWhatsapp size={28} />
          <ChevronDown
            size={14}
            className={`absolute -bottom-2 -right-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </span>}
      </button>
      {isOpen && (
        <div
          ref={panelRef}
          data-whatsapp-tray={variant === 'inline' ? (trayPosition.above ? 'above' : 'below') : 'floating'}
          style={variant === 'inline' ? { maxHeight: trayPosition.maxHeight, overflowY: 'auto' } : undefined}
          className={`${variant === 'inline' ? `absolute left-0 z-40 w-full ${trayPosition.above ? 'bottom-full mb-3' : 'top-full mt-3'}` : `absolute ${panelVerticalClass()} ${panelPositionClass()} w-[min(calc(100vw-2rem),22rem)]`} overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 dark:border-slate-800 dark:bg-slate-950`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Chat on WhatsApp
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose the right team
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Close WhatsApp contacts"
            >
              <X size={16} />
            </button>
          </div>
          <div className="max-h-[22rem] overflow-y-auto p-2">
            {configuredContacts.map((contact) => (
              <a
                key={contact.id}
                data-whatsapp-contact="managed"
                href={buildWhatsAppUrl(contact)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-green-50 dark:hover:bg-green-950/30"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                  <FaWhatsapp size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-slate-900 dark:text-white">
                    {contact.label}
                  </span>
                  {contact.description && (
                    <span className="mt-0.5 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {contact.description}
                    </span>
                  )}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppButton;
