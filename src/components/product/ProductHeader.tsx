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
      <h1 className="mt-2 sm:mt-3 font-serif text-2xl sm:text-4xl md:text-5xl leading-tight">{perfume.name}</h1>
      {perfume.inspiredBy ? (
        <p className="mt-2.5 sm:mt-4 text-xs sm:text-sm text-charcoal/70">
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
      <p className="mt-3.5 sm:mt-6 font-serif text-2xl sm:text-3xl text-charcoal">
        {formatUsd(perfume.price)}
        <span className="ml-2.5 text-sm sm:text-base text-charcoal/55 font-sans font-normal">{formatSize(perfume.sizeMl)}</span>
      </p>
    </header>
  );
}

export function AvailabilityCta({ perfume }: { perfume?: Perfume }) {
  const house = perfume ? getHouse(perfume.houseSlug) : null;
  const message = perfume
    ? `¡Hola Rame Parfum! Me interesa consultar la disponibilidad del perfume *${perfume.name}* (${house?.name ?? ""}) de ${formatUsd(perfume.price)}.`
    : "¡Hola Rame Parfum! Me gustaría consultar la disponibilidad de un perfume.";

  const whatsappUrl = `https://wa.me/584129221902?text=${encodeURIComponent(message)}`;

  return (
    <div className="mt-6 sm:mt-8 border border-beige bg-[#edf3f8]/60 p-4 sm:p-5">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] px-5 py-3.5 text-xs sm:text-sm tracking-[0.14em] text-white uppercase font-semibold transition-all shadow-sm active:scale-[0.99] rounded-xs"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="currentColor"
          className="shrink-0"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.02L7.55 18.84L4.44 19.66L5.27 16.63L5.07 16.31C4.24 15 3.81 13.48 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.69C7.02 10.9 7.9 12.07 8.02 12.24C8.15 12.4 9.7 14.94 12.16 15.91C14.21 16.71 14.62 16.55 15.07 16.51C15.52 16.47 16.52 15.91 16.72 15.33C16.93 14.75 16.93 14.25 16.86 14.15C16.8 14.05 16.64 13.99 16.39 13.86C16.14 13.74 14.93 13.14 14.71 13.06C14.48 12.98 14.32 12.94 14.15 13.19C13.99 13.44 13.52 14.05 13.38 14.22C13.23 14.38 13.09 14.4 12.84 14.28C12.59 14.15 11.78 13.89 10.82 13.03C10.07 12.36 9.56 11.53 9.42 11.28C9.27 11.03 9.4 10.9 9.53 10.77C9.64 10.66 9.78 10.48 9.9 10.34C10.03 10.2 10.07 10.1 10.15 9.93C10.24 9.77 10.19 9.62 10.13 9.5C10.07 9.38 9.6 8.23 9.4 7.76C9.21 7.3 9.02 7.36 8.87 7.35C8.73 7.35 8.57 7.33 8.53 7.33Z" />
        </svg>
        <span>Consultar o Pedir por WhatsApp</span>
      </a>
      <p className="mt-2.5 text-center text-[11px] sm:text-xs leading-relaxed text-charcoal/65">
        Atención directa: <span className="font-medium text-charcoal">+58 412 9221902</span>
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
