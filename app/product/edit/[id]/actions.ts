"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateProduct } from "@/app/lib/api";
import { productSchema } from "@/app/lib/validation";

export interface ProductEditState {
  values: Record<string, string>;
  errors: Record<string, string[]>;
  formError?: string;
}

export async function updateProductAction(
  productId: number,
  previousState: ProductEditState,
  formData: FormData,
): Promise<ProductEditState> {
  if (!Number.isInteger(productId) || productId <= 0) {
    return {
      values: previousState.values,
      errors: {},
      formError: "The product could not be updated. Please try again.",
    };
  }

  const rawValues = Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [key, String(value)]),
  );
  const result = productSchema.safeParse(rawValues);

  if (!result.success) {
    return {
      values: { ...previousState.values, ...rawValues },
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const {
    title,
    brand,
    price,
    stock,
    sku,
    categoryId,
    warrantyInformation,
    description,
    tags,
    weight,
    rating,
    thumbnail,
  } = result.data;
  let response: Response;
  try {
    response = await updateProduct(productId, {
      title,
      brand,
      price,
      stock,
      sku,
      categoryId,
      warrantyInformation,
      description,
      ...(weight === undefined ? {} : { weight }),
      ...(rating === undefined ? {} : { rating }),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      thumbnail,
    });
  } catch {
    return {
      values: rawValues,
      errors: {},
      formError: "The product could not be updated. Please try again.",
    };
  }

  if (!response.ok) {
    return {
      values: rawValues,
      errors: {},
      formError: "The product could not be updated. Please try again.",
    };
  }

  revalidatePath("/");
  revalidatePath(`/product/${productId}`);
  revalidatePath(`/product/edit/${productId}`);
  redirect(`/product/${productId}`);
}
