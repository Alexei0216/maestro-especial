import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/layouts/Container";
import ProductMedia from "@/components/ui/ProductMedia";
import ProductCard from "@/components/ui/ProductCard";
import QuantityControl from "@/components/ui/QuantityControl";
import { getProduct, getRelatedProducts } from "@/lib/api";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Producto no encontrado | Maestro Especial",
    };
  }

  return {
    title: `${product.name} | Maestro Especial`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image ? [product.image] : [],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const galleryImages = [product.image, ...(product.gallery ?? [])].filter(
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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
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

  return (
    <main className="bg-[#f8f6ef] text-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <Container className="py-10 lg:py-14">
        <section className="grid gap-2 lg:grid-cols-[128px_minmax(420px,680px)_minmax(260px,360px)] lg:items-start">
          <div className="order-3 ml-auto space-y-6 lg:order-3 lg:sticky lg:top-8">
            <div className="space-y-3">
              {product.category && (
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-yellow-700">
                  {product.category}
                </p>
              )}

              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                {product.name}
              </h1>

              <p className="text-base leading-7 text-neutral-700">
                {product.description}
              </p>
            </div>

            <div className="space-y-4 border-y border-neutral-300 py-5">
              <p className="text-3xl font-bold">{formattedPrice}</p>
              <p className="text-sm text-neutral-600">
                Disponible para pedido. Precio final confirmado antes del envio.
              </p>
            </div>

            <QuantityControl productName={product.name} />

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-neutral-500">Categoria</dt>
                <dd className="font-semibold">
                  {product.category ?? "Producto especial"}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">Referencia</dt>
                <dd className="font-semibold">ME-{product.id}</dd>
              </div>
            </dl>
          </div>

          <ProductMedia images={galleryImages} name={product.name} />
        </section>

        <section className="mt-14 border-t border-neutral-300 pt-10">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold">Descripcion del producto</h2>
            <p className="mt-5 text-lg leading-8 text-neutral-700">
              {product.description}
            </p>
          </div>
        </section>
      </Container>

      {relatedProducts.length > 0 && (
        <section
          className="overflow-hidden bg-white py-12"
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
                <ProductCard {...item} />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
