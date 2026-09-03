const TABLE = /<table\b[\s\S]*?<\/table>/gi;

export function enhanceBlogTables(html: string) {
  return String(html || '').replace(
    TABLE,
    (table) =>
      `<div class="blog-table-scroll" role="region" aria-label="Scrollable data table" tabindex="0">${table}</div>`,
  );
}
