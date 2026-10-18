"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { genders } from "@/data/taxonomies";
import { SearchField } from "@/components/layout/SearchField";

const typeLinks = [
  { href: "/tipo/disenador", label: "Diseñador" },
  { href: "/tipo/arabe", label: "Árabes" },
  { href: "/tipo/nicho", label: "Nicho" },
  { href: "/tipo/inspiracion", label: "Inspiraciones" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-beige/80 bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-3.5 shrink-0 group" onClick={() => setOpen(false)}>
          <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-slate-300/80 shadow-sm transition-transform duration-300 group-hover:scale-105 bg-slate-100">
            <Image
              src="/brand/logo.jpg"
              alt="Logo Rame Parfum"
              fill
              className="object-cover scale-[1.12]"
              priority
            />
          </div>
          <div>
            <span className="block font-serif text-2xl leading-none tracking-[0.18em] text-charcoal">
              RAME
            </span>
            <span className="mt-1 block text-[10px] tracking-[0.42em] text-champagne uppercase font-medium">
              Parfum
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Género">
          {genders.map((gender) => {
            const active = pathname === `/${gender.slug}`;
            return (
              <Link
                key={gender.slug}
                href={`/${gender.slug}`}
                className={`text-[11px] tracking-[0.22em] uppercase transition-colors ${
                  active ? "text-champagne" : "text-charcoal/70 hover:text-charcoal"
                }`}
              >
                {gender.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <Link
            href="/casas"
            className="text-[11px] tracking-[0.18em] text-charcoal/70 uppercase hover:text-charcoal"
          >
            Casas
          </Link>
          <Link
            href="/catalogo"
            className="text-[11px] tracking-[0.18em] text-charcoal/70 uppercase hover:text-charcoal"
          >
            Catálogo
          </Link>
          <SearchField compact />
        </div>

        <button
          type="button"
          className="border border-beige px-3 py-2 text-[10px] tracking-[0.2em] uppercase md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
        >
          {open ? "Cerrar" : "Menú"}
        </button>
      </div>

      <div className="hidden border-t border-beige/70 md:block">
        <div className="mx-auto flex max-w-6xl gap-8 px-5 py-2.5 md:px-8">
          {typeLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[11px] tracking-[0.16em] uppercase ${
                pathname.startsWith(link.href)
                  ? "text-champagne"
                  : "text-charcoal/55 hover:text-charcoal"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {open ? (
        <div className="space-y-6 border-t border-beige px-5 py-6 md:hidden">
          <nav className="flex gap-5" aria-label="Género">
            {genders.map((gender) => (
              <Link
                key={gender.slug}
                href={`/${gender.slug}`}
                onClick={() => setOpen(false)}
                className="text-xs tracking-[0.2em] uppercase"
              >
                {gender.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 text-xs tracking-[0.18em] uppercase">
            {typeLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/casas" onClick={() => setOpen(false)}>
              Casas
            </Link>
            <Link href="/catalogo" onClick={() => setOpen(false)}>
              Catálogo
            </Link>
          </div>
          <SearchField compact />
        </div>
      ) : null}
    </header>
  );
}
