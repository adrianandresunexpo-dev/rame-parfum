import Image from "next/image";
import Link from "next/link";
import { getHouse } from "@/data/houses";
import { getTypeMeta } from "@/data/taxonomies";
import { formatSize, formatUsd } from "@/lib/format";
import type { Perfume } from "@/types/perfume";

export function PerfumeCard({ perfume }: { perfume: Perfume }) {
  const house = getHouse(perfume.houseSlug);
  const type = getTypeMeta(perfume.type);
  const image = perfume.images.find((item) => item.role === "hero") ?? perfume.images[0];

  return (
    <Link href={`/perfume/${perfume.slug}`} className="group flex flex-col h-full">
      <div className="border border-beige bg-[#edf3f8] transition-all duration-300 group-hover:border-champagne/60 group-hover:shadow-sm">
        <div className="relative aspect-[4/5] overflow-hidden">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-3 sm:p-7 transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : null}
        </div>
      </div>
      <div className="pt-2 sm:pt-3.5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.2em] text-champagne uppercase truncate">
            {house?.name} · {type?.shortLabel}
          </p>
          <h3 className="mt-0.5 sm:mt-1 font-serif text-xs sm:text-lg md:text-xl text-charcoal line-clamp-2 leading-snug group-hover:text-champagne transition-colors">
            {perfume.name}
          </h3>
        </div>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-charcoal/85">
          {formatUsd(perfume.price)}
          <span className="text-[10px] sm:text-xs text-charcoal/50 font-normal ml-1">
            · {formatSize(perfume.sizeMl)}
          </span>
        </p>
      </div>
    </Link>
  );
}

export function PerfumeGrid({ perfumes }: { perfumes: Perfume[] }) {
  if (perfumes.length === 0) {
    return (
      <div className="border border-beige px-4 py-12 sm:px-6 sm:py-16 text-center">
        <p className="font-serif text-xl sm:text-2xl">Sin resultados</p>
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-charcoal/65">
          Prueba a quitar algún filtro o busca por otra nota, casa o perfil.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {perfumes.map((perfume) => (
        <PerfumeCard key={perfume.slug} perfume={perfume} />
      ))}
    </div>
  );
}
