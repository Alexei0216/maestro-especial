"use client";

import { useCart } from "./CartProvider";

function CartIcon() {
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
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6 5 3H2" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}

export default function CartButton() {
  const { itemCount, openCart } = useCart();

  return (
    <button
      type="button"
      className="motion-soft relative flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:-translate-y-0.5 hover:bg-white hover:text-[#302400] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
      onClick={openCart}
      aria-label="Abrir carrito"
    >
      <CartIcon />
      {itemCount > 0 && (
        <span className="animate-modal-zoom absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-500 px-1 text-xs font-bold text-black">
          {itemCount}
        </span>
      )}
    </button>
  );
}
