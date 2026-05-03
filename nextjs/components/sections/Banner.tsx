import Container from "@/components/layouts/Container";
import Image from "next/image";

export default function Banner() {
    return (
        <section className="relative min-h-[70vh] m-10 rounded-xl">
            
            <Image
                src="/banner.webp"
                alt="Banner Image"
                fill
                className="object-cover object-center rounded-xl"
            />
            
            <div className="absolute inset-0 bg-black/60 rounded-xl"></div>

            <Container>
                <div className="min-h-[70vh] flex items-center">

                    <div className="max-w-[650px] z-10 text-white flex flex-col">

                        <h1 className="text-5xl font-bold mb-5 flex items-center justify-center text-yellow-500">
                            Welcome to Maestro Especial
                        </h1>

                        <p className="text-xl">
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. <br/> Voluptas ex provident, accusamus soluta esse autem voluptatem iste
                        </p>

                    </div>

                    <div className="max-w-[650px] z-10 text-white flex flex-col items-center justify-center">

                        <Image 
                            src="/bannerImage.svg"
                            alt="Banner Image"
                            width={400}
                            height={300}
                        />

                        <button className="bg-yellow-500 py-3 px-20 rounded-xl text-md font-bold text-black cursor-pointer mt-10 hover:bg-yellow-600 transition">
                            Comprar
                        </button>

                    </div>

                </div>
            </Container>
        </section>
    )

}