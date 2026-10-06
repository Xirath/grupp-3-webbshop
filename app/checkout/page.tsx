"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { fetchClientSecret } from "../actions/stripe";
import { useCart } from "../components/ShoppingCart/CartContent";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in environment variables.",
  );
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

export default function CheckoutPage() {
  const { cartItems, totalItems, totalPrice } = useCart();

  const cartKey = `cart-${totalPrice}-${totalItems}-${cartItems.map((item) => `${item.id}x${item.quantity}`).join("-")}`;

  if (cartItems.length === 0) {
    return (
      <main>
        <p>Cart is empty, insert nice message here</p>
        <a href="/">
          <button className="rounded bg-blue-500 text-white px-4 py-2">
            Return to shop
          </button>
        </a>
      </main>
    );
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        key={cartKey}
        stripe={stripePromise}
        options={{ fetchClientSecret: () => fetchClientSecret(cartItems) }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
