import { CatalogRoute, type SearchParams } from "@/components/catalog/CatalogRoute";
import { getGenderLabel } from "@/data/taxonomies";

export default function UnisexPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <CatalogRoute
      locked={{ gender: "unisex" }}
      eyebrow="Género"
      title={getGenderLabel("unisex")}
      description="Solo perfumes clasificados como unisex. Composiciones versátiles, equilibradas y diseñadas con libre carácter olfativo."
      searchParams={searchParams}
    />
  );
}
