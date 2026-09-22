"use client";

import type { Product } from "@/app/types";
import Link from "next/link";
import Image from "next/image";
import { deleteProduct } from "@/app/actions/productActions";
import { productTableColumns } from "./productTableColumns";
import { getStockStatus, normalizeStock } from "./productUtils";

interface ProductRowProps {
  product: Product;
}

const tdBase =
  "border-b border-[#e5e5e5] px-3.5 py-2.5 align-middle text-sm text-[#111111] max-md:px-2.5 max-md:py-3";

export default function ProductRow({ product }: ProductRowProps) {
  const stock = normalizeStock(product.stock);
  const stockStatus = getStockStatus(stock);
  // ...existing code...

  const stockClassName =
    stockStatus.status === "out-of-stock"
      ? "text-red-800"
      : stockStatus.status === "low-stock"
        ? "text-orange-700"
        : "text-green-800";


  return (
    <tr className="hover:bg-[#fafafa]">
      {/* Title */}
      <td
        className={`${tdBase} ${productTableColumns.title} whitespace-nowrap max-md:whitespace-normal`}
      >
        <Link
          href={`/product/${product.id}`}
          className="flex w-full items-center gap-3 text-left max-md:gap-2.5"
        >
          <Image
            src={product.thumbnail}
            alt=""
            width={44}
            height={44}
            className="h-10.5 w-10.5 shrink-0 rounded border border-[#e5e5e5] bg-white object-contain max-md:h-11 max-md:w-11"
          />

          <div className="flex min-w-0 flex-col gap-0.75">
            <span className="truncate font-bold text-[#111111] max-md:whitespace-normal max-md:leading-tight">
              {product.title}
            </span>

            <span className="text-xs text-[#2e2e2e]">
              SKU: {product.sku ?? "Not available"}
            </span>
          </div>
        </Link>
      </td>

      {/* Brand */}
      <td
        className={`${tdBase} ${productTableColumns.brand} whitespace-nowrap`}
      >
        {product.brand ?? "Generic"}
      </td>

      {/* Category */}
      <td
        className={`${tdBase} ${productTableColumns.category} whitespace-nowrap`}
      >
        {product.category?.name ?? "Uncategorized"}
      </td>


      {/* Stock */}
      <td
        className={`${tdBase} ${productTableColumns.stock} whitespace-nowrap`}
      >
        <span className={stockClassName}>
          {stockStatus.label}
        </span>{" "}
        <span className="text-black">({stock})</span>
      </td>

      {/* Price */}
      <td
        className={`${tdBase} ${productTableColumns.price} whitespace-nowrap font-semibold`}
      >
        ${Number(product.price ?? 0).toFixed(2)}
      </td>

      {/* Actions */}
      <td
        className={`${tdBase} ${productTableColumns.actions} whitespace-nowrap`}
      >
        <div className="flex items-center gap-3 max-md:justify-end max-md:gap-1">
          {/* Delete */}
          <form
            action={deleteProduct.bind(null, product.id)}
            onSubmit={(event) => {
              if (!window.confirm(`Delete ${product.title}?`)) {
                event.preventDefault();
              }
            }}
          >
            <button
              type="submit"
              className="grid h-7 w-7 cursor-pointer place-items-center border-0 bg-transparent text-[#111111] transition hover:text-red-600 max-md:h-6.5 max-md:w-6.5"
              aria-label={`Delete ${product.title}`}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5 max-md:h-4.5 max-md:w-4.5"
              >
                <path
                  d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>

          {/* Edit */}
          <Link
            href={`/product/edit/${product.id}`}
            className="grid h-7 w-7 cursor-pointer place-items-center border-0 bg-transparent text-[#111111] transition hover:text-violet-700 max-md:h-6.5 max-md:w-6.5"
            aria-label={`Edit ${product.title}`}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5 max-md:h-4.5 max-md:w-4.5"
            >
              <path
                d="m4 20 4.2-1 10.6-10.6a2 2 0 0 0-2.8-2.8L5.4 16.2 4 20Zm10.5-12.9 2.8 2.8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </td>
    </tr>
  );
}
