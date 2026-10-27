import { videoThumbnail } from '@/lib/website-videos/policy';
import { procurementVideo } from '@/lib/website-videos/public';
import { MetadataRoute } from 'next';
import { getPublicPublishedReports } from '@/lib/intelligence/reports';
import { prisma } from '@/lib/prisma';
import { isRedirectedBlogSlug } from '@/lib/blogRedirects';
import { vehicleCatalogue } from '@/lib/vehicles/data';
import {
  BODY_CAMERA_LAUNCH_READY,
  bodyCameraLaunchPaths,
} from '@/lib/bodyCameraSolutions/config';

interface BlogForSitemap {
  blogSlug: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// Blog publication is database-driven, including future-dated scheduled posts.
// Generate the sitemap at request time so newly public posts appear without a redeploy.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.sureimports.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/contact-us`, changeFrequency: 'monthly', priority: 0.7 },
    {
      url: baseUrl,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/import-hub`,
      lastModified: '2026-09-22T00:00:00.000Z',
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/import-from-china-to-uk`,
      lastModified: '2026-09-22T00:00:00.000Z',
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/import-from-china-to-nigeria`,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/supplier-intelligence`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/supplier-verification`,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/supplier-intelligence/reports`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/start`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/buy-from-chinese-websites`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ship-with-us`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/track`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shipping-rate`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/buy-phones-from-china`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/corporate-sourcing`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/laptops-for-business`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/air-vs-sea-calculator`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/cbm-volumetric-weight-calculator`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/carton-optimization`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/generator-sizing`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/landed-cost-estimator`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/retail-price-builder`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/warranty-policy`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  if (BODY_CAMERA_LAUNCH_READY) {
    staticPages.push(
      ...bodyCameraLaunchPaths.map((path, index) => ({
        url: `${baseUrl}${path}`,
        changeFrequency: 'weekly' as const,
        priority: index === 0 ? 0.95 : 0.85,
      })),
    );
  }

  // Fetch published blog posts dynamically
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        blogPublished: true,
        xStaus: 'active',
        AND: [
          { OR: [{ createdAt: null }, { createdAt: { lte: new Date() } }] },
        ],
      },
      select: {
        blogSlug: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    blogPages = blogs
      .filter(
        (blog: BlogForSitemap) =>
          blog.blogSlug &&
          blog.blogSlug.length > 0 &&
          !isRedirectedBlogSlug(blog.blogSlug),
      )
      .map((blog: BlogForSitemap) => ({
        url: `${baseUrl}/blog/${blog.blogSlug}`,
        lastModified:
          blog.updatedAt?.toISOString() ||
          blog.createdAt?.toISOString() ||
          undefined,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
  }

  let reportPages: MetadataRoute.Sitemap = [];
  try {
    const { reports } = await getPublicPublishedReports();
    reportPages = reports.map((report) => ({
      url: `${baseUrl}/supplier-intelligence/reports/${report.slug}`,
      lastModified: report.updatedAt || report.publishedAt || undefined,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error(
      'Error fetching Supplier Intelligence reports for sitemap:',
      error,
    );
  }

  let vehiclePages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/cars`, changeFrequency: 'weekly', priority: 0.9 },
  ];
  try {
    vehiclePages = [
      ...vehiclePages,
      ...(await vehicleCatalogue())
        .filter((m) => m.published)
        .map((m) => ({
          url: `${baseUrl}/cars/models/${m.slug}`,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        })),
    ];
  } catch (error) {
    console.error('Unable to load vehicle sitemap entries', error);
  }
  const video = await procurementVideo();
  const videoPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/buy-from-chinese-websites/video`,
      changeFrequency: 'weekly',
      priority: 0.8,
      videos: [
        {
          title: video.title,
          description: video.description,
          thumbnail_loc: videoThumbnail(video.videoId).url,
          player_loc: `https://www.youtube-nocookie.com/embed/${video.videoId}`,
          publication_date: video.uploadDate,
          duration: video.durationSeconds,
        },
      ],
    },
  ];
  return [
    ...staticPages,
    ...blogPages,
    ...reportPages,
    ...vehiclePages,
    ...videoPages,
  ];
}
