import { stripe } from "@/lib/stripe";

const SERVER_API_URL =
  process.env.STRAPI_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

type CustomerMeta = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
};

function parseCustomerMetadata(metadata?: Record<string, string | undefined>): CustomerMeta | null {
  try {
    const customer = JSON.parse(metadata?.customer ?? "{}");

    if (typeof customer !== "object" || !customer) {
      return null;
    }

    return {
      firstName: String(customer.firstName ?? ""),
      lastName: String(customer.lastName ?? ""),
      phone: String(customer.phone ?? ""),
      address: String(customer.address ?? ""),
      city: String(customer.city ?? ""),
      postalCode: String(customer.postalCode ?? ""),
    };
  } catch {
    return null;
  }
}

async function strapiRequest(path: string, init?: RequestInit) {
  return fetch(`${SERVER_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return new Response("Webhook error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      id: string;
      amount_total?: number | null;
      customer_details?: { email?: string | null };
      metadata?: Record<string, string>;
    };

    const existingOrderRes = await strapiRequest(
      `/api/orders?filters[orderNumber][$eq]=${session.id}&fields[0]=id`,
      { method: "GET" },
    );
    if (existingOrderRes.ok) {
      const existingOrderData = await existingOrderRes.json();
      if ((existingOrderData?.data ?? []).length > 0) {
        return new Response("ok");
      }
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
      expand: ["data.price.product"],
    });
    const items = lineItems.data
      .map((line) => {
        const quantity = Number(line.quantity) || 0;
        const unitPrice = Number(line.price?.unit_amount ?? 0) / 100;
        const productObj = line.price?.product as { metadata?: Record<string, string>; name?: string } | string | null;
        const productMetadata =
          productObj && typeof productObj === "object" ? productObj.metadata : undefined;
        const productId = Number(productMetadata?.productId) || 0;
        const title =
          productObj && typeof productObj === "object" && productObj.name
            ? productObj.name
            : line.description ?? "Product";

        if (productId < 1 || quantity < 1 || unitPrice <= 0) {
          return null;
        }

        return {
          productId,
          quantity,
          unitPrice,
          title,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    if (items.length === 0) {
      return new Response("ok");
    }

    const customerMeta = parseCustomerMetadata(session.metadata);
    const customerName = `${customerMeta?.firstName ?? ""} ${customerMeta?.lastName ?? ""}`.trim();
    const totalPrice = Math.round((session.amount_total ?? 0) / 100);

    const createOrderRes = await strapiRequest("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        data: {
          orderNumber: session.id,
          orderStatus: "processing",
          paymentStatus: "paid",
          paymentMethod: "stripe",
          totalPrice,
          customerName,
          customerEmail: session.customer_details?.email ?? "",
          customerPhone: customerMeta?.phone ?? "",
          shippingAddress: {
            country: "ES",
            city: customerMeta?.city ?? "",
            zipCode: customerMeta?.postalCode ?? "",
            street: customerMeta?.address ?? "",
            apartment: "",
          },
        },
      }),
    });

    if (!createOrderRes.ok) {
      const err = await createOrderRes.text();
      console.error("Failed to create paid order from webhook:", err);
      return new Response("ok");
    }

    const createdOrderData = await createOrderRes.json();
    const orderId = createdOrderData?.data?.id;
    if (!orderId) {
      return new Response("ok");
    }

    await Promise.all(
      items.map(async (item) => {
        await strapiRequest("/api/order-items", {
          method: "POST",
          body: JSON.stringify({
            data: {
              order: orderId,
              product: item.productId,
              quantity: item.quantity,
              productTitleSnapshot: item.title,
              productPriceSnapshot: item.unitPrice,
              selectedAttributes: {},
            },
          }),
        });
      }),
    );
  }

  return new Response("ok");
}
