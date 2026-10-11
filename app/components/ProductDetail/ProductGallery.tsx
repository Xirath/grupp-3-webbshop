"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  title: string;
  images: string[];
}

export default function ProductGallery({
  title,
  images,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] ?? "");

  const activeImage = images.includes(selectedImage)
    ? selectedImage
    : images[0] ?? "";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid gap-4 sm:grid-cols-[72px_minmax(0,1fr)]">
        {images.length > 1 && (
          <div
            className="order-2 flex gap-3 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:overflow-visible sm:pb-0"
            aria-label="Product images"
          >
            {images.map((image, index) => {
              const isSelected = activeImage === image;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={isSelected}
                  className={`h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl border-2 bg-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 ${
                    isSelected
                      ? "border-violet-600 shadow-sm"
                      : "border-slate-200 hover:border-violet-300"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${title} thumbnail ${index + 1}`}
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

        <div
          className={`order-1 flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl bg-slate-50 sm:order-2 sm:min-h-[420px] ${
            images.length <= 1 ? "sm:col-span-2" : ""
          }`}
        >
          {activeImage ? (
            <Image
              src={activeImage}
              alt={title}
              width={700}
              height={700}
              priority
              className="h-full max-h-[620px] w-full object-contain p-6 sm:p-10 lg:p-12"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 px-6 text-center">
              <div
                aria-hidden="true"
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl text-slate-300 shadow-sm"
              >
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