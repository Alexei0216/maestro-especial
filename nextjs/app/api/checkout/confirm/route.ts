import { stripe } from "@/lib/stripe";

const SERVER_API_URL =
  process.env.STRAPI_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

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

function parseCustomerMetadata(metadata?: Record<string, string | undefined>) {
  const source = metadata?.customer ? undefined : metadata;

  if (source) {
    return {
      firstName: String(source.firstName ?? ""),
      lastName: String(source.lastName ?? ""),
      phone: String(source.phone ?? ""),
      address: String(source.address ?? ""),
      apartment: String(source.apartment ?? ""),
      city: String(source.city ?? ""),
      province: String(source.province ?? ""),
      postalCode: String(source.postalCode ?? ""),
      notes: String(source.notes ?? ""),
      shippingMethod: String(source.shippingMethod ?? ""),
      preferredDeliveryTime: String(source.preferredDeliveryTime ?? ""),
    };
  }

  try {
    const customer = JSON.parse(metadata?.customer ?? "{}");
    return {
      firstName: String(customer.firstName ?? ""),
      lastName: String(customer.lastName ?? ""),
      phone: String(customer.phone ?? ""),
      address: String(customer.address ?? ""),
      apartment: String(customer.apartment ?? ""),
      city: String(customer.city ?? ""),
      province: String(customer.province ?? ""),
      postalCode: String(customer.postalCode ?? ""),
      notes: String(customer.notes ?? ""),
      shippingMethod: String(customer.shippingMethod ?? ""),
      preferredDeliveryTime: String(customer.preferredDeliveryTime ?? ""),
    };
  } catch {
    return {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      apartment: "",
      city: "",
      province: "",
      postalCode: "",
      notes: "",
      shippingMethod: "",
      preferredDeliveryTime: "",
    };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sessionId = String(body?.sessionId ?? "");

    if (!sessionId) {
      return Response.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== "paid") {
      return Response.json({ error: "Session not paid" }, { status: 400 });
    }

    const existingOrderRes = await strapiRequest(
      `/api/orders?filters[orderNumber][$eq]=${session.id}&fields[0]=id`,
      { method: "GET" },
    );
    if (existingOrderRes.ok) {
      const existingOrderData = await existingOrderRes.json();
      if ((existingOrderData?.data ?? []).length > 0) {
        return Response.json({ ok: true, alreadyExists: true });
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

        if (productId < 1 || quantity < 1 || unitPrice <= 0) return null;
        return { productId, quantity, unitPrice, title };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    if (items.length === 0) {
      return Response.json({ error: "No valid items in session" }, { status: 400 });
    }

    const customerMeta = parseCustomerMetadata(session.metadata ?? undefined);
    const customerName = `${customerMeta.firstName} ${customerMeta.lastName}`.trim();
    const totalPrice = Math.round((session.amount_total ?? 0) / 100);

    const createOrderRes = await strapiRequest("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        data: {
          orderNumber: session.id,
          orderStatus: "processing",
          paymentStatus: "paid",
          paymentMethod: "stripe",
          shippingMethod: customerMeta.shippingMethod,
          customerNotes: customerMeta.notes,
          preferredDeliveryTime: customerMeta.preferredDeliveryTime,
          totalPrice,
          customerName,
          customerEmail: session.customer_details?.email ?? "",
          customerPhone: customerMeta.phone,
          shippingAddress: {
            country: "ES",
            city: customerMeta.city,
            province: customerMeta.province,
            zipCode: customerMeta.postalCode,
            street: customerMeta.address,
            apartment: customerMeta.apartment,
          },
        },
      }),
    });

    if (!createOrderRes.ok) {
      const err = await createOrderRes.text();
      return Response.json({ error: `Create order failed: ${err}` }, { status: 500 });
    }

    const createdOrder = await createOrderRes.json();
    const orderId = createdOrder?.data?.id;
    if (!orderId) {
      return Response.json({ error: "Order ID missing" }, { status: 500 });
    }

    await Promise.all(
      items.map((item) =>
        strapiRequest("/api/order-items", {
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
        }),
      ),
    );

    return Response.json({ ok: true });
  } catch (error: unknown) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Confirm failed" },
      { status: 500 },
    );
  }
}
