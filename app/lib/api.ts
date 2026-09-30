import type { Category, Product, ProductsResponse } from "@/app/types";

const API_URL = "http://localhost:4000";
const DEFAULT_LIMIT = "12";

export interface ProductFilterParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
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

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export async function addProduct(prevState: any, formData: FormData) {
  try {
    const title = (formData.get("title") as string)?.trim();
    if (!title) {
      return { success: false, error: "Please enter a product title" };
    }

    const tagsRaw = (formData.get("tags") as string) || "";
    const parsedTags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const rawUrl = ((formData.get("imageUrl") as string) || "").trim();
    const defaultImage = "https://picsum.photos/seed/picsum/200/300";
    const validImageUrl = isValidUrl(rawUrl) ? rawUrl : defaultImage;

    const stock = parseInt(formData.get("stock") as string, 10) || 0;

    const payload = {
      title,
      brand: (formData.get("brand") as string)?.trim() || "Generic",
      price: parseFloat(formData.get("price") as string) || 0,
      stock,
      weight: parseFloat(formData.get("weight") as string) || 0,
      sku: (formData.get("sku") as string)?.trim() || `SKU-${Date.now()}`,
      rating: parseFloat(formData.get("rating") as string) || 0,
      tags: parsedTags.length > 0 ? parsedTags : ["beauty"],
      warrantyInformation:
        (formData.get("warrantyInfo") as string) || "1 week warranty",
      categoryId: parseInt(formData.get("categoryId") as string, 10) || 1,
      description: "New product description",
      discountPercentage: 0,
      dimensions: { width: 0, height: 0, depth: 0 },
      shippingInformation: "Ships in 3-5 business days",
      availabilityStatus: stock > 0 ? "In Stock" : "Out of Stock",
      reviews: [],
      returnPolicy: "No return policy",
      minimumOrderQuantity: 1,
      meta: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        barcode: String(Math.floor(Math.random() * 10000000000000)),
        qrCode: "https://cdn.dummyjson.com/public/qr-code.png",
      },
      images: [validImageUrl],
      thumbnail: validImageUrl,
    };

    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    const createdProduct = await response.json();

    return { success: true, createdId: createdProduct.id, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || "Something went wrong" };
  }
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

export async function deleteProduct(productId: number): Promise<Response> {
  return fetch(`${API_URL}/products/${productId}`, {
    method: "DELETE",
  });
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
  const response = await fetch(`${API_URL}/categories`, { cache: "no-store" });
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
