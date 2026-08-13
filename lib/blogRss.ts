import { prisma } from '@/lib/prisma';

const SITE_URL = 'https://www.sureimports.com';

const MEDIA_PUBLIC_URL = (
  process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL || ''
).replace(/\/$/, '');

function cleanXmlCharacters(value: unknown) {
  return String(value ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
}

function escapeXml(value: unknown) {
  return cleanXmlCharacters(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cdata(value: unknown) {
  return `<![CDATA[${cleanXmlCharacters(value).replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;
}

function absoluteUrl(value: string | null | undefined, fallback = '') {
  const source = String(value || '').trim();
  if (!source) return fallback;
  if (/^https?:\/\//i.test(source)) return source;
  if (source.startsWith('/')) return `${SITE_URL}${source}`;
  if (MEDIA_PUBLIC_URL) {
    if (/^BLOG_[A-Z0-9]+$/.test(source)) {
      return `${MEDIA_PUBLIC_URL}/admin-sureimports/blog/${source}`;
    }
    return `${MEDIA_PUBLIC_URL}/${source.replace(/^\//, '')}`;
  }
  return `${SITE_URL}/${source.replace(/^\//, '')}`;
}

function plainText(html: string) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function parseSeo(value: string | null) {
  if (!value) return {} as Record<string, unknown>;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object'
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {} as Record<string, unknown>;
  }
}

export async function buildBlogRss() {
  const generatedAt = new Date();
  let posts: Awaited<ReturnType<typeof loadFeedPosts>> = [];

  try {
    posts = await loadFeedPosts();
  } catch (error) {
    console.error('Error building blog RSS feed:', error);
  }

  const lastBuildDate =
    posts[0]?.updatedAt || posts[0]?.createdAt || generatedAt;
  const fallbackImage = `${SITE_URL}/images/sure-imports-social-card.png`;

  const items = posts.map((post) => {
    const slug = post.blogSlug || post.pidBlog;
    const link = `${SITE_URL}/blog/${encodeURIComponent(slug)}`;
    const seo = parseSeo(post.blogExt2);
    const body = post.blogContent || '';
    const descriptionSource =
      typeof seo.metaDescription === 'string'
        ? seo.metaDescription
        : plainText(body).slice(0, 300);
    const author = post.publisher?.publisherName || post.blogBy || 'Sure Imports';
    const image = absoluteUrl(post.blogImage, fallbackImage);
    const publishedAt = post.createdAt || generatedAt;
    const updatedAt = post.updatedAt || publishedAt;
    const category = post.category?.categoryName ||
      (typeof seo.category === 'string' ? seo.category : 'Import Guide');
    const feedContent = `<p>${escapeXml(descriptionSource)}</p><p><a href="${escapeXml(link)}">Read the complete article on Sure Imports</a></p>`;

    return `
    <item>
      <title>${escapeXml(post.blogTitle)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${publishedAt.toUTCString()}</pubDate>
      <dc:creator>${cdata(author)}</dc:creator>
      <category>${cdata(category)}</category>
      <description>${cdata(descriptionSource)}</description>
      <content:encoded>${cdata(feedContent)}</content:encoded>
      <media:content url="${escapeXml(image)}" medium="image" />
      <atom:updated>${updatedAt.toISOString()}</atom:updated>
    </item>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Sure Imports Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Practical guides and expert insights for sourcing products, paying suppliers and shipping goods from China.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
    <generator>Sure Imports</generator>
    <image>
      <url>${fallbackImage}</url>
      <title>Sure Imports Blog</title>
      <link>${SITE_URL}/blog</link>
    </image>
    <atom:link href="${SITE_URL}/blog/rss" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;
}

async function loadFeedPosts() {
  return prisma.blog.findMany({
    where: {
      blogPublished: true,
      xStaus: 'active',
      AND: [{ OR: [{ createdAt: null }, { createdAt: { lte: new Date() } }] }],
    },
    select: {
      pidBlog: true,
      blogTitle: true,
      blogContent: true,
      blogSlug: true,
      blogImage: true,
      blogBy: true,
      blogExt2: true,
      createdAt: true,
      updatedAt: true,
      publisher: { select: { publisherName: true } },
      category: { select: { categoryName: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
}
