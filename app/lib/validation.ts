import { z } from "zod";

const requiredNumber = (message: string) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === ""
        ? undefined
        : Number(value),
    z.number({ error: message }).finite("Must be a valid number."),
  );

const optionalNumber = (schema: z.ZodNumber) =>
  z.preprocess(
    (value) => (value === "" ? undefined : Number(value)),
    schema.optional(),
  );

export const productSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  brand: z.string().trim().max(100),
  price: requiredNumber("Price is required.").pipe(
    z.number().min(0, "Price must be zero or greater."),
  ),
  stock: requiredNumber("Stock is required.").pipe(
    z.number().int().min(0, "Stock must be a whole number of zero or greater."),
  ),
  weight: optionalNumber(z.number().min(0)),
  rating: optionalNumber(z.number().min(0).max(5)),
  sku: z.string().trim().max(100),
  categoryId: requiredNumber("Category is required.").pipe(
    z.number().int().positive(),
  ),
  warrantyInformation: z.string().trim().max(200),
  tags: z.string().max(500),
  thumbnail: z.string().trim().url("Enter a valid image URL."),
  description: z.string().trim().max(5000),
});

export const stockSchema = z.object({
  stock: requiredNumber("Stock is required.").pipe(
    z.number().int().min(0, "Stock quantity must be zero or greater."),
  ),
});

// Validation schema for product search parameters
export const productSearchParamSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  categoryId: z.string().trim().optional(),
  stock: z.string().optional(),
  search: z.string().trim().max(100).optional(),
});

// Utility function to build a product search URL with optional query parameters
export function buildProductSearchUrl(params: {
  categoryId?: string;
  search?: string;
  page?: number;
}): string {
  const query = new URLSearchParams();

  if (params.categoryId) query.set("categoryId", params.categoryId);
  if (params.search) query.set("search", params.search);
  if (params.page && params.page > 1) query.set("page", String(params.page));

  const qs = query.toString();
  return qs ? `/?${qs}` : "/";
}
