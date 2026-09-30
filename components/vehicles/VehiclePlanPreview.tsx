'use client';
import { planTerms, type PlanSettings } from '@/lib/vehicles/installments';
import { naira } from '@/lib/vehicles/policy';
import VehiclePicker from './VehiclePicker';
export default function VehiclePlanPreview({
  settings,
  landed,
  option,
  onChange,
}: {
  settings: PlanSettings;
  landed: number | null;
  option: string;
  onChange: (value: string) => void;
}) {
  if (!settings.enabled) return null;
  const terms = landed ? planTerms(landed, settings) : null;
  return (
    <div className="vehicle-plan-preview">
      <VehiclePicker
        label="How would you like to pay?"
        value={option}
        onValueChange={onChange}
        options={[
          { value: 'FULL', label: 'Pay in full' },
          { value: 'PAY_SMALL_SMALL', label: 'Pay Small Small' },
        ]}
      />
      {option === 'PAY_SMALL_SMALL' && (
        <div className="vehicle-price-box">
          <h3>Pay Small Small</h3>
          <p>
            {settings.depositPercent}% deposit · {settings.durationDays} days ·{' '}
            {settings.feePercent}% additional fee
          </p>
          {terms ? (
            <dl>
              <div>
                <dt>Minimum deposit</dt>
                <dd>{naira(terms.depositMinor / 100)}</dd>
              </div>
              <div>
                <dt>Additional fee</dt>
                <dd>{naira(terms.feeMinor / 100)}</dd>
              </div>
              <div>
                <dt>Total including fee</dt>
                <dd>{naira(terms.totalMinor / 100)}</dd>
              </div>
              <div>
                <dt>Balance after minimum deposit</dt>
                <dd>{naira((terms.totalMinor - terms.depositMinor) / 100)}</dd>
              </div>
            </dl>
          ) : (
            <p>
              We will confirm the configuration and exact landed cost before
              issuing your payment plan.
            </p>
          )}
          <p className="vehicle-footnote">
            Preview only. Your accepted quotation fixes the Naira total. The
            payment period starts when your deposit is received and verified.
            Procurement starts only after full approved payment; delivery
            follows procurement. Cancellation before procurement refunds
            approved payments less 0.5% within{' '}
            {settings.refundBusinessDays ?? 7} business days of the request, to
            your Paystack-validated profile bank account.
          </p>
        </div>
      )}
    </div>
  );
}
