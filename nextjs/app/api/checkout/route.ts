import { stripe } from "@/lib/stripe";
import { getProducts } from "@/lib/products";

type CheckoutBody = {
    items?: unknown[];
    customer?: Record<string, unknown>;
};

function readRequired(value: unknown, field: string, maxLength = 500) {
    const text = String(value ?? "").trim();
    if (!text) {
        throw new Error(`Missing customer field: ${field}`);
    }
    if (text.length > maxLength) {
        throw new Error(`Customer field too long: ${field}`);
    }
    return text;
}

function readOptional(value: unknown, field: string, maxLength = 500) {
    const text = String(value ?? "").trim();
    if (text.length > maxLength) {
        throw new Error(`Customer field too long: ${field}`);
    }
    return text;
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as CheckoutBody;

        if (!body?.items?.length) {
            return Response.json({ error: "No items" }, { status: 400 });
        }

        const requestedItems = body.items.map((item) => {
            const cartItem = item && typeof item === "object" ? item as Record<string, unknown> : {};
            const quantity = Number(cartItem.quantity) || 0;
            const id = Number(cartItem.id) || 0;

            if (id < 1 || quantity < 1) {
                throw new Error(`Invalid cart item: ${String(cartItem.id ?? "unknown")}`);
            }

            return {
                id,
                quantity,
            };
        });

        const { products } = await getProducts({ pageSize: "100" });
        const cartItems = requestedItems.map((item: { id: number; quantity: number }) => {
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

        const line_items = cartItems.map((item: { id: number; quantity: number; name: string; price: number; image?: string }) => ({
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
            firstName: readRequired(customer.firstName, "firstName"),
            lastName: readRequired(customer.lastName, "lastName"),
            phone: readRequired(customer.phone, "phone"),
            address: readRequired(customer.address, "address"),
            apartment: readOptional(customer.apartment, "apartment"),
            city: readRequired(customer.city, "city"),
            province: readRequired(customer.province, "province"),
            postalCode: readRequired(customer.postalCode, "postalCode"),
            notes: readOptional(customer.notes, "notes"),
            shippingMethod: readRequired(customer.shippingMethod, "shippingMethod"),
            preferredDeliveryTime: readOptional(customer.preferredDeliveryTime, "preferredDeliveryTime"),
        };
        const customerEmail = readRequired(customer.email, "email");

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items,
            customer_email: customerEmail,
            metadata: {
                firstName: customerPayload.firstName,
                lastName: customerPayload.lastName,
                phone: customerPayload.phone,
                address: customerPayload.address,
                apartment: customerPayload.apartment,
                city: customerPayload.city,
                province: customerPayload.province,
                postalCode: customerPayload.postalCode,
                notes: customerPayload.notes,
                shippingMethod: customerPayload.shippingMethod,
                preferredDeliveryTime: customerPayload.preferredDeliveryTime,
            },
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout`,
        });

        return Response.json({ url: session.url });
    } catch (e: unknown) {
        console.error("CHECKOUT ERROR:", e);
        return Response.json(
            { error: e instanceof Error ? e.message : "Checkout failed" },
            { status: 500 }
        );
    }
}
