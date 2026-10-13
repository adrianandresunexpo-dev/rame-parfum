import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { perfumeTypes, getTypeMeta } from "@/data/taxonomies";
import { getHousesByType } from "@/lib/catalog";
import { CatalogRoute, type SearchParams } from "@/components/catalog/CatalogRoute";
import type { PerfumeType } from "@/types/perfume";

type Props = {
  params: Promise<{ tipo: string }>;
  searchParams: SearchParams;
};

export async function generateStaticParams() {
  return perfumeTypes.map((type) => ({
    tipo: type.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tipo } = await params;
  const meta = getTypeMeta(tipo as PerfumeType);
  if (!meta) return { title: "Tipo no encontrado | Rame Parfum" };

  return {
    title: `${meta.label} | Catálogo Rame Parfum`,
    description: meta.description,
  };
}

export default async function TipoDetailPage({ params, searchParams }: Props) {
  const { tipo } = await params;
  const meta = getTypeMeta(tipo as PerfumeType);

  if (!meta) {
    notFound();
  }

  const houses = getHousesByType(tipo as PerfumeType);

  const intro = (
    <div className="mt-8 border border-beige bg-[#efeae1] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] tracking-[0.2em] text-champagne uppercase">
            Recorrido por firmas
          </p>
          <p className="font-serif text-lg text-charcoal">
            Casas con catálogo {meta.shortLabel.toLowerCase()}
          </p>
        </div>
        <Link
          href={`/tipo/${tipo}/casas`}
          className="text-[11px] tracking-[0.16em] uppercase underline decoration-champagne underline-offset-4 hover:text-champagne font-medium"
        >
          Ver todas las casas ({houses.length}) &rarr;
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {houses.map((house) => (
          <Link
            key={house.slug}
            href={`/tipo/${tipo}/casas/${house.slug}`}
            className="border border-beige bg-ivory px-3 py-1 text-xs tracking-wider uppercase text-charcoal/80 hover:border-champagne"
          >
            {house.name}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <CatalogRoute
      locked={{ type: tipo as PerfumeType }}
      eyebrow="Tipo de Perfume"
      title={meta.label}
      description={meta.description}
      intro={intro}
      searchParams={searchParams}
    />
  );
}
