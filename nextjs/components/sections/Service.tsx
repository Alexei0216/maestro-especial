import ProductCard from "../ui/ProductCard";

export default function Service() {
    return (
        <section className="py-12 px-6 max-w-[1400px] mx-auto">

            {/* Title */}
            <h2 className="text-3xl font-bold mb-8">
                The Most Popular Products
            </h2>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

                <ProductCard 
                    title="Service 1"
                    description="High quality service for your needs"
                    price={19.99}
                    image="/banner.webp"
                />

                <ProductCard 
                    title="Service 2"
                    description="Another premium service option"
                    price={29.99}
                    image="/banner.webp"
                />

                <ProductCard 
                    title="Service 3"
                    description="Best value service package"
                    price={39.99}
                    image="/banner.webp"
                />

                <ProductCard 
                    title="Service 4"
                    description="Premium experience for professionals"
                    price={49.99}
                    image="/banner.webp"
                />

            </div>
        </section>
    );
}