import Image from "next/image";

type ProductCardProps = {
    title: string;
    description: string;
    price: number;
    image: string;
};

export default function ProductCard({
    title,
    description,
    price,
    image,
}: ProductCardProps) {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition flex flex-col">

            {/* Image */}
            <div className="relative h-56 w-full overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">

                {/* Title */}
                <h3 className="text-lg font-semibold mb-2">
                    {title}
                </h3>

                {/* SEO description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {description}
                </p>

                {/* Price + button */}
                <div className="mt-auto flex items-center justify-between">

                    <span className="text-xl font-bold text-black">
                        €{price}
                    </span>

                    <button className="bg-yellow-500 hover:bg-yellow-600 transition text-black font-semibold px-5 py-2 rounded-lg">
                        Comprar
                    </button>

                </div>
            </div>
        </div>
    );
}