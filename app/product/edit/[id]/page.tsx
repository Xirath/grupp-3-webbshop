import { notFound } from "next/navigation";
import { getCategories, getProduct } from "@/app/lib/api";
import ProductEditForm from "./ProductEditForm";

interface ProductEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductEditPage({
  params,
}: ProductEditPageProps) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) notFound();

  const product = await getProduct(productId);
  if (!product) notFound();
  const categories = await getCategories();
  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
            Inventory
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">
            Edit product
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            #{product.id} · {product.title}
          </p>
        </div>
        <ProductEditForm product={product} categories={categories} />
      </div>
    </main>
  );
}
