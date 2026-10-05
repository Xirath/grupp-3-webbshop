import type { Product } from "@/app/types";

import {
  getDiscountedPrice,
  getDiscountPercentage,
  getStockStatus,
  normalizeStock,
  formatPrice,
  type StockStatus,
} from "@/app/components/productUtils";
import AddToCartButton from "../../ShoppingCart/AddtoCartButton";



export default function WebshopProductSummary({ product }: { product: Product }) {
  const stock = normalizeStock(product.stock);
  const stockStatus = getStockStatus(stock);
  const discountPercentage = getDiscountPercentage(product.discountPercentage);
  const discountedPrice = getDiscountedPrice(product.price, discountPercentage);
  const hasDiscount = discountPercentage > 0;

  return (
    <div className="flex flex-col p-5 sm:p-7 lg:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <StockBadge status={stockStatus.status} label={stockStatus.label} />
        {product.category?.name && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {product.category.name}
          </span>
        )}
      </div>

      {product.brand && (
        <p className="mt-2 text-sm text-slate-500">
          Brand{" "}
          <span className="font-semibold text-slate-700">{product.brand}</span>
        </p>
      )}

      <div className="mt-7">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Current Price
        </p>
        <div className="mt-1 flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-bold tracking-tight text-slate-950">
            {formatPrice(discountedPrice)}
          </span>
          {hasDiscount && (
            <span className="text-base text-slate-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        {hasDiscount && (
          <p className="mt-1 text-sm font-semibold text-emerald-600">
            {discountPercentage.toFixed(0)}% discount
          </p>
        )}
      </div>

      

      {product.rating !== undefined && (
        <div className="mt-6 flex items-center justify-between border-b border-slate-200 pb-5">
          <span className="text-sm font-medium text-slate-500">
            Customer rating
          </span>
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="text-lg text-amber-500">
              ★
            </span>
            <span className="font-semibold text-slate-900">
              {product.rating.toFixed(1)}
            </span>
            {product.reviews && product.reviews.length > 0 && (
              <span className="text-sm text-slate-500">
                ({product.reviews.length})
              </span>
            )}
          </div>
        </div>
      )}

      <div className="mt-5 space-y-3">
        <QuickInfo label="Category" value={product.category?.name} />
        <QuickInfo label="SKU" value={product.sku} />
        <QuickInfo
          label="Availability"
          value={product.availabilityStatus || stockStatus.label}
        />
      </div>
      <div className="mt-6">
        <AddToCartButton product={product} />
      </div>
    </div>



  );
}

function StockBadge({ status, label }: { status: StockStatus; label: string }) {
  const styles = {
    "in-stock": "bg-emerald-50 text-emerald-700",
    "low-stock": "bg-amber-50 text-amber-700",
    "out-of-stock": "bg-red-50 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${
          status === "in-stock"
            ? "bg-emerald-600"
            : status === "low-stock"
            ? "bg-amber-500"
            : "bg-red-600"
        }`}
      />
      {label}
    </span>
  );
}



function QuickInfo({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="max-w-[60%] break-word text-right text-sm font-medium text-slate-800">
        {value}
      </span>
    </div>
  );
}
