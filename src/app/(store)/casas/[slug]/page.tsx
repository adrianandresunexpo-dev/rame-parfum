import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { houses, getHouse } from "@/data/houses";
import { CatalogRoute, type SearchParams } from "@/components/catalog/CatalogRoute";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: SearchParams;
};

export async function generateStaticParams() {
  return houses.map((house) => ({
    slug: house.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const house = getHouse(slug);
  if (!house) return { title: "Casa no encontrada | Rame Parfum" };

  return {
    title: `${house.name} | Catálogo Rame Parfum`,
    description: house.tagline ?? `Descubre todas las creaciones olfativas de la casa ${house.name}.`,
  };
}

export default async function CasaDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const house = getHouse(slug);

  if (!house) {
    notFound();
  }

  return (
    <CatalogRoute
      locked={{ house: house.slug }}
      eyebrow={house.origin ? `Maison · ${house.origin}` : "Casa"}
      title={house.name}
      description={house.tagline ?? `Todos los perfumes disponibles de la firma ${house.name}.`}
      searchParams={searchParams}
    />
  );
}
