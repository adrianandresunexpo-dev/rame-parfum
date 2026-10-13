import { HouseCard } from "@/components/home/HouseCard";
import { HeroBrand } from "@/components/home/HeroBrand";
import { OccasionCard } from "@/components/home/OccasionCard";
import { PriceRangeCard } from "@/components/home/PriceRangeCard";
import { ScentProfileCard } from "@/components/home/ScentProfileCard";
import { TypeCard } from "@/components/home/TypeCard";
import { PerfumeGrid } from "@/components/catalog/PerfumeCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { countPerfumesForHouse, getFeaturedPerfumes, getHouses } from "@/lib/catalog";
import { occasions, perfumeTypes, priceRanges, scentProfiles } from "@/data/taxonomies";

const featuredHouses = 6;

export default function HomePage() {
  const featured = getFeaturedPerfumes();
  const houses = getHouses().slice(0, featuredHouses);

  return (
    <>
      <HeroBrand />

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
        <SectionHeader
          eyebrow="Aroma"
          title="Descubre tu aroma"
          description="El carácter olfativo primero. Cítrico, oud, floral o gourmand, sin importar si el perfume es diseñador, árabe, nicho o inspiración."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {scentProfiles.map((profile) => (
            <ScentProfileCard
              key={profile.slug}
              href={`/perfil/${profile.slug}`}
              title={profile.label}
              accent={profile.accent}
            />
          ))}
        </div>
      </section>

      <section className="border-y border-beige bg-[#efeae1]">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <SectionHeader
            eyebrow="Momento"
            title="Descubre por ocasión"
            description="Elige el momento. El catálogo se abre con esa ocasión ya aplicada."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {occasions.map((item) => (
              <OccasionCard
                key={item.slug}
                href={`/ocasion/${item.slug}`}
                title={item.label}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
        <SectionHeader
          eyebrow="Colección"
          title="Explora por tipo"
          description="Entra en un tipo, recorre sus casas y abre los perfumes que le pertenecen."
        />
        <div className="grid gap-3 md:grid-cols-2">
          {perfumeTypes.map((item) => (
            <TypeCard
              key={item.slug}
              href={`/tipo/${item.slug}`}
              title={item.label}
              description={item.description}
            />
          ))}
        </div>
      </section>

      <section className="border-y border-beige">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <SectionHeader
            eyebrow="Maisons"
            title="Explora por casas"
            description="Una firma, todos sus perfumes. Después podrás seguir filtrando por tipo, género o aroma."
            action={
              <Button href="/casas" variant="ghost">
                Ver todas
              </Button>
            }
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {houses.map((house) => (
              <HouseCard
                key={house.slug}
                href={`/casas/${house.slug}`}
                name={house.name}
                tagline={house.tagline}
                count={countPerfumesForHouse(house.slug)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
        <SectionHeader
          eyebrow="USD"
          title="Explora por precio"
          description="Rangos pensados para el inventario actual. Se podrán ajustar cuando el catálogo real esté en marcha."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {priceRanges.map((range) => (
            <PriceRangeCard
              key={range.slug}
              href={`/precio/${range.slug}`}
              title={range.label}
              hint={range.hint}
            />
          ))}
        </div>
      </section>

      <section className="border-t border-beige bg-[#efeae1]">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <SectionHeader
            eyebrow="Selección"
            title="Perfumes destacados"
            action={
              <Button href="/catalogo" variant="ghost">
                Ver catálogo
              </Button>
            }
          />
          <PerfumeGrid perfumes={featured} />
        </div>
      </section>
    </>
  );
}
