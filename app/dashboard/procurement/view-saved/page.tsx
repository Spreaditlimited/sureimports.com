import { redirect } from 'next/navigation';

export default function ViewSavedRedirectPage() {
  redirect('/dashboard/procurement/view-orders/saved');
}
