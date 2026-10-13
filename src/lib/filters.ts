import { getHouse } from "@/data/houses";
import { getPriceRange, scentProfiles } from "@/data/taxonomies";
import { normalizeText } from "@/lib/format";
import type { CatalogFilters, Perfume } from "@/types/perfume";

function matchesPrice(perfume: Perfume, priceSlug?: string) {
  if (!priceSlug) return true;
  const range = getPriceRange(priceSlug);
  if (!range) return true;
  return perfume.price >= range.min && perfume.price < range.max;
}

function perfumeSearchBlob(perfume: Perfume) {
  const house = getHouse(perfume.houseSlug);
  const profileTerms = Object.keys(perfume.profile).flatMap((slug) => {
    const meta = scentProfiles.find((item) => item.slug === slug);
    return [slug, meta?.label ?? "", ...(meta?.searchTerms ?? [])];
  });
  const notes = [
    ...perfume.notes.top,
    ...perfume.notes.heart,
    ...perfume.notes.base,
  ];

  return normalizeText(
    [
      perfume.name,
      house?.name ?? "",
      perfume.inspiredBy?.name ?? "",
      ...notes,
      ...profileTerms,
    ].join(" "),
  );
}

function matchesQuery(perfume: Perfume, query?: string) {
  if (!query?.trim()) return true;
  const needle = normalizeText(query);
  if (!needle) return true;
  return perfumeSearchBlob(perfume).includes(needle);
}

export function filterPerfumes(list: Perfume[], filters: CatalogFilters) {
  return list.filter((perfume) => {
    if (filters.gender && perfume.gender !== filters.gender) return false;
    if (filters.type && perfume.type !== filters.type) return false;
    if (filters.house && perfume.houseSlug !== filters.house) return false;
    if (filters.profile && !perfume.profile[filters.profile]) return false;
    if (filters.occasion && !perfume.occasions.includes(filters.occasion)) {
      return false;
    }
    if (filters.featured && !perfume.featured) return false;
    if (!matchesPrice(perfume, filters.priceSlug)) return false;
    if (!matchesQuery(perfume, filters.query)) return false;
    return true;
  });
}

export function relevantProfiles(perfume: Perfume) {
  return Object.entries(perfume.profile)
    .filter(([, value]) => typeof value === "number" && value >= 35)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
    .slice(0, 6)
    .map(([slug, value]) => ({
      slug: slug as keyof Perfume["profile"],
      value: value ?? 0,
    }));
}
