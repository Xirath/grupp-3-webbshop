import Link from "next/link";
import type { Product } from "@/app/types";
import ProductGallery from "./ProductGallery";
import ProductInformation from "./ProductInformation";
import ProductMetadata from "./ProductMetadata";
import ProductReviews from "./ProductReviews";
import ProductSummary from "./ProductSummary";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const images = [
    ...new Set([product.thumbnail, ...(product.images ?? [])]),
  ].filter(
    (image): image is string =>
      typeof image === "string" && image.trim().length > 0,
  );

  return (
    <main className="min-h-screen bg-slate-100 p-3 sm:p-5 lg:p-8">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-2xl">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="hidden text-xs font-semibold uppercase tracking-wider text-violet-600 sm:inline">
                  Product Details
                </span>
                <span className="hidden text-slate-300 sm:inline">/</span>
                <span className="truncate text-xs text-slate-500">
                  {product.sku ? `SKU ${product.sku}` : "Inventory"}
                </span>
              </div>
              <h1 className="mt-1 truncate text-lg font-bold text-slate-950 sm:text-xl">
                {product.title}
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/product/edit/${product.id}`}
                className="min-h-10 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
              >
                Edit product
              </Link>
              <Link
                href="/"
                className="min-h-10 shrink-0 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
              >
                Back to products
              </Link>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <section
            aria-label="Product overview"
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
              <ProductGallery title={product.title} images={images} />
              <ProductSummary product={product} />
            </div>
          </section>

          <ProductInformation product={product} />

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader title="Description" />
            <div className="px-5 py-5 sm:px-6">
              {product.description ? (
                <p className="max-w-5xl whitespace-pre-line text-sm leading-7 text-slate-600">
                  {product.description}
                </p>
              ) : (
                <p className="text-sm italic text-slate-400">
                  No description available.
                </p>
              )}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Tags
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <li key={tag}>
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader title="Shipping & Returns" />
            <div className="grid divide-y divide-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <InfoBlock
                title="Shipping Information"
                value={product.shippingInformation}
              />
              <InfoBlock title="Return Policy" value={product.returnPolicy} />
            </div>
          </section>

          <ProductReviews product={product} />
          <ProductMetadata product={product} />
        </div>
      </div>
    </main>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
      <h2 className="text-base font-bold text-slate-950">{title}</h2>
    </div>
  );
}

function InfoBlock({ title, value }: { title: string; value?: string }) {
  return (
    <div className="p-5 sm:p-6">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p
        className={`mt-2 text-sm leading-6 ${
          value ? "text-slate-600" : "italic text-slate-400"
        }`}
      >
        {value || "No information available."}
      </p>
    </div>
  );
}
