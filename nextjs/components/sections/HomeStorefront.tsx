import Link from "next/link";
import Container from "../layouts/Container";
import { ChevronRightIcon } from "../icons"

const categories = [
  {
    title: "Split mural",
    description: "Soluciones silenciosas para dormitorios, salones y oficinas.",
  },
  {
    title: "Conductos",
    description: "Climatizacion integrada para viviendas completas y reformas.",
  },
  {
    title: "Locales comerciales",
    description: "Equipos robustos para tiendas, restaurantes y espacios de trabajo.",
  },
];

const services = [
  {
    title: "Instalacion certificada",
    description:
      "Visita tecnica, calculo de potencia, montaje limpio y puesta en marcha.",
  },
  {
    title: "Mantenimiento",
    description:
      "Limpieza, revision de gas, filtros y control de rendimiento estacional.",
  },
  {
    title: "Reparacion y diagnostico",
    description:
      "Localizamos averias, fugas y problemas de rendimiento con criterio tecnico.",
  },
];

const steps = [
  "Cuentanos el espacio",
  "Elegimos el equipo adecuado",
  "Instalamos y verificamos",
];

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

      <section className="animate-fade-up py-10">
        <div className="grid gap-8 rounded-lg bg-[#302400] p-6 text-white lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-yellow-400">
              Servicios
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              No solo vendemos equipos, resolvemos climatizacion
            </h2>
            <p className="mt-4 leading-7 text-white/70">
              Un aire acondicionado mal dimensionado consume mas, enfria peor y
              dura menos. Por eso unimos producto, instalacion y mantenimiento.
            </p>
          </div>

          <div className="grid gap-4">
            {services.map((service) => (
              <Link key={service.title} href={"/"}>
                <article
                  className="motion-soft rounded-lg border border-white/10 bg-white/10 p-5 hover:-translate-y-0.5 hover:bg-white/15 flex items-center justify-between"
                >
                  <div className="">
                    <h3 className="text-xl font-bold">{service.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/70">
                      {service.description}
                    </p>
                  </div>
                  <div className="">
                    <ChevronRightIcon />
                  </div>
                </article>
              </Link>
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
