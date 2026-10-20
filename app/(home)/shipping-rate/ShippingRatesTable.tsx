'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import styles from './ShippingRatesTable.module.css';

export type ShippingRateRow = {
  countryName: string;
  rates: Array<{
    name: string;
    label: string;
    rate: number;
    currency: 'USD' | 'NGN';
    unit: string;
  }>;
};

function formatMoney(value: number, currency: 'USD' | 'NGN') {
  return new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'NGN' ? 0 : 2,
  }).format(value);
}

export default function ShippingRatesTable({
  rates,
}: {
  rates: ShippingRateRow[];
}) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredRates = useMemo(() => {
    const terms = deferredQuery.split(/\s+/).filter(Boolean);

    return rates.flatMap((country) => {
      const matchingRates = terms.length
        ? country.rates.filter((rate) => {
            const searchableText = [
              country.countryName,
              rate.label,
              rate.name,
              rate.currency,
              rate.unit,
            ]
              .join(' ')
              .toLowerCase();
            return terms.every((term) => searchableText.includes(term));
          })
        : country.rates;

      return matchingRates.length ? [{ ...country, rates: matchingRates }] : [];
    });
  }, [deferredQuery, rates]);

  const visibleRateCount = filteredRates.reduce(
    (total, country) => total + country.rates.length,
    0,
  );

  return (
    <div id="shipping-rates" className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h2>Current shipping rates</h2>
          <p>
            Compare the estimated rate, currency and billing unit for each
            method.
          </p>
        </div>
        <div>
          <label htmlFor="shipping-rate-search">
            Find your destination or method
          </label>
          <div className={styles.search}>
            <Search size={18} aria-hidden="true" />
            <input
              id="shipping-rate-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Country or shipping method"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear shipping rate search"
              >
                <X size={17} aria-hidden="true" />
              </button>
            ) : null}
          </div>
          <p className={styles.count} role="status">
            {filteredRates.length}{' '}
            {filteredRates.length === 1 ? 'destination' : 'destinations'} ·{' '}
            {visibleRateCount} {visibleRateCount === 1 ? 'rate' : 'rates'}
          </p>
        </div>
      </div>
      {filteredRates.length > 0 ? (
        <>
          <div className={styles.mobileRates}>
            {filteredRates.map((country) => (
              <section key={country.countryName} className={styles.country}>
                <h3>{country.countryName}</h3>
                <dl>
                  {country.rates.map((rate) => (
                    <div key={rate.name} className={styles.rate}>
                      <dt>{rate.label}</dt>
                      <dd>
                        <strong>{formatMoney(rate.rate, rate.currency)}</strong>
                        <span>
                          {rate.currency} / {rate.unit}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
          <div className={styles.desktopRates}>
            <table>
              <caption className="sr-only">
                Current shipping rates by destination and shipping method
              </caption>
              <thead>
                <tr>
                  <th scope="col">Destination</th>
                  <th scope="col">Shipping method</th>
                  <th scope="col">Estimated rate</th>
                  <th scope="col">Billing unit</th>
                </tr>
              </thead>
              {filteredRates.map((country) => (
                <tbody key={country.countryName}>
                  {country.rates.map((rate, index) => (
                    <tr key={rate.name}>
                      {index === 0 ? (
                        <th scope="rowgroup" rowSpan={country.rates.length}>
                          {country.countryName}
                        </th>
                      ) : null}
                      <td>{rate.label}</td>
                      <td className={styles.money}>
                        {formatMoney(rate.rate, rate.currency)}{' '}
                        <span>{rate.currency}</span>
                      </td>
                      <td>Per {rate.unit}</td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </>
      ) : (
        <div className={styles.empty}>
          <p>
            {rates.length
              ? `No shipping rates match “${query.trim()}”.`
              : 'No shipping rates are currently listed.'}
          </p>
          <p>
            {rates.length
              ? 'Try another country or shipping method.'
              : 'Please chat with us using the WhatsApp button on this page.'}
          </p>
        </div>
      )}
    </div>
  );
}
