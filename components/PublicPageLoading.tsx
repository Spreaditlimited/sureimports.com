'use client';

import { useLayoutEffect } from 'react';

export default function PublicPageLoading({
  label = 'Loading page…',
}: {
  label?: string;
}) {
  useLayoutEffect(() => {
    // Run after navigation records the previous page's scroll, but before paint.
    // A short fallback must not inherit the catalogue's deep scroll position.
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div
      role="status"
      aria-busy="true"
      className="flex items-center justify-center bg-[var(--si-canvas)] px-6 text-[var(--si-muted)]"
      style={{ minHeight: '100svh' }}
    >
      <p>{label}</p>
    </div>
  );
}
