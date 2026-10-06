"use client";

import { useEffect, useRef } from "react";
import { useCart } from "../components/ShoppingCart/CartContent";

export default function CartResetHandler() {
  const { clearCart } = useCart();
  const hasReset = useRef(false);
  useEffect(() => {
    if (!hasReset.current) {
      hasReset.current = true;
      clearCart();
    }
  }, [clearCart]);
  return null;
}
