import { Suspense } from 'react';
import ShopOrderConfirmation from '@/components/shop/ShopOrderConfirmation';
export default function Page() {
  return (
    <Suspense fallback={<p className="p-8">Loading your order…</p>}>
      <ShopOrderConfirmation dashboard={true} />
    </Suspense>
  );
}
