import { CatalogRoute, type SearchParams } from "@/components/catalog/CatalogRoute";
import { getGenderLabel } from "@/data/taxonomies";

export default function MujerPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <CatalogRoute
      locked={{ gender: "mujer" }}
      eyebrow="Género"
      title={getGenderLabel("mujer")}
      description="Solo perfumes clasificados como mujer."
      searchParams={searchParams}
    />
  );
}
