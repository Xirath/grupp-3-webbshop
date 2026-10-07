import { redirect } from "next/navigation";
import CartResetHandler from "./CartResetHandler";

import { stripe } from "@lib/stripe";
import { Stripe } from "stripe";
import Link from "next/link";
import { formatPrice } from "@components/productUtils";

export default async function ReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/");
    //throw new Error("Please provide a valid session_id (`cs_test_...`)");
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
      return <p>{specificError}</p>;
    }

    // Payment is still pending
    return (
      <main>
        <h2>Payment Pending</h2>
        <p>Your payment is still pending.</p>
        <Link href="/checkout">
          Return to checkout to finalize your payment
        </Link>
      </main>
    );
  }

  // Payment has been successfully completed, show the success message & reset the cart
  if (status === "complete") {
    // Check if the amount_total is available before proceeding
    if (amount_total === null || amount_total === undefined) {
      // Should not proceed without a verified payment amount
      return (
        <main>
          <h1>Unable to Verify Order Details</h1>
          <p className="mt-2 text-sm text-gray-600">
            We could not confirm the final payment amount with Stripe. If your
            card was charged, you will receive an email receipt shortly.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Return to Shop
            </Link>
          </div>
        </main>
      );
    }
    const amountPaid = formatPrice(amount_total / 100);
    return (
      <>
        <CartResetHandler />
        <section id="success">
          <h2>Thank you for your purchase!</h2>
          <p>
            Your payment of <strong>{amountPaid}</strong> was successful.
          </p>
          <div>
            <span>Order Number: </span>
            <span>#{session_id.slice(-8).toUpperCase()}</span>
          </div>
          <div>
            <span>Billing Email: </span>
            <span>{customerEmail}</span>
          </div>
          <div>
            <span>Payment Status: </span>
            <span>Paid</span>
          </div>
          <p>
            We appreciate your business! A confirmation email will be sent to{" "}
            {customerEmail}. If you have any questions, please email{" "}
            orders@example.com with your order number (e.g., #ORD-$
            {session_id.slice(-8).toUpperCase()}).
          </p>
          <a href="mailto:orders@example.com">orders@example.com</a>.
          <Link href="/">Continue Shopping</Link>
        </section>
      </>
    );
  }

  // Session for payment has expired
  if (status === "expired") {
    return (
      <main>
        <h2>Session Expired</h2>
        <p>Your payment has expired.</p>
        <Link href="/">Return to shop</Link>
      </main>
    );
  }
}
