import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './BrandFooter.module.css';

type FooterLink = { label: string; href: string };
export default function BrandFooter({ home = '/', logo = '/images/svg-logo-white.svg', brand = '', mainSite = '', newsletter, programmeLinks = [], settings }: {
  home?: string; logo?: string; brand?: string; mainSite?: string;
  newsletter?: ReactNode; programmeLinks?: FooterLink[]; settings?: ReactNode;
}) {
  return <footer className={styles.footer} data-whatsapp-placement="footer">
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.identity}>
          <Link href={home} aria-label={`Sure Imports ${brand} home`} className={styles.brand}>
            <Image src={logo} alt="Sure Imports" width={200} height={32} unoptimized />
            {brand && <span>{brand}</span>}
          </Link>
          <p>From finding the right products to bringing them home. Import from China with confidence.</p>
          <span className={styles.locations}>Nigeria · United Kingdom · China</span>
        </div>
        <nav aria-label="Explore Sure Imports">
          <h2>Explore</h2>
          <Link href={`${mainSite}/import-hub`}>Import Hub</Link>
          <Link href={`${mainSite}/cars`}>Cars & commercial vehicles</Link>
          <a href="https://linescout.sureimports.com/white-label">White label products</a>
          <a href="https://linescout.sureimports.com">LineScout sourcing</a>
          <a href="https://partner.sureimports.com/partners">Become a partner</a>
          <a href="https://affiliate.sureimports.com">Affiliate programme</a>
        </nav>
        <nav aria-label="Help and company">
          <h2>Here to help</h2>
          <Link href={`${mainSite}/contact-us`}>Contact us</Link>
          <Link href={`${mainSite}/track`}>Track a shipment</Link>
          <Link href={`${mainSite}/shipping-rate`}>Shipping rates</Link>
          <Link href={`${mainSite}/about`}>About Sure Imports</Link>
          <a href="mailto:hello@sureimports.com">hello@sureimports.com</a>
        </nav>
        <div className={styles.lastColumn}>
          <h2>{newsletter ? 'Import insights' : `Your ${brand.toLowerCase()} journey`}</h2>
          {newsletter ? newsletter : <nav aria-label={`${brand} resources`}>{programmeLinks.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>}
          <div className={styles.socials} aria-label="Follow Sure Imports">
            <a href="https://www.instagram.com/sureimport" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.youtube.com/@sureimports" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href="https://www.tiktok.com/@tochukwunkwocha" target="_blank" rel="noopener noreferrer">TikTok</a>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Sure Importers Limited<span>Spreadit Sourcing Limited · United Kingdom</span></p>
        <nav aria-label="Legal policies">
          <Link href={`${mainSite}/privacy-policy`}>Privacy</Link>
          <Link href={`${mainSite}/terms-and-conditions`}>Terms</Link>
          <Link href={`${mainSite}/shipping-policy`}>Shipping</Link>
          <Link href={`${mainSite}/warranty-policy`}>Warranty</Link>
          {brand === 'Affiliate' && <Link href="/affiliate-terms">Affiliate terms</Link>}
          {settings}
        </nav>
      </div>
    </div>
  </footer>;
}
