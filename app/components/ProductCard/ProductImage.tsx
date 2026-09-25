import Image from "next/image";
import { getThumbHashFromURL } from "@/app/lib/images";
import { thumbHashToDataURL } from "thumbhash";
export default async function ProductImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const hashString = await getThumbHashFromURL(src);
  const blurDataURL = thumbHashToDataURL(Buffer.from(hashString, "base64"));
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 250px"
      placeholder="blur"
      blurDataURL={blurDataURL}
      className="object-cover"
    />
  );
}
