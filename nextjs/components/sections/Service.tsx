import ProductCard from "../ui/ProductCard";
import { getProducts } from "../../lib/api";
import Container from "../layouts/Container";

export default async function Service() {
  const products = await getProducts();

  return (
    <Container>
      <section
        className="py-12 max-w-[1400px]"
        aria-labelledby="popular-products-title"
      >
        <h2
          id="popular-products-title"
          className="text-3xl font-bold mb-8 text-center"
        >
          Los productos más populares
        </h2>

        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(200px,260px))]">
            {products.map((product) => (
              <div key={product.id}>
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}
