import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Check, Mail, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroPill from '@/components/home/HeroPill';
import styles from './delete-account.module.css';

const title = 'Delete your account';
const description = 'Request deletion of your Sure Imports account. Learn how to submit your request, verify ownership and prepare your account before closing it.';
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://www.sureimports.com/delete-account' },
  openGraph: { title, description, url: 'https://www.sureimports.com/delete-account' },
  twitter: { title, description },
};

const requestEmail = `mailto:hello@sureimports.com?subject=${encodeURIComponent('Sure Imports account deletion request')}&body=${encodeURIComponent('Hello Sure Imports,\n\nI would like to request deletion of my Sure Imports account and associated personal data.\n\nRegistered email address: \nAccount name: \nAny open order or shipment references (if applicable): \n\nPlease let me know the next steps to verify ownership and confirm when my request has been completed.\n\nThank you.')}`;

export default function DeleteAccountPage() {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.hero}>
            <HeroPill>Account &amp; privacy</HeroPill>
            <h1>Your account.<br />Your choice.</h1>
            <p>If you’re ready to leave Sure Imports, you can request deletion of your account and associated personal data here.</p>
          </header>

          <div className={styles.layout}>
            <section className={styles.request} aria-labelledby="request-heading">
              <span className={styles.icon}><Mail size={24} aria-hidden="true" /></span>
              <span className={styles.eyebrow}>ACCOUNT DELETION</span>
              <h2 id="request-heading">Let’s close your account carefully.</h2>
              <p>Send your request from the email address registered to your Sure Imports account. You do not need to sign in to get started.</p>
              <ol className={styles.steps}>
                <li><span>01</span><div><h3>Send your request</h3><p>Include your registered email, account name and any open order or shipment references.</p></div></li>
                <li><span>02</span><div><h3>Confirm it’s you</h3><p>Our team will guide you through verifying account ownership before processing deletion.</p></div></li>
                <li><span>03</span><div><h3>Receive confirmation</h3><p>We’ll confirm the outcome by email, including any records that need to be retained.</p></div></li>
              </ol>
              <a className={styles.primary} href={requestEmail}>Request account deletion <ArrowUpRight size={18} aria-hidden="true" /></a>
              <p className={styles.emailNote}>Opens your email app. You can also email <a href="mailto:hello@sureimports.com">hello@sureimports.com</a> with the subject “Sure Imports account deletion request”.</p>
              <div className={styles.security}><ShieldCheck size={19} aria-hidden="true" /><p>Never send your password, verification codes or payment card details.</p></div>
            </section>

            <aside className={styles.before} aria-labelledby="before-heading">
              <span className={styles.eyebrow}>BEFORE YOU GO</span>
              <h2 id="before-heading">A few things to check.</h2>
              <ul className={styles.checklist}>
                <li><Check size={18} aria-hidden="true" /><div><h3>Save what you need</h3><p>Download invoices and keep any order or shipment references you may need later.</p></div></li>
                <li><Check size={18} aria-hidden="true" /><div><h3>Review open activity</h3><p>Tell us about pending orders, shipments, refunds or balances so our team can advise on the next steps.</p></div></li>
                <li><Check size={18} aria-hidden="true" /><div><h3>Understand the change</h3><p>Once your account is deleted, you’ll lose access to its dashboard and account history. Completed deletion cannot be undone.</p></div></li>
              </ul>
              <Link className={styles.secondary} href="/dashboard">Review my dashboard <ArrowUpRight size={17} aria-hidden="true" /></Link>
              <div className={styles.retention}><h3>About your data</h3><p>Your request covers your account and associated personal data. Some transaction records may need to be retained for accounting, dispute resolution or other required obligations. Our team will explain what applies to your request.</p><Link href="/privacy-policy">Read our privacy policy <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
            </aside>
          </div>

          <section className={styles.help} aria-labelledby="help-heading"><div><h2 id="help-heading">Need help before you decide?</h2><p>If an account or order issue brought you here, our team can help you work through it.</p></div><Link href="/contact-us">Contact our team <ArrowUpRight size={18} aria-hidden="true" /></Link></section>
        </div>
      </main>
      <Footer />
    </>
  );
}
