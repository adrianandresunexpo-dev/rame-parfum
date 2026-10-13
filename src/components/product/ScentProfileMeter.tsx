import { getProfileMeta } from "@/data/taxonomies";
import { relevantProfiles } from "@/lib/filters";
import type { Perfume } from "@/types/perfume";

export function ScentProfileMeter({ perfume }: { perfume: Perfume }) {
  const profiles = relevantProfiles(perfume);

  if (profiles.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl">Perfil aromático</h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-charcoal/60">
        Las barras indican el carácter percibido del perfume — afinidad olfativa, no un
        porcentaje de composición química.
      </p>
      <ul className="mt-6 space-y-4">
        {profiles.map((item) => {
          const meta = getProfileMeta(item.slug);
          return (
            <li key={item.slug}>
              <div className="mb-1.5 flex justify-between text-xs tracking-[0.12em] uppercase">
                <span>{meta?.label ?? item.slug}</span>
                <span className="text-charcoal/45">Carácter</span>
              </div>
              <div className="h-1.5 bg-beige">
                <div
                  className="h-1.5"
                  style={{
                    width: `${item.value}%`,
                    backgroundColor: meta?.accent ?? "#B99A63",
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
