import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { priceRanges, getPriceRange } from "@/data/taxonomies";
import { CatalogRoute, type SearchParams } from "@/components/catalog/CatalogRoute";

type Props = {
  params: Promise<{ rango: string }>;
  searchParams: SearchParams;
};

export async function generateStaticParams() {
  return priceRanges.map((r) => ({
    rango: r.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rango } = await params;
  const meta = getPriceRange(rango);
  if (!meta) return { title: "Rango no encontrado | Rame Parfum" };

  return {
    title: `Perfumes ${meta.label} | Catálogo Rame Parfum`,
    description: `Descubre perfumes dentro del rango de precio ${meta.label} (${meta.hint}).`,
  };
}

export default async function PrecioDetailPage({ params, searchParams }: Props) {
  const { rango } = await params;
  const meta = getPriceRange(rango);

  if (!meta) {
    notFound();
  }

  const intro = (
    <div className="mt-8 border border-beige bg-[#edf3f8] p-5">
      <p className="text-[10px] tracking-[0.2em] text-champagne uppercase">
        Segmento de inversión
      </p>
      <p className="mt-1 text-sm text-charcoal/80 leading-relaxed font-serif text-lg">
        {meta.hint}
      </p>
      <div className="mt-4 border-t border-beige/70 pt-3">
        <p className="text-[10px] tracking-[0.16em] text-charcoal/50 uppercase mb-2">
          Otros rangos de precio:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {priceRanges.map((item) => (
            <Link
              key={item.slug}
              href={`/precio/${item.slug}`}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider border transition-colors ${
                item.slug === rango
                  ? "border-charcoal bg-charcoal text-ivory"
                  : "border-beige bg-ivory text-charcoal/70 hover:border-champagne"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <CatalogRoute
      locked={{ priceSlug: rango }}
      eyebrow="Rango de Precio"
      title={meta.label}
      description={`Selección de fragancias con precio en ${meta.label}. ${meta.hint}.`}
      intro={intro}
      searchParams={searchParams}
    />
  );
}
