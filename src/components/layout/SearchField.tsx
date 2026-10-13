"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchField({
  initialQuery = "",
  compact = false,
}: {
  initialQuery?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const q = value.trim();
    const href = q ? `/catalogo?q=${encodeURIComponent(q)}` : "/catalogo";
    router.push(href);
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "w-full" : "w-full max-w-md"}>
      <label className="sr-only" htmlFor="catalog-search">
        Buscar por nombre, casa, notas o perfil aromático
      </label>
      <input
        id="catalog-search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Buscar cítrico, oud, Lattafa…"
        className="w-full border border-beige bg-ivory px-4 py-2.5 text-sm text-charcoal outline-none placeholder:text-charcoal/40 focus:border-champagne"
      />
    </form>
  );
}
