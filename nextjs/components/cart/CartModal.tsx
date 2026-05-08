"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "./CartProvider";

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

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CartModal() {
  const {
    closeCart,
    isOpen,
    items,
    removeItem,
    subtotal,
    updateQuantity,
  } = useCart();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeCart();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [closeCart, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 bg-black/45 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Carrito"
      onClick={closeCart}
    >
      <aside
        className="animate-slide-cart ml-auto flex h-full w-full max-w-[460px] flex-col bg-[#f8f6ef] text-neutral-950 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-300 px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-yellow-700">
              Maestro Especial
            </p>
            <h2 className="text-2xl font-bold">Carrito</h2>
          </div>

          <button
            type="button"
            className="motion-soft flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white hover:scale-105 hover:bg-neutral-100"
            onClick={closeCart}
            aria-label="Cerrar carrito"
          >
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <h3 className="text-2xl font-bold">Tu carrito esta vacio</h3>
            <p className="mt-3 text-neutral-600">
              Anade productos desde el catalogo para preparar tu pedido.
            </p>
            <button
              type="button"
              className="motion-soft mt-7 rounded-lg bg-yellow-500 px-6 py-3 font-bold text-black hover:-translate-y-0.5 hover:bg-yellow-600 hover:shadow-lg"
              onClick={closeCart}
            >
              Seguir comprando
            </button>
          </div>
        ) : (
          <>
            <div className="scrollbar-none flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="animate-fade-up grid grid-cols-[86px_1fr] gap-4 border-b border-neutral-200 pb-4"
                  >
                    <div className="relative h-24 overflow-hidden rounded-lg bg-white">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="86px"
                          unoptimized
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold leading-snug">{item.name}</h3>
                          <p className="mt-1 text-sm text-neutral-600">
                            {formatPrice(item.price ?? 0)}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="motion-soft text-sm font-semibold text-neutral-500 hover:text-red-700"
                          onClick={() => removeItem(item.id)}
                        >
                          Quitar
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex h-10 items-center rounded-lg border border-neutral-300 bg-white">
                          <button
                            type="button"
                            className="motion-soft h-full w-9 text-lg hover:bg-neutral-100 active:scale-95"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Reducir cantidad"
                          >
                            -
                          </button>
                          <span className="w-10 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="motion-soft h-full w-9 text-lg hover:bg-neutral-100 active:scale-95"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-bold">
                          {formatPrice((item.price ?? 0) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-neutral-300 bg-white px-6 py-5">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-2 text-sm text-neutral-600">
                Envio e impuestos se confirmaran al finalizar el pedido.
              </p>

              <div className="mt-5 grid gap-3">
                <Link
                  href="/checkout"
                  className="motion-soft rounded-lg bg-yellow-500 px-6 py-3 text-center font-bold text-black hover:-translate-y-0.5 hover:bg-yellow-600 hover:shadow-lg"
                  onClick={closeCart}
                >
                  Finalizar pedido
                </Link>
                <button
                  type="button"
                  className="motion-soft rounded-lg border border-neutral-300 bg-white px-6 py-3 font-semibold hover:bg-neutral-100"
                  onClick={closeCart}
                >
                  Seguir comprando
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
