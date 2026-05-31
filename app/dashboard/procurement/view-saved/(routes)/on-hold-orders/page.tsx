import { redirect } from 'next/navigation';

export default function OnHoldOrdersRedirectPage() {
  redirect('/dashboard/procurement/view-orders/on-hold-orders');
}
