import { buildProductsQuery, ProductSearchParams } from "./buildProductsQuery";
import { PaginatedProducts, Product } from "../types/product";
import { StrapiProduct } from "../types/strapi";

const SERVER_API_URL =
  process.env.STRAPI_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:1337";

const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337";

const getMediaUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${PUBLIC_API_URL}${url}`;
};

const mapProduct = (item: StrapiProduct): Product => ({
  id: item.id,
  documentId: item.documentId,
  name: item.name,
  price: item.price,
  oldPrice: item.oldPrice,
  thumbnail: getMediaUrl(item.thumbnail?.url) ?? "",
  images: (item.images ?? [])
    .map((media) => getMediaUrl(media.url))
    .filter((url): url is string => Boolean(url)),
  stock: item.stock,
  sku: item.sku,
  slug: item.slug,
  shortDescription: item.shortDescription,
  description: item.description,
  attributes: item.attributes,
  category: item.category
    ? {
        id: item.category.id,
        name: item.category.name,
        slug: item.category.slug,
      }
    : undefined,
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
});

export async function getProducts(
  searchParams: ProductSearchParams = {},
): Promise<PaginatedProducts> {
  const queryString = buildProductsQuery(searchParams, {
    populate: "*",
  });

  const response = await fetch(`${SERVER_API_URL}/api/products?${queryString}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    console.warn(`Failed to fetch products: ${response.status}`, queryString);
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

  const data = await response.json();
  const products = (data?.data ?? []).map(mapProduct);

  return {
    products,
    pagination: data?.meta?.pagination ?? {
      page: 1,
      pageSize: 12,
      pageCount: 1,
      total: products.length,
    },
  };
}

export async function getBrands(): Promise<Array<{ id: number; title: string; slug: string }>> {
  try {
    const response = await fetch(
      `${SERVER_API_URL}/api/brands?sort=title:asc&pagination[pageSize]=100`,
      { cache: "no-store" },
    );

    if (response.ok) {
      const data = await response.json();
      return (data?.data ?? []).map((brand: { id: number; title: string; slug: string }) => ({
        id: brand.id,
        title: brand.title,
        slug: brand.slug,
      }));
    }

    if (response.status !== 403) {
      throw new Error(`Failed to fetch brands: ${response.status}`);
    }
  } catch (error) {
    console.warn("Brand endpoint unavailable, using fallback brand list.", error);
  }

  const brandMap = new Map<string, { id: number; title: string; slug: string }>();
  const fallbackProducts = await getProducts({ pageSize: "100" });

  for (const product of fallbackProducts.products) {
    const brand = product.brand;
    if (!brand?.slug || !brand?.title || typeof brand?.id !== "number") continue;
    brandMap.set(brand.slug, {
      id: brand.id,
      title: brand.title,
      slug: brand.slug,
    });
  }

  return Array.from(brandMap.values()).sort((a, b) => a.title.localeCompare(b.title));
}

export async function getProductFilterOptions(): Promise<{
  btuOptions: number[];
  roomAreaOptions: number[];
  energyClassOptions: string[];
  installationTypeOptions: string[];
}> {
  const { products } = await getProducts({ pageSize: "200" });

  const btuSet = new Set<number>();
  const roomAreaSet = new Set<number>();
  const energySet = new Set<string>();
  const installationSet = new Set<string>();

  for (const product of products) {
    if (typeof product.btu === "number" && Number.isFinite(product.btu)) {
      btuSet.add(product.btu);
    }
    if (
      typeof product.roomArea === "number" &&
      Number.isFinite(product.roomArea)
    ) {
      roomAreaSet.add(product.roomArea);
    }
    if (typeof product.energyClass === "string" && product.energyClass.trim()) {
      energySet.add(product.energyClass.trim());
    }
    if (
      typeof product.installationType === "string" &&
      product.installationType.trim()
    ) {
      installationSet.add(product.installationType.trim());
    }
  }

  return {
    btuOptions: Array.from(btuSet).sort((a, b) => a - b),
    roomAreaOptions: Array.from(roomAreaSet).sort((a, b) => a - b),
    energyClassOptions: Array.from(energySet).sort((a, b) =>
      a.localeCompare(b),
    ),
    installationTypeOptions: Array.from(installationSet).sort((a, b) =>
      a.localeCompare(b),
    ),
  };
}

