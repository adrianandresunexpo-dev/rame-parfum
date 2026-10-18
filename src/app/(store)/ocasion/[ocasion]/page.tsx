import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { occasions, getOccasionMeta } from "@/data/taxonomies";
import { CatalogRoute, type SearchParams } from "@/components/catalog/CatalogRoute";
import type { Occasion } from "@/types/perfume";

type Props = {
  params: Promise<{ ocasion: string }>;
  searchParams: SearchParams;
};

export async function generateStaticParams() {
  return occasions.map((o) => ({
    ocasion: o.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ocasion } = await params;
  const meta = getOccasionMeta(ocasion as Occasion);
  if (!meta) return { title: "Ocasión no encontrada | Rame Parfum" };

  return {
    title: `Perfumes para ${meta.label} | Catálogo Rame Parfum`,
    description: meta.description,
  };
}

export default async function OcasionDetailPage({ params, searchParams }: Props) {
  const { ocasion } = await params;
  const meta = getOccasionMeta(ocasion as Occasion);

  if (!meta) {
    notFound();
  }

  const intro = (
    <div className="mt-8 border border-beige bg-[#edf3f8] p-5">
      <p className="text-[10px] tracking-[0.2em] text-champagne uppercase">
        Momento sugerido
      </p>
      <p className="mt-1 text-sm text-charcoal/80 leading-relaxed">
        {meta.description}
      </p>
      <div className="mt-4 border-t border-beige/70 pt-3">
        <p className="text-[10px] tracking-[0.16em] text-charcoal/50 uppercase mb-2">
          Explora por otros momentos:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {occasions.map((item) => (
            <Link
              key={item.slug}
              href={`/ocasion/${item.slug}`}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider border transition-colors ${
                item.slug === ocasion
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
      locked={{ occasion: ocasion as Occasion }}
      eyebrow="Ocasión de Uso"
      title={`Para ${meta.label}`}
      description={meta.description}
      intro={intro}
      searchParams={searchParams}
    />
  );
}
