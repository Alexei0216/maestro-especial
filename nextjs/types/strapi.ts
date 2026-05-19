export type StrapiMedia = {
  id: number;
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: StrapiMedia;
    small?: StrapiMedia;
    medium?: StrapiMedia;
    large?: StrapiMedia;
  };
};

export type StrapiProductAttribute = {
  id: number;
  name: string;
  value: string;
};

export type StrapiSeo = {
  id: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  ogImage?: StrapiMedia;
};

export type StrapiCategory = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: any; // Blocks
  image?: StrapiMedia;
  seo?: StrapiSeo[];
  parentCategory?: {
    id: number;
    name: string;
    slug: string;
  };
  categories?: StrapiCategory[];
  products?: StrapiProduct[];
};

export type StrapiBrand = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  logo?: StrapiMedia;
};

export type StrapiProductVariant = {
  id: number;
  documentId: string;
  sku?: string;
  price?: number;
  stock?: number;
  images?: StrapiMedia[];
  attributes?: StrapiProductAttribute[];
  product?: StrapiProduct;
};

export type StrapiReview = {
  id: number;
  documentId: string;
  rating: number;
  text?: any; // Blocks
  approved: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  product?: StrapiProduct;
};

export type StrapiOrderItem = {
  id: number;
  documentId: string;
  quantity: number;
  productTitleSnapshot: string;
  productPriceSnapshot: number;
  productImageSnapshot?: StrapiMedia;
  selectedAttributes?: Record<string, any>;
  order?: StrapiOrder;
  product?: StrapiProduct;
};

export type StrapiAddress = {
  id: number;
  country: string;
  city: string;
  province?: string;
  zipCode: string;
  street: string;
  apartment?: string;
};

export type StrapiOrder = {
  id: number;
  documentId: string;
  orderNumber: string;
  orderStatus: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded" | "cancelled";
  totalPrice: number;
  shippingPrice?: number;
  paymentMethod?: string;
  shippingMethod?: string;
  customerNotes?: string;
  preferredDeliveryTime?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  order_items?: StrapiOrderItem[];
  shared_address?: StrapiAddress[];
  shippingAddress?: StrapiAddress | StrapiAddress[];
};

export type StrapiProduct = {
  id: number;
  documentId: string;
  name: string;
  price: number;
  oldPrice?: number;
  thumbnail: StrapiMedia;
  images: StrapiMedia[];
  stock: number;
  sku?: string;
  slug: string;
  shortDescription?: string;
  description?: any; // Blocks - rich text
  attributes?: StrapiProductAttribute[];
  seo?: StrapiSeo[];
  category?: StrapiCategory;
  product_variants?: StrapiProductVariant[];
  reviews?: StrapiReview[];
  order_item?: StrapiOrderItem;
  brand?: StrapiBrand;
  inverter?: boolean;
  wifi?: boolean;
  btu?: number;
  roomArea?: number;
  energyClass?: string;
  installationType?: string;
};
