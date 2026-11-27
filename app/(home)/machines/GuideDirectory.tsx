'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { selectMachineGuides } from '@/lib/machines/guides';
import styles from './page.module.css';

type Guide = ReturnType<typeof selectMachineGuides>[number];
export default function GuideDirectory({ guides }: { guides: Guide[] }) {
  const [query, setQuery] = useState('');
  const needle = query.trim().toLocaleLowerCase();
  const filtered = guides.filter((guide) =>
    `${guide.title} ${guide.description}`.toLocaleLowerCase().includes(needle),
  );
  return (
    <>
      <div className={styles.search}>
        <label htmlFor="machine-guide-search">
          Find a machine or sourcing topic
        </label>
        <input
          id="machine-guide-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try tissue, milling, packaging or factory testing"
        />
        <p role="status">
          {filtered.length} of {guides.length} published guides
          {needle ? ' match your search' : ' available'}.
        </p>
      </div>
      {filtered.length === 0 ? (
        <p>
          No published guide matches that search. Try another machine name or
          ask Sure Imports about your project.
        </p>
      ) : null}
      {[
        'Machines and production lines',
        'Buying, testing and factory setup',
      ].map((group) => {
        const items = filtered.filter((guide) => guide.group === group);
        return items.length ? (
          <div key={group} className={styles.guideGroup}>
            <h3>
              {group} <span>{items.length}</span>
            </h3>
            <div className={styles.guideGrid}>
              {items.map((guide) => (
                <article key={guide.slug} className={styles.guideCard}>
                  <p className={styles.guideLabel}>
                    {guide.isSeries
                      ? 'China sourcing · Nigeria guide'
                      : group === 'Machines and production lines'
                        ? 'Machine guide'
                        : 'Sourcing knowledge'}
                  </p>
                  <h4>
                    <Link href={`/blog/${guide.slug}`}>{guide.title}</Link>
                  </h4>
                  {guide.description ? <p>{guide.description}</p> : null}
                  <Link
                    href={`/blog/${guide.slug}`}
                    className={styles.readLink}
                    aria-label={`Read ${guide.title}`}
                  >
                    Read guide
                  </Link>
                </article>
              ))}
            </div>
          </div>
        ) : null;
      })}
    </>
  );
}
