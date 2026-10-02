import type { Product } from "@/app/types";
import StockEditor from "./StockEditor";
import {
  formatPrice,
  getDiscountedPrice,
  getDiscountPercentage,
  getStockStatus,
  normalizeStock,
  type StockStatus,
} from "../productUtils";

function getStockStatusTextClass(status: StockStatus): string {
  const classes: Record<StockStatus, string> = {
    "in-stock": "text-emerald-600",
    "low-stock": "text-amber-600",
    "out-of-stock": "text-red-600",
  };

  return classes[status];
}

export default function ProductSummary({ product }: { product: Product }) {
  const stock = normalizeStock(product.stock);
  const stockStatus = getStockStatus(stock);
  const discountPercentage = getDiscountPercentage(product.discountPercentage);
  const discountedPrice = getDiscountedPrice(
    product.price,
    discountPercentage,
  );
  const hasDiscount = discountPercentage > 0;

  return (
    <div className="flex h-full flex-col p-5 sm:p-7 lg:p-8">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <StockBadge
            status={stockStatus.status}
            label={stockStatus.label}
          />

          {product.category?.name && (
            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
              {product.category.name}
            </span>
          )}
        </div>

        {product.brand && (
          <p className="mt-4 text-sm text-slate-500">
            Brand{" "}
            <span className="font-semibold text-slate-800">
              {product.brand}
            </span>
          </p>
        )}
      </div>

      <section className="mt-7" aria-label="Price">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Current price
        </p>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {formatPrice(discountedPrice)}
          </span>

          {hasDiscount && (
            <span className="text-base font-medium text-slate-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {hasDiscount && (
          <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Save {discountPercentage.toFixed(0)}%
          </span>
        )}
      </section>

      <section
        aria-label="Stock information"
        className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Current stock
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-950">
              {stock}
            </p>
          </div>

          <StockIcon status={stockStatus.status} />
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className={`text-sm font-semibold ${getStockStatusTextClass(
                stockStatus.status,
              )}`}
            >
              {stockStatus.label}
            </p>

            {product.minimumOrderQuantity !== undefined && (
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Minimum order quantity: {product.minimumOrderQuantity}
              </p>
            )}
          </div>

          <StockEditor
            productId={product.id}
            productTitle={product.title}
            stock={stock}
          />
        </div>
      </section>

      {product.rating !== undefined && (
        <section
          aria-label="Customer rating"
          className="mt-6 flex items-center justify-between border-b border-slate-200 pb-5"
        >
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
        </section>
      )}

      <div className="mt-5 space-y-3">
        <QuickInfo label="Category" value={product.category?.name} />
        <QuickInfo label="SKU" value={product.sku} />
        <QuickInfo
          label="Availability"
          value={product.availabilityStatus || stockStatus.label}
        />
      </div>
    </div>
  );
}

function StockBadge({
  status,
  label,
}: {
  status: StockStatus;
  label: string;
}) {
  const styles: Record<StockStatus, string> = {
    "in-stock": "bg-emerald-50 text-emerald-700",
    "low-stock": "bg-amber-50 text-amber-700",
    "out-of-stock": "bg-red-50 text-red-700",
  };

  const dotStyles: Record<StockStatus, string> = {
    "in-stock": "bg-emerald-600",
    "low-stock": "bg-amber-500",
    "out-of-stock": "bg-red-600",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${dotStyles[status]}`}
      />

      {label}
    </span>
  );
}

function StockIcon({ status }: { status: StockStatus }) {
  const styles: Record<StockStatus, string> = {
    "in-stock":
      "border-emerald-200 bg-emerald-50 text-emerald-600",
    "low-stock":
      "border-amber-200 bg-amber-50 text-amber-600",
    "out-of-stock":
      "border-red-200 bg-red-50 text-red-600",
  };

  const icon =
    status === "in-stock"
      ? "✓"
      : status === "low-stock"
        ? "!"
        : "×";

  return (
    <div
      aria-hidden="true"
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-lg font-bold ${styles[status]}`}
    >
      {icon}
    </div>
  );
}

function QuickInfo({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="max-w-[65%] break-words text-right text-sm font-medium text-slate-800">
        {value}
      </span>
    </div>
  );
}