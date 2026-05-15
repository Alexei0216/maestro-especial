"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from "../icons";
import DraggableGallery from "./DraggableGallery";

type ProductMediaProps = {
  images: string[];
  name: string;
};

export default function ProductMedia({ images, name }: ProductMediaProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const activeImage = images[activeIndex] ?? images[0];

  const showImage = useCallback((index: number) => {
    if (images.length === 0) {
      return;
    }

    const nextIndex = (index + images.length) % images.length;
    setActiveIndex(nextIndex);
  }, [images]);

  useEffect(() => {
    if (images.length === 0) {
      setActiveIndex(0);
      return;
    }

    if (activeIndex >= images.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, images]);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }

      if (event.key === "ArrowLeft") {
        showImage(activeIndex - 1);
      }

      if (event.key === "ArrowRight") {
        showImage(activeIndex + 1);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, isModalOpen, showImage]);

  useEffect(() => {
    setIsZoomed(false);
    setZoomOrigin({ x: 50, y: 50 });
  }, [activeIndex]);

  return (
    <>
      <div className="order-2 lg:order-2">
        <button
          type="button"
          className="motion-soft relative block aspect-[4/5] max-h-[680px] min-h-[460px] w-full overflow-hidden rounded-lg bg-white text-left shadow-sm hover:shadow-xl"
          onClick={() => setIsModalOpen(true)}
          aria-label={`Abrir imagen ampliada de ${name}`}
        >
          {activeImage && (
            <Image
              src={activeImage}
              alt={name}
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              unoptimized
              className="object-cover motion-soft hover:scale-[1.02]"
            />
          )}
        </button>
      </div>

      <div className="order-1 lg:order-1 lg:max-h-[680px]">
        <DraggableGallery
          images={images}
          name={name}
          activeImage={activeImage}
          onSelect={(image) => {
            const index = images.findIndex((item) => item === image);
            if (index >= 0) {
              setActiveIndex(index);
            }
          }}
        />
      </div>

      {isModalOpen && activeImage && createPortal(
        <div
          className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/88 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Imagen ampliada de ${name}`}
          onClick={() => setIsModalOpen(false)}
        >
          <button
            type="button"
            className="motion-soft absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/12 text-white shadow-lg shadow-black/25 backdrop-blur-md hover:scale-105 hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white"
            onClick={(event) => {
              event.stopPropagation();
              setIsModalOpen(false);
            }}
            aria-label="Cerrar imagen ampliada"
          >
            <CloseIcon className="h-4 w-4" />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              className="motion-soft absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/12 text-white shadow-lg shadow-black/25 backdrop-blur-md hover:scale-105 hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white sm:left-6 sm:h-14 sm:w-14"
              onClick={(event) => {
                event.stopPropagation();
                showImage(activeIndex - 1);
              }}
              aria-label="Imagen anterior"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
          )}

          <div
            className="animate-modal-zoom relative h-full max-h-[90vh] w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(event) => {
              const x = event.touches[0]?.clientX;
              if (x !== undefined) setTouchStartX(x);
            }}
            onTouchEnd={(event) => {
              const startX = touchStartX;
              const endX = event.changedTouches[0]?.clientX;

              if (startX === null || endX === undefined) return;

              const distance = endX - startX;
              if (Math.abs(distance) < 40) return;

              if (distance > 0) {
                showImage(activeIndex - 1);
              } else {
                showImage(activeIndex + 1);
              }
            }}
          >
            <Image
              src={activeImage}
              alt={name}
              fill
              sizes="100vw"
              unoptimized
              className={`object-contain motion-soft ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
                const yPercent = ((event.clientY - rect.top) / rect.height) * 100;

                setZoomOrigin({
                  x: Math.min(100, Math.max(0, xPercent)),
                  y: Math.min(100, Math.max(0, yPercent)),
                });
                setIsZoomed((prev) => !prev);
              }}
              onMouseMove={(event) => {
                if (!isZoomed) return;

                const rect = event.currentTarget.getBoundingClientRect();
                const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
                const yPercent = ((event.clientY - rect.top) / rect.height) * 100;
                setZoomOrigin({
                  x: Math.min(100, Math.max(0, xPercent)),
                  y: Math.min(100, Math.max(0, yPercent)),
                });
              }}
              style={{
                transform: isZoomed ? "scale(2)" : "scale(1)",
                transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
              }}
            />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              className="motion-soft absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/12 text-white shadow-lg shadow-black/25 backdrop-blur-md hover:scale-105 hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white sm:right-6 sm:h-14 sm:w-14"
              onClick={(event) => {
                event.stopPropagation();
                showImage(activeIndex + 1);
              }}
              aria-label="Imagen siguiente"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          )}
        </div>,
        document.body,
      )}
    </>
  );
}
