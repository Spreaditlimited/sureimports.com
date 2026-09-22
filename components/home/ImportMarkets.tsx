import Link from 'next/link';
import styles from './ImportGuide.module.css';

const markets = [
  {
    code: 'ng',
    flag: '🇳🇬',
    name: 'Nigeria',
    href: '/import-from-china-to-nigeria',
    text: 'Buying, sourcing and shipping guides for the Nigerian market.',
  },
  {
    code: 'uk',
    flag: '🇬🇧',
    name: 'United Kingdom',
    href: '/import-from-china-to-uk',
    text: 'China sourcing, white labelling and shipping for UK buyers.',
  },
] as const;

export default function ImportMarkets({
  active,
  expanded = false,
}: {
  active?: 'ng' | 'uk';
  expanded?: boolean;
}) {
  return (
    <nav
      aria-label="Import destination"
      className={expanded ? styles.marketGrid : styles.marketSwitch}
    >
      {markets.map((market) => (
        <Link
          key={market.code}
          href={market.href}
          aria-current={active === market.code ? 'page' : undefined}
        >
          <span className={styles.flag} aria-hidden="true">
            {market.flag}
          </span>
          <div>
            <strong>{market.name}</strong>
            {expanded && (
              <>
                <p>{market.text}</p>
                <span className={styles.textLink}>
                  Explore the {market.name === 'Nigeria' ? 'Nigeria' : 'UK'}{' '}
                  guide
                </span>
              </>
            )}
          </div>
        </Link>
      ))}
    </nav>
  );
}
