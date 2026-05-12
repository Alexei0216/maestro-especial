import ProductCard from "../ui/ProductCard";
import { getProducts } from "../../lib/api";
import Container from "../layouts/Container";

export default async function Service() {
  const products = await getProducts();

  return (
    <Container>
      <section
        id="products"
        className="animate-fade-up py-12 max-w-[1400px]"
        aria-labelledby="popular-products-title"
      >
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-yellow-700">
              Catalogo
            </p>
            <h2 id="popular-products-title" className="text-3xl font-bold">
              Equipos destacados
            </h2>
          </div>
        </div>

        {products.length === 0 ? (
          <p>No hay productos disponibles</p>
        ) : (
          <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(200px,260px))]">
            {products.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}
