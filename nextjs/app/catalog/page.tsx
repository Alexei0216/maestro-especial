import type { Metadata } from "next";
import { getProducts, getCategories } from "../../lib/api";
import ProductCard from "../../components/ui/ProductCard";
import Container from "../../components/layouts/Container";
import Section from "../../components/layouts/Section";

export const metadata: Metadata = {
  title: "Каталог товаров | Maestro Especial",
  description: "Каталог товаров Maestro Especial",
};

export default async function CatalogPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <Container>
      <Section>
        <h1 className="text-3xl font-bold mb-8">Каталог товаров</h1>

        {/* Categories filter */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Категории</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>
    </Container>
  );
}
