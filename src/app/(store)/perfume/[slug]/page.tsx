import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHouse } from "@/data/houses";
import { perfumes } from "@/data/perfumes";
import { getPerfume, getPerfumesByHouse } from "@/lib/catalog";
import { ProductGallery, BottleViewerPlaceholder } from "@/components/product/ProductGallery";
import {
  ProductHeader,
  AvailabilityCta,
  ProductMeta,
  OccasionTags,
} from "@/components/product/ProductHeader";
import { NotePyramid } from "@/components/product/NotePyramid";
import { ScentProfileMeter } from "@/components/product/ScentProfileMeter";
import { PerfumeCard } from "@/components/catalog/PerfumeCard";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return perfumes.map((perfume) => ({
    slug: perfume.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const perfume = getPerfume(slug);
  if (!perfume) return { title: "Perfume no encontrado | Rame Parfum" };

  const house = getHouse(perfume.houseSlug);
  return {
    title: `${perfume.name} · ${house?.name ?? "Rame Parfum"}`,
    description: perfume.description,
  };
}

export default async function PerfumePage({ params }: Props) {
  const { slug } = await params;
  const perfume = getPerfume(slug);

  if (!perfume) {
    notFound();
  }

  const house = getHouse(perfume.houseSlug);
  const relatedFromHouse = getPerfumesByHouse(perfume.houseSlug)
    .filter((item) => item.slug !== perfume.slug)
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16">
      {/* Breadcrumbs editoriales */}
      <nav aria-label="Ruta de navegación" className="mb-8">
        <ol className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-charcoal/50 uppercase">
          <li>
            <Link href="/" className="hover:text-charcoal">
              Inicio
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/catalogo" className="hover:text-charcoal">
              Catálogo
            </Link>
          </li>
          {house ? (
            <>
              <li>/</li>
              <li>
                <Link href={`/casas/${house.slug}`} className="hover:text-charcoal">
                  {house.name}
                </Link>
              </li>
            </>
          ) : null}
          <li>/</li>
          <li className="text-charcoal font-medium">{perfume.name}</li>
        </ol>
      </nav>

      {/* Grid principal de la ficha */}
      <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
        {/* Columna Izquierda: Galería visual */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <ProductGallery
            images={perfume.images}
            name={perfume.name}
            houseName={house?.name}
            concentration={perfume.concentration}
            sizeMl={perfume.sizeMl}
          />
          <BottleViewerPlaceholder />
        </div>

        {/* Columna Derecha: Información completa */}
        <div className="lg:col-span-7">
          <ProductHeader perfume={perfume} />

          {/* Descripción editorial */}
          <section className="mt-8">
            <h2 className="text-[10px] tracking-[0.2em] text-charcoal/45 uppercase">
              Carácter y composición
            </h2>
            <p className="mt-3 text-base leading-relaxed text-charcoal/80">
              {perfume.description}
            </p>
          </section>

          <ProductMeta perfume={perfume} />

          <AvailabilityCta />

          {/* Perfil aromático (Barras de afinidad olfativa) */}
          <ScentProfileMeter perfume={perfume} />

          {/* Pirámide olfativa (Salida, Corazón, Fondo) */}
          <NotePyramid perfume={perfume} />

          {/* Ocasiones de uso */}
          <OccasionTags perfume={perfume} />
        </div>
      </div>

      {/* Recomendaciones / Otros perfumes de la misma casa */}
      {relatedFromHouse.length > 0 ? (
        <section className="mt-24 border-t border-beige pt-16">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] tracking-[0.22em] text-champagne uppercase">
                Maison {house?.name}
              </p>
              <h2 className="mt-2 font-serif text-3xl">Más creaciones de esta casa</h2>
            </div>
            {house ? (
              <Link
                href={`/casas/${house.slug}`}
                className="text-xs tracking-[0.16em] text-charcoal/60 uppercase hover:text-charcoal underline underline-offset-4"
              >
                Ver todas ({relatedFromHouse.length + 1})
              </Link>
            ) : null}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedFromHouse.map((related) => (
              <PerfumeCard key={related.slug} perfume={related} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
