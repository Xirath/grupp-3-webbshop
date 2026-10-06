import { notFound } from "next/navigation";
import { getProduct } from "@/app/lib/api";
import WebShopProductDetail from "@/app/components/ProductDetail/WebShopProductDetail/WebShopProductDetail";
import WebshopHeader from "@/app/components/Header/webshopHeader";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    notFound();
  }

  const product = await getProduct(productId);
  if (!product) notFound();

  return (
    <div className="page-container">
       <WebshopHeader />
      <WebShopProductDetail product={product} />
    </div>
  )
}