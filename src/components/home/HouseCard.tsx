import Link from "next/link";

type Props = {
  href: string;
  name: string;
  tagline?: string;
  count: number;
};

export function HouseCard({ href, name, tagline, count }: Props) {
  return (
    <Link href={href} className="group block border border-beige bg-ivory p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-serif text-2xl text-charcoal">{name}</h3>
        <span className="text-[10px] tracking-[0.16em] text-charcoal/40 uppercase">
          {count} {count === 1 ? "perfume" : "perfumes"}
        </span>
      </div>
      {tagline ? (
        <p className="mt-3 text-sm leading-relaxed text-charcoal/60">{tagline}</p>
      ) : null}
    </Link>
  );
}
