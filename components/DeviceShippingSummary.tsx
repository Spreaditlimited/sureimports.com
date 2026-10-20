import type { deviceShippingBreakdown } from '@/lib/procurement/deviceShipping';
export type DeviceShippingSummaryData = ReturnType<
  typeof deviceShippingBreakdown
>;
export default function DeviceShippingSummary({
  value,
  embedded = false,
}: {
  value: DeviceShippingSummaryData | null;
  embedded?: boolean;
}) {
  if (!value?.enabled) return null;
  const naira = (amount: number) =>
    `₦${amount.toLocaleString('en-NG', { maximumFractionDigits: 2 })}`;
  return (
    <section
      className={embedded ? "mt-4 border-t border-indigo-200 pt-4 text-sm leading-6 text-indigo-900 dark:border-indigo-800 dark:text-indigo-200" : "m-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-900"}
      aria-label="Nigeria device shipping"
    >
      {value.unclassified > 0 && (
        <p role="alert" className="mb-3 font-medium">
          Before paying, edit each product and confirm whether it is a phone,
          laptop or other goods. Your shipping estimate may change.
        </p>
      )}
      <h3 className="font-semibold">Nigeria device shipping</h3>
      <p className="mt-1">
        Phones: {naira(value.phoneRateNgn)} each · Laptops:{' '}
        {naira(value.laptopRateNgn)} each.
      </p>
      {value.phones > 0 && (
        <p className="mt-2">
          {value.phones} phone(s) × {naira(value.phoneRateNgn)} ={' '}
          {naira(value.phones * value.phoneRateNgn)}
        </p>
      )}
      {value.laptops > 0 && (
        <p className="mt-2">
          {value.laptops} laptop(s) × {naira(value.laptopRateNgn)} ={' '}
          {naira(value.laptops * value.laptopRateNgn)}
        </p>
      )}
      <p className="mt-2 text-slate-500">
        Device fees replace weight-based international freight for phones and
        laptops. Only other goods are included in the shipping measurement
        below. Domestic delivery to our China warehouse is separate.
      </p>
    </section>
  );
}
