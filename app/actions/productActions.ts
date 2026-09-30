"use server";

import { revalidatePath, updateTag } from "next/cache";
import { deleteProduct as deleteProductRequest } from "@/app/lib/api";
import { addProduct as addProductRequest } from "@/app/lib/api";

export async function addProduct(prevState: any, formData: FormData) {
  const result = await addProductRequest(prevState, formData);

  revalidatePath("/product/add");

  return result;
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
