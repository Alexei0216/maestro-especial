import { stripe } from "@/lib/stripe";
import { getProducts } from "@/lib/products";

const SERVER_API_URL =
    process.env.STRAPI_API_URL ?? "http://strapi:1337";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!body?.items?.length) {
            return Response.json({ error: "No items" }, { status: 400 });
        }

        const { products } = await getProducts({ pageSize: "100" });9

        const cartItems = body.items.map((item: any) => {
            const product = products.find((p) => p.id === item.productId);

            if (!product) {
                throw new Error(`Product not found: ${item.productId}`);
            }

            return {
                product,
                quantity: item.quantity,
            };
        });

        const line_items = cartItems.map((item) => ({
            price_data: {
                currency: "eur",
                product_data: {
                    name: item.product.name,
                    images: item.product.thumbnail ? [item.product.thumbnail] : [],
                },
                unit_amount: Math.round(item.product.price * 100),
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items,
            success_url: `${process.env.NEXT_PUBLIC_API_URL}/checkout/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        });

        return Response.json({ url: session.url });
    } catch (e: any) {
        console.error("CHECKOUT ERROR:", e);
        return Response.json(
            { error: e.message },
            { status: 500 }
        );
    }
}
