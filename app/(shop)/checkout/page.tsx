"use client";

import Link from "next/link";
import { useCart } from "@components/ShoppingCart/CartContent";
import CheckoutForm from "./CheckoutForm";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  Lock,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

export default function CheckoutPage() {
  const { cartItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="page-container flex min-h-[60vh] flex-col items-center justify-center py-12">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Your Cart is Empty
        </h1>
        <p className="mb-6 text-gray-500">
          You have no items in your shopping cart. Add some products before
          proceeding to checkout.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
        >
          Return to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto my-8 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-center gap-2 text-sm">
        <span className="w-14 text-gray-400">Cart</span>
        <ArrowRightIcon className="h-3.5 w-3.5 text-gray-300" />
        <span className="w-24 font-semibold text-violet-600">Checkout</span>
        <ArrowRightIcon className="h-3.5 w-3.5 text-gray-300" />
        <span className="w-28 text-gray-400">Confirmation</span>
      </div>

      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Return to cart
        </Link>
      </div>

      <CheckoutForm />
      <div className="mt-8 grid grid-cols-1 gap-4 border-t border-gray-200/60 pt-6 text-center sm:grid-cols-3">
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-500">
          <Lock className="h-4 w-4 text-emerald-600" />
          <span>256-bit SSL Encryption</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-500">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <span>Guaranteed Safe Checkout</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-500">
          <RotateCcw className="h-4 w-4 text-gray-600" />
          <span>30-Day Return Policy</span>
        </div>
      </div>
    </main>
  );
}
