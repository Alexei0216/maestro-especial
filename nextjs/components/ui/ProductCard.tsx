import Image from "next/image";
import Link from "next/link";
import type { Product } from "../../types/product";

type ProductCardProps = Product;

export default function ProductCard({
  id,
  name,
  description,
  price,
  image,
}: ProductCardProps) {
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition flex flex-col group h-full">
      <Link
        href={`/products/${id}`}
        className="relative h-56 w-full overflow-hidden block"
        aria-label={`Ver ${name}`}
      >
        {image && (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold mb-2">
          <Link href={`/products/${id}`} className="hover:text-yellow-700">
            {name}
          </Link>
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>

        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="text-xl font-bold text-black">€{price ?? "—"}</span>

          <Link
            href={`/products/${id}`}
            className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer transition text-black font-semibold px-5 py-2 rounded-lg"
          >
            Comprar
          </Link>
        </div>
      </div>
    </article>
  );
}
