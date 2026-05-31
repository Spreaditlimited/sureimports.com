import { redirect } from 'next/navigation';

export default function CompletedOrdersRedirectPage() {
  redirect('/dashboard/procurement/view-orders/completed-orders');
}
