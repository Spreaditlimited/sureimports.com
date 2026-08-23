export type SolutionImage = {
  src: string;
  alt: string;
  subject: string;
  sourceUrl: string;
};

const sc580: SolutionImage = {
  src: '/images/body-camera-solutions/hytera-sc580-product.webp',
  alt: 'Hytera SC580 smart 4G body-worn camera',
  subject: 'Hytera SC580',
  sourceUrl:
    'https://www.hytera.com/la/product-new/body-worn-camera/body-worn-camera/sc580.html',
};

const gc550: SolutionImage = {
  src: '/images/body-camera-solutions/hytera-gc550-product.webp',
  alt: 'Hytera GC550 compact 2K body-worn camera',
  subject: 'Hytera GC550',
  sourceUrl:
    'https://www.hytera.com/en/product-new/body-worn-camera/body-worn-camera/gc550.html',
};

const eds30: SolutionImage = {
  src: '/images/body-camera-solutions/hytera-eds30-product.png',
  alt: 'Hytera EDS30 portable eight-bay docking station',
  subject: 'Hytera EDS30',
  sourceUrl: 'https://www.hytera.com/eu/products/ids-system/eds30',
};

const dem: SolutionImage = {
  src: '/images/body-camera-solutions/hytera-dem-platform.webp',
  alt: 'Hytera Digital Evidence Management dashboard displayed on a monitor',
  subject: 'Hytera Digital Evidence Management',
  sourceUrl:
    'https://www.hytera.com/en/product-new/body-worn-camera/management-platform/dem.html',
};

export const bodyCameraProductImages = { sc580, gc550, eds30, dem } as const;

export const solutionImageBySlug: Record<string, SolutionImage> = {
  'hytera-body-cameras': sc580,
  'hytera-sc580': sc580,
  'hytera-gc550': gc550,
  'digital-evidence-management': dem,
  'hytera-eds30-docking-station': eds30,
  'live-command-and-dispatch': sc580,
  'body-cameras-for-banks': gc550,
  'body-cameras-for-security-companies': sc580,
  'body-cameras-for-government': sc580,
  'body-cameras-for-transport-and-logistics': gc550,
  'body-cameras-for-oil-gas-and-industry': sc580,
};
