import type { DeviceRates } from '@/lib/procurement/deviceShipping';

export default function DeviceProductShippingNote({ rates, productType, quantity }: {
  rates: DeviceRates | null;
  productType: string;
  quantity: string;
}) {
  const device = productType === 'LAPTOP' ? 'laptop' : 'phone';
  const rate = rates ? (productType === 'LAPTOP' ? rates.laptopNgn : rates.phoneNgn) : null;
  const count = Number(quantity);
  const naira = (amount: number) => `₦${amount.toLocaleString('en-NG', { maximumFractionDigits: 2 })}`;
  return <div className="space-y-1 text-sm leading-relaxed text-slate-500">
    <p>{rate !== null ? `Shipping is ${naira(rate)} per ${device}.` : 'Shipping is charged per device for this product.'} No weight or volume is required.</p>
    {rate !== null && Number.isSafeInteger(count) && count > 1 && <p className="font-medium text-slate-900 dark:text-slate-100">{count} {device}s × {naira(rate)} = {naira(count * rate)}</p>}
  </div>;
}
