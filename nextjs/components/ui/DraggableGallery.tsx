"use client";

import Image from "next/image";
import { PointerEvent, useRef, useState } from "react";

type DraggableGalleryProps = {
  images: string[];
  name: string;
  activeImage?: string;
  onSelect?: (image: string) => void;
};

export default function DraggableGallery({
  images,
  name,
  activeImage,
  onSelect,
}: DraggableGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    moved: false,
    image: "",
  });

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    const target = (event.target as HTMLElement).closest<HTMLButtonElement>(
      "[data-gallery-image]",
    );

    setIsDragging(true);
    element.setPointerCapture(event.pointerId);
    dragState.current = {
      x: event.clientX,
      y: event.clientY,
      left: element.scrollLeft,
      top: element.scrollTop,
      moved: false,
      image: target?.dataset.galleryImage ?? "",
    };
  }

  function drag(event: PointerEvent<HTMLDivElement>) {
    const element = scrollRef.current;

    if (!element || !isDragging) {
      return;
    }

    const distanceX = event.clientX - dragState.current.x;
    const distanceY = event.clientY - dragState.current.y;

    if (Math.abs(distanceX) > 4 || Math.abs(distanceY) > 4) {
      dragState.current.moved = true;
    }

    element.scrollLeft = dragState.current.left - distanceX;
    element.scrollTop = dragState.current.top - distanceY;
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const element = scrollRef.current;
    const selectedImage = dragState.current.image;
    const wasClick = !dragState.current.moved;

    if (element?.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }

    setIsDragging(false);

    if (wasClick && selectedImage) {
      onSelect?.(selectedImage);
    }
  }

  return (
    <div
      ref={scrollRef}
      onPointerDown={startDrag}
      onPointerMove={drag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={`scrollbar-none flex max-h-[680px] gap-3 overflow-auto pr-1 select-none touch-pan-x lg:flex-col lg:touch-pan-y ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      aria-label="Galeria de imagenes del producto"
    >
      {images.map((image, index) => (
        <button
          type="button"
          key={`${image}-${index}`}
          data-gallery-image={image}
          onClick={(event) => {
            event.stopPropagation();

            if (!dragState.current.moved) {
              onSelect?.(image);
            }
          }}
          className={`motion-soft relative h-28 w-24 shrink-0 overflow-hidden rounded-lg border bg-neutral-100 lg:h-36 lg:w-28 ${
            activeImage === image
              ? "scale-[0.98] border-yellow-600 ring-2 ring-yellow-500"
              : "border-neutral-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md"
          }`}
          aria-current={activeImage === image}
          aria-label={`Mostrar imagen ${index + 1} de ${name}`}
        >
          <Image
            src={image}
            alt={`${name} imagen ${index + 1}`}
            fill
            sizes="112px"
            unoptimized
            className="object-cover motion-soft hover:scale-105"
            draggable={false}
          />
        </button>
      ))}
    </div>
  );
}
