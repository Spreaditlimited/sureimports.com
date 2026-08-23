export const BODY_CAMERA_LAUNCH_READY = false;

export const bodyCameraBrand = {
  siteName: 'Sure Imports',
  manufacturer: 'Hytera',
  partnerDesignation: 'Authorised Hytera Solutions Partner',
  partnerRegion: 'Nigeria',
  baseUrl: 'https://www.sureimports.com',
  hubPath: '/body-camera-solutions',
  contactEmail: 'hello@sureimports.com',
  phoneDisplay: '+234 803 764 9956',
  phoneHref: '+2348037649956',
  // Replace with Hytera-approved co-brand artwork before launch.
  partnerLogoAsset: null as string | null,
  // Replace with the authorised certificate/directory URL before launch.
  partnerVerificationUrl: null as string | null,
} as const;

const cloudflareStreamCustomerCode = 'customer-1vkeaflxib2kotwm';
const cloudflareStreamVideoId =
  process.env.NEXT_PUBLIC_HYTERA_BODY_CAMERA_VIDEO_ID?.trim() ||
  '226d4ec29d70b364312e3d54f932fd64';

export const bodyCameraVideo = {
  id: cloudflareStreamVideoId,
  isReady: Boolean(cloudflareStreamVideoId),
  playerUrl: cloudflareStreamVideoId
    ? `https://${cloudflareStreamCustomerCode}.cloudflarestream.com/${cloudflareStreamVideoId}/iframe`
    : null,
  manifestUrl: cloudflareStreamVideoId
    ? `https://${cloudflareStreamCustomerCode}.cloudflarestream.com/${cloudflareStreamVideoId}/manifest/video.m3u8`
    : null,
  posterUrl: cloudflareStreamVideoId
    ? `https://${cloudflareStreamCustomerCode}.cloudflarestream.com/${cloudflareStreamVideoId}/thumbnails/thumbnail.jpg`
    : null,
} as const;

export const bodyCameraPlaceholders = {
  pricingApproved: false,
  downloadsApproved: true,
  caseStudyApproved: false,
  productPhotographyApproved: true,
} as const;

export const bodyCameraLaunchPaths = [
  '/body-camera-solutions',
  '/body-camera-solutions/hytera-body-cameras',
  '/body-camera-solutions/hytera-sc580',
  '/body-camera-solutions/hytera-gc550',
  '/body-camera-solutions/digital-evidence-management',
  '/body-camera-solutions/hytera-eds30-docking-station',
  '/body-camera-solutions/live-command-and-dispatch',
  '/body-camera-solutions/body-cameras-for-banks',
  '/body-camera-solutions/body-cameras-for-security-companies',
  '/body-camera-solutions/body-cameras-for-government',
  '/body-camera-solutions/body-cameras-for-transport-and-logistics',
  '/body-camera-solutions/body-cameras-for-oil-gas-and-industry',
] as const;
