"use client";

import Image from "next/image";
import { useState } from "react";
import DraggableGallery from "./DraggableGallery";

type ProductMediaProps = {
  images: string[];
  name: string;
};

export default function ProductMedia({ images, name }: ProductMediaProps) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <>
      <div className="order-2 lg:order-2">
        <div className="relative aspect-[4/5] max-h-[680px] min-h-[460px] overflow-hidden rounded-lg bg-white shadow-sm">
          {activeImage && (
            <Image
              src={activeImage}
              alt={name}
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              unoptimized
              className="object-cover"
            />
          )}
        </div>
      </div>

      <div className="order-1 lg:order-1 lg:max-h-[680px]">
        <DraggableGallery
          images={images}
          name={name}
          activeImage={activeImage}
          onSelect={setActiveImage}
        />
      </div>
    </>
  );
}
