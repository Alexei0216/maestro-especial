import Link from "next/link";
import Container from "../layouts/Container";
import { ChevronRightIcon } from "../icons";
import { services, categories, steps } from "@/lib/services";
import ServiceCard from "@/components/ui/ServiceCard";

export default function HomeStorefront() {
  return (
    <Container>
      <section className="animate-fade-up py-12">
        <div className="grid gap-4 rounded-lg bg-white p-5 shadow-sm lg:grid-cols-4 lg:p-6">
          <div className="border-b border-neutral-200 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-yellow-700">
              Tienda tecnica
            </p>
            <h2 className="mt-2 text-3xl font-bold">Compra con asesoramiento</h2>
          </div>
          <div>
            <p className="text-2xl font-bold">A++</p>
            <p className="mt-1 text-sm text-neutral-600">Equipos eficientes</p>
          </div>
          <div>
            <p className="text-2xl font-bold">24/48h</p>
            <p className="mt-1 text-sm text-neutral-600">Respuesta comercial</p>
          </div>
          <div>
            <p className="text-2xl font-bold">360</p>
            <p className="mt-1 text-sm text-neutral-600">
              Venta, instalacion y servicio
            </p>
          </div>
        </div>
      </section>

      <section className="animate-fade-up py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-yellow-700">
              Categorias
            </p>
            <h2 className="mt-2 text-3xl font-bold">Encuentra el equipo adecuado</h2>
          </div>
          <Link
            href="/contact"
            className="motion-soft w-fit rounded-lg border border-neutral-300 bg-white px-5 py-3 font-semibold hover:-translate-y-0.5 hover:shadow-md"
          >
            Te asesoramos
          </Link>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.title}
              className="motion-soft rounded-lg bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 h-12 w-12 rounded-lg bg-yellow-500/20" />
              <h3 className="text-2xl font-bold">{category.title}</h3>
              <p className="mt-3 leading-7 text-neutral-600">
                {category.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="animate-fade-up py-8">
        <div className="grid gap-8 rounded-lg bg-[#302400] p-5 text-white lg:grid-cols-[0.9fr_1.1fr] lg:p-6">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-yellow-400">
              Servicios
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              No solo vendemos equipos, resolvemos climatizacion
            </h2>
            <p className="mt-4 leading-7 text-white/85">
              Un aire acondicionado mal dimensionado consume mas, enfria peor y
              dura menos. Por eso unimos producto, instalacion y mantenimiento.
            </p>
            <Link href={"/services"} className="mt-auto cursor-pointer max-w-[150px] motion-soft rounded-lg bg-yellow-500 px-6 py-3 font-bold text-black hover:-translate-y-0.5 hover:bg-yellow-600 hover:shadow-lg">
              Mostrar mas
            </Link>
          </div>

          <div className="grid gap-4">
            {services.map((service) => (
              <ServiceCard
                key={service.slug}
                title={service.title}
                description={service.description}
                href={`/services/${service.slug}`}
                inverted
              />
            ))}
          </div>
        </div>
      </section>

      <section className="animate-fade-up py-10">
        <div className="grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step}
              className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-semibold text-yellow-700">
                Paso {index + 1}
              </p>
              <h3 className="mt-3 text-2xl font-bold">{step}</h3>
              <p className="mt-3 leading-7 text-neutral-600">
                Te acompanamos para elegir sin dudas y evitar compras
                improvisadas.
              </p>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
