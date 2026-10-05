"use server";

import { revalidatePath, updateTag } from "next/cache";
import { deleteProduct as deleteProductRequest } from "@/app/lib/api";
import { addProduct as addProductRequest } from "@/app/lib/api";

export interface ProductFormState {
  success: boolean;
  createdId?: number;
  error?: string | null;
}

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export async function addProduct(
  prevState: ProductFormState | null,
  formData: FormData,
) {
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

    const newProduct = await addProductRequest(payload);
    return { success: true, createdId: newProduct.id, error: null };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Something went wrong";
    return { success: false, error: errorMessage };
  } finally {
    revalidatePath("/product/add");
    updateTag("products");
  }
}

export async function deleteProduct(productId: number) {
  if (!Number.isInteger(productId) || productId <= 0) {
    throw new Error("Invalid product ID");
  }

  const response = await deleteProductRequest(productId);

  if (!response.ok) {
    throw new Error(`Unable to delete product ${productId}`);
  }

  updateTag("products");
}
