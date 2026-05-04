import Container from "@/components/layouts/Container";
import Image from "next/image";
import Section from "../layouts/Section";

export default function Banner() {
    return (
        <Container>
            <section className="relative h-[560px] m-10 overflow-hidden rounded-xl">

                {/* Background image */}
                <Image
                    src="/banner.webp"
                    alt="Banner background"
                    fill
                    priority
                    className="object-cover object-center"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60" />

                <Section className="h-full">
                    <div className="relative z-10 h-full flex items-center justify-between gap-10">

                        {/* Left side */}
                        <div className="max-w-xl text-white">
                            <h1 className="text-5xl font-bold text-yellow-500 mb-5">
                                Welcome to Maestro Especial
                            </h1>

                            <p className="text-xl leading-relaxed">
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                                Voluptas ex provident, accusamus soluta esse autem voluptatem iste
                            </p>
                        </div>

                        {/* Right side */}
                        <div className="flex flex-col items-center text-white">
                            <Image
                                src="/bannerImage.svg"
                                alt="Banner illustration"
                                width={400}
                                height={300}
                                priority
                            />

                            <button className="mt-10 bg-yellow-500 hover:bg-yellow-600 transition text-black font-bold py-3 px-16 rounded-xl">
                                Comprar
                            </button>
                        </div>

                    </div>
                </Section>
            </section>
        </Container>
    );
}