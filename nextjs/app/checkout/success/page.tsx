"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";

export default function CheckoutSuccessPage() {
  const { clearCart, isReady } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!isReady) return;
    clearCart();
  }, [isReady]);

  useEffect(() => {
    if (!sessionId) return;
    void fetch("/api/checkout/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
  }, [sessionId]);

  return (
    <section className="animate-fade-up mx-auto max-w-2xl rounded-lg bg-white px-6 py-12 text-center shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-green-700">
        Pago completado
      </p>
      <h1 className="mt-3 text-4xl font-bold">Gracias por tu pedido</h1>
      <p className="mt-4 text-neutral-600">
        Hemos recibido tu pago y estamos procesando el pedido.
      </p>
      <Link
        href="/catalog"
        className="motion-soft mt-8 inline-flex rounded-lg bg-yellow-500 px-6 py-3 font-bold text-black hover:-translate-y-0.5 hover:bg-yellow-600 hover:shadow-lg"
      >
        Seguir comprando
      </Link>
    </section>
  );
}
