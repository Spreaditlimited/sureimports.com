export type BodyCameraDocument = {
  slug: string;
  title: string;
  description: string;
  version: string;
  pages: number;
  fileSize: string;
  filename: string;
  cloudinaryPublicId: string;
};

export const bodyCameraDocuments: BodyCameraDocument[] = [
  {
    slug: 'body-camera-product-solution-catalogue',
    title: 'Body Camera Product and Solution Catalogue',
    description:
      'Official Hytera catalogue covering SC580, GC550, EDS30, digital evidence management and related solution components.',
    version: '2026 catalogue',
    pages: 13,
    fileSize: '4.6 MB',
    filename: 'Hytera-Body-Camera-Product-and-Solution-Catalogue-2026.pdf',
    cloudinaryPublicId:
      'sureimports/body-camera-solutions/documents/hytera-body-camera-product-solution-catalogue-2026.pdf',
  },
  {
    slug: 'digital-evidence-management-product-description-v5-4',
    title: 'Digital Evidence Management System — Product Description',
    description:
      'Technical reference for DEM architecture, evidence workflows, networking, security, reliability and system specifications.',
    version: 'Version 5.4',
    pages: 45,
    fileSize: '1.0 MB',
    filename: 'Hytera-Digital-Evidence-Management-Product-Description-V5.4.pdf',
    cloudinaryPublicId:
      'sureimports/body-camera-solutions/documents/hytera-digital-evidence-management-product-description-v5-4.pdf',
  },
];

export const bodyCameraDocumentBySlug = new Map(
  bodyCameraDocuments.map((document) => [document.slug, document]),
);
