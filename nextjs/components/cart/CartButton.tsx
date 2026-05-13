"use client";

import { CartIcon } from "../icons";
import { useCart } from "./CartProvider";

export default function CartButton() {
  const { itemCount, openCart } = useCart();

  return (
    <button
      type="button"
      className="motion-soft relative flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:-translate-y-0.5 hover:bg-white hover:text-[#302400] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer"
      onClick={openCart}
      aria-label="Abrir carrito"
    >
      <CartIcon />
      {itemCount > 0 && (
        <span className="animate-modal-zoom absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-500 px-1 text-xs font-bold text-black ">
          {itemCount}
        </span>
      )}
    </button>
  );
}
