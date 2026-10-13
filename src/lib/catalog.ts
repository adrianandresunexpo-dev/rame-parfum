import { houses as allHouses, getHouse } from "@/data/houses";
import { perfumes as allPerfumes } from "@/data/perfumes";
import { filterPerfumes } from "@/lib/filters";
import type { CatalogFilters, PerfumeType } from "@/types/perfume";

export function getPerfumes(filters: CatalogFilters = {}) {
  return filterPerfumes(allPerfumes, filters);
}

export function getPerfume(slug: string) {
  return allPerfumes.find((perfume) => perfume.slug === slug);
}

export function getFeaturedPerfumes() {
  return allPerfumes.filter((perfume) => perfume.featured);
}

export function getHouses() {
  return allHouses;
}

export function getHouseBySlug(slug: string) {
  return getHouse(slug);
}

export function getHousesByType(type: PerfumeType) {
  const slugs = new Set(
    allPerfumes.filter((perfume) => perfume.type === type).map((p) => p.houseSlug),
  );
  return allHouses.filter((house) => slugs.has(house.slug));
}

export function getPerfumesByHouse(houseSlug: string) {
  return getPerfumes({ house: houseSlug });
}

export function getPerfumesByProfile(profile: CatalogFilters["profile"]) {
  return profile ? getPerfumes({ profile }) : getPerfumes();
}

export function getPerfumesByOccasion(occasion: CatalogFilters["occasion"]) {
  return occasion ? getPerfumes({ occasion }) : getPerfumes();
}

export function countPerfumesForHouse(houseSlug: string, type?: PerfumeType) {
  return allPerfumes.filter((perfume) => {
    if (perfume.houseSlug !== houseSlug) return false;
    if (type && perfume.type !== type) return false;
    return true;
  }).length;
}
