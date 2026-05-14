import type { Metadata } from "next";
import {
  getProducts,
  getCategories,
  getProductAttributes,
} from "../../lib/api";
import ProductCard from "../../components/ui/ProductCard";
import Container from "../../components/layouts/Container";
import Section from "../../components/layouts/Section";
import FilterPanel from "../../components/filters/FilterPanel";
import Pagination from "../../components/ui/Pagination";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import PageSizeSelector from "../../components/ui/PageSizeSelector";

export const metadata: Metadata = {
  title: "Catálogo de Productos | Maestro Especial",
  description: "Catálogo de productos Maestro Especial",
};

interface CatalogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;

  const [result, categories, attributes] = await Promise.all([
    getProducts(params),
    getCategories(),
    getProductAttributes(),
  ]);

  const { products, pagination } = result;

  return (
    <Container>
      <Section className="animate-fade-up pb-14 max-w-[1400px]">
        <Breadcrumbs />
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Panel */}
          <FilterPanel categories={categories} attributes={attributes} />

          {/* Products Section */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-gray-600 text-sm">
                Mostrando {products.length} de {pagination.total} productos
              </p>

              {/* Page Size Selector */}
              <div className="flex items-center gap-4">
                <PageSizeSelector currentSize={pagination.pageSize} />
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No se encontraron productos
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Intente cambiar los parámetros del filtro
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  pagination={pagination}
                  searchParams={Object.fromEntries(
                    Object.entries(params).map(([key, value]) => [
                      key,
                      Array.isArray(value)
                        ? value.join(",")
                        : (value || "").toString(),
                    ]),
                  )}
                />
              </>
            )}
          </div>
        </div>
      </Section>
    </Container>
  );
}
