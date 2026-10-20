'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Download, Check, Smartphone } from 'lucide-react';
import { useAppInstall } from './InstallProvider';
import styles from './InstallApp.module.css';

export default function InstallApp() {
  const { installed, ready, ios, available, busy, error, install } = useAppInstall();
  return <main className={styles.page}>
    <section className={styles.card} aria-labelledby="install-heading">
      <Image src="/app-icons/icon-192.png" alt="" width={80} height={80} className={styles.icon} priority />
      <p className={styles.eyebrow}>SURE IMPORTS, ONE TAP AWAY</p>
      <h1 id="install-heading">Your imports. On your Home Screen.</h1>
      <p className={styles.intro}>Open your dashboard, follow your orders and reach support directly from your phone or computer.</p>
      <div className={styles.setup} aria-live="polite">
        {!ready ? <p>Checking installation options…</p> : installed ? <>
          <h2><Check aria-hidden="true" size={22} /> You’re ready to go</h2>
          <p>Sure Imports is installed on this device.</p>
          <Link className={styles.action} href="/dashboard">Open your dashboard</Link>
        </> : <>
          <h2><Smartphone aria-hidden="true" size={22} /> {ios ? 'Add to your iPhone or iPad' : 'Install Sure Imports'}</h2>
          {(available || busy) && <button className={styles.action} type="button" disabled={busy} onClick={() => void install()}><Download size={18} aria-hidden="true" />{busy ? 'Opening install options…' : 'Install Sure Imports'}</button>}
          {ios ? <ol>
            <li>Open this page in <strong>Safari</strong>.</li>
            <li>Tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>.</li>
            <li>Keep <strong>Open as Web App</strong> enabled if shown, then tap <strong>Add</strong>.</li>
            <li>Open the Sure Imports icon from your Home Screen.</li>
          </ol> : <p>{available ? 'Your browser will ask you to confirm installation.' : 'On Android, open the Chrome menu and choose “Install app” or “Add to Home screen”. On a computer, use the install option in Chrome or Edge, or “Add to Dock” in Safari if available.'}</p>}
          <p>If you opened this link inside another app, open it in your browser first.</p>
        </>}
        {error && <p role="alert">{error}</p>}
      </div>
      <p className={styles.note}>Free to install. An internet connection is required. Sign in to access your account and orders.</p>
      <Link className={styles.browser} href="/dashboard">Continue in your browser →</Link>
    </section>
  </main>;
}
