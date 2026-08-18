const configuredLineScoutUrl =
  process.env.NEXT_PUBLIC_LINESCOUT_BASE_URL ||
  (process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_SITE_URL
    : undefined);

export const LINESCOUT_BASE_URL = (
  configuredLineScoutUrl || 'https://linescout.sureimports.com'
).replace(/\/$/, '');

export const LINESCOUT_WHITE_LABEL_URL =
  `${LINESCOUT_BASE_URL}/sourcing-project?route_type=white_label`;

export const LINESCOUT_BULK_SOURCING_URL =
  `${LINESCOUT_BASE_URL}/sourcing-project?route_type=simple_sourcing`;

export const LINESCOUT_MACHINE_SOURCING_URL =
  `${LINESCOUT_BASE_URL}/sourcing-project?route_type=machine_sourcing`;

export function getLineScoutProductUrl(slug: string) {
  return `${LINESCOUT_BASE_URL}/white-label/${encodeURIComponent(slug)}`;
}
