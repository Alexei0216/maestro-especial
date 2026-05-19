import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response("Webhook error", { status: 400 });
  }

  // 💥 ВОТ ЗДЕСЬ
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const orderId = session.metadata?.orderId;

    await fetch(`${process.env.STRAPI_API_URL}/api/orders/${orderId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          paymentStatus: "paid",
          orderStatus: "processing",
        },
      }),
    });
  }

  return new Response("ok");
}
