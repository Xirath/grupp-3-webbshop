import type {
  Category,
  Product,
  ProductsResponse,
  CreateProductInput,
  UpdateProductInput,
} from "@/app/types";

const API_URL = "http://localhost:4000";
const DEFAULT_LIMIT = "12";

export interface ProductFilterParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}

export async function addProduct(
  payload: CreateProductInput,
): Promise<Product> {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to add product");
  return response.json() as Promise<Product>;
}

export async function getNextId() {
  try {
    const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : data.products || data.data || [];
      if (list.length > 0) {
        const ids = list
          .map((p: any) => parseInt(String(p.id), 10))
          .filter((id: number) => !isNaN(id));
        return ids.length > 0 ? Math.max(...ids) + 1 : 1;
      }
    }
  } catch (err) {
    console.error("Failed to fetch next ID:", err);
  }
  return 1;
}

export async function getProduct(productId: number): Promise<Product | null> {
  const response = await fetch(
    `${API_URL}/products/${productId}?_expand=category`,
    { cache: "no-store" },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Unable to load product ${productId}`);

  return (await response.json()) as Product;
}

export async function getProducts({
  page = 1,
  limit = Number(DEFAULT_LIMIT),
  categoryId,
  search,
}: ProductFilterParams = {}): Promise<ProductsResponse> {
  const query = new URLSearchParams({
    _page: String(page),
    _limit: String(limit),
    _sort: "id",
    _order: "desc",
    _expand: "category",
  });
  if (categoryId) query.set("categoryId", categoryId);
  if (search?.trim()) query.set("q", search.trim());
  const response = await fetch(`${API_URL}/products?${query.toString()}`, {
    next: { tags: ["products"], revalidate: 15 },
  });
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load categories");

  return (await response.json()) as Category[];
}

export interface ProductStockResponse {
  total: number;
  lowStock: number;
  outOfStock: number;
  inStock: number;
}

export async function getProductStock({}: ProductFilterParams = {}): Promise<ProductStockResponse> {
  const allProductsData = await fetch(`${API_URL}/products`, {
    next: { tags: ["products"], revalidate: 15 },
  }).then((res) => res.json() as Promise<{ products: Product[] }>);

  const allProducts = allProductsData.products ?? [];
  const summary = allProducts.reduce(
    (acc, item) => {
      const itemCount = item.stock ?? 0;
      if (itemCount > 10) acc.inStock++;
      else if (itemCount > 0) acc.lowStock++;
      else acc.outOfStock++;
      return acc;
    },
    { inStock: 0, lowStock: 0, outOfStock: 0, total: allProducts.length },
  );
  return summary;
}

export async function updateProduct(
  productId: number,
  payload: UpdateProductInput,
): Promise<Response> {
  return fetch(`${API_URL}/products/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateProductStock(
  productId: number,
  stock: number,
): Promise<Response> {
  return fetch(`${API_URL}/products/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stock }),
  });
}

export async function deleteProduct(productId: number): Promise<Response> {
  return fetch(`${API_URL}/products/${productId}`, {
    method: "DELETE",
  });
}
