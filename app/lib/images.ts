import sharp from "sharp";
import { rgbaToThumbHash } from "thumbhash";

export async function getThumbHashFromURL(imageURL: string): Promise<string> {
  const response = await fetch(imageURL);
  const arrayBuffer = await response.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  const image = sharp(inputBuffer).resize(100, 100, { fit: "inside" });
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const binaryHash = rgbaToThumbHash(info.width, info.height, data);

  return Buffer.from(binaryHash).toString("base64");
}
