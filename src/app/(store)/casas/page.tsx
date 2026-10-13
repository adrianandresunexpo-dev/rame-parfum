import type { Metadata } from "next";
import Link from "next/link";
import { houses } from "@/data/houses";
import { countPerfumesForHouse } from "@/lib/catalog";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Casas y Maisons | Rame Parfum",
  description:
    "Explora nuestro catálogo a través de las grandes casas de perfumería: diseñadores parisinos, casas del Golfo y firmas de autor.",
};

export default function CasasIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <SectionHeader
        eyebrow="Maisons & Casas"
        title="Directorio de Casas"
        description="Desde la tradición de la alta costura europea hasta las casas del Golfo con oud y ámbar. Selecciona una firma para descubrir todas sus creaciones."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {houses.map((house) => {
          const count = countPerfumesForHouse(house.slug);
          return (
            <div key={house.slug} className="group relative border border-beige bg-ivory p-6 transition-colors hover:border-champagne">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] tracking-[0.2em] text-champagne uppercase">
                    {house.origin ?? "Maison"}
                  </span>
                  <h2 className="mt-1 font-serif text-2xl text-charcoal">{house.name}</h2>
                </div>
                <span className="text-[10px] tracking-[0.16em] text-charcoal/45 uppercase whitespace-nowrap">
                  {count} {count === 1 ? "perfume" : "perfumes"}
                </span>
              </div>
              {house.tagline ? (
                <p className="mt-3 text-sm leading-relaxed text-charcoal/65">
                  {house.tagline}
                </p>
              ) : null}
              <div className="mt-6 border-t border-beige/60 pt-4">
                <Link
                  href={`/casas/${house.slug}`}
                  className="inline-flex items-center text-[11px] tracking-[0.18em] text-charcoal uppercase underline decoration-champagne underline-offset-4 hover:text-champagne"
                >
                  Ver creaciones &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
