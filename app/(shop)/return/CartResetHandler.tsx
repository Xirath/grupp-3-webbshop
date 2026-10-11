"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@components/ShoppingCart/CartContent";

export default function CartResetHandler({ sessionId }: { sessionId: string }) {
  const { clearCart } = useCart();
  const hasReset = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storageKey = sessionId
      ? `cleared_order_${sessionId}`
      : "order_cleared";
    const alreadyCleared = sessionStorage.getItem(storageKey);

    if (!hasReset.current && !alreadyCleared) {
      hasReset.current = true;
      clearCart();
      sessionStorage.setItem(storageKey, "true");
    }
  }, [clearCart, sessionId]);
  return null;
}
