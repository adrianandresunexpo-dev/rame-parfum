import { CatalogView } from "@/components/catalog/CatalogView";
import { getPerfumes } from "@/lib/catalog";
import { filtersFromSearchParams, mergeFilters } from "@/lib/routes";
import type { CatalogFilters } from "@/types/perfume";

export type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function CatalogRoute({
  locked,
  title,
  description,
  eyebrow,
  searchParams,
  intro,
}: {
  locked: CatalogFilters;
  title: string;
  description?: string;
  eyebrow?: string;
  searchParams: SearchParams;
  intro?: React.ReactNode;
}) {
  const queryFilters = filtersFromSearchParams(await searchParams);
  const filters = mergeFilters(locked, queryFilters);
  const perfumes = getPerfumes(filters);

  return (
    <CatalogView
      title={title}
      description={description}
      eyebrow={eyebrow}
      perfumes={perfumes}
      query={filters.query}
      intro={intro}
    />
  );
}
