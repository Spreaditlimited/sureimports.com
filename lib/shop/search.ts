/** Literal, bounded model numbers: searching 12 must not match 128GB/512GB. */
export function shopSearchPatterns(query: string): string[] {
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return /^\d+$/.test(term) ? `(^|[^0-9])${escaped}([^0-9]|$)` : escaped;
    });
}
