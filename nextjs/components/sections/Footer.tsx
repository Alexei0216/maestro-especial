import Link from "next/link";
import Container from "../layouts/Container";

const footerLinks = [
  { href: "/", label: "Inicio" },
  { href: "/catalog", label: "Catalogo" },
  { href: "/contact", label: "Contacto" },
  { href: "/checkout", label: "Checkout" },
];

export default function Footer() {
  return (
    <footer className="bg-[#302400] text-white">
      <Container className="py-12">
        <div className="grid gap-10 border-b border-white/15 pb-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <Link
              href="/"
              className="motion-soft text-3xl font-bold hover:text-yellow-400"
            >
              Maestro Especial
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
              Productos seleccionados con atencion al detalle, compra clara y
              atencion cercana antes de confirmar cada pedido.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-yellow-400">
              Tienda
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="motion-soft hover:text-yellow-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-yellow-400">
              Servicio
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li>Pedidos personalizados</li>
              <li>Confirmacion previa</li>
              <li>Entrega coordinada</li>
              <li>Atencion postventa</li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-yellow-400">
              Contacto
            </h2>
            <address className="mt-4 space-y-3 text-sm not-italic text-white/75">
              <p>Madrid, Espana</p>
              <p>
                <a className="motion-soft hover:text-yellow-400" href="tel:+34900000000">
                  +34 900 000 000
                </a>
              </p>
              <p>
                <a
                  className="motion-soft hover:text-yellow-400"
                  href="mailto:info@maestroespecial.com"
                >
                  info@maestroespecial.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>2026 Maestro Especial. Todos los derechos reservados.</p>
          <p>Pago seguro - Pedido verificado - Atencion personalizada</p>
        </div>
      </Container>
    </footer>
  );
}
