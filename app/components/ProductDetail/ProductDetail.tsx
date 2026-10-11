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
    <main className="min-h-screen bg-slate-100 px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold uppercase tracking-wider text-violet-600">
                  Product details
                </span>

                <span className="text-slate-300">/</span>

                <span className="text-slate-500">
                  {product.sku ? `SKU ${product.sku}` : "Product"}
                </span>
              </div>

              <h1 className="mt-2 text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">
                {product.title}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={`/product/edit/${product.id}?returnTo=/product/${product.id}`}
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
              >
                Edit product
              </Link>

              <Link
                href="/admin"
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
              >
                Back to products
              </Link>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          <section
            aria-label="Product overview"
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="grid gap-0 lg:grid-cols-2">
              <ProductGallery title={product.title} images={images} />

              <div className="border-t border-slate-200 lg:border-l lg:border-t-0">
                <ProductSummary product={product} />
              </div>
            </div>
          </section>

          <ProductInformation product={product} />

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
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
                        <span className="inline-flex rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700">
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader title="Shipping & Returns" />

            <div className="grid divide-y divide-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <InfoBlock
                title="Shipping Information"
                value={product.shippingInformation}
              />

              <InfoBlock
                title="Return Policy"
                value={product.returnPolicy}
              />
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

function InfoBlock({
  title,
  value,
}: {
  title: string;
  value?: string;
}) {
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