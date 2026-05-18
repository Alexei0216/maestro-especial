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
import { Product, Category, Order, PaginatedProducts } from "../types/product";

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

  // Validate and sanitize parameters
  const minPrice = typeof searchParams.minPrice === 'string' && !isNaN(Number(searchParams.minPrice))
    ? searchParams.minPrice : undefined;
  const maxPrice = typeof searchParams.maxPrice === 'string' && !isNaN(Number(searchParams.maxPrice))
    ? searchParams.maxPrice : undefined;
  const categories = typeof searchParams.categories === 'string'
    ? searchParams.categories.split(',').filter(Boolean) : [];
  const sort = typeof searchParams.sort === 'string' && searchParams.sort.trim() !== ''
    ? searchParams.sort : undefined;
  const sizes = typeof searchParams.sizes === 'string'
    ? [searchParams.sizes].filter(Boolean) : [];
  const types = typeof searchParams.types === 'string'
    ? [searchParams.types].filter(Boolean) : [];
  const search = typeof searchParams.search === 'string' && searchParams.search.trim() !== ''
    ? searchParams.search.trim() : undefined;
  const page = (typeof searchParams.page === 'string' && !isNaN(Number(searchParams.page)))
    || (typeof searchParams['pagination[page]'] === 'string' && !isNaN(Number(searchParams['pagination[page]'])))
    ? (searchParams.page || searchParams['pagination[page]']) : '1';
  const pageSize = (typeof searchParams.pageSize === 'string' && !isNaN(Number(searchParams.pageSize)))
    || (typeof searchParams['pagination[pageSize]'] === 'string' && !isNaN(Number(searchParams['pagination[pageSize]'])))
    ? (searchParams.pageSize || searchParams['pagination[pageSize]']) : '12';

  console.log("Parsed search params:", { minPrice, maxPrice, categories, sort, search, page, pageSize });

  if (minPrice) params.append("filters[price][$gte]", minPrice);
  if (maxPrice) params.append("filters[price][$lte]", maxPrice);

  // Categories filter - multiple selection using slug or id markers
  const categorySlugs: string[] = [];
  const categoryIds: string[] = [];

  categories.forEach((cat) => {
    if (!cat || typeof cat !== 'string') return;

    if (cat.startsWith("slug:")) {
      const slug = cat.replace(/^slug:/, "").trim();
      if (
        slug &&
        slug !== "null" &&
        slug !== "undefined"
      ) {
        categorySlugs.push(slug);
      }
    } else if (cat.startsWith("id:")) {
      const id = cat.replace(/^id:/, "").trim();
      if (id && !isNaN(Number(id))) categoryIds.push(id);
    } else {
      const slug = cat.trim();
      if (
        slug &&
        slug !== "null" &&
        slug !== "undefined"
      ) {
        categorySlugs.push(slug);
      }
    }
  });

  console.log("Category filters:", { categorySlugs, categoryIds });

  if (categorySlugs.length === 1) {
    params.append("filters[category][slug][$eq]", categorySlugs[0]);
  } else if (categorySlugs.length > 1) {
    categorySlugs.forEach((slug, index) => {
      params.append(`filters[category][slug][$in][${index}]`, slug);
    });
  }

  if (categoryIds.length === 1) {
    params.append("filters[category][id][$eq]", categoryIds[0]);
  } else if (categoryIds.length > 1) {
    categoryIds.forEach((id, index) => {
      params.append(`filters[category][id][$in][${index}]`, id);
    });
  }

  // Search filter - simplified
  if (search) {
    params.append("filters[$or][0][name][$containsi]", search);
    params.append("filters[$or][1][description][$containsi]", search);
    params.append("filters[$or][2][shortDescription][$containsi]", search);
    params.append("filters[$or][3][sku][$containsi]", search);
    params.append("filters[$or][4][category][name][$containsi]", search);
    params.append("filters[$or][5][attributes][name][$containsi]", search);
    params.append("filters[$or][6][attributes][value][$containsi]", search);
  }

  // Attributes filter - single selection for sizes and types
  if (sizes.length > 0) {
    params.append("filters[attributes][name][$eq]", "size");
    params.append("filters[attributes][value][$eq]", sizes[0]);
  }
  if (types.length > 0) {
    params.append("filters[attributes][name][$eq]", "type");
    params.append("filters[attributes][value][$eq]", types[0]);
  }

  if (sort === "price_asc") params.append("sort", "price:asc");
  if (sort === "price_desc") params.append("sort", "price:desc");
  if (sort === "newest") params.append("sort", "createdAt:desc");
  if (sort === "name_asc") params.append("sort", "name:asc");
  if (sort === "name_desc") params.append("sort", "name:desc");

  params.append("pagination[page]", page);
  params.append("pagination[pageSize]", pageSize);
  params.append("populate", "*");

  const queryString = params.toString();
  console.log("Built query string:", queryString);

  return queryString;
}

// Products
export async function getProducts(searchParams?: Record<string, string | string[] | undefined>): Promise<PaginatedProducts> {
  let queryString: string;

  if (searchParams && Object.keys(searchParams).length > 0) {
    // If we have search params, use buildStrapiQuery (which already includes populate)
    queryString = buildStrapiQuery(searchParams);
  } else {
    // If no search params, use default query
    queryString = "populate=*&pagination[page]=1&pagination[pageSize]=12";
  }

  console.log("API Request URL:", `${SERVER_API_URL}/api/products?${queryString}`);

  const res = await fetch(
    `${SERVER_API_URL}/api/products?${queryString}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error');
    console.error(`API Error ${res.status}:`, errorText);
    // Temporary fallback: return empty products instead of throwing
    console.warn('Returning empty products due to API error');
    return {
      products: [],
      pagination: {
        page: 1,
        pageSize: 12,
        pageCount: 1,
        total: 0,
      },
    };
  }

  const data = await res.json();

  const products = (data?.data ?? []).map(
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
      brand: item.brand
        ? {
            id: item.brand.id,
            title: item.brand.title,
            slug: item.brand.slug,
          }
        : undefined,
      inverter: item.inverter,
      wifi: item.wifi,
      btu: item.btu,
      roomArea: item.roomArea,
      energyClass: item.energyClass,
      installationType: item.installationType,
      variants: mapVariants(item.product_variants),
      reviews: mapReviews(item.reviews),
    })
  );

  const pagination = data?.meta?.pagination ?? {
    page: 1,
    pageSize: 12,
    pageCount: 1,
    total: products.length,
  };

  return {
    products,
    pagination,
  };
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
    brand: item.brand
      ? {
          id: item.brand.id,
          title: item.brand.title,
          slug: item.brand.slug,
        }
      : undefined,
    inverter: item.inverter,
    wifi: item.wifi,
    btu: item.btu,
    roomArea: item.roomArea,
    energyClass: item.energyClass,
    installationType: item.installationType,
    variants: mapVariants(item.product_variants),
    reviews: mapReviews(item.reviews),
  };
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  try {
    // Получаем больше продуктов для выбора похожих
    const { products } = await getProducts({ "pagination[pageSize]": "20" });
    const related = products.filter((item) => item.id !== product.id);

    // Сначала продукты из той же категории
    const sameCategory = product.category
      ? related.filter((item) => item.category?.id === product.category?.id)
      : [];

    // Затем остальные продукты
    const otherProducts = related.filter((item) => !sameCategory.includes(item));

    // Объединяем и ограничиваем до 8 продуктов
    return [...sameCategory, ...otherProducts].slice(0, 8);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
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

export async function getProductAttributes(): Promise<{
  sizes: Array<{ id: string; name: string }>;
  types: Array<{ id: string; name: string }>;
}> {
  // For demonstration, return some sample data
  // In a real application, you would fetch this from Strapi
  const sizes = [
    { id: 'size_s', name: 'S' },
    { id: 'size_m', name: 'M' },
    { id: 'size_l', name: 'L' },
    { id: 'size_xl', name: 'XL' }
  ];

  const types = [
    { id: 'type_casual', name: 'Casual' },
    { id: 'type_formal', name: 'Formal' },
    { id: 'type_sport', name: 'Sport' }
  ];

  return { sizes, types };
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
