export type StrapiProduct = {
  id: number;
  documentId: string;
  name: string;
  description: string;
  price?: number;
  category?: string;
  image?: {
    id: number;
    url: string;
    alternativeText?: string | null;
    width?: number;
    height?: number;
  };
  gallery?: {
    id: number;
    url: string;
    alternativeText?: string | null;
    width?: number;
    height?: number;
  }[];
};
