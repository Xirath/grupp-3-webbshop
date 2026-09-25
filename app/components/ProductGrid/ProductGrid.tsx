import { Product } from "@/app/types";
import ProductCard from "../ProductCard/ProductCard";

interface ProductGridProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export default async function ProductGrid({
  products,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
}: ProductGridProps) {
  return (
    <div className="page-container">
      <div className="flex justify-between">
        <span>
          Showing {products.length} of {totalItems} products
        </span>
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 page-container">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
