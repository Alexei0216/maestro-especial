import Link from "next/link";
import Container from "@/components/layouts/Container";
import { services } from "@/lib/services";
import { ChevronRightIcon } from "@/components/icons";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ServiceCard from "@/components/ui/ServiceCard";

export const metadata = {
  title: "Servicios | Maestro Especial",
  description: "Conoce todos nuestros servicios de climatización",
};

export default function ServicesPage() {
  return (
    <Container>
      <section className="py-12">
        <Breadcrumbs
          customItems={[
            { label: "Inicio", href: "/" },
            { label: "Servicios" },
          ]}
        />

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
            <ServiceCard
              key={service.slug}
              title={service.title}
              description={service.description}
              href={`/services/${service.slug}`}
            />
          ))}
        </div>
      </section>
    </Container>
  );
}
