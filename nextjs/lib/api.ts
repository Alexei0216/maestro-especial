import { StrapiProduct } from "../types/strapi";
import { Product } from "../types/product";

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

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${SERVER_API_URL}/api/products?populate=*`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  const data = await res.json();

  return (data?.data ?? []).map(
    (item: StrapiProduct): Product => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: getMediaUrl(item.image?.url),
      gallery: (item.gallery ?? [])
        .map((media) => getMediaUrl(media.url))
        .filter((url): url is string => Boolean(url)),
      category: item.category,
    }),
  );
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const products = await getProducts();

  return products.find((product) => String(product.id) === id);
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  const products = await getProducts();
  const related = products.filter((item) => item.id !== product.id);
  const sameCategory = product.category
    ? related.filter((item) => item.category === product.category)
    : [];

  return [
    ...sameCategory,
    ...related.filter((item) => !sameCategory.includes(item)),
  ].slice(0, 8);
}
