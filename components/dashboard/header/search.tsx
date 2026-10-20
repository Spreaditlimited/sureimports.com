'use client';

import { useRouter } from 'next/navigation';
import { useFeatureVisibility } from '@/components/dashboard/features/FeatureAvailability';
import { Search } from 'lucide-react';
import type { FormEvent } from 'react';

export default function DashboardSearch() {
  const router = useRouter();
  const visible = useFeatureVisibility();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = String(new FormData(event.currentTarget).get('search') ?? '').trim();
    if (query.length >= 2) router.push(`/dashboard/shop?search=${encodeURIComponent(query)}`);
  }
  if (!visible('/dashboard/shop')) return null;
  return (
    <form role="search" data-si-search-field onSubmit={submit} className="si-dashboard-search">
      <Search size={18} aria-hidden="true" />
      <input name="search" type="search" aria-label="Search shop products" placeholder="Search shop products…" minLength={2} required />
    </form>
  );
}
