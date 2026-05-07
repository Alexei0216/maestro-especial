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
  const dragState = useRef({ x: 0, y: 0, left: 0, top: 0 });

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    setIsDragging(true);
    element.setPointerCapture(event.pointerId);
    dragState.current = {
      x: event.clientX,
      y: event.clientY,
      left: element.scrollLeft,
      top: element.scrollTop,
    };
  }

  function drag(event: PointerEvent<HTMLDivElement>) {
    const element = scrollRef.current;

    if (!element || !isDragging) {
      return;
    }

    element.scrollLeft = dragState.current.left - (event.clientX - dragState.current.x);
    element.scrollTop = dragState.current.top - (event.clientY - dragState.current.y);
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const element = scrollRef.current;

    if (element?.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }

    setIsDragging(false);
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
          onClick={() => onSelect?.(image)}
          className={`relative h-28 w-24 shrink-0 overflow-hidden rounded-lg border bg-neutral-100 transition lg:h-36 lg:w-28 ${
            activeImage === image
              ? "border-yellow-600 ring-2 ring-yellow-500"
              : "border-neutral-200 hover:border-neutral-400"
          }`}
          aria-label={`Mostrar imagen ${index + 1} de ${name}`}
        >
          <Image
            src={image}
            alt={`${name} imagen ${index + 1}`}
            fill
            sizes="112px"
            unoptimized
            className="object-cover"
            draggable={false}
          />
        </button>
      ))}
    </div>
  );
}
