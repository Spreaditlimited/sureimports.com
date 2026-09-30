'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { planSchedule, type VehiclePlan } from '@/lib/vehicles/installments';
import { naira } from '@/lib/vehicles/policy';
export default function VehiclePaymentPlan({
  plan,
  paidMinor,
  pendingMinor,
  canCancel,
}: {
  plan: VehiclePlan;
  paidMinor: number;
  pendingMinor: number;
  canCancel: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [consent, setConsent] = useState(false),
    [cancel, setCancel] = useState(false);
  async function action(body: unknown) {
    setBusy(true);
    setError('');
    try {
      const r = await fetch(`/api/vehicles/orders/${plan.orderId}/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message);
      setCancel(false);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const terms = plan.terms,
    closed = ['CANCELLED', 'REFUNDED'].includes(plan.status);
  return (
    <section className="vehicle-order-panel vehicle-plan-panel">
      <h2>Pay Small Small</h2>
      <p className="vehicle-status">
        {(
          {
            PAYMENT_REVIEW: 'Bank payment under review',
            REQUESTED: 'Plan requested',
            OFFERED: 'Review your offer',
            ACCEPTED: 'Awaiting minimum deposit',
            ACTIVE: 'Payment plan active',
            COMPLETED: 'Fully paid',
            CANCELLATION_REQUESTED: 'Cancellation under review',
            REFUND_PENDING: 'Refund pending',
            REFUNDED: 'Refund completed',
            CANCELLED: 'Cancelled',
          } as Record<string, string>
        )[plan.status] || plan.status}
      </p>
      {terms ? (
        <>
          <dl className="vehicle-order-totals">
            <div>
              <dt>Invoiced landed cost</dt>
              <dd>{naira(terms.landedMinor / 100)}</dd>
            </div>
            <div>
              <dt>Additional fee ({terms.feePercent}%)</dt>
              <dd>{naira(terms.feeMinor / 100)}</dd>
            </div>
            <div>
              <dt>Total payable</dt>
              <dd>{naira(terms.totalMinor / 100)}</dd>
            </div>
            <div>
              <dt>Minimum deposit ({terms.depositPercent}%)</dt>
              <dd>{naira(terms.depositMinor / 100)}</dd>
            </div>
            <div>
              <dt>Payments approved</dt>
              <dd>{naira(paidMinor / 100)}</dd>
            </div>
            <div>
              <dt>Awaiting bank confirmation</dt>
              <dd>{naira(pendingMinor / 100)}</dd>
            </div>
          </dl>
          {!closed && (
            <>
              <progress
                aria-label="Approved payment progress"
                max={terms.totalMinor}
                value={paidMinor}
              />
              <p>
                Complete payment within {terms.durationDays} days of the bank
                credit that satisfies your deposit. Procurement starts only
                after full approved payment.
              </p>
              <ol className="vehicle-plan-schedule">
                {planSchedule(terms, plan.activatedAt, paidMinor).map((row) => (
                  <li key={row.label}>
                    <div>
                      <strong>{row.label}</strong>
                      <span>
                        {row.paid
                          ? 'Paid'
                          : row.dueAt
                            ? `Due ${new Date(row.dueAt).toLocaleDateString('en-GB', { timeZone: 'Africa/Lagos' })}`
                            : row.label === 'Initial deposit' && plan.expiresAt
                              ? `Before ${new Date(plan.expiresAt).toLocaleString('en-GB', { timeZone: 'Africa/Lagos' })} WAT`
                              : 'Date set after deposit confirmation'}
                      </span>
                    </div>
                    <strong>{naira(row.amountMinor / 100)}</strong>
                  </li>
                ))}
              </ol>
            </>
          )}
          <details>
            <summary>Agreed payment terms</summary>
            <p>{terms.termsText}</p>
            {plan.acceptedAt && (
              <p>
                Accepted{' '}
                {new Date(plan.acceptedAt).toLocaleString('en-GB', {
                  timeZone: 'Africa/Lagos',
                })}{' '}
                WAT.
              </p>
            )}
          </details>
          {plan.status === 'OFFERED' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void action({
                  action: 'accept',
                  consent,
                  revision: terms.revision,
                  totalMinor: terms.totalMinor,
                });
              }}
            >
              <label className="vehicle-consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                />
                I accept the total, fee, deposit, payment period and terms shown
                above.
              </label>
              <button className="vehicle-button" disabled={busy || !consent}>
                Accept payment plan
              </button>
            </form>
          )}
        </>
      ) : (
        <p>
          Our team will confirm your vehicle and issue a fixed Naira offer with
          your deposit, fee and payment schedule.
        </p>
      )}
      {plan.refundDueAt && (
        <p>
          Refund deadline:{' '}
          {new Date(plan.refundDueAt).toLocaleDateString('en-GB', {
            timeZone: 'Africa/Lagos',
          })}{' '}
          ({plan.refundBusinessDays} business days from your cancellation
          request). Reconciliation does not restart this deadline.
        </p>
      )}
      {plan.refundFeeMinor && (
        <p>
          Approved payments: {naira(Number(plan.refundGrossMinor) / 100)} ·
          Cancellation deduction (0.5%):{' '}
          {naira(Number(plan.refundFeeMinor) / 100)}
        </p>
      )}
      {['CANCELLATION_REQUESTED', 'REFUND_PENDING'].includes(plan.status) && (
        <p>
          Refunds go only to your Paystack-validated{' '}
          <a href="/dashboard/profile-update">profile bank account</a>.
          Re-verify your account there if requested. Bank changes are paused
          once a refund transfer is pending.
        </p>
      )}
      {plan.refundMinor && (
        <p>
          Refund {plan.status === 'REFUNDED' ? 'transferred' : 'pending'}:{' '}
          {naira(Number(plan.refundMinor) / 100)}
          {plan.refundReference ? ` · Reference ${plan.refundReference}` : ''}.
        </p>
      )}
      {canCancel &&
        ![
          'PAYMENT_REVIEW',
          'CANCELLATION_REQUESTED',
          'REFUND_PENDING',
          'CANCELLED',
          'REFUNDED',
        ].includes(plan.status) && (
          <>
            <button
              className="vehicle-plan-text-button"
              onClick={() => setCancel(!cancel)}
            >
              Request cancellation
            </button>
            {cancel && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  void action({
                    action: 'cancel_request',
                    reason: f.get('reason'),
                    cancellationConsent: f.get('cancellationConsent') === 'on',
                  });
                }}
              >
                <label className="vehicle-field">
                  Reason
                  <textarea name="reason" required maxLength={2000} />
                </label>
                <p>
                  Before procurement starts, cancellation refunds your approved
                  payments less 0.5%, even if fully paid. The refund deadline
                  starts when you submit this request. Payments and procurement
                  will pause while finance reconciles your payments. Refunds go
                  only to your Paystack-validated profile bank account.
                </p>
                <label className="vehicle-consent">
                  <input type="checkbox" name="cancellationConsent" required />I
                  accept the 0.5% deduction and refund to my verified profile
                  bank account.
                </label>
                <button className="vehicle-button" disabled={busy}>
                  Submit cancellation request
                </button>
              </form>
            )}
          </>
        )}
      {error && (
        <p className="vehicle-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
