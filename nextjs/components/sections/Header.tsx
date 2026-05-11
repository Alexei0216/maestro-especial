"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CartButton from "../cart/CartButton";
import Container from "../layouts/Container";

const menuLinks = [
  { href: "/", label: "Inicio", icon: "home" },
  { href: "/catalog", label: "Catalogo", icon: "catalog" },
  { href: "/contact", label: "Contacto", icon: "contact" },
  { href: "/checkout", label: "Checkout", icon: "checkout" },
];

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function MenuLinkIcon({ icon }: { icon: string }) {
  const commonProps = {
    "aria-hidden": true,
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: "2",
    viewBox: "0 0 24 24",
  };

  if (icon === "catalog") {
    return (
      <svg {...commonProps}>
        <path d="M4 5h16" />
        <path d="M4 12h16" />
        <path d="M4 19h16" />
        <path d="M8 5v14" />
      </svg>
    );
  }

  if (icon === "contact") {
    return (
      <svg {...commonProps}>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
      </svg>
    );
  }

  if (icon === "checkout") {
    return (
      <svg {...commonProps}>
        <path d="M6 6h15l-1.5 9h-12z" />
        <path d="M6 6 5 3H2" />
        <path d="M9 20h.01" />
        <path d="M18 20h.01" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.1"
      viewBox="0 0 24 24"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

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
                <CloseIcon />
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
                          <MenuLinkIcon icon={link.icon} />
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
