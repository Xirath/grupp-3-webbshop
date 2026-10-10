import { redirect } from "next/navigation";
import CartResetHandler from "./CartResetHandler";

import { stripe } from "@lib/stripe";
import { Stripe } from "stripe";
import Link from "next/link";
import { formatPrice } from "@components/productUtils";
import {
  ArrowRightIcon,
  CheckCircle2,
  Clock,
  TriangleAlert,
  XCircle,
} from "lucide-react";

export default async function ReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/");
  }

  const { status, customer_details, payment_intent, amount_total } =
    await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });
  const customerEmail = customer_details?.email;

  // Handle different payment statuses
  // Payment is still open and awaiting completion
  if (status === "open") {
    // The payment is still open, so we check for any specific errors first
    const paymentIntent = payment_intent as Stripe.PaymentIntent | null;
    const specificError = paymentIntent?.last_payment_error?.message;

    // Payment failed with a specific error message
    if (specificError) {
      return (
        <main className="page-container flex min-h-[60vh] flex-col items-center justify-center py-12">
          <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-rose-600">
              <XCircle className="h-13 w-13" />
            </div>
            <h2 className="text-xl font-bold text-rose-950">Payment Failed</h2>
            <p className="mt-2 text-sm leading-relaxed text-rose-800">
              {specificError}
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Return to Checkout
              </Link>
            </div>
          </div>
        </main>
      );
    }

    // Payment is still pending
    return (
      <main className="page-container flex min-h-[60vh] flex-col items-center justify-center py-12">
        <div className="w-full max-w-md rounded-2xl border border-amber-200 bg-amber-50/70 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-amber-600">
            <Clock className="h-13 w-13" />
          </div>
          <h2 className="text-xl font-bold text-amber-950">
            Payment Processing
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-amber-800">
            Your payment is currently being processed by your bank or provider.
          </p>
          <div className="mt-6">
            <Link
              href="/checkout"
              className="inline-flex items-center rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
            >
              Return to Checkout
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Payment has been successfully completed, show the success message & reset the cart
  if (status === "complete") {
    // Check if the amount_total is available before proceeding
    if (amount_total === null || amount_total === undefined) {
      // Should not proceed without a verified payment amount
      return (
        <main className="page-container flex min-h-[60vh] flex-col items-center justify-center py-12">
          <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-rose-600">
              <TriangleAlert className="h-13 w-13" />
            </div>
            <h2 className="text-xl font-bold text-rose-950">
              Unable to Verify Order Details
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-rose-800">
              We could not confirm the final payment amount with Stripe. If your
              card was charged, you will receive an email receipt shortly.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Return to Checkout
              </Link>
            </div>
          </div>
        </main>
      );
    }
    const amountPaid = formatPrice(amount_total / 100);
    return (
      <main className="mx-auto my-8 w-full max-w-xl px-4 sm:px-6 lg:px-8">
        <CartResetHandler sessionId={session_id} />

        <div className="mb-6 flex items-center justify-center gap-2 text-sm">
          <span className="w-14 text-gray-400">Cart</span>
          <ArrowRightIcon className="h-3.5 w-3.5 text-gray-300" />
          <span className="w-24 text-gray-400">Checkout</span>
          <ArrowRightIcon className="h-3.5 w-3.5 text-gray-300" />
          <span className="w-28 font-semibold text-violet-600">
            Confirmation
          </span>
        </div>

        <div className="w-full max-w-xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-emerald-600">
            <CheckCircle2 className="h-13 w-13" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Thank you for your order!
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Your payment was successful and your order is being processed.
          </p>
          <div className="mt-8 divide-y divide-gray-200/60 rounded-xl border border-gray-100 bg-gray-50/80 p-6 text-left">
            <div className="flex items-center justify-between pb-3 text-sm">
              <span className="text-gray-500">Order Number</span>
              <span className="font-mono font-semibold text-gray-800">
                #{session_id.slice(-8).toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-gray-500">Billing Email</span>
              <span className="font-medium text-gray-800">{customerEmail}</span>
            </div>
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-gray-500">Payment Status</span>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                Paid
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 text-base font-bold text-gray-900">
              <span>Amount Paid</span>
              <span className="text-violet-600">{amountPaid}</span>
            </div>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-gray-400">
            A confirmation email has been sent to{" "}
            <span className="font-medium text-gray-600">{customerEmail}</span>.
            Questions? Contact us at{" "}
            <a
              href="mailto:orders@example.com"
              className="text-violet-600 underline hover:text-violet-700"
            >
              orders@example.com
            </a>
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-xl bg-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 sm:w-auto"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Session for payment has expired
  if (status === "expired") {
    return (
      <main className="page-container flex min-h-[60vh] flex-col items-center justify-center py-12">
        <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-rose-50/60 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-rose-600">
            <TriangleAlert className="h-13 w-13" />
          </div>
          <h2 className="text-xl font-bold text-rose-950">Session Expired</h2>
          <p className="mt-2 text-sm text-rose-800">
            Your payment session has timed out. Please review your cart and try
            again.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Return to Shop
            </Link>
          </div>
        </div>
      </main>
    );
  }
}
