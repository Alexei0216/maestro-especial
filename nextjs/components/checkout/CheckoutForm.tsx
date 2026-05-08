"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useCart } from "../cart/CartProvider";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CheckoutForm() {
  const { clearCart, isReady, items, subtotal } = useCart();
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
    clearCart();
  }

  if (!isReady) {
    return (
      <section className="animate-fade-up mx-auto max-w-2xl rounded-lg bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-yellow-700">
          Checkout
        </p>
        <h1 className="mt-3 text-4xl font-bold">Preparando tu pedido</h1>
      </section>
    );
  }

  if (isSubmitted) {
    return (
      <section className="animate-fade-up mx-auto max-w-2xl rounded-lg bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-yellow-700">
          Pedido recibido
        </p>
        <h1 className="mt-3 text-4xl font-bold">Gracias por tu pedido</h1>
        <p className="mt-4 text-neutral-600">
          Hemos preparado tu solicitud. Te contactaremos para confirmar detalles,
          disponibilidad y envio.
        </p>
        <Link
          href="/"
          className="motion-soft mt-8 inline-flex rounded-lg bg-yellow-500 px-6 py-3 font-bold text-black hover:-translate-y-0.5 hover:bg-yellow-600 hover:shadow-lg"
        >
          Volver al catalogo
        </Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="animate-fade-up mx-auto max-w-2xl rounded-lg bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-yellow-700">
          Carrito vacio
        </p>
        <h1 className="mt-3 text-4xl font-bold">No hay productos para comprar</h1>
        <p className="mt-4 text-neutral-600">
          Anade productos al carrito antes de finalizar tu pedido.
        </p>
        <Link
          href="/"
          className="motion-soft mt-8 inline-flex rounded-lg bg-yellow-500 px-6 py-3 font-bold text-black hover:-translate-y-0.5 hover:bg-yellow-600 hover:shadow-lg"
        >
          Ver productos
        </Link>
      </section>
    );
  }

  return (
    <form
      className="animate-fade-up grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start"
      onSubmit={handleSubmit}
    >
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-yellow-700">
          Checkout
        </p>
        <h1 className="mt-2 text-4xl font-bold">Datos del pedido</h1>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-neutral-700">
            Nombre
            <input
              required
              name="firstName"
              className="motion-soft h-12 w-full rounded-lg border border-neutral-300 px-4 font-normal outline-none focus:border-yellow-600 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.18)]"
              autoComplete="given-name"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-neutral-700">
            Apellidos
            <input
              required
              name="lastName"
              className="motion-soft h-12 w-full rounded-lg border border-neutral-300 px-4 font-normal outline-none focus:border-yellow-600 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.18)]"
              autoComplete="family-name"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-neutral-700">
            Email
            <input
              required
              name="email"
              type="email"
              className="motion-soft h-12 w-full rounded-lg border border-neutral-300 px-4 font-normal outline-none focus:border-yellow-600 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.18)]"
              autoComplete="email"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-neutral-700">
            Telefono
            <input
              required
              name="phone"
              className="motion-soft h-12 w-full rounded-lg border border-neutral-300 px-4 font-normal outline-none focus:border-yellow-600 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.18)]"
              autoComplete="tel"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-neutral-700 sm:col-span-2">
            Direccion
            <input
              required
              name="address"
              className="motion-soft h-12 w-full rounded-lg border border-neutral-300 px-4 font-normal outline-none focus:border-yellow-600 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.18)]"
              autoComplete="street-address"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-neutral-700">
            Ciudad
            <input
              required
              name="city"
              className="motion-soft h-12 w-full rounded-lg border border-neutral-300 px-4 font-normal outline-none focus:border-yellow-600 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.18)]"
              autoComplete="address-level2"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-neutral-700">
            Codigo postal
            <input
              required
              name="postalCode"
              className="motion-soft h-12 w-full rounded-lg border border-neutral-300 px-4 font-normal outline-none focus:border-yellow-600 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.18)]"
              autoComplete="postal-code"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-neutral-700 sm:col-span-2">
            Comentario
            <textarea
              name="notes"
              className="motion-soft min-h-32 w-full rounded-lg border border-neutral-300 px-4 py-3 font-normal outline-none focus:border-yellow-600 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.18)]"
              placeholder="Horario preferido, detalles de entrega..."
            />
          </label>
        </div>
      </section>

      <aside className="rounded-lg bg-white p-6 shadow-sm lg:sticky lg:top-8">
        <h2 className="text-2xl font-bold">Resumen</h2>

        <ul className="mt-6 space-y-4">
          {items.map((item) => (
            <li key={item.id} className="animate-fade-up grid grid-cols-[72px_1fr] gap-4">
              <div className="relative h-20 overflow-hidden rounded-lg bg-neutral-100">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="72px"
                    unoptimized
                    className="object-cover"
                  />
                )}
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold leading-snug">{item.name}</h3>
                <p className="mt-1 text-sm text-neutral-600">
                  Cantidad: {item.quantity}
                </p>
                <p className="mt-2 font-bold">
                  {formatPrice((item.price ?? 0) * item.quantity)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-neutral-300 pt-5">
          <div className="flex justify-between text-lg font-bold">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-2 text-sm text-neutral-600">
            El envio se confirma antes del pago final.
          </p>
        </div>

        <button
          type="submit"
          className="motion-soft mt-6 w-full rounded-lg bg-yellow-500 px-6 py-3 font-bold text-black hover:-translate-y-0.5 hover:bg-yellow-600 hover:shadow-lg"
        >
          Confirmar pedido
        </button>
      </aside>
    </form>
  );
}
