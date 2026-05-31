import { redirect } from 'next/navigation';

export default function ReadyForPickupRedirectPage() {
  redirect('/dashboard/procurement/view-orders/ready-for-pickup');
}
