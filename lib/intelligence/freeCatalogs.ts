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
      'Browse 150 photographed lace frontal wig styles made with Japanese Futura fibre. The catalog includes style codes, 13 × 4 and 13 × 6 lace options, a one-piece minimum order and indicative USD product prices.',
    coverImageUrl:
      'https://res.cloudinary.com/djprcwnsz/image/upload/v1794658233/sureimports/free-catalogs/futura-premium-wigs-cover-2026.png',
    cloudinaryPublicId:
      'sureimports/free-catalogs/futura-premium-wigs-catalogue-2026.pdf',
    filename: 'Sure-Imports-Futura-Premium-Wigs-Catalogue.pdf',
    styleCount: 150,
    pageCount: 7,
    fileSizeLabel: '20 MB',
  },
];

export const freeCatalogBySlug = new Map(
  freeCatalogs.map((catalog) => [catalog.slug, catalog]),
);
