import Link from "next/link";
import Container from "@/components/layouts/Container";
import { services, Service } from "@/lib/services";
import { ChevronRightIcon } from "@/components/icons";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return {
      title: "Servicio no encontrado",
    };
  }

  return {
    title: `${service.title} | Maestro Especial`,
    description: service.description,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug) as Service | undefined;

  if (!service) {
    notFound();
  }

  const otherServices = services.filter((s) => s.slug !== slug);

  return (
    <Container>
      <section className="py-12">
        {/* Breadcrumbs */}
        <div className="mb-8 flex items-center gap-2 text-sm">
          <Link href="/" className="text-neutral-600 hover:text-neutral-900">
            Inicio
          </Link>
          <ChevronRightIcon className="h-4 w-4" />
          <Link href="/services" className="text-neutral-600 hover:text-neutral-900">
            Servicios
          </Link>
          <ChevronRightIcon className="h-4 w-4" />
          <span className="font-semibold text-neutral-900">{service.title}</span>
        </div>

        {/* Hero Section */}
        <div className="mb-12 rounded-lg bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 p-8 lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-yellow-700">
            Servicio
          </p>
          <h1 className="mt-4 text-4xl font-bold lg:text-5xl">{service.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-700">
            {service.description}
          </p>
        </div>

        {/* Content Section */}
        <div className="mb-12 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold">Detalles del servicio</h2>
              <p className="mt-4 leading-7 text-neutral-600">
                Contamos con un equipo altamente capacitado y certificado para
                brindarte los mejores servicios en climatización. Nos
                comprometemos a garantizar la calidad y profesionalismo en cada
                proyecto.
              </p>

              <div className="mt-8 space-y-4">
                {service.highlights.map((highlight) => (
                  <div key={highlight} className="flex gap-4">
                    <div className="mt-1 h-6 w-6 flex-shrink-0 rounded-full bg-yellow-500/20" />
                    <p className="text-sm leading-7 text-neutral-600">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <Link
              href="/contact"
              className="motion-soft flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-6 py-4 font-bold text-black hover:-translate-y-0.5 hover:bg-yellow-600 hover:shadow-lg"
            >
              Solicitar servicio
            </Link>

            <div className="mt-8 rounded-lg bg-neutral-50 p-6">
              <h3 className="font-semibold">¿Necesitas información?</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Nuestro equipo está disponible para resolver todas tus dudas.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-block text-sm font-semibold text-yellow-700 hover:text-yellow-800"
              >
                Contáctanos →
              </Link>
            </div>
          </div>
        </div>

        {/* Related Services */}
        {otherServices.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold">Otros servicios</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {otherServices.map((otherService) => (
                <Link
                  key={otherService.slug}
                  href={`/services/${otherService.slug}`}
                >
                  <article className="motion-soft rounded-lg border border-neutral-200 bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg">
                    <h3 className="text-xl font-bold">{otherService.title}</h3>
                    <p className="mt-3 leading-6 text-neutral-600">
                      {otherService.description}
                    </p>
                    <div className="mt-4 flex items-center text-yellow-700 font-semibold text-sm">
                      Ver servicio
                      <ChevronRightIcon className="ml-1 h-4 w-4" />
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </Container>
  );
}
