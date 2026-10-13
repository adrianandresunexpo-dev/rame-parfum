import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHouse } from "@/data/houses";
import { perfumes } from "@/data/perfumes";
import { getTypeMeta } from "@/data/taxonomies";
import { CatalogRoute, type SearchParams } from "@/components/catalog/CatalogRoute";
import type { PerfumeType } from "@/types/perfume";

type Props = {
  params: Promise<{ tipo: string; casa: string }>;
  searchParams: SearchParams;
};

export async function generateStaticParams() {
  const combos = new Set<string>();
  for (const p of perfumes) {
    combos.add(`${p.type}:::${p.houseSlug}`);
  }
  return Array.from(combos).map((item) => {
    const [tipo, casa] = item.split(":::");
    return { tipo, casa };
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tipo, casa } = await params;
  const meta = getTypeMeta(tipo as PerfumeType);
  const house = getHouse(casa);
  if (!meta || !house) return { title: "No encontrado | Rame Parfum" };

  return {
    title: `${house.name} (${meta.shortLabel}) | Rame Parfum`,
    description: `Perfumes de ${house.name} en la categoría de ${meta.label.toLowerCase()}.`,
  };
}

export default async function TipoCasaPerfumesPage({ params, searchParams }: Props) {
  const { tipo, casa } = await params;
  const meta = getTypeMeta(tipo as PerfumeType);
  const house = getHouse(casa);

  if (!meta || !house) {
    notFound();
  }

  const intro = (
    <nav aria-label="Ruta de navegación" className="mt-4">
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
        <li>
          <Link href={`/tipo/${tipo}/casas`} className="hover:text-charcoal">
            Casas
          </Link>
        </li>
        <li>/</li>
        <li className="text-charcoal font-medium">{house.name}</li>
      </ol>
    </nav>
  );

  return (
    <CatalogRoute
      locked={{ type: tipo as PerfumeType, house: house.slug }}
      eyebrow={`${meta.label} · Maison ${house.name}`}
      title={`${house.name}`}
      description={`Catálogo de creaciones de ${house.name} dentro de la colección ${meta.label.toLowerCase()}.`}
      intro={intro}
      searchParams={searchParams}
    />
  );
}
