import Container from "@/components/layouts/Container";
import Image from "next/image";
import Link from "next/link";
import Section from "../layouts/Section";

export default function Banner() {
  return (
    <Container>
      <section className="animate-fade-up relative mt-10 min-h-[560px] overflow-hidden rounded-lg">
        <Image
          src="/banner.webp"
          alt="Instalacion profesional de aire acondicionado"
          fill
          priority
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/65" />

        <Section className="h-full">
          <div className="relative z-10 flex min-h-[560px] items-center justify-between gap-10 py-10">
            <div className="max-w-2xl text-white">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-yellow-400">
                Climatizacion, instalacion y mantenimiento
              </p>
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-6xl">
                Aire acondicionado para vivir y trabajar mejor
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-white/80">
                Equipos eficientes, asesoramiento tecnico, instalacion cuidada y
                servicio postventa para hogares, oficinas y locales comerciales.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="motion-soft rounded-lg bg-yellow-500 px-6 py-3 font-bold text-black hover:-translate-y-0.5 hover:bg-yellow-600 hover:shadow-lg"
                >
                  Solicitar presupuesto
                </Link>
                <Link
                  href="/catalog"
                  className="motion-soft rounded-lg border border-white/30 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-sm hover:-translate-y-0.5 hover:bg-white hover:text-[#302400]"
                >
                  Ver catalogo
                </Link>
              </div>
            </div>

            <div className="hidden flex-col items-center text-white lg:flex">
              <Image
                src="/bannerImage.svg"
                alt="Equipo de climatizacion"
                width={400}
                height={300}
                priority
                className="h-auto"
              />
            </div>
          </div>
        </Section>
      </section>
    </Container>
  );
}
