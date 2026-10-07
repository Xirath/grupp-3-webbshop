"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

import { fetchClientSecret } from "@actions/stripe";
import { useCart } from "@components/ShoppingCart/CartContent";
import Link from "next/link";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cartKey = `cart-${totalPrice}-${totalItems}-${cartItems.map((item) => `${item.id}x${item.quantity}`).join("-")}`;

  const handleFetchClientSecret = async () => {
    try {
      setErrorMessage(null);
      return await fetchClientSecret(cartItems);
    } catch (error) {
      if (error instanceof Error && error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
      throw error;
    }
  };

  if (cartItems.length === 0) {
    return (
      <main>
        <p>Cart is empty, insert nice message here</p>
        <Link href="/" className="rounded bg-blue-500 text-white px-4 py-2">
          Return to shop
        </Link>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main>
        <h2>Checkout Error</h2>
        <p>{errorMessage}</p>
        {/* TODO: Link to the shopping cart page */}
        <Link href="/" className="rounded bg-blue-500 text-white px-4 py-2">
          Review Cart
        </Link>
      </main>
    );
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        key={cartKey}
        stripe={stripePromise}
        options={{ fetchClientSecret: handleFetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
