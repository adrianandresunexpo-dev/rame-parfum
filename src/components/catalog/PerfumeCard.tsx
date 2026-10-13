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
    <Link href={`/perfume/${perfume.slug}`} className="group block">
      <div className="border border-beige bg-[#efeae1]">
        <div className="relative aspect-[4/5] overflow-hidden">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-contain p-8 transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : null}
        </div>
      </div>
      <div className="pt-4">
        <p className="text-[10px] tracking-[0.2em] text-champagne uppercase">
          {house?.name} · {type?.shortLabel}
        </p>
        <h3 className="mt-1 font-serif text-xl text-charcoal">{perfume.name}</h3>
        <p className="mt-2 text-sm text-charcoal/70">
          {formatUsd(perfume.price)} · {formatSize(perfume.sizeMl)}
        </p>
      </div>
    </Link>
  );
}

export function PerfumeGrid({ perfumes }: { perfumes: Perfume[] }) {
  if (perfumes.length === 0) {
    return (
      <div className="border border-beige px-6 py-16 text-center">
        <p className="font-serif text-2xl">Sin resultados</p>
        <p className="mt-3 text-sm text-charcoal/65">
          Prueba a quitar algún filtro o busca por otra nota, casa o perfil.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {perfumes.map((perfume) => (
        <PerfumeCard key={perfume.slug} perfume={perfume} />
      ))}
    </div>
  );
}
