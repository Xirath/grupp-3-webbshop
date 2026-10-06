"use client";

import { useCart } from "./CartContent";
import { formatPrice } from "../productUtils";
import Link from "next/link";

export default function ShoppingCart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">🛒 Shopping Cart ({totalItems})</h2>

        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-red-600 hover:underline"
          >
            Clear cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{item.title}</p>

                <p className="text-sm text-gray-500">
                  {formatPrice(item.price)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => decreaseQuantity(item.id)}
                  className="h-8 w-8 rounded border border-gray-300"
                >
                  −
                </button>

                <span className="min-w-6 text-center">{item.quantity}</span>

                <button
                  type="button"
                  onClick={() => increaseQuantity(item.id)}
                  disabled={item.quantity >= (item.stock ?? Infinity)}
                  className="h-8 w-8 rounded border border-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeFromCart(item.id)}
                className="text-sm font-medium text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex justify-between pt-2 text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <Link
            href="/checkout"
            className="text-sm text-blue-600 hover:underline"
          >
            Proceed to Checkout
          </Link>
        </div>
      )}
    </section>
  );
}
