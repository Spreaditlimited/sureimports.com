import type { Metadata } from 'next';
import { Mail, MessageCircle, PackageCheck, Phone, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroPill from '@/components/home/HeroPill';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getCompanyContactSettings } from '@/lib/intelligence/companyContacts';
import styles from './contact.module.css';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Talk to Sure Imports about sourcing, shipping and your orders. Find our contact details and locations in Nigeria, the United Kingdom and China.',
  alternates: { canonical: 'https://www.sureimports.com/contact-us' },
};
export default async function ContactPage() {
  const contacts = await getCompanyContactSettings();
  const phones = contacts.lagosContact.split(/[,;\n]+/).map(p => p.trim()).filter(Boolean);
  const offices = [
    { city:'Lagos', country:'Nigeria', company:'Sure Importers Limited', address:contacts.lagosAddress, phones },
    { city:'Warrington', country:'United Kingdom', company:'Spreadit Sourcing Limited', address:'33 Bevan Court, Dunlop Street, WA4 6AA, Warrington, England.', phones:['+44 788 119 4138'] },
    { city:'Guangzhou', country:'China', company:'China operations', address:contacts.chinaAddress.replace(/^China:\s*/i,''), phones:[] },
  ];
  return <><Navbar /><main className={styles.page}>
    <div className={styles.container}>
      <header className={styles.hero}>
        <HeroPill>Contact Sure Imports</HeroPill>
        <h1>Let’s talk about<br className={styles.break} /> your next import.</h1>
        <p>Starting with a product idea, planning a shipment, or checking an order? Here’s how to reach the right team.</p>
      </header>
      <section className={styles.channels} aria-label="Ways to contact us">
        <article className={styles.card}><MessageCircle aria-hidden="true" /><h2>Chat with us</h2><p>Ask about buying from China, white labelling, shipping, or joining our partner programme.</p><WhatsAppButton waID="" variant="inline" triggerClassName={styles.primary} message="Hello Sure Imports, I have an enquiry." /></article>
        <article className={styles.card}><Mail aria-hidden="true" /><h2>Email our team</h2><p>For detailed enquiries, share your product links, quantities and destination. For an existing order, include your order reference.</p><a className={styles.action} href="mailto:hello@sureimports.com">hello@sureimports.com</a></article>
        <article className={styles.card}><PackageCheck aria-hidden="true" /><h2>Already placed an order?</h2><p>Sign in to see your order’s progress. Have a shipping reference? Check your shipment directly.</p><div className={styles.links}><a className={styles.action} href="/dashboard">Open my dashboard</a><a className={styles.textLink} href="/track">Track a shipment</a></div></article>
      </section>
      <section className={styles.offices} aria-labelledby="office-heading">
        <div className={styles.sectionHeading}><span>Local support. China expertise.</span><h2 id="office-heading">Our locations</h2><p>Contact us before visiting or sending goods so we can confirm the right location and arrangements.</p></div>
        <div className={styles.officeGrid}>{offices.map(office => <article key={office.country} className={styles.office}>
          <MapPin aria-hidden="true" /><span>{office.country}</span><h3>{office.city}</h3><strong>{office.company}</strong><address>{office.address}</address>
          {office.phones.map(phone => <a key={phone} href={`tel:${phone.replace(/[^+\d]/g,'')}`}><Phone size={15} aria-hidden="true" />{phone}</a>)}
        </article>)}</div>
      </section>
      <aside className={styles.note}><h2>Make your first message count.</h2><p>Tell us what you want to buy, where it’s going, and the quantity. If you already have an order, include its reference. Never send passwords, verification codes or card details.</p></aside>
    </div>
  </main><Footer /></>;
}
