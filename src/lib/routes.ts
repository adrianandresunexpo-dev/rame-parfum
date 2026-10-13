import type { CatalogFilters, Gender, Occasion, PerfumeType, ScentProfile } from "@/types/perfume";
import { genders, occasions, perfumeTypes, priceRanges, scentProfiles } from "@/data/taxonomies";

const genderSlugs = new Set(genders.map((item) => item.slug));
const typeSlugs = new Set(perfumeTypes.map((item) => item.slug));
const profileSlugs = new Set(scentProfiles.map((item) => item.slug));
const occasionSlugs = new Set(occasions.map((item) => item.slug));
const priceSlugs = new Set(priceRanges.map((item) => item.slug));

export type PathContext = {
  basePath: string;
  locked: CatalogFilters;
};

export function parsePathContext(pathname: string): PathContext {
  const path = pathname.replace(/\/$/, "") || "/";

  const gender = path.match(/^\/(hombre|mujer|unisex)$/);
  if (gender && genderSlugs.has(gender[1] as Gender)) {
    return { basePath: path, locked: { gender: gender[1] as Gender } };
  }

  const typeHouses = path.match(/^\/tipo\/([^/]+)\/casas\/([^/]+)$/);
  if (typeHouses && typeSlugs.has(typeHouses[1] as PerfumeType)) {
    return {
      basePath: path,
      locked: {
        type: typeHouses[1] as PerfumeType,
        house: typeHouses[2],
      },
    };
  }

  const typeHouseIndex = path.match(/^\/tipo\/([^/]+)\/casas$/);
  if (typeHouseIndex && typeSlugs.has(typeHouseIndex[1] as PerfumeType)) {
    return {
      basePath: path,
      locked: { type: typeHouseIndex[1] as PerfumeType },
    };
  }

  const typeOnly = path.match(/^\/tipo\/([^/]+)$/);
  if (typeOnly && typeSlugs.has(typeOnly[1] as PerfumeType)) {
    return {
      basePath: path,
      locked: { type: typeOnly[1] as PerfumeType },
    };
  }

  const house = path.match(/^\/casas\/([^/]+)$/);
  if (house) {
    return { basePath: path, locked: { house: house[1] } };
  }

  const profile = path.match(/^\/perfil\/([^/]+)$/);
  if (profile && profileSlugs.has(profile[1] as ScentProfile)) {
    return {
      basePath: path,
      locked: { profile: profile[1] as ScentProfile },
    };
  }

  const occasion = path.match(/^\/ocasion\/([^/]+)$/);
  if (occasion && occasionSlugs.has(occasion[1] as Occasion)) {
    return {
      basePath: path,
      locked: { occasion: occasion[1] as Occasion },
    };
  }

  const price = path.match(/^\/precio\/([^/]+)$/);
  if (price && priceSlugs.has(price[1])) {
    return { basePath: path, locked: { priceSlug: price[1] } };
  }

  return { basePath: path === "/" ? "/catalogo" : path, locked: {} };
}

export function filtersFromSearchParams(
  params: URLSearchParams | Record<string, string | string[] | undefined>,
): CatalogFilters {
  const get = (key: string) => {
    if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const gender = get("genero");
  const type = get("tipo");
  const profile = get("perfil");
  const occasion = get("ocasion");
  const priceSlug = get("precio");
  const house = get("casa");
  const query = get("q");
  const featured = get("destacados");

  return {
    gender: gender && genderSlugs.has(gender as Gender) ? (gender as Gender) : undefined,
    type: type && typeSlugs.has(type as PerfumeType) ? (type as PerfumeType) : undefined,
    profile:
      profile && profileSlugs.has(profile as ScentProfile)
        ? (profile as ScentProfile)
        : undefined,
    occasion:
      occasion && occasionSlugs.has(occasion as Occasion)
        ? (occasion as Occasion)
        : undefined,
    priceSlug: priceSlug && priceSlugs.has(priceSlug) ? priceSlug : undefined,
    house: house || undefined,
    query: query || undefined,
    featured: featured === "1" || featured === "true",
  };
}

export function mergeFilters(locked: CatalogFilters, query: CatalogFilters): CatalogFilters {
  return {
    gender: locked.gender ?? query.gender,
    type: locked.type ?? query.type,
    house: locked.house ?? query.house,
    profile: locked.profile ?? query.profile,
    occasion: locked.occasion ?? query.occasion,
    priceSlug: locked.priceSlug ?? query.priceSlug,
    query: query.query,
    featured: query.featured,
  };
}

export function toSearchParams(filters: CatalogFilters, locked: CatalogFilters) {
  const params = new URLSearchParams();
  if (filters.gender && !locked.gender) params.set("genero", filters.gender);
  if (filters.type && !locked.type) params.set("tipo", filters.type);
  if (filters.house && !locked.house) params.set("casa", filters.house);
  if (filters.profile && !locked.profile) params.set("perfil", filters.profile);
  if (filters.occasion && !locked.occasion) params.set("ocasion", filters.occasion);
  if (filters.priceSlug && !locked.priceSlug) params.set("precio", filters.priceSlug);
  if (filters.query) params.set("q", filters.query);
  if (filters.featured) params.set("destacados", "1");
  return params;
}
