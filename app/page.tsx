import ProductGrid from "./components/ProductGrid/ProductGrid";
import WebshopHeader from "./components/Header/webshopHeader";
import { AdaptivePagination } from "./components/Pagination/AdaptivePagination";
import { redirect } from "next/navigation";
import {
  buildProductSearchUrl,
  productSearchParamSchema as SearchParamSchema,
} from "./lib/validation";
import { getCategories, getProducts } from "./lib/api";

interface HomeProps {
  searchParams: Promise<{
    page?: string;
    categoryId?: string;
    stock?: string; 
    search?: string; 
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  // Validate and parse search parameters using Zod schema
  const {
    page: requestedPage,
    categoryId,
    search,
  } = SearchParamSchema.parse(params);

  // Check if the current URL parameters are "dirty" (i.e., differ from the parsed values)
  const isPageDirty =
    params.page !== undefined && params.page !== String(requestedPage);
  const isCategoryDirty =
    params.categoryId !== undefined && params.categoryId !== categoryId;

  if (isPageDirty || isCategoryDirty) {
    redirect(
      buildProductSearchUrl({ categoryId, search, page: requestedPage }),
    );
  }

  // Fetch paginated products and categories in parallel
  const [paginatedData, categories] = await Promise.all([
    getProducts({ page: requestedPage, categoryId, search }),
    getCategories(),
  ]);

  // Destructure the paginated data for easier access
  const { products, total, page, pages, limit } = paginatedData;

  // Redirect to the last page if the requested page exceeds the total number of pages
  if (pages > 0 && requestedPage > pages) {
    redirect(buildProductSearchUrl({ categoryId, search, page: pages }));
  }

  return (
    <main className="flex-1 flex flex-col justify-between max-w-7xl mx-auto mb-4 w-full">
      <WebshopHeader />
      <ProductGrid
        products={products}
        currentPage={page}
        totalPages={pages}
        totalItems={total}
        pageSize={limit}
      />
      <div className="mt-auto mb-12">
        <AdaptivePagination
          currentPage={page}
          totalPages={pages}
          totalItems={total}
          pageSize={limit}
        />
      </div>
    </main>
  );
}
