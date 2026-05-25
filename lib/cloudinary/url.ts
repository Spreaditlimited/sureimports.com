type TransformOptions = {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'limit' | 'thumb';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png' | 'avif';
};

const CLOUDINARY_HOST = 'res.cloudinary.com';

export function isCloudinaryUrl(url: string): boolean {
  const value = String(url || '').trim();
  return value.includes(CLOUDINARY_HOST) && value.includes('/image/upload/');
}

export function resolveMediaUrl(
  value: string | null | undefined,
  baseUrl: string | null | undefined = process.env
    .NEXT_PUBLIC_CLOUDINARY_BASE_URL,
): string {
  const media = String(value || '').trim();
  if (!media) return '';

  if (
    media.startsWith('http://') ||
    media.startsWith('https://') ||
    media.startsWith('//') ||
    media.startsWith('data:')
  ) {
    return media;
  }

  if (media.startsWith('/')) {
    return media;
  }

  const base = String(baseUrl || '')
    .trim()
    .replace(/\/$/, '');
  if (!base) return media;

  return `${base}/${media.replace(/^\//, '')}`;
}

export function cloudinaryTransformUrl(
  url: string,
  options: TransformOptions = {},
): string {
  if (!isCloudinaryUrl(url)) {
    return url;
  }

  const parts: string[] = [];

  if (options.format) {
    parts.push(`f_${options.format}`);
  }

  if (options.quality !== undefined) {
    parts.push(`q_${options.quality}`);
  }

  if (options.width) {
    parts.push(`w_${options.width}`);
  }

  if (options.height) {
    parts.push(`h_${options.height}`);
  }

  if (options.crop) {
    parts.push(`c_${options.crop}`);
  }

  if (parts.length === 0) {
    return url;
  }

  return url.replace('/image/upload/', `/image/upload/${parts.join(',')}/`);
}
