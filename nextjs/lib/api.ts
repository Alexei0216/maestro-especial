import {
  StrapiProduct,
  StrapiCategory,
  StrapiOrder,
  StrapiReview,
  StrapiProductVariant,
  StrapiMedia,
  StrapiSeo,
  StrapiProductAttribute,
  StrapiOrderItem,
  StrapiAddress,
} from "../types/strapi";
import { Product, Category, Order } from "../types/product";

const SERVER_API_URL =
  process.env.STRAPI_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:1337";

const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337";

function getMediaUrl(url?: string): string | undefined {
  if (!url) {
    return undefined;
  }

  if (url.startsWith("http")) {
    return url;
  }

  return `${PUBLIC_API_URL}${url}`;
}

function mapMedia(media?: StrapiMedia): string | undefined {
  return getMediaUrl(media?.url);
}

function mapMediaArray(media?: StrapiMedia[]): string[] {
  return (media ?? [])
    .map((m) => getMediaUrl(m.url))
    .filter((url): url is string => Boolean(url));
}

function mapSeo(seo?: StrapiSeo[]): Product["seo"] | Category["seo"] | undefined {
  if (!seo || seo.length === 0) return undefined;
  const s = seo[0];
  return {
    metaTitle: s.metaTitle,
    metaDescription: s.metaDescription,
    keywords: s.keywords,
    ogImage: mapMedia(s.ogImage),
  };
}

function mapAttributes(attributes?: StrapiProductAttribute[]) {
  return (attributes ?? []).map((attr) => ({
    id: attr.id,
    name: attr.name,
    value: attr.value,
  }));
}

function mapVariants(variants?: StrapiProductVariant[]) {
  return (variants ?? []).map((v) => ({
    id: v.id,
    sku: v.sku,
    price: v.price,
    stock: v.stock,
    images: mapMediaArray(v.images),
    attributes: mapAttributes(v.attributes),
  }));
}

function mapReviews(reviews?: StrapiReview[]) {
  return (reviews ?? [])
    .filter((r) => r.approved)
    .map((r) => ({
      id: r.id,
      rating: r.rating,
      text: r.text,
      approved: r.approved,
      user: r.user ? {
        username: r.user.username,
        email: r.user.email,
      } : undefined,
    }));
}

function mapOrderItems(items?: StrapiOrderItem[]) {
  return (items ?? []).map((item) => ({
    id: item.id,
    quantity: item.quantity,
    productTitleSnapshot: item.productTitleSnapshot,
    productPriceSnapshot: item.productPriceSnapshot,
    productImageSnapshot: mapMedia(item.productImageSnapshot),
    selectedAttributes: item.selectedAttributes,
    product: item.product ? {
      id: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
    } : undefined,
  }));
}

function mapAddress(address?: StrapiAddress[]): Order["shippingAddress"] | undefined {
  if (!address || address.length === 0) return undefined;
  const addr = address[0];
  return {
    country: addr.country,
    city: addr.city,
    zipCode: addr.zipCode,
    street: addr.street,
    apartment: addr.apartment,
  };
}

// Helper function to build Strapi query from URL search params
export function buildStrapiQuery(searchParams: Record<string, string | string[] | undefined>): string {
  const params = new URLSearchParams();

  const minPrice = typeof searchParams.minPrice === 'string' ? searchParams.minPrice : undefined;
  const maxPrice = typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : undefined;
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : undefined;

  if (minPrice) params.append("filters[price][$gte]", minPrice);
  if (maxPrice) params.append("filters[price][$lte]", maxPrice);

  if (category) params.append("filters[category][slug][$eq]", category);

  if (sort === "price_asc") params.append("sort", "price:asc");
  if (sort === "price_desc") params.append("sort", "price:desc");
  if (sort === "newest") params.append("sort", "createdAt:desc");

  params.append("populate", "*");

  return params.toString();
}

// Products
export async function getProducts(searchParams?: Record<string, string | string[] | undefined>): Promise<Product[]> {
  const queryString = searchParams ? buildStrapiQuery(searchParams) : "populate=*";
  
  const res = await fetch(
    `${SERVER_API_URL}/api/products?${queryString}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }

  const data = await res.json();

  return (data?.data ?? []).map(
    (item: StrapiProduct): Product => ({
      id: item.id,
      documentId: item.documentId,
      name: item.name,
      price: item.price,
      oldPrice: item.oldPrice,
      thumbnail: mapMedia(item.thumbnail)!,
      images: mapMediaArray(item.images),
      stock: item.stock,
      sku: item.sku,
      slug: item.slug,
      shortDescription: item.shortDescription,
      description: item.description,
      attributes: mapAttributes(item.attributes),
      seo: mapSeo(item.seo),
      category: item.category ? {
        id: item.category.id,
        name: item.category.name,
        slug: item.category.slug,
      } : undefined,
      variants: mapVariants(item.product_variants),
      reviews: mapReviews(item.reviews),
    })
  );
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const res = await fetch(
    `${SERVER_API_URL}/api/products?filters[slug][$eq]=${slug}&populate=*`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch product: ${res.status}`);
  }

  const data = await res.json();
  const item = data?.data?.[0];

  if (!item) return undefined;

  return {
    id: item.id,
    documentId: item.documentId,
    name: item.name,
    price: item.price,
    oldPrice: item.oldPrice,
    thumbnail: mapMedia(item.thumbnail)!,
    images: mapMediaArray(item.images),
    stock: item.stock,
    sku: item.sku,
    slug: item.slug,
    shortDescription: item.shortDescription,
    description: item.description,
    attributes: mapAttributes(item.attributes),
    seo: mapSeo(item.seo),
    category: item.category ? {
      id: item.category.id,
      name: item.category.name,
      slug: item.category.slug,
    } : undefined,
    variants: mapVariants(item.product_variants),
    reviews: mapReviews(item.reviews),
  };
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  const products = await getProducts();
  const related = products.filter((item) => item.id !== product.id);
  const sameCategory = product.category
    ? related.filter((item) => item.category?.id === product.category?.id)
    : [];

  return [
    ...sameCategory,
    ...related.filter((item) => !sameCategory.includes(item)),
  ].slice(0, 8);
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const res = await fetch(
    `${SERVER_API_URL}/api/categories?populate=*`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status}`);
  }

  const data = await res.json();

  return (data?.data ?? []).map(
    (item: StrapiCategory): Category => ({
      id: item.id,
      documentId: item.documentId,
      name: item.name,
      slug: item.slug,
      description: item.description,
      image: mapMedia(item.image),
      seo: mapSeo(item.seo),
      parentCategory: item.parentCategory ? {
        id: item.parentCategory.id,
        name: item.parentCategory.name,
        slug: item.parentCategory.slug,
      } : undefined,
      subcategories: item.categories?.map((cat) => ({
        id: cat.id,
        documentId: cat.documentId,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: mapMedia(cat.image),
        seo: mapSeo(cat.seo),
      })),
      products: item.products?.map((prod: any) => ({
        id: prod.id,
        documentId: prod.documentId,
        name: prod.name,
        price: prod.price,
        oldPrice: prod.oldPrice,
        thumbnail: mapMedia(prod.thumbnail)!,
        images: mapMediaArray(prod.images),
        stock: prod.stock,
        sku: prod.sku,
        slug: prod.slug,
        shortDescription: prod.shortDescription,
        description: prod.description,
        attributes: mapAttributes(prod.attributes),
        seo: mapSeo(prod.seo),
        category: prod.category ? {
          id: prod.category.id,
          name: prod.category.name,
          slug: prod.category.slug,
        } : undefined,
        variants: mapVariants(prod.product_variants),
        reviews: mapReviews(prod.reviews),
      })),
    })
  );
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const res = await fetch(
    `${SERVER_API_URL}/api/categories?filters[slug][$eq]=${slug}&populate=*`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch category: ${res.status}`);
  }

  const data = await res.json();
  const item = data?.data?.[0];

  if (!item) return undefined;

  return {
    id: item.id,
    documentId: item.documentId,
    name: item.name,
    slug: item.slug,
    description: item.description,
    image: mapMedia(item.image),
    seo: mapSeo(item.seo),
    parentCategory: item.parentCategory ? {
      id: item.parentCategory.id,
      name: item.parentCategory.name,
      slug: item.parentCategory.slug,
    } : undefined,
    subcategories: item.categories?.map((cat: StrapiCategory) => ({
      id: cat.id,
      documentId: cat.documentId,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: mapMedia(cat.image),
      seo: mapSeo(cat.seo),
    })),
    products: item.products?.map((prod: any) => ({
      id: prod.id,
      documentId: prod.documentId,
      name: prod.name,
      price: prod.price,
      oldPrice: prod.oldPrice,
      thumbnail: mapMedia(prod.thumbnail)!,
      images: mapMediaArray(prod.images),
      stock: prod.stock,
      sku: prod.sku,
      slug: prod.slug,
      shortDescription: prod.shortDescription,
      description: prod.description,
      attributes: mapAttributes(prod.attributes),
      seo: mapSeo(prod.seo),
      category: prod.category ? {
        id: prod.category.id,
        name: prod.category.name,
        slug: prod.category.slug,
      } : undefined,
      variants: mapVariants(prod.product_variants),
      reviews: mapReviews(prod.reviews),
    })),
  };
}

// Orders
export async function getOrders(): Promise<Order[]> {
  const res = await fetch(
    `${SERVER_API_URL}/api/orders?populate[order_items][populate][product]=*&populate[order_items][populate][productImageSnapshot]=*&populate[shared_address]=*&populate[user]=*`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch orders: ${res.status}`);
  }

  const data = await res.json();

  return (data?.data ?? []).map(
    (item: StrapiOrder): Order => ({
      id: item.id,
      documentId: item.documentId,
      orderNumber: item.orderNumber,
      orderStatus: item.orderStatus,
      paymentStatus: item.paymentStatus,
      totalPrice: item.totalPrice,
      shippingPrice: item.shippingPrice,
      paymentMethod: item.paymentMethod,
      shippingMethod: item.shippingMethod,
      customerName: item.customerName,
      customerEmail: item.customerEmail,
      customerPhone: item.customerPhone,
      items: mapOrderItems(item.order_items),
      shippingAddress: mapAddress(item.shared_address),
    })
  );
}

export async function getOrder(orderNumber: string): Promise<Order | undefined> {
  const res = await fetch(
    `${SERVER_API_URL}/api/orders?filters[orderNumber][$eq]=${orderNumber}&populate[order_items][populate][product]=*&populate[order_items][populate][productImageSnapshot]=*&populate[shared_address]=*&populate[user]=*`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch order: ${res.status}`);
  }

  const data = await res.json();
  const item = data?.data?.[0];

  if (!item) return undefined;

  return {
    id: item.id,
    documentId: item.documentId,
    orderNumber: item.orderNumber,
    orderStatus: item.orderStatus,
    paymentStatus: item.paymentStatus,
    totalPrice: item.totalPrice,
    shippingPrice: item.shippingPrice,
    paymentMethod: item.paymentMethod,
    shippingMethod: item.shippingMethod,
    customerName: item.customerName,
    customerEmail: item.customerEmail,
    customerPhone: item.customerPhone,
    items: mapOrderItems(item.order_items),
    shippingAddress: mapAddress(item.shared_address),
  };
}

// Reviews
export async function getProductReviews(productId: number): Promise<Product["reviews"]> {
  const res = await fetch(
    `${SERVER_API_URL}/api/reviews?filters[product][id][$eq]=${productId}&filters[approved][$eq]=true&populate[user]=*`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch reviews: ${res.status}`);
  }

  const data = await res.json();

  return (data?.data ?? []).map((item: StrapiReview) => ({
    id: item.id,
    rating: item.rating,
    text: item.text,
    approved: item.approved,
    user: item.user ? {
      username: item.user.username,
      email: item.user.email,
    } : undefined,
  }));
}
