export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export function getStockStatus(stock: number): {
  status: StockStatus;
  label: string;
} {
  if (stock === 0) {
    return {
      status: "out-of-stock",
      label: "Out of Stock",
    };
  }

  if (stock <= 10) {
    return {
      status: "low-stock",
      label: "Low Stock",
    };
  }

  return {
    status: "in-stock",
    label: "In Stock",
  };
}

export function normalizeStock(stock?: number): number {
  if (typeof stock !== "number" || !Number.isFinite(stock)) {
    return 0;
  }

  return Math.max(0, Math.floor(stock));
}

export function getDiscountPercentage(discountPercentage?: number): number {
  if (
    typeof discountPercentage !== "number" ||
    !Number.isFinite(discountPercentage)
  ) {
    return 0;
  }

  return Math.min(Math.max(discountPercentage, 0), 100);
}

export function getDiscountedPrice(
  price: number,
  discountPercentage = 0,
): number {
  const safePrice = Number.isFinite(price) ? Math.max(0, price) : 0;

  const discount = getDiscountPercentage(discountPercentage);

  return Math.max(0, safePrice - (safePrice * discount) / 100);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}
