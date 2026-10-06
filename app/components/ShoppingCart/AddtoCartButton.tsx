"use client";

import { Product } from "@/app/types";
import { useCart } from "./CartContent";
import { getStockStatus, normalizeStock } from "../productUtils";


interface addToCartButtonProps {
    product: Product;
}


export default function AddToCartButton({ product }: addToCartButtonProps) {
    const { addToCart } = useCart();

    const stock = normalizeStock(product.stock);

    return (
        <button
            type="button"
            onClick={() => addToCart(product)}
            disabled={stock <= 0}
            className="rounded-md bg-black px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Add ${product.title} to cart`}
        >
            🛒 Add to cart
        </button>);
}