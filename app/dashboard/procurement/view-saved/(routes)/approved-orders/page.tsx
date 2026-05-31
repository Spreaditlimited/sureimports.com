import { redirect } from 'next/navigation';

export default function ApprovedOrdersRedirectPage() {
  redirect('/dashboard/procurement/view-orders/approved');
}
