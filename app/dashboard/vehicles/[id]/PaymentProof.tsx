'use client';
import { createVehicleRequestKey } from '@/lib/vehicles/requestKey';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { VehicleBank } from '@/lib/vehicles/customer';
import { naira } from '@/lib/vehicles/policy';
import VehiclePicker from '@/components/vehicles/VehiclePicker';
export default function PaymentProof({
  orderId,
  reference,
  balance,
  banks,
  expired,
}: {
  orderId: string;
  reference: string;
  balance: number;
  banks: VehicleBank[];
  expired: boolean;
}) {
  const router = useRouter();
  const [bankId, setBankId] = useState(banks[0]?.pidBankAccount || '');
  const bank = banks.find((b) => b.pidBankAccount === bankId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState('');
  const [key, setKey] = useState(() => createVehicleRequestKey());
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied('Copied');
    } catch {
      setCopied('Select and copy the number above.');
    }
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const form = new FormData(e.currentTarget);
    form.set('bank', bankId);
    form.set('requestKey', key);
    try {
      const r = await fetch(`/api/vehicles/orders/${orderId}/proof`, {
        method: 'POST',
        body: form,
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message);
      setOpen(false);
      setKey(createVehicleRequestKey());
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <section className="vehicle-order-panel">
      <h2>Pay by bank transfer</h2>
      {expired ? (
        <p className="vehicle-error">
          Your quotation has expired. Please request confirmation from our team
          before making a new transfer. If you already paid, submit your proof
          below for reconciliation.
        </p>
      ) : (
        <p>
          Transfer {naira(balance)} using the details below. You can submit
          separate transfers if your bank has a daily limit.
        </p>
      )}
      {banks.length ? (
        <>
          <VehiclePicker
            label="Receiving bank"
            value={bankId}
            onValueChange={setBankId}
            options={banks.map((bank) => ({
              value: bank.pidBankAccount,
              label: bank.bankName,
            }))}
          />
          {bank && !expired && (
            <div className="vehicle-bank-details">
              <strong>{bank.bankName}</strong>
              <p>{bank.accountName}</p>
              <p className="vehicle-account-number">{bank.accountNumber}</p>
              <button type="button" onClick={() => copy(bank.accountNumber)}>
                Copy account number
              </button>
              <p>
                Use reference: <strong>{reference}</strong>
              </p>
              <button type="button" onClick={() => copy(reference)}>
                Copy reference
              </button>
              <span role="status">{copied}</span>
            </div>
          )}
          <button className="vehicle-button" onClick={() => setOpen(!open)}>
            {open ? 'Hide payment form' : 'I have paid — submit proof'}
          </button>
          {open && (
            <form onSubmit={submit}>
              <label className="vehicle-field">
                Amount transferred (NGN)
                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  max={balance}
                  step="0.01"
                  required
                />
              </label>
              <label className="vehicle-field">
                Sender’s account name
                <input name="sender" required maxLength={160} />
              </label>
              <label className="vehicle-field">
                Bank transaction reference
                <input name="reference" required maxLength={150} />
              </label>
              <label className="vehicle-field">
                Payment receipt (JPG, PNG or PDF, up to 3 MB)
                <input
                  name="proof"
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  required
                />
              </label>
              <p className="vehicle-footnote">
                Submitting proof does not confirm payment. Our finance team
                checks the bank credit before updating your order.
              </p>
              {error && (
                <p className="vehicle-error" role="alert">
                  {error}
                </p>
              )}
              <button className="vehicle-button" disabled={submitting}>
                {submitting ? 'Uploading…' : 'Submit payment proof'}
              </button>
            </form>
          )}
        </>
      ) : (
        <p>
          Our team is confirming the receiving bank account. Please check back
          before transferring.
        </p>
      )}
    </section>
  );
}
