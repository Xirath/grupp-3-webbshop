"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { fetchClientSecret } from "@actions/stripe";
import { useCart } from "@components/ShoppingCart/CartContent";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in environment variables.",
  );
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

export default function CheckoutForm() {
  const { cartItems, totalItems, totalPrice } = useCart();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cartKey = `cart-${totalPrice}-${totalItems}-${cartItems
    .map((item) => `${item.id}x${item.quantity}`)
    .join("-")}`;

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

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-rose-200 bg-rose-50/60 p-8 text-center shadow-sm">
        {/* Centered Icon with a soft pill background */}
        <div className="mx-auto mb-4 flex h-15 w-15 items-center justify-center rounded-full text-rose-600">
          <AlertCircle className="h-15 w-15" />
        </div>

        <h2 className="text-lg font-bold text-gray-900">
          Unable to Proceed to Checkout
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {errorMessage}
        </p>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
          >
            Review Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    // Note: The embedded checkout uses its own background-color which is set in the stripe dashboard.
    // To ensure visual consistency, it is wrapped in a colored container and the color should match the embedded checkout's background.
    <div
      id="checkout"
      className="rounded-2xl border border-gray-100 bg-[#f5f3ff] p-6 shadow-sm"
    >
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
