export type FreeCatalog = {
  slug: string;
  title: string;
  description: string;
  coverImageUrl: string;
  cloudinaryPublicId: string;
  filename: string;
  styleCount: number;
  pageCount: number;
  fileSizeLabel: string;
};

export const freeCatalogs: FreeCatalog[] = [
  {
    slug: 'futura-premium-wigs',
    title: 'Futura Premium Wigs',
    description:
      'Explore 150 photographed lace frontal styles made with Japanese Futura fibre. Each has a JY code you can use to request the exact look you want.',
    coverImageUrl:
      'https://res.cloudinary.com/djprcwnsz/image/upload/v1794659360/sureimports/free-catalogs/futura-premium-wigs-cover-minimal-2026.png',
    cloudinaryPublicId:
      'sureimports/free-catalogs/futura-premium-wigs-catalogue-minimal-2026.pdf',
    filename: 'Sure-Imports-Futura-Premium-Wigs-Catalogue.pdf',
    styleCount: 150,
    pageCount: 7,
    fileSizeLabel: '20 MB',
  },
];

export const freeCatalogBySlug = new Map(
  freeCatalogs.map((catalog) => [catalog.slug, catalog]),
);
