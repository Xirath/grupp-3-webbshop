import { Product } from "@/app/types";
import Image from "next/image";
import { getThumbHashFromURL } from "@/app/lib/images";
import { thumbHashToDataURL } from "thumbhash";

function calculateOriginalPrice(price?: number, discountPercentage?: number) {
  if (price === undefined || discountPercentage === undefined) return 0;
  return price / (1 - discountPercentage / 100) - price;
}

export default async function ProductCard({ product }: { product: Product }) {
  const hashString = await getThumbHashFromURL(product?.images[0] ?? "");
  const blurDataURL = thumbHashToDataURL(Buffer.from(hashString, "base64"));
  return (
    <div>
      <Image
        src={product?.images[0] ?? ""}
        alt={product?.title ?? "Unnamed Product"}
        width={200}
        height={200}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className="block object-cover"
      />
      <p>Discount: {product?.discountPercentage ?? ""}</p>
      <p>
        Savings: $
        {calculateOriginalPrice(
          product?.price,
          product?.discountPercentage,
        ).toFixed(0)}
      </p>
      <h1>{product?.title ?? "Unnamed Product"}</h1>
      <p>Price: ${product?.price ?? "N/A"}</p>
      <p>Category: {product?.category?.name ?? "Uncategorized"}</p>
    </div>
  );
}
