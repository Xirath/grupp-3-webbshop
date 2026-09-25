import type { Category, Product, ProductsResponse } from "./types";
import ProductGrid from "./components/ProductGrid/ProductGrid";

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
  const search = params.search;

  // Build query filters
  const categoryFilter = categoryId ? `&categoryId=${categoryId}` : "";

  const searchFilter = search?.trim()
    ? `&q=${encodeURIComponent(search.trim())}`
    : "";

  const paginatedUrl = `${API_BASE_URL}/products?_page=${currentPage}&_limit=${DEFAULT_LIMIT}&_sort=id&_order=desc&_expand=category${categoryFilter}${searchFilter}`;
  const allProductsUrl = `${API_BASE_URL}/products?_limit=1000`;
  const categoriesUrl = `${API_BASE_URL}/categories`;

  // 2. Parallel fetch with Next.js cache tags
  const [paginatedData, categoriesData] = await Promise.all([
    fetch(paginatedUrl, {
      next: { tags: ["products"], revalidate: 15 },
    }).then((res) => res.json() as Promise<ProductsResponse>),

    fetch(categoriesUrl, {
      next: { tags: ["categories"], revalidate: 3600 },
    }).then((res) => res.json() as Promise<Category[]>),
  ]);

  const { products, total, page, pages, limit } = paginatedData;

  return (
    <main>
      <h1 className="text-2xl font-bold m-0 text-center">new webshop</h1>
      <ProductGrid
        products={products}
        currentPage={page}
        totalPages={pages}
        totalItems={total}
        pageSize={limit}
      />
    </main>
  );
}
