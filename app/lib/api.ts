import type { Category, Product, ProductsResponse } from "@/app/types";

const API_URL = "http://localhost:4000";
const DEFAULT_LIMIT = "12";

export interface ProductFilterParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
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

export async function getProduct(productId: number): Promise<Product | null> {
  const response = await fetch(
    `${API_URL}/products/${productId}?_expand=category`,
    { cache: "no-store" },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Unable to load product ${productId}`);

  return (await response.json()) as Product;
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) throw new Error("Unable to load categories");

  return (await response.json()) as Category[];
}

export interface UpdateProductPayload {
  title: string;
  brand: string;
  price: number;
  stock: number;
  sku: string;
  categoryId: number;
  warrantyInformation: string;
  tags: string[];
  thumbnail: string;
  description: string;
  weight?: number;
  rating?: number;
}

export async function updateProduct(
  productId: number,
  payload: UpdateProductPayload,
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
