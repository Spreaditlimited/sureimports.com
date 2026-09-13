'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { LogOut } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import { useAuth } from '@/app/context/AuthContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { NavItem } from '../types';

interface SideNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  className?: string;
}

export function SideNav({ items, setOpen }: SideNavProps) {
  const { logout } = useAuth();
  const path = usePathname();
  const { isOpen, toggle } = useSidebar();
  const expanded = Boolean(setOpen) || isOpen;
  const [openItem, setOpenItem] = useState('');
  const previousItem = useRef('');

  useEffect(() => {
    if (!expanded && openItem) {
      previousItem.current = openItem;
      setOpenItem('');
    } else if (expanded && !openItem && previousItem.current) {
      setOpenItem(previousItem.current);
      previousItem.current = '';
    }
  }, [expanded, openItem]);

  const active = (href: string) => href.startsWith('/') && (path === href || (href !== '/' && path.startsWith(href + '/')));
  const renderLink = (item: NavItem) => (
    <Link key={item.title} href={item.href} target={item.target} rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
      className="si-nav-item" aria-label={item.title} title={!expanded ? item.title : undefined}
      aria-current={active(item.href) ? 'page' : undefined} onClick={() => setOpen?.(false)}>
      <span className="si-nav-icon" aria-hidden="true"><item.icon /></span>
      <span className={expanded ? 'si-nav-label' : 'sr-only'}>{item.title}</span>
    </Link>
  );

  return <nav className="si-side-nav" aria-label="Dashboard navigation" data-expanded={expanded}>
    {items.map(item => item.isChidren ? (
      <Accordion key={item.title} type="single" collapsible value={openItem} onValueChange={value => {
        if (!expanded) toggle();
        setOpenItem(value);
      }}>
        <AccordionItem value={item.title} className="border-0">
          <AccordionTrigger className="si-nav-item" aria-label={item.title} title={!expanded ? item.title : undefined}>
            <span className="si-nav-icon" aria-hidden="true"><item.icon /></span>
            <span className={expanded ? 'si-nav-label' : 'sr-only'}>{item.title}</span>
          </AccordionTrigger>
          {expanded && <AccordionContent className="si-nav-children">{item.children?.map(renderLink)}</AccordionContent>}
        </AccordionItem>
      </Accordion>
    ) : renderLink(item))}
    <div className="si-nav-bottom">
      <button type="button" className="si-nav-item" aria-label="Sign out" title={!expanded ? 'Sign out' : undefined} onClick={logout}>
        <span className="si-nav-icon" aria-hidden="true"><LogOut /></span>
        <span className={expanded ? 'si-nav-label' : 'sr-only'}>Sign out</span>
      </button>
      {expanded && <p className="si-nav-copyright">© Sure Importers Limited<br />All rights reserved.</p>}
    </div>
  </nav>;
}
