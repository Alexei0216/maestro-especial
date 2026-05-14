import type { Metadata } from "next";
import Container from "@/components/layouts/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta con Maestro Especial para informacion sobre productos, pedidos, entregas y atencion personalizada.",
};

const contactCards = [
  {
    title: "Atencion al cliente",
    value: "+34 900 000 000",
    description: "Lunes a viernes, 9:00-18:00",
    href: "tel:+34900000000",
  },
  {
    title: "Email",
    value: "info@maestroespecial.com",
    description: "Respondemos lo antes posible",
    href: "mailto:info@maestroespecial.com",
  },
  {
    title: "Zona de servicio",
    value: "Madrid, Espana",
    description: "Entregas coordinadas segun pedido",
  },
];

export default function ContactPage() {
  return (
    <main className="bg-[#f8f6ef] text-neutral-950">
      <Container className="pb-10 lg:pb-14">
        <Breadcrumbs />
        <section className="animate-fade-up grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-yellow-700">
              Contacto
            </p>
            <h1 className="mt-3 max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
              Hablemos de tu pedido
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-700">
              Si tienes dudas sobre un producto, disponibilidad, entrega o
              preparacion del pedido, escribenos y te ayudaremos antes de
              finalizar la compra.
            </p>

            <div className="mt-8 grid gap-4">
              {contactCards.map((card) => (
                <div
                  key={card.title}
                  className="motion-soft rounded-lg border border-neutral-200 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                >
                  <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-500">
                    {card.title}
                  </h2>
                  {card.href ? (
                    <a
                      href={card.href}
                      className="motion-soft mt-2 block text-xl font-bold hover:text-yellow-700"
                    >
                      {card.value}
                    </a>
                  ) : (
                    <p className="mt-2 text-xl font-bold">{card.value}</p>
                  )}
                  <p className="mt-1 text-sm text-neutral-600">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <section className="rounded-lg bg-white p-6 shadow-sm lg:p-8">
            <h2 className="text-3xl font-bold">Enviar mensaje</h2>
            <p className="mt-3 text-neutral-600">
              Cuentanos que necesitas y prepararemos una respuesta clara.
            </p>

            <form className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-neutral-700">
                Nombre
                <input
                  required
                  name="name"
                  className="motion-soft h-12 w-full rounded-lg border border-neutral-300 px-4 font-normal outline-none focus:border-yellow-600 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.18)]"
                  autoComplete="name"
                />
              </label>

              <label className="space-y-2 text-sm font-semibold text-neutral-700">
                Telefono
                <input
                  name="phone"
                  className="motion-soft h-12 w-full rounded-lg border border-neutral-300 px-4 font-normal outline-none focus:border-yellow-600 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.18)]"
                  autoComplete="tel"
                />
              </label>

              <label className="space-y-2 text-sm font-semibold text-neutral-700 sm:col-span-2">
                Email
                <input
                  required
                  name="email"
                  type="email"
                  className="motion-soft h-12 w-full rounded-lg border border-neutral-300 px-4 font-normal outline-none focus:border-yellow-600 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.18)]"
                  autoComplete="email"
                />
              </label>

              <label className="space-y-2 text-sm font-semibold text-neutral-700 sm:col-span-2">
                Motivo
                <select
                  name="topic"
                  className="motion-soft h-12 w-full rounded-lg border border-neutral-300 bg-white px-4 font-normal outline-none focus:border-yellow-600 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.18)]"
                >
                  <option>Consulta sobre producto</option>
                  <option>Estado de pedido</option>
                  <option>Entrega</option>
                  <option>Pedido personalizado</option>
                </select>
              </label>

              <label className="space-y-2 text-sm font-semibold text-neutral-700 sm:col-span-2">
                Mensaje
                <textarea
                  required
                  name="message"
                  className="motion-soft min-h-36 w-full rounded-lg border border-neutral-300 px-4 py-3 font-normal outline-none focus:border-yellow-600 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.18)]"
                  placeholder="Producto, cantidad aproximada, direccion de entrega..."
                />
              </label>

              <button
                type="submit"
                className="motion-soft h-12 rounded-lg bg-yellow-500 px-6 font-bold text-black hover:-translate-y-0.5 hover:bg-yellow-600 hover:shadow-lg sm:col-span-2 sm:w-fit"
              >
                Enviar consulta
              </button>
            </form>
          </section>
        </section>

        <section className="animate-fade-up mt-12 grid gap-4 rounded-lg bg-[#302400] p-6 text-white lg:grid-cols-3 lg:p-8">
          <div>
            <h2 className="text-xl font-bold">Compra asistida</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Revisamos cada pedido antes de confirmar disponibilidad y entrega.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold">Respuesta clara</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Te indicamos precio final, tiempos y condiciones antes del pago.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold">Atencion cercana</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Un canal directo para resolver dudas sobre productos y pedidos.
            </p>
          </div>
        </section>
      </Container>
    </main>
  );
}
