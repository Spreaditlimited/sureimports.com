'use client';

import { useId, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import styles from './CatalogueSearch.module.css';

export default function CatalogueSearch({
  label,
  placeholder,
  value,
  onChange,
  onSubmit,
  onClear,
  helper,
  action,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClear?: () => void;
  helper: string;
  action?: string;
}) {
  const id = useId();
  return (
    <div className={styles.wrapper}>
      <form
        role="search"
        aria-label={label}
        action={action}
        onSubmit={onSubmit}
        className={styles.field}
      >
        <Search size={20} className={styles.icon} aria-hidden="true" />
        <label className="sr-only" htmlFor={id}>
          {label}
        </label>
        <input
          id={id}
          data-si-unstyled
          className={styles.input}
          type="search"
          name="q"
          maxLength={200}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-describedby={`${id}-help`}
        />
        <button className={styles.submit} type="submit">
          Search
        </button>
      </form>
      <div className={styles.helpRow}>
        <p id={`${id}-help`} className={styles.help}>
          {helper}
        </p>
        {value && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => (onClear ? onClear() : onChange(''))}
            aria-label={`Clear ${label.toLowerCase()}`}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
