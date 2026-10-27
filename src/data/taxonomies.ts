import type {
  Gender,
  Occasion,
  PerfumeType,
  PriceRange,
  ScentProfile,
} from "@/types/perfume";

export const genders: { slug: Gender; label: string }[] = [
  { slug: "hombre", label: "Hombre" },
  { slug: "mujer", label: "Mujer" },
  { slug: "unisex", label: "Unisex" },
];

export const perfumeTypes: {
  slug: PerfumeType;
  label: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    slug: "disenador",
    label: "Diseñador",
    shortLabel: "Diseñador",
    description:
      "Creaciones de las grandes maisons de moda. Firmas reconocibles, pulidas y pensadas para el día a día y las ocasiones especiales.",
  },
  {
    slug: "arabe",
    label: "Árabes",
    shortLabel: "Árabe",
    description:
      "Composiciones de casas del Golfo y Oriente Medio: ámbar, oud, especias y dulzura opulenta, con una estela generosa.",
  },
  {
    slug: "nicho",
    label: "Nicho",
    shortLabel: "Nicho",
    description:
      "Perfumería de autor, con fórmulas más libres y materias primas protagonistas. Piezas para quien busca un carácter distinto.",
  },
  {
    slug: "inspiracion",
    label: "Inspiraciones",
    shortLabel: "Inspiración",
    description:
      "Interpretaciones accesibles de perfumes conocidos. Una forma de explorar un perfil aromático con otro precio y otra firma.",
  },
];

export const scentProfiles: {
  slug: ScentProfile;
  label: string;
  accent: string;
  displayNotes: string[];
  searchTerms: string[];
}[] = [
  {
    slug: "citrico",
    label: "Cítrico",
    accent: "#C6B43A",
    displayNotes: ["Bergamota", "Limón", "Mandarina", "Pomelo", "Naranja", "Lima"],
    searchTerms: [
      "citrico",
      "cítrico",
      "citricos",
      "bergamota",
      "limon",
      "limón",
      "naranja",
      "pomelo",
      "mandarina",
      "lima",
    ],
  },
  {
    slug: "fresco",
    label: "Fresco",
    accent: "#7A9E8A",
    displayNotes: ["Menta", "Lavanda", "Romero", "Acordes aromáticos", "Brisa marina"],
    searchTerms: ["fresco", "frescura", "menta", "lavanda", "aromatico"],
  },
  {
    slug: "acuatico",
    label: "Acuático",
    accent: "#5B8FA8",
    displayNotes: ["Notas marinas", "Brisa oceánica", "Algas", "Agua fresca", "Loto"],
    searchTerms: ["acuatico", "acuático", "marino", "agua", "oceano", "océano"],
  },
  {
    slug: "floral",
    label: "Floral",
    accent: "#C9A3B0",
    displayNotes: ["Rosa", "Jazmín", "Peonía", "Flor de azahar", "Iris", "Magnolia"],
    searchTerms: ["floral", "rosa", "jazmin", "jazmín", "flor", "peonia", "peonía"],
  },
  {
    slug: "frutal",
    label: "Frutal",
    accent: "#C47B6A",
    displayNotes: ["Manzana", "Piña", "Durazno", "Frutos rojos", "Melocotón", "Pera"],
    searchTerms: [
      "frutal",
      "fruta",
      "manzana",
      "piña",
      "pina",
      "melocoton",
      "durazno",
      "frutos",
    ],
  },
  {
    slug: "gourmand",
    label: "Dulce / Gourmand",
    accent: "#C08A4A",
    displayNotes: ["Vainilla", "Caramelo", "Praliné", "Chocolate", "Canela", "Haba tonka"],
    searchTerms: [
      "gourmand",
      "dulce",
      "vainilla",
      "caramelo",
      "praline",
      "praliné",
      "chocolate",
      "canela",
    ],
  },
  {
    slug: "especiado",
    label: "Especiado",
    accent: "#B85C38",
    displayNotes: ["Cardamomo", "Pimienta negra", "Canela", "Clavo de olor", "Nuez moscada"],
    searchTerms: ["especiado", "especia", "pimienta", "cardamomo", "clavo", "canela"],
  },
  {
    slug: "ambarado",
    label: "Ambarado",
    accent: "#C4A574",
    displayNotes: ["Ámbar", "Resinas doradas", "Vainilla oriental", "Mirra", "Benjuí"],
    searchTerms: ["ambarado", "ambar", "ámbar", "ámbarado", "amber"],
  },
  {
    slug: "amaderado",
    label: "Amaderado",
    accent: "#6B4F32",
    displayNotes: ["Madera de cedro", "Sándalo", "Vetiver", "Pachulí", "Abedul"],
    searchTerms: ["amaderado", "madera", "cedro", "sándalo", "sandalo", "vetiver", "abedul"],
  },
  {
    slug: "verde",
    label: "Verde",
    accent: "#6B8F71",
    displayNotes: ["Gálbano", "Hojas verdes", "Té verde", "Hierba fresca", "Higo"],
    searchTerms: ["verde", "galbano", "hoja", "hierba", "te verde", "té"],
  },
  {
    slug: "cuero",
    label: "Cuero",
    accent: "#4A3728",
    displayNotes: ["Cuero curtido", "Gamuza", "Ante", "Humo aromático"],
    searchTerms: ["cuero", "leather", "gamuza", "ante"],
  },
  {
    slug: "oud",
    label: "Oud",
    accent: "#2C241C",
    displayNotes: ["Madera de Agar (Oud)", "Resinas oscuras", "Incienso oriental"],
    searchTerms: ["oud", "oudh", "agarwood", "madera de agar"],
  },
];

export const occasions: {
  slug: Occasion;
  label: string;
  description: string;
}[] = [
  { slug: "dia", label: "Día", description: "Luz, frescura y presencia limpia." },
  { slug: "noche", label: "Noche", description: "Más cuerpo, más estela, más misterio." },
  { slug: "trabajo", label: "Trabajo", description: "Pulido, cercano y profesional." },
  { slug: "casual", label: "Casual", description: "Cómodo, cotidiano, sin esfuerzo." },
  { slug: "citas", label: "Citas", description: "Cercanía, carácter y recuerdo." },
  { slug: "eventos", label: "Eventos", description: "Presencia para ocasiones formales." },
  { slug: "salidas", label: "Salidas", description: "Energía para la noche fuera." },
];

export const priceRanges: PriceRange[] = [
  {
    slug: "hasta-50",
    label: "Hasta $50",
    hint: "Entrada accesible",
    min: 0,
    max: 50,
  },
  {
    slug: "50-100",
    label: "$50 — $100",
    hint: "Equilibrio diario",
    min: 50,
    max: 100,
  },
  {
    slug: "100-200",
    label: "$100 — $200",
    hint: "Firmas de diseñador",
    min: 100,
    max: 200,
  },
  {
    slug: "200-plus",
    label: "Más de $200",
    hint: "Nicho y piezas de autor",
    min: 200,
    max: Number.POSITIVE_INFINITY,
  },
];

export function getGenderLabel(slug: Gender) {
  return genders.find((item) => item.slug === slug)?.label ?? slug;
}

export function getTypeLabel(slug: PerfumeType) {
  return perfumeTypes.find((item) => item.slug === slug)?.label ?? slug;
}

export function getTypeMeta(slug: PerfumeType) {
  return perfumeTypes.find((item) => item.slug === slug);
}

export function getProfileMeta(slug: ScentProfile) {
  return scentProfiles.find((item) => item.slug === slug);
}

export function getOccasionMeta(slug: Occasion) {
  return occasions.find((item) => item.slug === slug);
}

export function getPriceRange(slug: string) {
  return priceRanges.find((item) => item.slug === slug);
}
