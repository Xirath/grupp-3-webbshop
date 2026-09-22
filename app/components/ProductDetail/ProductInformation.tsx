import type { Product } from "@/app/types";
import {
  getDiscountPercentage,
  getStockStatus,
  normalizeStock,
  formatPrice,
} from "../productUtils";

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
      <h2 className="text-base font-bold text-slate-950">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="break-word text-sm font-medium text-slate-900 sm:max-w-[65%] sm:text-right">
        {value}
      </dd>
    </div>
  );
}

export default function ProductInformation({ product }: { product: Product }) {
  const stock = normalizeStock(product.stock);
  const stockStatus = getStockStatus(stock);
  const discountPercentage = getDiscountPercentage(product.discountPercentage);

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionHeader
          title="Product Information"
          description="Core product and catalog information."
        />
        <dl className="divide-y divide-slate-100 px-5 sm:px-6">
          <DetailRow label="Product ID" value={product.id} />
          <DetailRow label="Brand" value={product.brand} />
          <DetailRow label="Category" value={product.category?.name} />
          <DetailRow label="Category ID" value={product.categoryId} />
          <DetailRow label="SKU" value={product.sku} />
          <DetailRow label="Price" value={formatPrice(product.price)} />
          {product.discountPercentage !== undefined && (
            <DetailRow label="Discount" value={`${discountPercentage}%`} />
          )}
          <DetailRow
            label="Weight"
            value={
              product.weight !== undefined ? `${product.weight} g` : undefined
            }
          />
        </dl>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionHeader
          title="Dimensions & Inventory"
          description="Physical specifications and stock information."
        />
        <dl className="divide-y divide-slate-100 px-5 sm:px-6">
          <DetailRow label="Stock" value={stock} />
          <DetailRow label="Stock status" value={stockStatus.label} />
          <DetailRow
            label="Width"
            value={
              product.dimensions ? `${product.dimensions.width} cm` : undefined
            }
          />
          <DetailRow
            label="Height"
            value={
              product.dimensions ? `${product.dimensions.height} cm` : undefined
            }
          />
          <DetailRow
            label="Depth"
            value={
              product.dimensions ? `${product.dimensions.depth} cm` : undefined
            }
          />
          <DetailRow
            label="Minimum order"
            value={product.minimumOrderQuantity}
          />
          <DetailRow label="Warranty" value={product.warrantyInformation} />
        </dl>
      </section>
    </div>
  );
}
