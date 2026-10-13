import { Suspense } from "react";
import { FilterPanel } from "@/components/catalog/FilterPanel";
import { PerfumeGrid } from "@/components/catalog/PerfumeCard";
import { SearchField } from "@/components/layout/SearchField";
import type { Perfume } from "@/types/perfume";

type Props = {
  title: string;
  description?: string;
  eyebrow?: string;
  perfumes: Perfume[];
  query?: string;
  intro?: React.ReactNode;
};

export function CatalogView({
  title,
  description,
  eyebrow,
  perfumes,
  query,
  intro,
}: Props) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <p className="text-[11px] tracking-[0.28em] text-champagne uppercase">
        {eyebrow ?? "Catálogo"}
      </p>
      <h1 className="mt-3 font-serif text-4xl md:text-5xl">{title}</h1>
      {description ? (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal/70">
          {description}
        </p>
      ) : null}

      {intro}

      <div className="mt-8 max-w-md">
        <SearchField initialQuery={query} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <Suspense
          fallback={
            <div className="border border-beige p-6 text-sm text-charcoal/50">
              Cargando filtros…
            </div>
          }
        >
          <FilterPanel />
        </Suspense>
        <div>
          <p className="mb-6 text-xs tracking-[0.16em] text-charcoal/50 uppercase">
            {perfumes.length} perfume{perfumes.length === 1 ? "" : "s"}
          </p>
          <PerfumeGrid perfumes={perfumes} />
        </div>
      </div>
    </div>
  );
}
