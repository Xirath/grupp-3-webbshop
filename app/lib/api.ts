import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

import type {
  Category,
  Product,
  ProductsResponse,
  CreateProductInput,
  UpdateProductInput,
} from "@/app/types";

const DEFAULT_LIMIT = "12";

export interface ProductFilterParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}

export interface ProductStockResponse {
  total: number;
  lowStock: number;
  outOfStock: number;
  inStock: number;
}

export async function getProduct(productId: number): Promise<Product | null> {
  const Product = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true, reviews: { orderBy: { date: "desc" } } },
  });
  return Product ? convertFromPrismaProduct(Product) : null;
}

export async function getProducts({
  page = 1,
  limit = Number(DEFAULT_LIMIT),
  categoryId,
  search,
}: ProductFilterParams = {}): Promise<ProductsResponse> {
  // Prisma has built-in support for pagination using skip and take.
  const PageNumber = Math.max(1, page);
  const take = Math.max(1, limit);
  const skip = (PageNumber - 1) * take;

  const where: Prisma.ProductWhereInput = {};

  if (categoryId) {
    where.categoryId = parseInt(categoryId, 10);
  }

  if (search?.trim()) {
    const searchString = search.trim();
    where.OR = [
      { title: { contains: searchString, mode: "insensitive" } },
      { tags: { has: searchString.toLowerCase() } },
      { brand: { contains: searchString, mode: "insensitive" } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      include: { category: true, reviews: { orderBy: { date: "desc" } } },
    }),
    prisma.product.count({ where }),
  ]);

  const pages = Math.ceil(total / take);

  return {
    products: products.map(convertFromPrismaProduct),
    total,
    limit: take,
    page: PageNumber,
    pages,
  };
}

export async function getCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  return categories;
}

export async function getProductStock(): Promise<ProductStockResponse> {
  const [inStock, lowStock, outOfStock, total] = await Promise.all([
    prisma.product.count({ where: { stock: { gt: 10 } } }),
    prisma.product.count({ where: { stock: { gt: 0, lte: 10 } } }),
    prisma.product.count({ where: { stock: { lte: 0 } } }),
    prisma.product.count(),
  ]);

  return { inStock, lowStock, outOfStock, total };
}

export async function addProduct(
  payload: CreateProductInput,
): Promise<Product> {
  const newProduct = await prisma.product.create({
    data: {
      title: payload.title,
      description: payload.description || "",
      categoryId: payload.categoryId,
      price: payload.price,
      discountPercentage: payload.discountPercentage ?? 0,
      rating: payload.rating ?? 0,
      stock: payload.stock ?? 0,
      tags: payload.tags ?? [],
      brand: payload.brand || "Generic",
      sku: payload.sku || `SKU-${Date.now()}`, // Should make better unique SKU generation in the future.
      weight: payload.weight ?? 0,
      width: payload.dimensions?.width ?? 0,
      height: payload.dimensions?.height ?? 0,
      depth: payload.dimensions?.depth ?? 0,
      warrantyInformation: payload.warrantyInformation,
      shippingInformation: payload.shippingInformation,
      availabilityStatus: payload.availabilityStatus,
      returnPolicy: payload.returnPolicy,
      minimumOrderQuantity: payload.minimumOrderQuantity ?? 1,
      barcode: payload.meta?.barcode,
      qrCode: payload.meta?.qrCode,
      images: payload.images ?? [],
      thumbnail: payload.thumbnail,
    },
    include: { category: true, reviews: true },
  });
  return convertFromPrismaProduct(newProduct);
}

// Using prisma aggregate to get the next available product ID.
export async function getNextId(): Promise<number> {
  const highest = await prisma.product.aggregate({
    _max: { id: true },
  });
  return (highest._max.id ?? 0) + 1;
}

export async function updateProduct(
  productId: number,
  payload: UpdateProductInput,
): Promise<{ ok: boolean }> {
  try {
    const { reviews: _reviews, dimensions, meta, ...rest } = payload;
    void _reviews;
    await prisma.product.update({
      where: { id: productId },
      data: {
        ...rest,
        ...(dimensions && {
          width: dimensions.width ?? 0,
          height: dimensions.height ?? 0,
          depth: dimensions.depth ?? 0,
        }),
        ...(meta && {
          barcode: meta?.barcode,
          qrCode: meta?.qrCode,
        }),
      },
    });
    return {
      ok: true,
    };
  } catch {
    return { ok: false };
  }
}

export async function updateProductStock(
  productId: number,
  stock: number,
): Promise<{ ok: boolean }> {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { stock },
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function deleteProduct(
  productId: number,
): Promise<{ ok: boolean }> {
  try {
    await prisma.product.delete({
      where: { id: productId },
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

type DbProduct = Prisma.ProductGetPayload<{
  include: { category?: true; reviews?: true };
}>;

// Since some fields are flattened in the Prisma product, we need to convert them back to the nested structure expected by the frontend.
function convertFromPrismaProduct(p: DbProduct): Product {
  return {
    id: p.id,
    title: p.title,
    description: p.description ?? "",
    categoryId: p.categoryId,
    category: p.category ?? undefined,
    price: p.price,
    discountPercentage: p.discountPercentage ?? 0,
    rating: p.rating ?? 0,
    stock: p.stock ?? 0,
    tags: p.tags,
    brand: p.brand ?? "Generic",
    sku: p.sku ?? undefined,
    weight: p.weight ?? undefined,
    warrantyInformation: p.warrantyInformation ?? undefined,
    shippingInformation: p.shippingInformation ?? undefined,
    availabilityStatus: p.availabilityStatus ?? undefined,
    returnPolicy: p.returnPolicy ?? undefined,
    minimumOrderQuantity: p.minimumOrderQuantity ?? 1,
    images: p.images,
    thumbnail: p.thumbnail,
    dimensions: {
      width: p.width ?? 0,
      height: p.height ?? 0,
      depth: p.depth ?? 0,
    },
    meta: {
      createdAt: p.createdAt
        ? p.createdAt.toISOString()
        : new Date().toISOString(),
      updatedAt: p.updatedAt
        ? p.updatedAt.toISOString()
        : new Date().toISOString(),
      barcode: p.barcode ?? undefined,
      qrCode: p.qrCode ?? undefined,
    },
    reviews: p.reviews
      ? p.reviews.map((r) => ({
          rating: r.rating,
          comment: r.comment ?? "",
          date: r.date ? r.date.toISOString() : new Date().toISOString(),
          reviewerName: r.reviewerName,
          reviewerEmail: r.reviewerEmail,
        }))
      : [],
  };
}
