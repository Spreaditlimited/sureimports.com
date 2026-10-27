/** Editorial checks for stored article bodies; site chrome is deliberately excluded. */
export function articleText(html: string) {
  return String(html || '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

const words = (text: string) => (text ? text.split(/\s+/).length : 0);
function paragraphs(html: string) {
  return (String(html || '').match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) || [])
    .map(articleText)
    .filter((text) => words(text) >= 20);
}

export function articleRepetition(
  html: string,
  peers: Array<{ slug: string; html: string }>,
) {
  const bodyWords = words(articleText(html));
  const own = paragraphs(html);
  const counts = new Map<string, number>();
  let largestOverlap = { slug: '', words: 0 };
  for (const peer of peers) {
    const set = new Set(paragraphs(peer.html));
    for (const text of set) counts.set(text, (counts.get(text) || 0) + 1);
    const overlap = own.reduce(
      (sum, text) => sum + (set.has(text) ? words(text) : 0),
      0,
    );
    if (overlap > largestOverlap.words)
      largestOverlap = { slug: peer.slug, words: overlap };
  }
  const sharedWords = own.reduce(
    (sum, text) => sum + ((counts.get(text) || 0) >= 3 ? words(text) : 0),
    0,
  );
  return {
    bodyWords,
    sharedWords,
    sharedRatio: bodyWords ? sharedWords / bodyWords : 0,
    largestOverlap,
    pairRatio: bodyWords ? largestOverlap.words / bodyWords : 0,
  };
}

export function findArticleQualityIssues(input: {
  html: string;
  newPublication: boolean;
  image?: string | null;
  peers: Array<{ slug: string; html: string }>;
}) {
  const issues: string[] = [];
  const repetition = articleRepetition(input.html, input.peers);
  if (input.newPublication && repetition.bodyWords < 2000) {
    issues.push(
      `New articles require at least 2,000 useful body words under the site's editorial policy; this draft has ${repetition.bodyWords}. Length alone does not establish quality.`,
    );
  }
  if (!input.image?.trim())
    issues.push(
      'An article-specific feature image is required before publication.',
    );
  if (
    /\b(?:content cluster|Sure Imports cluster|product-selection cluster|SEO cluster)\b/i.test(
      articleText(input.html),
    )
  ) {
    issues.push(
      'Remove publishing-process language about content clusters from the reader-facing article.',
    );
  }
  if (/<h1\b/i.test(input.html))
    issues.push(
      'Use H2/H3 headings in the body; the page already supplies the article H1.',
    );
  if (repetition.sharedWords >= 200 && repetition.sharedRatio >= 0.25) {
    issues.push(
      `${Math.round(repetition.sharedRatio * 100)}% of body words repeat long paragraphs found in at least three other articles. Replace reused passages with subject-specific information.`,
    );
  } else if (
    repetition.largestOverlap.words >= 200 &&
    repetition.pairRatio >= 0.35
  ) {
    issues.push(
      `${Math.round(repetition.pairRatio * 100)}% of body words repeat paragraphs from /blog/${repetition.largestOverlap.slug}. Review whether the pages serve distinct reader needs.`,
    );
  }
  for (const match of input.html.matchAll(/\bhref\s*=\s*(["'])(.*?)\1/gi)) {
    const href = match[2];
    if (
      /(?:^|\/)(?:undefined|null)(?:[/?#]|$)/i.test(href) ||
      href.includes('/tools/carton-optimization-tool')
    ) {
      issues.push(`Invalid internal destination: ${href}`);
    }
  }
  return [...new Set(issues)];
}
