import Image from "next/image";
import Link from "next/link";
import type { Product } from "../../types/product";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const {
    id,
    name,
    price,
    oldPrice,
    thumbnail,
    stock,
    slug,
    shortDescription,
    category,
  } = product;

  return (
    <article className="motion-soft bg-white rounded-lg overflow-hidden shadow-md hover:-translate-y-1 hover:shadow-xl flex flex-col group h-full">
      <Link
        href={`/products/${slug}`}
        className="relative h-56 w-full overflow-hidden block"
        aria-label={`Ver ${name}`}
      >
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            unoptimized
            className="object-cover motion-soft group-hover:scale-105"
          />
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {category && (
          <span className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {category.name}
          </span>
        )}

        <h3 className="text-lg font-semibold mb-2">
          <Link
            href={`/products/${slug}`}
            className="motion-soft hover:text-yellow-700"
          >
            {name}
          </Link>
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {shortDescription || "Sin descripción"}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-black">{price} €</span>
            {oldPrice && oldPrice > price && (
              <span className="text-sm text-gray-500 line-through">
                {oldPrice} €
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-gray-500">
              {stock > 0 ? `${stock} en stock` : "Agotado"}
            </span>
            <Link
              href={`/products/${slug}`}
              className="motion-soft bg-yellow-500 hover:bg-yellow-600 hover:-translate-y-0.5 cursor-pointer text-black font-semibold px-4 py-2 rounded-lg text-sm"
            >
              Ver producto
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
