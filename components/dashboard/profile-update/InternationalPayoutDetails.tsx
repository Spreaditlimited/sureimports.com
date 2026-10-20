'use client';
import { useEffect, useState, type FormEvent } from 'react';
import styles from './InternationalPayoutDetails.module.css';
type Saved = { method: string; summary: string; country: string; needsUpdate: boolean };
export default function InternationalPayoutDetails({ country }: { country: string }) {
  const [saved, setSaved] = useState<Saved | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [method, setMethod] = useState('PAYPAL_MANUAL');
  const [confirming, setConfirming] = useState(false);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  async function load(signal?: AbortSignal) {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/account/payout-details', { cache: 'no-store', signal });
      const data = await res.json(); if (!res.ok) throw Error(data.message);
      setSaved(data.profile); setEditing(!data.profile);
    } catch (error) { if (!signal?.aborted) setError((error as Error).message); }
    finally { if (!signal?.aborted) setLoading(false); }
  }
  useEffect(() => { const controller = new AbortController(); void load(controller.signal); return () => controller.abort(); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    const data = new FormData(event.currentTarget);
    const profile = method === 'PAYPAL_MANUAL' ? { method, accountName: data.get('accountName'), paypalEmail: data.get('paypalEmail'), confirmedOwnAccount: data.get('ownership') === 'on' } : { method, accountName: data.get('accountName'), bankName: data.get('bankName'), accountNumber: data.get('accountNumber'), bankCode: data.get('bankCode'), confirmedOwnAccount: data.get('ownership') === 'on' };
    try {
      const res = await fetch('/api/account/payout-details', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(confirming ? { action: 'confirm', code } : { action: 'request-code', profile }) });
      const result = await res.json(); if (!res.ok) throw Error(result.message);
      setNotice(result.message);
      if (confirming) { setConfirming(false); setCode(''); await load(); } else setConfirming(true);
    } catch (error) { setError((error as Error).message); } finally { setBusy(false); }
  }
  return <section className={styles.card}><h2>Refund & payout details</h2><p>Choose your preferred destination for eligible manual refunds and payouts. Saving details does not request or send a payment.</p>{loading ? <p role="status">Loading payout details…</p> : <>
    {saved && <div className={styles.saved}><strong>{saved.summary}</strong><p>{saved.needsUpdate ? 'Your country has changed. Update these details before requesting a payout.' : 'Change confirmed by account email. Recipient ownership has not been independently verified.'}</p><button type="button" onClick={() => { setEditing(true); setConfirming(false); }}>Change payout details</button></div>}
    {editing && <form onSubmit={submit}>{confirming ? <><label htmlFor="payout-code">Confirmation code</label><p>Enter the six-digit code sent to your Sure Imports account email.</p><input id="payout-code" value={code} onChange={e => setCode(e.target.value)} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required /><button disabled={busy}>{busy ? 'Saving…' : 'Confirm and save details'}</button><button type="button" disabled={busy} onClick={() => { setConfirming(false); setCode(''); }}>Change details or request another code</button></> : <>
      <label htmlFor="payout-method">Preferred payout method</label><select id="payout-method" value={method} onChange={e => setMethod(e.target.value)} disabled={busy}><option value="PAYPAL_MANUAL">PayPal</option>{country === 'United Kingdom' && <option value="UK_BANK">UK bank transfer</option>}</select>
      <label htmlFor="payout-name">Account-holder name</label><input id="payout-name" name="accountName" autoComplete="name" minLength={2} maxLength={120} required />
      {method === 'PAYPAL_MANUAL' ? <><label htmlFor="payout-email">PayPal email address</label><input id="payout-email" name="paypalEmail" type="email" maxLength={254} required /><p>Your PayPal account must be able to receive the payout currency. Our team will check availability before payment.</p></> : <><label htmlFor="payout-bank">Bank name</label><input id="payout-bank" name="bankName" minLength={2} maxLength={120} required /><div className={styles.fields}><label>Account number<input name="accountNumber" inputMode="numeric" pattern="[0-9]{8}" maxLength={8} required /></label><label>Sort code<input name="bankCode" inputMode="numeric" placeholder="12-34-56" pattern="[0-9]{2}[- ]?[0-9]{2}[- ]?[0-9]{2}" maxLength={8} required /></label></div></>}
      <label className={styles.check}><input type="checkbox" name="ownership" required /><span>This account belongs to me and the details are correct.</span></label><button disabled={busy}>{busy ? 'Sending code…' : 'Confirm payout details'}</button><small>We’ll send a confirmation code to your account email. Details are reviewed before each manual payment.</small>
    </>}</form>}
    {!editing && !saved && error && <button type="button" onClick={() => void load()}>Try again</button>}
  </>}{error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}</section>;
}
