import Link from "next/link";
import { Suspense } from "react";
import { Star } from "lucide-react";

import type { Product } from "@/app/types";
import ProductImage from "./ProductImage";
import DiscountTag from "./DiscountTag";
import { formatPrice, getDiscountedPrice } from "../productUtils";

function isDiscounted(product: Product): boolean {
  return Boolean(
    product.discountPercentage && product.discountPercentage > 0,
  );
}

export default async function ProductCard({
  product,
}: {
  product: Product;
}) {
  const isDiscountedFlag = isDiscounted(product);

  return (
    <Link
      href={`/product/${product.id}`}
      className="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
    >
      <article className="relative flex h-full flex-col gap-2 rounded-lg bg-gray-200 transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="relative aspect-square w-full overflow-hidden rounded-t-lg bg-gray-100">
          <Suspense
            fallback={
              <div className="h-full w-full animate-pulse bg-gray-200" />
            }
          >
            <ProductImage
              src={product.images?.[0] ?? product.thumbnail ?? ""}
              alt={product.title ?? "Unnamed Product"}
            />
          </Suspense>
        </div>

        <DiscountTag
          className="absolute right-2 top-2"
          product={product}
          showPercentage={product.price <= 100}
        />

        <div className="flex flex-1 flex-col p-2">
          <h2 className="h-10 line-clamp-2 text-sm font-semibold">
            {product.title ?? "Unnamed Product"}
          </h2>

          <p className="text-sm text-gray-700">
            {product.category?.name ?? "Uncategorized"}
          </p>

          <div className="mt-auto flex items-end justify-between pt-2">
            <div className="flex items-center gap-1 text-sm">
              {product.rating && product.rating > 0 ? (
                <>
                  <span>{product.rating}</span>
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                </>
              ) : null}
            </div>

            <div className="mt-auto flex flex-col items-end justify-end leading-none">
              <p
                className={`text-right text-sm/none font-bold text-zinc-400 line-through ${
                  !isDiscountedFlag ? "invisible select-none" : ""
                }`}
              >
                {formatPrice(product.price)}
              </p>

              <p
                className={`mt-0.5 text-right text-lg/none font-bold ${
                  isDiscountedFlag ? "text-rose-500" : ""
                }`}
              >
                {formatPrice(
                  getDiscountedPrice(
                    product.price,
                    product.discountPercentage,
                  ),
                )}
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}