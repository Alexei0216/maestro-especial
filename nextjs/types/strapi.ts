export type StrapiProduct = {
  id: number;
  documentId: string;
  name: string;
  description: string;
  price?: number;
  image?: {
    id: number;
    url: string;
    alternativeText?: string | null;
    width?: number;
    height?: number;
  };
};
