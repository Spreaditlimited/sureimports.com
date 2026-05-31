import { redirect } from 'next/navigation';

export default function InTransitRedirectPage() {
  redirect('/dashboard/procurement/view-orders/in-transit');
}
