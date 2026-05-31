import { redirect } from 'next/navigation';

export default function PendingOrdersRedirectPage() {
  redirect('/dashboard/procurement/view-orders/pending');
}
