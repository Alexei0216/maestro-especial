import Link from "next/link";
import Container from "../layouts/Container";

export default function Header() {
    return (
        <header className="bg-[#302400] text-white py-4">

            <Container className="flex flex-row items-center justify-center">
                <Link href="/" className="text-3xl font-bold">
                    Maestro Especial
                </Link>
                {/* <ul className="flex flex-row gap-5">
                    <li>
                        <Link href="/">Inicio</Link>
                    </li>
                    <li>
                        <Link href="/">Sobre nosotros</Link>
                    </li>
                    <li>
                        <Link href="/">Servicios</Link>
                    </li>
                    <li>
                        <Link href="/">Contactos</Link>
                    </li>
                </ul> */}
            </Container>
            
        </header>
    )
}
