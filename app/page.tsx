import type { Category, Product, ProductsResponse } from "./types";
import Header from "./components/Header/Header";
import SummaryCards from "./components/Summary-card/SummaryCard";
import SearchBar from "./components/SearchBar";
import ProductTable from "./components/ProductTable";

const DEFAULT_LIMIT = "6";
const API_BASE_URL = "http://localhost:4000";

interface HomeProps {
  searchParams: Promise<{
    page?: string;
    categoryId?: string;
    stock?: string;
    search?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  // 1. Next.js 15 requirement: await searchParams
  const params = await searchParams;
  const currentPage = Number(params.page ?? 1);
  const categoryId = params.categoryId;
  const stock = params.stock;
  const search = params.search;

  // Build query filters
  const categoryFilter = categoryId ? `&categoryId=${categoryId}` : "";
  let stockFilter = "";

  if (stock === "in") stockFilter = "&stock_gte=11";
  if (stock === "low") stockFilter = "&stock_gte=1&stock_lte=10";
  if (stock === "out") stockFilter = "&stock=0";

  const searchFilter = search?.trim()
    ? `&q=${encodeURIComponent(search.trim())}`
    : "";

  const paginatedUrl = `${API_BASE_URL}/products?_page=${currentPage}&_limit=${DEFAULT_LIMIT}&_sort=id&_order=desc&_expand=category${categoryFilter}${stockFilter}${searchFilter}`;
  const allProductsUrl = `${API_BASE_URL}/products?_limit=1000`;
  const categoriesUrl = `${API_BASE_URL}/categories`;

  // 2. Parallel fetch with Next.js cache tags
  const [paginatedData, allProductsData, categoriesData] = await Promise.all([
    fetch(paginatedUrl, {
      next: { tags: ["products"], revalidate: 15 },
    }).then((res) => res.json() as Promise<ProductsResponse>),

    fetch(allProductsUrl, {
      next: { tags: ["products-summary"], revalidate: 15 },
    }).then((res) => res.json() as Promise<{ products: Product[] }>),

    fetch(categoriesUrl, {
      next: { tags: ["categories"], revalidate: 3600 },
    }).then((res) => res.json() as Promise<Category[]>),
  ]);

  const { products, total, page, pages, limit } = paginatedData;
  const allProducts = allProductsData.products ?? [];

  // Single-pass reduction for summary cards
  const summary = allProducts.reduce(
    (acc, item) => {
      const itemCount = item.stock ?? 0;
      if (itemCount > 10) acc.inStock++;
      else if (itemCount > 0) acc.lowStock++;
      else acc.outOfStock++;
      return acc;
    },
    { inStock: 0, lowStock: 0, outOfStock: 0 }
  );

  return (
    <main>
      <Header />
      <SummaryCards
        total={allProducts.length}
        inStock={summary.inStock}
        lowStock={summary.lowStock}
        outOfStock={summary.outOfStock}
      />
      <SearchBar categories={categoriesData} />
      <div className="page-container">
        <ProductTable
          products={products}
          currentPage={page}
          totalPages={pages}
          totalItems={total}
          pageSize={limit}
        />
      </div>
    </main>
  );
}