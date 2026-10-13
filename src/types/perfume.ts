export type Gender = "hombre" | "mujer" | "unisex";

export type PerfumeType = "disenador" | "arabe" | "nicho" | "inspiracion";

export type ScentProfile =
  | "citrico"
  | "fresco"
  | "acuatico"
  | "floral"
  | "frutal"
  | "gourmand"
  | "especiado"
  | "ambarado"
  | "amaderado"
  | "verde"
  | "cuero"
  | "oud";

export type Occasion =
  | "dia"
  | "noche"
  | "trabajo"
  | "casual"
  | "citas"
  | "eventos"
  | "salidas";

export type ImageRole = "hero" | "angle" | "detail";

export type ProductImage = {
  src: string;
  alt: string;
  role: ImageRole;
  /** Reserved for a future 360° bottle viewer */
  angle?: string;
};

export type House = {
  slug: string;
  name: string;
  origin?: string;
  tagline?: string;
};

export type InspiredBy = {
  name: string;
  slug?: string;
};

export type Perfume = {
  slug: string;
  name: string;
  houseSlug: string;
  type: PerfumeType;
  gender: Gender;
  price: number;
  sizeMl: number;
  description: string;
  concentration: string;
  longevity?: string;
  sillage?: string;
  occasions: Occasion[];
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  /** Olfactory affinity 0–100. Not chemical composition. */
  profile: Partial<Record<ScentProfile, number>>;
  images: ProductImage[];
  featured?: boolean;
  inspiredBy?: InspiredBy;
};

export type CatalogFilters = {
  gender?: Gender;
  type?: PerfumeType;
  house?: string;
  profile?: ScentProfile;
  occasion?: Occasion;
  priceSlug?: string;
  query?: string;
  featured?: boolean;
};

export type PriceRange = {
  slug: string;
  label: string;
  hint: string;
  min: number;
  max: number;
};
