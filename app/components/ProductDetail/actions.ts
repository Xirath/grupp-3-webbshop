"use server";

import { revalidatePath } from "next/cache";
import { updateProductStock } from "@/app/lib/api";
import { stockSchema } from "@/app/lib/validation";

export interface StockEditState {
  error?: string;
  success?: boolean;
}

export async function updateStockAction(
  productId: number,
  _previousState: StockEditState,
  formData: FormData,
): Promise<StockEditState> {
  if (!Number.isInteger(productId) || productId <= 0) {
    return { error: "Stock could not be updated. Please try again." };
  }

  const result = stockSchema.safeParse({
    stock: String(formData.get("stock") ?? ""),
  });

  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ?? "Enter a valid stock quantity.",
    };
  }

  try {
    const response = await updateProductStock(productId, result.data.stock);
    if (!response.ok)
      return { error: "Stock could not be updated. Please try again." };
  } catch {
    return { error: "Stock could not be updated. Please try again." };
  }

  revalidatePath(`/product/${productId}`);
  revalidatePath("/");
  return { success: true };
}
