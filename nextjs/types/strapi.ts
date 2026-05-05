export type StrapiProduct = {
  id: number;
  attributes: {
    name: string;
    description: string;
    price?: number;
    image?: {
      data: {
        id: number;
        attributes: {
          url: string;
          alternativeText?: string;
          width?: number;
          height?: number;
        };
      } | null;
    };
  };
};