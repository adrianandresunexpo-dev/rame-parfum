import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { perfumeTypes, getTypeMeta } from "@/data/taxonomies";
import { countPerfumesForHouse, getHousesByType } from "@/lib/catalog";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { PerfumeType } from "@/types/perfume";

type Props = {
  params: Promise<{ tipo: string }>;
};

export async function generateStaticParams() {
  return perfumeTypes.map((type) => ({
    tipo: type.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tipo } = await params;
  const meta = getTypeMeta(tipo as PerfumeType);
  if (!meta) return { title: "Casas no encontradas | Rame Parfum" };

  return {
    title: `Casas de perfumería ${meta.shortLabel} | Rame Parfum`,
    description: `Casas y firmas asociadas a la categoría de ${meta.label.toLowerCase()}.`,
  };
}

export default async function TipoCasasPage({ params }: Props) {
  const { tipo } = await params;
  const meta = getTypeMeta(tipo as PerfumeType);

  if (!meta) {
    notFound();
  }

  const houses = getHousesByType(tipo as PerfumeType);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <nav aria-label="Ruta de navegación" className="mb-8">
        <ol className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-charcoal/50 uppercase">
          <li>
            <Link href="/" className="hover:text-charcoal">
              Inicio
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/tipo/${tipo}`} className="hover:text-charcoal">
              {meta.label}
            </Link>
          </li>
          <li>/</li>
          <li className="text-charcoal font-medium">Casas</li>
        </ol>
      </nav>

      <SectionHeader
        eyebrow={`Colección · ${meta.shortLabel}`}
        title={`Casas con catálogo ${meta.label.toLowerCase()}`}
        description={`Explora las firmas con perfumes en la categoría ${meta.shortLabel.toLowerCase()}. Selecciona una casa para ver sus piezas exclusivas de esta línea.`}
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {houses.map((house) => {
          const count = countPerfumesForHouse(house.slug, tipo as PerfumeType);
          return (
            <div
              key={house.slug}
              className="group border border-beige bg-ivory p-6 transition-colors hover:border-champagne"
            >
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
              <div className="mt-6 border-t border-beige/60 pt-4 flex items-center justify-between">
                <Link
                  href={`/tipo/${tipo}/casas/${house.slug}`}
                  className="text-[11px] tracking-[0.16em] text-charcoal uppercase underline decoration-champagne underline-offset-4 hover:text-champagne font-medium"
                >
                  Ver {meta.shortLabel.toLowerCase()} ({count}) &rarr;
                </Link>
                <Link
                  href={`/casas/${house.slug}`}
                  className="text-[10px] tracking-[0.14em] text-charcoal/40 uppercase hover:text-charcoal"
                >
                  Toda la casa
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
