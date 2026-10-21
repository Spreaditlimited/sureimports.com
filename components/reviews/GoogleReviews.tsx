'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './GoogleReviews.module.css';

type Review = {
  id: string;
  rating: number;
  text: string;
  date: string;
  author: string;
  authorUrl?: string;
  avatar?: string;
  url?: string;
};
type Reviews = {
  name: string;
  rating: number;
  count: number;
  url?: string;
  reviews: Review[];
  attributions: { provider: string; providerUri?: string }[];
};
const listingUrl = 'https://www.google.com/maps?cid=12434003460925322644';
const httpsUrl = (value?: string) => {
  try {
    const url = new URL(value || '');
    return url.protocol === 'https:' ? url.href : undefined;
  } catch {
    return undefined;
  }
};

function ReviewText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <details
      className={styles.quote}
      onToggle={(event) => setExpanded(event.currentTarget.open)}
    >
      <summary>
        <span>{text}</span>
        <span className={styles.readMore}>
          {expanded ? 'Show less' : 'Read review'}
        </span>
      </summary>
      <p>{text}</p>
    </details>
  );
}

export default function GoogleReviews() {
  const root = useRef<HTMLElement>(null);
  const [data, setData] = useState<Reviews | null>(null);
  const [status, setStatus] = useState<
    'waiting' | 'loading' | 'ready' | 'unavailable'
  >('waiting');
  useEffect(() => {
    const controller = new AbortController();
    let started = false;
    const load = async () => {
      if (started) return;
      started = true;
      setStatus('loading');
      try {
        const response = await fetch('/api/google-reviews', {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Unavailable');
        const result: Reviews = await response.json();
        if (
          !Number.isFinite(result.rating) ||
          !Number.isFinite(result.count) ||
          !Array.isArray(result.reviews)
        )
          throw new Error('Invalid response');
        setData(result);
        setStatus('ready');
      } catch {
        if (!controller.signal.aborted) setStatus('unavailable');
      }
    };
    if (!('IntersectionObserver' in window)) {
      void load();
      return () => controller.abort();
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        void load();
      }
    });
    if (root.current) observer.observe(root.current);
    return () => {
      observer.disconnect();
      controller.abort();
    };
  }, []);
  return (
    <section
      ref={root}
      className={styles.section}
      aria-labelledby="google-reviews-title"
    >
      <div className={styles.heading}>
        <div>
          <p className={styles.source} translate="no">
            Google Maps
          </p>
          <h2 id="google-reviews-title">More customer experiences</h2>
          {data ? (
            <p className={styles.rating}>
              <strong>{data.rating.toFixed(1)} / 5</strong>
              <span aria-hidden="true">★</span>From{' '}
              {data.count.toLocaleString()} Google reviews
            </p>
          ) : (
            <p className={styles.notice} role="status">
              {status === 'unavailable'
                ? 'Read our customer reviews directly on Google.'
                : 'Loading customer reviews from Google…'}
            </p>
          )}
        </div>
        <a
          className={styles.allReviews}
          href={httpsUrl(data?.url) || listingUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read all reviews on Google <span aria-hidden="true">↗</span>
        </a>
      </div>
      {data && (
        <>
          <p className={styles.notice}>
            Showing up to four reviews in Google's relevance order.
            Review text is shown in its original language.
          </p>
          <div className={styles.grid}>
            {data.reviews.slice(0, 4).map((review) => (
              <article className={styles.card} key={review.id}>
                <div className={styles.author}>
                  {httpsUrl(review.avatar) && (
                    <img
                      src={httpsUrl(review.avatar)}
                      width={40}
                      height={40}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div>
                    <a
                      href={
                        httpsUrl(review.authorUrl) ||
                        httpsUrl(review.url) ||
                        listingUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {review.author}
                    </a>
                    <p>{review.date}</p>
                  </div>
                </div>
                <p
                  className={styles.stars}
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {'★'.repeat(
                    Math.max(0, Math.min(5, Math.round(review.rating))),
                  )}
                  <span aria-hidden="true">
                    {'☆'.repeat(
                      5 - Math.max(0, Math.min(5, Math.round(review.rating))),
                    )}
                  </span>
                </p>
                {review.text && <ReviewText text={review.text} />}
                <a
                  className={styles.reviewLink}
                  href={httpsUrl(review.url) || listingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Google Maps ↗
                </a>
              </article>
            ))}
          </div>
          {data.attributions.map((item) => (
            <p key={item.provider} className={styles.notice}>
              <a href={httpsUrl(item.providerUri)}>{item.provider}</a>
            </p>
          ))}
        </>
      )}
      <p className={styles.terms}>
        Google reviews are provided through Google Maps.{' '}
        <a
          href="https://www.google.com/intl/en_us/help/terms_maps/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Maps terms
        </a>{' '}
        ·{' '}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Privacy Policy
        </a>
      </p>
    </section>
  );
}
