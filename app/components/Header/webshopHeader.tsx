"use client";

import { Cuboid, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../ShoppingCart/CartContent";
import ShoppingCart from "../ShoppingCart/ShoppingCart";

export default function WebshopHeader() {
  const { totalItems } = useCart();
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 border-b-2 border-gray-300/50 mb-3 mx-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-2xl"
        >
          <Cuboid size={48} />
          <p>BuyIT</p>
        </Link>
        <p className="text-m font-semibold text-gray-700">
          Welcome to our webshop! Explore our products and enjoy a seamless
          shopping experience.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/">
            <User size={32} />
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowCart(!showCart)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 font-semibold"
            >
              🛒 Cart ({totalItems})
            </button>
          </div>
        </div>
      </header>
      {showCart && <ShoppingCart />}
    </>
  );
}
