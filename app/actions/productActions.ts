"use server";

import { revalidatePath } from "next/cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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
      warrantyInformation: (formData.get("warrantyInfo") as string) || "1 week warranty",
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

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    const createdProduct = await response.json();

    // Cache clear/refresh karne ke liye taake new ID update ho jaye
    revalidatePath("/product/add");

    return { success: true, createdId: createdProduct.id, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || "Something went wrong" };
  }
}

export async function deleteProduct(productId: number) {
  if (!Number.isInteger(productId) || productId <= 0) {
    throw new Error("Invalid product ID");
  }

  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Unable to delete product ${productId}`);
  }

  revalidatePath("/");
}