import type { Category, Product } from "@/app/types";

const API_URL = "http://localhost:4000";

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
