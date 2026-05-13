import type { Metadata } from "next";
import { getProducts, getCategories } from "../../lib/api";
import ProductCard from "../../components/ui/ProductCard";
import Container from "../../components/layouts/Container";
import Section from "../../components/layouts/Section";
import FilterPanel from "../../components/filters/FilterPanel";

export const metadata: Metadata = {
  title: "Каталог товаров | Maestro Especial",
  description: "Каталог товаров Maestro Especial",
};

interface CatalogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  
  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  return (
    <Container>
      <Section>
        <h1 className="text-3xl font-bold mb-8">Каталог товаров</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Panel */}
          <FilterPanel categories={categories} />

          {/* Products Section */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Товары не найдены</p>
                <p className="text-gray-400 text-sm mt-2">Попробуйте изменить параметры фильтра</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 text-sm mb-4">
                  Найдено товаров: <span className="font-semibold">{products.length}</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Section>
    </Container>
  );
}
