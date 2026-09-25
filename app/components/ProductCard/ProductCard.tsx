import { Product } from "@/app/types";
import { Suspense } from "react";
import { Star } from "lucide-react";
import ProductImage from "./ProductImage";
import DiscountTag from "./DiscountTag";
import { getDiscountedPrice, formatPrice } from "../productUtils";

function isDiscounted(product: Product): boolean {
  return product?.discountPercentage && product.discountPercentage > 0
    ? true
    : false;
}

export default async function ProductCard({ product }: { product: Product }) {
  const isDiscountedFlag = isDiscounted(product);

  return (
    <div className="relative flex flex-col gap-2 bg-gray-200 h-full rounded-lg">
      <div className="relative w-full aspect-square overflow-hidden rounded-t-lg bg-gray-100">
        <Suspense
          fallback={<div className="w-full h-full bg-gray-200 animate-pulse" />}
        >
          <ProductImage
            src={product?.images[0] ?? ""}
            alt={product?.title ?? "Unnamed Product"}
          />
        </Suspense>
      </div>
      <div className="flex flex-col flex-1 p-2">
        <DiscountTag
          className="absolute top-2 right-2"
          product={product}
          showPercentage={product.price <= 100}
        />
        <h2>{product?.title ?? "Unnamed Product"}</h2>
        <p className="text-sm text-gray-700">
          {" "}
          {product?.category?.name ?? "Uncategorized"}
        </p>

        <div className="flex items-end justify-between mt-auto pt-2">
          <div className="flex items-center gap-1 text-sm">
            {product.rating && product.rating > 0 ? (
              <>
                {product.rating}{" "}
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col items-end leading-none justify-end mt-auto">
            <p
              className={`text-sm/none text-zinc-400 text-right line-through font-bold ${!isDiscountedFlag ? "invisible select-none" : ""}`}
            >
              {formatPrice(product.price)}
            </p>
            <p
              className={`text-lg/none font-bold text-right mt-0.5 ${isDiscountedFlag ? "text-rose-500" : ""}`}
            >
              {formatPrice(
                getDiscountedPrice(product.price, product.discountPercentage),
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
