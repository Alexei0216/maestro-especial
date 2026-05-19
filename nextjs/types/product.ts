export type Product = {
  id: number;
  documentId: string;
  name: string;
  price: number;
  oldPrice?: number;
  thumbnail: string; // URL
  images: string[]; // URLs
  stock: number;
  sku?: string;
  slug: string;
  shortDescription?: string;
  description?: any; // Rich text blocks
  attributes?: {
    id: number;
    name: string;
    value: string;
  }[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    ogImage?: string;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  brand?: {
    id: number;
    title: string;
    slug: string;
  };
  inverter?: boolean;
  wifi?: boolean;
  btu?: number;
  roomArea?: number;
  energyClass?: string;
  installationType?: string;
  variants?: {
    id: number;
    sku?: string;
    price?: number;
    stock?: number;
    images?: string[];
    attributes?: {
      name: string;
      value: string;
    }[];
  }[];
  reviews?: {
    id: number;
    rating: number;
    text?: any;
    approved: boolean;
    user?: {
      username: string;
      email: string;
    };
  }[];
};

export type PaginatedProducts = {
  products: Product[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
};

export type Category = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: any;
  image?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    ogImage?: string;
  };
  parentCategory?: {
    id: number;
    name: string;
    slug: string;
  };
  subcategories?: Category[];
  products?: Product[];
};

export type Order = {
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
  items: {
    id: number;
    quantity: number;
    productTitleSnapshot: string;
    productPriceSnapshot: number;
    productImageSnapshot?: string;
    selectedAttributes?: Record<string, any>;
    product?: {
      id: number;
      name: string;
      slug: string;
    };
  }[];
  shippingAddress?: {
    country: string;
    city: string;
    province?: string;
    zipCode: string;
    street: string;
    apartment?: string;
  };
};
