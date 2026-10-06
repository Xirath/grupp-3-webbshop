import { NextResponse } from "next/server";
import { stripe } from "@/app/lib/stripe";
import Stripe from "stripe";
import { getProduct, updateProduct } from "@/app/lib/api";

const processedEvents = new Set<string>();

export async function POST(req: Request) {
  const body = await req.text();
  const header = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is missing in .env.local");
    return NextResponse.json(
      { error: "Webhook secret is not configured" },
      { status: 500 },
    );
  }

  if (!header) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, header, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (processedEvents.has(session.id)) {
        console.log(
          `Session ${session.id} was already fulfilled. Skipping duplicate.`,
        );
        return NextResponse.json({ received: true });
      }

      processedEvents.add(session.id);

      // Update stock for purchased items
      if (session.metadata?.order_items) {
        const purchasedItems = JSON.parse(session.metadata.order_items) as {
          id: number;
          quantity: number;
        }[];

        await Promise.all(
          purchasedItems.map(async (item) => {
            const product = await getProduct(item.id);
            if (product && typeof product.stock === "number") {
              const newStock = Math.max(0, product.stock - item.quantity);
              console.log(
                `Stock for Product #${item.id} reduced from ${product.stock} to ${newStock}`,
              );
              await updateProduct(item.id, { stock: newStock });
            }
          }),
        );
      }
      // TODO: Send receipt to customer
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.warn(
        `Payment failed: ${paymentIntent.last_payment_error?.message}`,
      );
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // 4. Return a 200 OK so Stripe knows the event was successfully received
  return NextResponse.json({ received: true });
}
