import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/layouts/Container";
import ProductMedia from "@/components/ui/ProductMedia";
import ProductCard from "@/components/ui/ProductCard";
import QuantityControl from "@/components/ui/QuantityControl";
import { getProduct, getRelatedProducts } from "@/lib/api";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const getPlainText = (value: unknown): string => {
  if (!value) return "";
  if (typeof value === "string") return value;

  const extractText = (item: unknown): string => {
    if (!item) return "";
    if (typeof item === "string") return item;
    if (Array.isArray(item)) {
      return item.map(extractText).join(" ");
    }
    if (typeof item === "object") {
      const obj = item as Record<string, unknown>;
      if (Array.isArray(obj.children)) {
        return obj.children.map(extractText).join("");
      }
      if (typeof obj.text === "string") {
        return obj.text;
      }
    }
    return "";
  };

  return extractText(value).trim();
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Producto no encontrado | Maestro Especial",
    };
  }

  const metadataDescription = getPlainText(product.description);

  return {
    title: `${product.name} | Maestro Especial`,
    description: metadataDescription,
    openGraph: {
      title: product.name,
      description: metadataDescription,
      images: product.thumbnail ? [product.thumbnail] : [],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const galleryImages = [product.thumbnail, ...product.images].filter(
    (image): image is string => Boolean(image),
  );
  const relatedProducts = await getRelatedProducts(product);
  const formattedPrice =
    product.price === undefined
      ? "Consultar"
      : new Intl.NumberFormat("es-ES", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        }).format(product.price);

  const productDescription = getPlainText(product.description);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: productDescription,
    category: product.category,
    image: galleryImages,
    offers:
      product.price === undefined
        ? undefined
        : {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
          },
  };
  const categoryFilterHref = product.category
    ? typeof product.category.slug === "string" &&
      product.category.slug.trim() !== "" &&
      product.category.slug !== "null" &&
      product.category.slug !== "undefined"
      ? `/catalog?categories=slug:${encodeURIComponent(product.category.slug)}`
      : `/catalog?categories=id:${product.category.id}`
    : undefined;

  return (
    <main className="bg-[#f8f6ef] text-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <Container>
        <Breadcrumbs/>
        <section className="animate-fade-up relative grid gap-8 lg:grid-cols-[128px_minmax(420px,680px)_minmax(320px,1fr)] lg:items-start lg:gap-2">
          <div className="order-3 flex items-start lg:order-3 lg:self-stretch lg:pl-14 xl:pl-20">
            <aside className="w-full max-w-[380px] lg:sticky lg:top-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  {product.category && (
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-yellow-700">
                      {product.category.name}
                    </p>
                  )}

                  <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                    {product.name}
                  </h1>

                  <p className="text-base leading-7 text-neutral-700">
                    {productDescription}
                  </p>
                </div>

                <div className="space-y-4 border-y border-neutral-300 py-5">
                  <p className="text-3xl font-bold">{formattedPrice}</p>
                  <p className="text-sm text-neutral-600">
                    Disponible para pedido. Precio final confirmado antes del
                    envio.
                  </p>
                </div>

                <QuantityControl
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.thumbnail,
                  }}
                />

                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-neutral-500">Categoria</dt>
                    <dd className="font-semibold">
                      {product.category && categoryFilterHref ? (
                        <Link
                          href={categoryFilterHref}
                          className="inline-flex rounded-sm text-yellow-700 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                          {product.category.name}
                        </Link>
                      ) : (
                        "Producto especial"
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500">Referencia</dt>
                    <dd className="font-semibold">
                      {product.sku?.trim() || `ME-${product.id}`}
                    </dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>

          <ProductMedia images={galleryImages} name={product.name} />
        </section>

        <section className="animate-fade-up mt-14 border-t border-neutral-300 pt-10">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold">Descripcion del producto</h2>
            <p className="mt-5 text-lg leading-8 text-neutral-700">
              {productDescription}
            </p>
          </div>
        </section>
      </Container>

      {relatedProducts.length > 0 && (
        <section
          className="animate-fade-up mx-auto overflow-hidden py-12"
          aria-labelledby="related-products-title"
        >
          <Container>
            <h2 id="related-products-title" className="text-3xl font-bold">
              Productos relacionados
            </h2>
          </Container>

          <div className="scrollbar-none mt-7 flex w-full gap-6 overflow-x-auto px-5 pb-2 sm:px-8 lg:px-15">
            {relatedProducts.map((item) => (
              <div key={item.id} className="w-[280px] shrink-0">
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
