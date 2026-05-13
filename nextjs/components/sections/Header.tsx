"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CartButton from "../cart/CartButton";
import Container from "../layouts/Container";
import { MenuIcon, CloseIcon, MenuLinkIcon, ChevronRightIcon } from "../icons";

const menuLinks = [
  { href: "/", label: "Inicio", icon: "home" },
  { href: "/catalog", label: "Catalogo", icon: "catalog" },
  { href: "/contact", label: "Contacto", icon: "contact" },
  { href: "/checkout", label: "Checkout", icon: "checkout" },
] as const;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-[#302400] text-white shadow-lg shadow-black/10">
      <Container className="relative grid h-18 grid-cols-[auto_1fr_auto] items-center gap-4">
        <button
          type="button"
          className="motion-soft flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 hover:-translate-y-0.5 hover:bg-white hover:text-[#302400] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Abrir menu"
          aria-expanded={isMenuOpen}
        >
          <MenuIcon />
        </button>

        <Link
          href="/"
          className="motion-soft absolute left-1/2 max-w-[58vw] -translate-x-1/2 truncate text-center text-2xl font-bold hover:text-yellow-400 sm:text-3xl"
        >
          Maestro Especial
        </Link>

        <div className="justify-self-end ">
          <CartButton />
        </div>
      </Container>

      {isMenuOpen && (
        <div
          className="animate-fade-in fixed inset-0 z-50 bg-black/45 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
          role="presentation"
        >
          <aside
            className="animate-slide-menu flex h-full w-full max-w-[390px] flex-col bg-[#f8f6ef] text-neutral-950 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            aria-label="Menu de navegacion"
          >
            <div className="flex items-center justify-between border-b border-neutral-300 px-6 py-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-yellow-700">
                  Menu
                </p>
                <h2 className="text-2xl font-bold">Maestro Especial</h2>
              </div>
              <button
                type="button"
                className="motion-soft flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white hover:scale-105 hover:bg-neutral-100"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Cerrar menu"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 px-6 py-6">
              <ul className="space-y-2">
                {menuLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="motion-soft group flex items-center justify-between rounded-lg border border-transparent bg-white/60 px-4 py-4 text-lg font-semibold hover:-translate-y-0.5 hover:border-neutral-200 hover:bg-white hover:shadow-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="flex items-center gap-3">
                        <span className="motion-soft flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-800 group-hover:bg-yellow-500 group-hover:text-black">
                          <MenuLinkIcon icon={link.icon} className="h-6 w-6" />
                        </span>
                        {link.label}
                      </span>
                      <span
                        className="motion-soft text-neutral-400 group-hover:translate-x-1 group-hover:text-yellow-700"
                        aria-hidden="true"
                      >
                        <ChevronRightIcon />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-lg bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-yellow-700">
                  Atencion
                </p>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  Contactanos para disponibilidad, entregas y pedidos
                  personalizados antes de finalizar la compra.
                </p>
              </div>
            </nav>

            <div className="border-t border-neutral-300 px-6 py-5 text-sm text-neutral-600">
              <p>+34 900 000 000</p>
              <p className="mt-1">info@maestroespecial.com</p>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
