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
    }),
  );
}
