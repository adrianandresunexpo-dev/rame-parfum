"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { houses } from "@/data/houses";
import {
  genders,
  occasions,
  perfumeTypes,
  priceRanges,
  scentProfiles,
} from "@/data/taxonomies";
import {
  filtersFromSearchParams,
  mergeFilters,
  parsePathContext,
  toSearchParams,
} from "@/lib/routes";
import type { CatalogFilters } from "@/types/perfume";

function Chip({
  active,
  locked,
  children,
  onClick,
}: {
  active: boolean;
  locked?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locked && active}
      suppressHydrationWarning
      className={`border px-3 py-1.5 text-[11px] tracking-[0.12em] uppercase transition-colors ${
        active
          ? "border-champagne bg-champagne text-white shadow-sm font-medium"
          : "border-beige bg-white/70 text-charcoal/80 hover:border-champagne hover:text-champagne hover:bg-white"
      } ${locked && active ? "cursor-default opacity-90" : ""}`}
    >
      {children}
    </button>
  );
}

export function FilterPanel() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locked, basePath } = parsePathContext(pathname);
  const query = filtersFromSearchParams(searchParams);
  const filters = mergeFilters(locked, query);

  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on Escape key
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    }
    if (mobileOpen) {
      window.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function update(next: CatalogFilters) {
    const params = toSearchParams(next, locked);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
  }

  function toggle<K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) {
    if (locked[key]) return;
    const current = filters[key];
    update({ ...filters, [key]: current === value ? undefined : value });
  }

  function clearAll() {
    update({});
  }

  const activeCount = [
    filters.gender && !locked.gender,
    filters.type && !locked.type,
    filters.house && !locked.house,
    filters.profile && !locked.profile,
    filters.occasion && !locked.occasion,
    filters.priceSlug && !locked.priceSlug,
  ].filter(Boolean).length;

  // Estado de secciones colapsables (acordeón)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    gender: true,
    type: true,
    priceSlug: true, // Precio visible para que no quede enterrado abajo
    house: false,
    profile: false,
    occasion: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const filterContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-beige/60 pb-3 mb-2">
        <p className="text-[11px] tracking-[0.24em] text-champagne uppercase font-medium">
          Filtros {activeCount > 0 ? `(${activeCount})` : ""}
        </p>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={clearAll}
            className="text-[10px] tracking-[0.16em] text-charcoal/60 uppercase underline underline-offset-4 hover:text-charcoal"
          >
            Limpiar todo
          </button>
        ) : null}
      </div>

      {/* GÉNERO */}
      {!locked.gender ? (
        <fieldset className="border-b border-beige/40 pb-4">
          <legend className="w-full">
            <button
              type="button"
              onClick={() => toggleSection("gender")}
              className="flex w-full items-center justify-between py-1 text-left text-xs tracking-[0.16em] text-charcoal/80 uppercase hover:text-charcoal focus:outline-none"
            >
              <span className="font-semibold flex items-center gap-2">
                Género
                {filters.gender && (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-champagne" />
                )}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 text-charcoal/50 ${
                  openSections.gender ? "rotate-180" : ""
                }`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </legend>
          {openSections.gender && (
            <div className="flex flex-wrap gap-2 pt-3">
              {genders.map((item) => (
                <Chip
                  key={item.slug}
                  active={filters.gender === item.slug}
                  onClick={() => toggle("gender", item.slug)}
                >
                  {item.label}
                </Chip>
              ))}
            </div>
          )}
        </fieldset>
      ) : null}

      {/* TIPO */}
      {!locked.type ? (
        <fieldset className="border-b border-beige/40 pb-4">
          <legend className="w-full">
            <button
              type="button"
              onClick={() => toggleSection("type")}
              className="flex w-full items-center justify-between py-1 text-left text-xs tracking-[0.16em] text-charcoal/80 uppercase hover:text-charcoal focus:outline-none"
            >
              <span className="font-semibold flex items-center gap-2">
                Tipo
                {filters.type && (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-champagne" />
                )}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 text-charcoal/50 ${
                  openSections.type ? "rotate-180" : ""
                }`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </legend>
          {openSections.type && (
            <div className="flex flex-wrap gap-2 pt-3">
              {perfumeTypes.map((item) => (
                <Chip
                  key={item.slug}
                  active={filters.type === item.slug}
                  onClick={() => toggle("type", item.slug)}
                >
                  {item.shortLabel}
                </Chip>
              ))}
            </div>
          )}
        </fieldset>
      ) : null}

      {/* PRECIO (USD) - Puesto antes para que sea fácil de encontrar */}
      {!locked.priceSlug ? (
        <fieldset className="border-b border-beige/40 pb-4">
          <legend className="w-full">
            <button
              type="button"
              onClick={() => toggleSection("priceSlug")}
              className="flex w-full items-center justify-between py-1 text-left text-xs tracking-[0.16em] text-charcoal/80 uppercase hover:text-charcoal focus:outline-none"
            >
              <span className="font-semibold flex items-center gap-2">
                Precio (USD)
                {filters.priceSlug && (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-champagne" />
                )}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 text-charcoal/50 ${
                  openSections.priceSlug ? "rotate-180" : ""
                }`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </legend>
          {openSections.priceSlug && (
            <div className="flex flex-wrap gap-2 pt-3">
              {priceRanges.map((item) => (
                <Chip
                  key={item.slug}
                  active={filters.priceSlug === item.slug}
                  onClick={() => toggle("priceSlug", item.slug)}
                >
                  {item.label}
                </Chip>
              ))}
            </div>
          )}
        </fieldset>
      ) : null}

      {/* CASA */}
      {!locked.house ? (
        <fieldset className="border-b border-beige/40 pb-4">
          <legend className="w-full">
            <button
              type="button"
              onClick={() => toggleSection("house")}
              className="flex w-full items-center justify-between py-1 text-left text-xs tracking-[0.16em] text-charcoal/80 uppercase hover:text-charcoal focus:outline-none"
            >
              <span className="font-semibold flex items-center gap-2">
                Casa / Marca
                {filters.house && (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-champagne" />
                )}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 text-charcoal/50 ${
                  openSections.house ? "rotate-180" : ""
                }`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </legend>
          {openSections.house && (
            <div className="flex flex-wrap gap-2 pt-3 max-h-60 overflow-y-auto pr-1">
              {houses.map((item) => (
                <Chip
                  key={item.slug}
                  active={filters.house === item.slug}
                  onClick={() => toggle("house", item.slug)}
                >
                  {item.name}
                </Chip>
              ))}
            </div>
          )}
        </fieldset>
      ) : null}

      {/* PERFIL AROMÁTICO */}
      {!locked.profile ? (
        <fieldset className="border-b border-beige/40 pb-4">
          <legend className="w-full">
            <button
              type="button"
              onClick={() => toggleSection("profile")}
              className="flex w-full items-center justify-between py-1 text-left text-xs tracking-[0.16em] text-charcoal/80 uppercase hover:text-charcoal focus:outline-none"
            >
              <span className="font-semibold flex items-center gap-2">
                Perfil aromático
                {filters.profile && (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-champagne" />
                )}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 text-charcoal/50 ${
                  openSections.profile ? "rotate-180" : ""
                }`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </legend>
          {openSections.profile && (
            <div className="flex flex-wrap gap-2 pt-3">
              {scentProfiles.map((item) => (
                <Chip
                  key={item.slug}
                  active={filters.profile === item.slug}
                  onClick={() => toggle("profile", item.slug)}
                >
                  {item.label}
                </Chip>
              ))}
            </div>
          )}
        </fieldset>
      ) : null}

      {/* OCASIÓN */}
      {!locked.occasion ? (
        <fieldset className="border-b border-beige/40 pb-4">
          <legend className="w-full">
            <button
              type="button"
              onClick={() => toggleSection("occasion")}
              className="flex w-full items-center justify-between py-1 text-left text-xs tracking-[0.16em] text-charcoal/80 uppercase hover:text-charcoal focus:outline-none"
            >
              <span className="font-semibold flex items-center gap-2">
                Ocasión
                {filters.occasion && (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-champagne" />
                )}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 text-charcoal/50 ${
                  openSections.occasion ? "rotate-180" : ""
                }`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </legend>
          {openSections.occasion && (
            <div className="flex flex-wrap gap-2 pt-3">
              {occasions.map((item) => (
                <Chip
                  key={item.slug}
                  active={filters.occasion === item.slug}
                  onClick={() => toggle("occasion", item.slug)}
                >
                  {item.label}
                </Chip>
              ))}
            </div>
          )}
        </fieldset>
      ) : null}
    </div>
  );

  return (
    <>
      {/* Botón y barra para Mobile (< lg) */}
      <div className="lg:hidden mb-6 flex items-center justify-between border border-beige bg-ivory p-3">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 border border-charcoal bg-charcoal px-4 py-2 text-[11px] tracking-[0.16em] text-ivory uppercase"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filtros {activeCount > 0 ? `(${activeCount})` : ""}
        </button>

        {activeCount > 0 ? (
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] tracking-[0.14em] text-charcoal/65 uppercase underline hover:text-charcoal"
          >
            Limpiar ({activeCount})
          </button>
        ) : (
          <span className="text-[11px] tracking-[0.14em] text-charcoal/45 uppercase">
            Sin filtros activos
          </span>
        )}
      </div>

      {/* Drawer Móvil (Slide-over / Bottom sheet) */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto flex h-full w-full max-w-sm flex-col bg-ivory p-6 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between border-b border-beige pb-4 mb-6">
              <span className="font-serif text-2xl text-charcoal">Filtros</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="border border-beige p-2 text-xs tracking-wider uppercase text-charcoal hover:border-champagne"
                aria-label="Cerrar filtros"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="flex-1 pb-6">{filterContent}</div>

            <div className="sticky bottom-0 border-t border-beige bg-ivory pt-4">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-full bg-charcoal py-3 text-[11px] tracking-[0.2em] text-ivory uppercase"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Panel Desktop (Sidebar clásico) */}
      <div className="hidden lg:block border border-beige bg-ivory p-6">
        {filterContent}
      </div>
    </>
  );
}
