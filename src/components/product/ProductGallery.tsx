import Image from "next/image";
import type { ProductImage } from "@/types/perfume";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const hero = images.find((item) => item.role === "hero") ?? images[0];

  return (
    <div className="border border-beige bg-[#efeae1]">
      <div className="relative aspect-[4/5]">
        {hero ? (
          <Image src={hero.src} alt={hero.alt} fill className="object-contain p-10" priority />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-charcoal/40">
            Imagen de {name}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Slot for a future interactive / 360° bottle viewer.
 * Receives the same image contract (`role: "angle"` + `angle`) that a real viewer will use.
 */
export function BottleViewerPlaceholder({ images }: { images: ProductImage[] }) {
  const angles = images.filter((item) => item.role === "angle");

  return (
    <div className="mt-4 border border-dashed border-beige px-5 py-6">
      <p className="text-[10px] tracking-[0.22em] text-champagne uppercase">
        Vista de la botella
      </p>
      <p className="mt-2 font-serif text-xl">Próximamente: recorrido visual</p>
      <p className="mt-2 text-sm leading-relaxed text-charcoal/60">
        Este espacio está preparado para sustituirse por un visor interactivo. Por ahora
        usamos placeholders; las tomas por ángulo ya existen en los datos
        {angles.length ? ` (${angles.map((item) => item.angle).join(", ")})` : ""}.
      </p>
    </div>
  );
}
