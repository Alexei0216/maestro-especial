import ProductCard from "../ui/ProductCard";
import { getProducts } from "../../lib/api";

export default async function Service() {
    const products = await getProducts();

    return (
        <section className="py-12 px-6 max-w-[1400px] mx-auto">

            <h2 className="text-3xl font-bold mb-8">
                The Most Popular Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        {...product}
                    />
                ))}

            </div>
        </section>
    );
}