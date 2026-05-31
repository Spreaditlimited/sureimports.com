import { redirect } from 'next/navigation';

export default function PayForShippingRedirectPage() {
  redirect('/dashboard/procurement/view-orders/pay-for-shipping');
}
