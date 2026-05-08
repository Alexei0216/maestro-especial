import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layouts/Container";
import ProductCard from "@/components/ui/ProductCard";
import { getProducts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Catalogo",
  description:
    "Catalogo de equipos de aire acondicionado, climatizacion, instalacion y mantenimiento de Maestro Especial.",
};

const catalogCategories = [
  "Todos",
  "Split mural",
  "Conductos",
  "Locales comerciales",
  "Mantenimiento",
];

const serviceFilters = [
  "Instalacion incluida",
  "Alta eficiencia",
  "Asesoramiento tecnico",
  "Servicio postventa",
];

export default async function CatalogPage() {
  const products = await getProducts();

  return (
    <main className="bg-[#f8f6ef] text-neutral-950">
      <Container className="py-10 lg:py-14">
        <section className="animate-fade-up rounded-lg bg-[#302400] p-6 text-white lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-yellow-400">
                Catalogo
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
                Equipos de aire acondicionado y soluciones de climatizacion
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
                Compara equipos, revisa categorias y pide ayuda tecnica para
                elegir la potencia y el servicio adecuados.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/10 p-5">
              <h2 className="text-xl font-bold">Compra asistida</h2>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Si no sabes que equipo necesitas, te orientamos antes de hacer
                el pedido.
              </p>
              <Link
                href="/contact"
                className="motion-soft mt-5 inline-flex rounded-lg bg-yellow-500 px-5 py-3 font-bold text-black hover:-translate-y-0.5 hover:bg-yellow-600 hover:shadow-lg"
              >
                Pedir asesoramiento
              </Link>
            </div>
          </div>
        </section>

        <section className="animate-fade-up mt-8 grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
          <aside className="rounded-lg bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl font-bold">Filtros</h2>

            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-500">
                Categorias
              </p>
              <div className="mt-3 flex flex-wrap gap-2 lg:flex-col">
                {catalogCategories.map((category, index) => (
                  <button
                    key={category}
                    type="button"
                    className={`motion-soft rounded-lg border px-4 py-3 text-left text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md ${
                      index === 0
                        ? "border-yellow-500 bg-yellow-500 text-black"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-yellow-500"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-500">
                Servicios
              </p>
              <div className="mt-3 space-y-3">
                {serviceFilters.map((service) => (
                  <label
                    key={service}
                    className="flex items-center gap-3 text-sm text-neutral-700"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-yellow-500"
                    />
                    {service}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-6 flex flex-col gap-3 rounded-lg bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-neutral-500">Productos encontrados</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <select className="motion-soft h-11 rounded-lg border border-neutral-300 bg-white px-4 text-sm font-semibold outline-none focus:border-yellow-600">
                <option>Orden recomendado</option>
                <option>Precio menor a mayor</option>
                <option>Precio mayor a menor</option>
              </select>
            </div>

            {products.length === 0 ? (
              <div className="rounded-lg bg-white p-10 text-center shadow-sm">
                <h2 className="text-2xl font-bold">No hay productos disponibles</h2>
                <p className="mt-3 text-neutral-600">
                  Contactanos y te ayudaremos a elegir una solucion de
                  climatizacion.
                </p>
                <Link
                  href="/contact"
                  className="motion-soft mt-6 inline-flex rounded-lg bg-yellow-500 px-5 py-3 font-bold text-black hover:-translate-y-0.5 hover:bg-yellow-600"
                >
                  Contactar
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </Container>
    </main>
  );
}
