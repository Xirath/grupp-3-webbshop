import {
  productSearchParamSchema as SearchParamSchema,
  buildProductSearchUrl,
} from "../lib/validation";
import Header from "../components/Header/Header";
import SummaryCards from "../components/Summary-card/SummaryCard";
import SearchBar from "../components/Searchbar/SearchBar";
import ProductTable from "../components/ProductTable";
import { getCategories, getProducts, getProductStock } from "../lib/api";
import { redirect } from "next/navigation";

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
  const [paginatedData, categories, summary] = await Promise.all([
    getProducts({ page: requestedPage, categoryId, search }),
    getCategories(),
    getProductStock(),
  ]);

  // Destructure the paginated data for easier access
  const { products, total, page, pages, limit } = paginatedData;

  // Redirect to the last page if the requested page exceeds the total number of pages
  if (pages > 0 && requestedPage > pages) {
    redirect(buildProductSearchUrl({ categoryId, search, page: pages }));
  }

  // Construct the current URL with query parameters
  const query = new URLSearchParams(
    params as Record<string, string>,
  ).toString();
  const currentURL = `/admin${query ? `?${query}` : ""}`;

  return (
    <main>
      <Header />
      <SummaryCards
        total={summary.total}
        inStock={summary.inStock}
        lowStock={summary.lowStock}
        outOfStock={summary.outOfStock}
      />
      <SearchBar categories={categories} />
      <div className="page-container">
        <ProductTable
          products={products}
          returnTo={currentURL}
          currentPage={page}
          totalPages={pages}
          totalItems={total}
          pageSize={limit}
        />
      </div>
    </main>
  );
}
