import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { scentProfiles, getProfileMeta } from "@/data/taxonomies";
import { CatalogRoute, type SearchParams } from "@/components/catalog/CatalogRoute";
import type { ScentProfile } from "@/types/perfume";

type Props = {
  params: Promise<{ perfil: string }>;
  searchParams: SearchParams;
};

export async function generateStaticParams() {
  return scentProfiles.map((p) => ({
    perfil: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { perfil } = await params;
  const meta = getProfileMeta(perfil as ScentProfile);
  if (!meta) return { title: "Perfil no encontrado | Rame Parfum" };

  return {
    title: `Aroma ${meta.label} | Catálogo Rame Parfum`,
    description: `Perfumes con carácter olfativo ${meta.label.toLowerCase()}: notas y acordes destacados.`,
  };
}

export default async function PerfilDetailPage({ params, searchParams }: Props) {
  const { perfil } = await params;
  const meta = getProfileMeta(perfil as ScentProfile);

  if (!meta) {
    notFound();
  }

  const intro = (
    <div className="mt-8 border border-beige bg-[#edf3f8] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            className="inline-block h-4 w-4 rounded-full border border-black/10 shrink-0"
            style={{ backgroundColor: meta.accent }}
            aria-hidden="true"
          />
          <div>
            <p className="text-[10px] tracking-[0.2em] text-champagne uppercase">
              Familia Olfativa
            </p>
            <p className="text-sm text-charcoal/70">
              Acordes y notas habituales:{" "}
              <span className="text-charcoal">
                {meta.displayNotes.join(", ")}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 border-t border-beige/70 pt-3">
        <p className="text-[10px] tracking-[0.16em] text-charcoal/50 uppercase mb-2">
          Otros perfiles aromáticos:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {scentProfiles.map((item) => (
            <Link
              key={item.slug}
              href={`/perfil/${item.slug}`}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider border transition-colors ${
                item.slug === perfil
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
      locked={{ profile: perfil as ScentProfile }}
      eyebrow="Perfil Olfativo"
      title={`Carácter ${meta.label}`}
      description={`Descubre las fragancias donde predomina la faceta ${meta.label.toLowerCase()}. Mostramos afinidad olfativa destacada sobre la composición.`}
      intro={intro}
      searchParams={searchParams}
    />
  );
}
