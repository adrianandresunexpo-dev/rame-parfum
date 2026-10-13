import { CatalogRoute, type SearchParams } from "@/components/catalog/CatalogRoute";
import { getGenderLabel } from "@/data/taxonomies";

const copy = {
  hombre: "Solo perfumes clasificados como hombre.",
  mujer: "Solo perfumes clasificados como mujer.",
  unisex: "Solo perfumes unisex. No se mezclan con hombre ni mujer.",
} as const;

export default function HombrePage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <CatalogRoute
      locked={{ gender: "hombre" }}
      eyebrow="Género"
      title={getGenderLabel("hombre")}
      description={copy.hombre}
      searchParams={searchParams}
    />
  );
}
