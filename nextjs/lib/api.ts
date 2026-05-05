import { StrapiProduct } from "../types/strapi";
import { Product } from "../types/product";

const API_URL = "http://localhost:1337";

export async function getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/api/products?populate=*`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
    }

    const data = await res.json();

    return (data?.data ?? []).map((item: StrapiProduct): Product => ({
        id: item.id,
        name: item.attributes.name,
        description: item.attributes.description,
        price: item.attributes.price,
        image: item.attributes.image?.data?.attributes?.url
            ? `${API_URL}${item.attributes.image.data.attributes.url}`
            : undefined,
    }));
}