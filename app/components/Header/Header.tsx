"use client";

import { useState } from "react";
import Button from "./button";
import { useCart } from "../ShoppingCart/CartContent";
import ShoppingCart from "../ShoppingCart/ShoppingCart";

export default function Header() {
  const { totalItems } = useCart();
  const [showCart, setShowCart] = useState(false);

  return (
    <main className="bg-white shadow-md">
      <div className="page-container">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col justify-center">
            <h1 className="md:text-3xl text-2xl font-bold text-gray-900">
              Inventory Management
            </h1>

            <p className="py-4 text-gray-600 wrap-break">
              Manage and track your global product catalogue across all
              categories.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowCart(!showCart)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 font-semibold"
            >
              🛒 Cart ({totalItems})
            </button>

            <Button />
          </div>
        </header>

        {showCart && <ShoppingCart />}
      </div>
    </main>
  );
}