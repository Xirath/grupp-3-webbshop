"use server";

import { headers } from "next/headers";

import { stripe } from "@/app/lib/stripe";
import { CartItem } from "../types";
import { getProduct } from "../lib/api";

export async function fetchClientSecret(cartItems: CartItem[]) {
  if (!cartItems || cartItems.length === 0) {
    throw new Error("Can't create a checkout session with an empty cart.");
  }

  const origin = (await headers()).get("origin");

  // Fetch and verify the product data for each cart item to get the latest price and details
  const verifiedItems = await Promise.all(
    cartItems.map(async (item) => {
      const liveProduct = await getProduct(item.id);

      // Check if the product exists
      if (!liveProduct) {
        throw new Error(`Product with ID ${item.id} not found.`);
      }

      // Check if there is enough stock for the requested quantity
      if (
        typeof liveProduct.stock === "number" &&
        liveProduct.stock < item.quantity
      ) {
        if (liveProduct.stock === 0) {
          throw new Error(
            `"${liveProduct.title}" is currently out of stock. Please remove it from your cart.`,
          );
        } else {
          throw new Error(
            `Only ${liveProduct.stock} left in stock for "${liveProduct.title}", but you have ${item.quantity} in your cart. Please update your quantity.`,
          );
        }
      }

      // Check if the price has changed
      if (liveProduct.price !== item.price) {
        throw new Error(
          `Price for product with ID ${item.id} has changed. Current price is ${liveProduct.price}.`,
        );
      }

      // Use the live product data to ensure accurate pricing and details
      return {
        line_item: {
          price_data: {
            currency: "usd",
            product_data: {
              name: liveProduct.title,
              description: liveProduct.description
                ? liveProduct.description.slice(0, 100)
                : undefined,
            },
            unit_amount: Math.round(liveProduct.price * 100),
          },
          quantity: item.quantity,
        },
        metadataItem: {
          id: liveProduct.id,
          quantity: item.quantity,
        },
      };
    }),
  );

  // Extract line items and metadata for the checkout session
  const line_items = verifiedItems.map((v) => v.line_item);
  const metadataOrderItems = verifiedItems.map((v) => v.metadataItem);

  // Create Checkout session for the items in the cart
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded_page",
    line_items: line_items,
    mode: "payment",
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      order_items: JSON.stringify(metadataOrderItems),
    },
  });

  if (!session.client_secret) {
    throw new Error(
      "Failed to create Stripe Checkout session: client_secret is null",
    );
  }

  return session.client_secret;
}
