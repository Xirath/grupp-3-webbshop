import { Product } from "@/app/types";
import { getSavings } from "@/app/components/productUtils";
import { formatCompactSavings } from "@/app/components/productUtils";

// Determines the appropriate font size for the discount text based on its length.
function getDynamicFontSize(text: string): string {
  const len = text.length;
  if (len <= 4) return "text-base";
  if (len === 5) return "text-[13px]";
  if (len === 6) return "text-[12px]";
  if (len === 7) return "text-[11px]";
  return "text-[8px]";
}

export default async function DiscountTag({
  product,
  className = "",
}: {
  className?: string;
  product: Product;
  showPercentage: boolean;
}) {
  if (!product.discountPercentage || product.discountPercentage <= 0) {
    return null;
  }

  // Show discount in percent if under 100, otherwise show whole savings
  const isUnder100 = (product.price ?? 0) <= 100;
  const discountText = isUnder100
    ? `${Math.round(product.discountPercentage)}%`
    : `-$${formatCompactSavings(getSavings(product.price, product.discountPercentage))}`;

  return (
    <div
      className={`absolute top-2.5 right-2.5 z-10 flex flex-col items-center justify-center w-15 h-15 rounded-full bg-rose-600 text-white font-extrabold shadow-lg border-2 border-white leading-tight ${className}`}
    >
      <span className={getDynamicFontSize(discountText)}>{discountText}</span>
    </div>
  );
}
