import Link from "next/link";
import Container from "@/components/layouts/Container";
import { services } from "@/lib/services";
import { ChevronRightIcon } from "@/components/icons";

export const metadata = {
  title: "Servicios | Maestro Especial",
  description: "Conoce todos nuestros servicios de climatización",
};

export default function ServicesPage() {
  return (
    <Container>
      <section className="py-12">
        {/* Breadcrumbs */}
        <div className="mb-8 flex items-center gap-2 text-sm">
          <Link href="/" className="text-neutral-600 hover:text-neutral-900">
            Inicio
          </Link>
          <ChevronRightIcon className="h-4 w-4" />
          <span className="font-semibold text-neutral-900">Servicios</span>
        </div>

        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-yellow-700">
            Servicios
          </p>
          <h1 className="mt-2 text-4xl font-bold">
            No solo vendemos equipos, resolvemos climatización
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-neutral-600">
            Un aire acondicionado mal dimensionado consume mas, enfria peor y
            dura menos. Por eso unimos producto, instalacion y mantenimiento.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`}>
              <article className="motion-soft h-full rounded-lg border border-neutral-200 bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold">{service.title}</h3>
                <p className="mt-3 leading-7 text-neutral-600">
                  {service.description}
                </p>
                <div className="mt-6 flex items-center text-yellow-700 font-semibold">
                  Ver más
                  <ChevronRightIcon />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </Container>
  );
}
