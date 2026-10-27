const TABLE = /<table\b[\s\S]*?<\/table>/gi;

export function enhanceBlogTables(html: string) {
  return String(html || '')
    .replace(/<iframe\b([^>]*)>/gi, (_, attributes: string) => {
      const lazy = /\bloading\s*=/.test(attributes)
        ? attributes.replace(/\bloading\s*=\s*(["']).*?\1/gi, 'loading="lazy"')
        : `${attributes} loading="lazy"`;
      const accessible = /\btitle\s*=/.test(lazy)
        ? lazy
        : `${lazy} title="Related video"`;
      return `<iframe${accessible}>`;
    })
    .replace(
      TABLE,
      (table) =>
        `<div class="blog-table-scroll" role="region" aria-label="Scrollable data table" tabindex="0">${table}</div>`,
    );
}
