export const BLOG_READING_WORDS_PER_MINUTE = 200;

export function blogPlainText(content: string | null | undefined): string {
  return String(content || '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:nbsp|amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getBlogWordCount(content: string | null | undefined): number {
  const plainText = blogPlainText(content);
  return plainText ? plainText.split(' ').length : 0;
}

export function getBlogReadingTime(content: string | null | undefined): number {
  const wordCount = getBlogWordCount(content);
  return wordCount > 0
    ? Math.max(1, Math.ceil(wordCount / BLOG_READING_WORDS_PER_MINUTE))
    : 0;
}
