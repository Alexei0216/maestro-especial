"use client";

import { useState } from "react";

type QuantityControlProps = {
  productName: string;
};

export default function QuantityControl({ productName }: QuantityControlProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-neutral-700" htmlFor="quantity">
        Cantidad
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-12 items-center rounded-lg border border-neutral-300 bg-white">
          <button
            type="button"
            className="h-full w-11 text-xl text-neutral-700 transition hover:bg-neutral-100"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            aria-label="Reducir cantidad"
          >
            -
          </button>
          <input
            id="quantity"
            className="h-full w-14 border-x border-neutral-300 text-center text-base font-semibold outline-none"
            min={1}
            value={quantity}
            onChange={(event) => {
              const nextValue = Number(event.target.value);
              setQuantity(Number.isFinite(nextValue) && nextValue > 0 ? nextValue : 1);
            }}
            type="number"
          />
          <button
            type="button"
            className="h-full w-11 text-xl text-neutral-700 transition hover:bg-neutral-100"
            onClick={() => setQuantity((value) => value + 1)}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        <button
          type="button"
          className="h-12 flex-1 rounded-lg bg-yellow-500 px-6 font-bold text-black transition hover:bg-yellow-600 sm:flex-none"
          aria-label={`Anadir ${productName} al carrito`}
        >
          Anadir al carrito
        </button>
      </div>
    </div>
  );
}
