"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  title: string;
  images: string[];
}

export default function ProductGallery({ title, images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] ?? "");

  const activeImage = images.includes(selectedImage)
    ? selectedImage
    : images[0] ?? "";

  return (
    <div className="border-b border-slate-200 p-4 sm:p-6 lg:border-b-0 lg:border-r lg:p-8">
      <div className="grid gap-4 sm:grid-cols-[76px_minmax(0,1fr)]">
        {images.length > 1 && (
          <div
            className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col"
            aria-label="Product images"
          >
            {images.map((image, index) => {
              const selected = activeImage === image;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={selected}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-50 transition sm:h-17 sm:w-17 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 ${
                    selected
                      ? "border-violet-600 shadow-sm"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <Image
                    src={image}
                    alt=""
                    width={68}
                    height={68}
                    loading="lazy"
                    className="h-full w-full object-contain p-2"
                  />
                </button>
              );
            })}
          </div>
        )}

        <div className="order-1 flex aspect-square min-h-70 items-center justify-center overflow-hidden rounded-2xl bg-slate-50 sm:order-2 lg:min-h-105">
          {activeImage ? (
            <Image
              src={activeImage}
              alt={title}
              width={700}
              height={700}
              priority
              className="h-full w-full object-contain p-8 sm:p-12"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl text-slate-300 shadow-sm">
                ?
              </div>
              <p className="text-sm font-medium text-slate-400">
                No image available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
