"use client";

import Image from "next/image";
import type { ProductImage } from "@/types/perfume";

interface ProductGalleryProps {
  images: ProductImage[];
  name: string;
  houseName?: string;
  concentration?: string;
  sizeMl?: number;
}

export function ProductGallery({
  images,
  name,
}: ProductGalleryProps) {
  const hero = images.find((item) => item.role === "hero") ?? images[0];

  return (
    <div className="border border-beige bg-[#edf3f8] shadow-sm select-none max-w-[290px] sm:max-w-none mx-auto w-full">
      {/* Contenedor de imagen optimizado para móvil y desktop */}
      <div className="relative aspect-square sm:aspect-[4/5] w-full overflow-hidden">
        <div className="relative h-full w-full flex items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-[#ffffff] to-[#edf3f8]">
          {hero ? (
            <Image
              src={hero.src}
              alt={hero.alt}
              fill
              sizes="(max-width: 640px) 290px, (max-width: 1024px) 50vw, 45vw"
              className="object-contain p-4 sm:p-8 transition-transform duration-300 hover:scale-105"
              priority
            />
          ) : (
            <div className="text-sm text-charcoal/40">{name}</div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Placeholder vacío — se mantiene por si algún archivo lo importa
 */
export function BottleViewerPlaceholder() {
  return null;
}
