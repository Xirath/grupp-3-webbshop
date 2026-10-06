"use server";

import { headers } from "next/headers";

import { stripe } from "@/app/lib/stripe";
import { CartItem } from "../types";

export async function fetchClientSecret(cartItems: CartItem[]) {
  if (!cartItems || cartItems.length === 0) {
    throw new Error("Can't create a checkout session with an empty cart.");
  }

  const origin = (await headers()).get("origin");

  // Create Checkout session for the items in the cart
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded_page",
    line_items: cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          description: item.description,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.client_secret) {
    throw new Error(
      "Failed to create Stripe Checkout session: client_secret is null",
    );
  }

  return session.client_secret;
}
