import type { Perfume } from "@/types/perfume";

const layers = [
  { key: "top" as const, label: "Salida" },
  { key: "heart" as const, label: "Corazón" },
  { key: "base" as const, label: "Fondo" },
];

export function NotePyramid({ perfume }: { perfume: Perfume }) {
  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl">Pirámide olfativa</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {layers.map((layer) => (
          <div key={layer.key} className="border border-beige p-5">
            <p className="text-[10px] tracking-[0.22em] text-champagne uppercase">
              {layer.label}
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-charcoal/80">
              {perfume.notes[layer.key].map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
