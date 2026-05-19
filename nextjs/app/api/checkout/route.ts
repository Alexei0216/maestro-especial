import { stripe } from "@/lib/stripe";
import { getProducts } from "@/lib/products";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!body?.items?.length) {
            return Response.json({ error: "No items" }, { status: 400 });
        }

        const requestedItems = body.items.map((item: any) => {
            const quantity = Number(item.quantity) || 0;
            const id = Number(item.id) || 0;

            if (id < 1 || quantity < 1) {
                throw new Error(`Invalid cart item: ${item?.id ?? "unknown"}`);
            }

            return {
                id,
                quantity,
            };
        });

        const { products } = await getProducts({ pageSize: "100" });
        const cartItems = requestedItems.map((item) => {
            const product = products.find((p) => p.id === item.id);
            if (!product) {
                throw new Error(`Product not found: ${item.id}`);
            }
            return {
                id: item.id,
                quantity: item.quantity,
                name: product.name,
                price: Number(product.price) || 0,
                image: product.thumbnail,
            };
        });

        const line_items = cartItems.map((item) => ({
            price_data: {
                currency: "eur",
                product_data: {
                    name: item.name,
                    metadata: {
                        productId: String(item.id),
                    },
                    images:
                        item.image && item.image.startsWith("http")
                            ? [item.image]
                            : undefined,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        const customer = body.customer ?? {};
        const origin = new URL(req.url).origin;
        const customerPayload = {
            firstName: String(customer.firstName ?? ""),
            lastName: String(customer.lastName ?? ""),
            phone: String(customer.phone ?? ""),
            address: String(customer.address ?? ""),
            city: String(customer.city ?? ""),
            postalCode: String(customer.postalCode ?? ""),
        };

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items,
            customer_email: String(customer.email ?? "") || undefined,
            metadata: {
                customer: JSON.stringify(customerPayload),
            },
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout`,
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
