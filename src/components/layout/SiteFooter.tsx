import Link from "next/link";
import Image from "next/image";
import { perfumeTypes } from "@/data/taxonomies";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-beige bg-[#edf3f8]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-4 md:px-8">
        <div>
          <div className="flex items-center gap-3.5 mb-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-slate-300 shadow-sm bg-slate-100">
              <Image
                src="/brand/logo.jpg"
                alt="Rame Parfum Logo"
                fill
                className="object-cover scale-[1.12]"
              />
            </div>
            <div>
              <p className="font-serif text-2xl tracking-[0.18em]">RAME</p>
              <p className="text-[10px] tracking-[0.4em] text-champagne uppercase font-medium">
                Parfum
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-charcoal/65">
            Un catálogo para descubrir perfume por aroma, ocasión y casa. Preparado
            para convertirse en tienda.
          </p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.22em] text-champagne uppercase">Explorar</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/hombre">Hombre</Link>
            </li>
            <li>
              <Link href="/mujer">Mujer</Link>
            </li>
            <li>
              <Link href="/unisex">Unisex</Link>
            </li>
            <li>
              <Link href="/catalogo">Catálogo</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.22em] text-champagne uppercase">Tipos</p>
          <ul className="mt-4 space-y-2 text-sm">
            {perfumeTypes.map((type) => (
              <li key={type.slug}>
                <Link href={`/tipo/${type.slug}`}>{type.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.22em] text-champagne uppercase">Casas</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/casas">Todas las casas</Link>
            </li>
            <li>
              <Link href="/perfil/citrico">Descubrir por aroma</Link>
            </li>
            <li>
              <Link href="/ocasion/noche">Por ocasión</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-beige px-5 py-6 text-center text-[11px] tracking-[0.14em] text-charcoal/50 uppercase">
        Rame Parfum · Catálogo · USD
      </div>
    </footer>
  );
}
