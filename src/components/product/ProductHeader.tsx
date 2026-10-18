import Link from "next/link";
import { getOccasionMeta, getGenderLabel, getTypeMeta } from "@/data/taxonomies";
import { formatSize, formatUsd } from "@/lib/format";
import type { Perfume } from "@/types/perfume";
import { getHouse } from "@/data/houses";
import { getPerfume } from "@/lib/catalog";

export function ProductHeader({ perfume }: { perfume: Perfume }) {
  const house = getHouse(perfume.houseSlug);
  const type = getTypeMeta(perfume.type);

  return (
    <header>
      <p className="text-[11px] tracking-[0.22em] text-champagne uppercase">
        <Link href={`/casas/${house?.slug}`} className="hover:text-charcoal">
          {house?.name}
        </Link>
        {" · "}
        <Link href={`/tipo/${perfume.type}`}>{type?.shortLabel}</Link>
        {" · "}
        <Link href={`/${perfume.gender}`}>{getGenderLabel(perfume.gender)}</Link>
      </p>
      <h1 className="mt-3 font-serif text-4xl md:text-5xl">{perfume.name}</h1>
      {perfume.inspiredBy ? (
        <p className="mt-4 text-sm text-charcoal/70">
          Inspirado en{" "}
          {perfume.inspiredBy.slug && getPerfume(perfume.inspiredBy.slug) ? (
            <Link
              href={`/perfume/${perfume.inspiredBy.slug}`}
              className="underline decoration-champagne underline-offset-4 hover:text-charcoal"
            >
              {perfume.inspiredBy.name}
            </Link>
          ) : (
            <Link
              href={`/catalogo?q=${encodeURIComponent(perfume.inspiredBy.name)}`}
              className="underline decoration-champagne underline-offset-4 hover:text-charcoal"
              title={`Buscar ${perfume.inspiredBy.name} en el catálogo`}
            >
              {perfume.inspiredBy.name}
            </Link>
          )}
        </p>
      ) : null}
      <p className="mt-6 font-serif text-3xl">
        {formatUsd(perfume.price)}
        <span className="ml-3 text-base text-charcoal/55">{formatSize(perfume.sizeMl)}</span>
      </p>
    </header>
  );
}

export function AvailabilityCta() {
  return (
    <div className="mt-8 border border-beige p-5">
      <button
        type="button"
        className="w-full bg-charcoal px-6 py-3.5 text-[11px] tracking-[0.2em] text-ivory uppercase"
      >
        Consultar disponibilidad
      </button>
      <p className="mt-3 text-xs leading-relaxed text-charcoal/55">
        Placeholder de la futura tienda. No realiza compras ni pagos.
      </p>
    </div>
  );
}

export function ProductMeta({ perfume }: { perfume: Perfume }) {
  return (
    <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
      <div>
        <dt className="text-[10px] tracking-[0.18em] text-charcoal/45 uppercase">
          Concentración
        </dt>
        <dd className="mt-1">{perfume.concentration}</dd>
      </div>
      {perfume.longevity ? (
        <div>
          <dt className="text-[10px] tracking-[0.18em] text-charcoal/45 uppercase">
            Duración
          </dt>
          <dd className="mt-1">{perfume.longevity}</dd>
        </div>
      ) : null}
      {perfume.sillage ? (
        <div>
          <dt className="text-[10px] tracking-[0.18em] text-charcoal/45 uppercase">Estela</dt>
          <dd className="mt-1">{perfume.sillage}</dd>
        </div>
      ) : null}
    </dl>
  );
}

export function OccasionTags({ perfume }: { perfume: Perfume }) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl">Ocasiones</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {perfume.occasions.map((slug) => {
          const meta = getOccasionMeta(slug);
          return (
            <Link
              key={slug}
              href={`/ocasion/${slug}`}
              className="border border-beige px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase hover:border-champagne"
            >
              {meta?.label ?? slug}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
