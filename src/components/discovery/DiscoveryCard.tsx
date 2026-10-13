import Link from "next/link";

type Props = {
  href: string;
  title: string;
  description?: string;
  accent?: string;
  meta?: string;
};

export function DiscoveryCard({ href, title, description, accent, meta }: Props) {
  return (
    <Link
      href={href}
      className="group block border border-beige bg-ivory p-6 transition-colors hover:border-champagne"
    >
      {accent ? (
        <span
          className="mb-5 block h-1 w-10"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
      ) : null}
      {meta ? (
        <p className="mb-2 text-[10px] tracking-[0.22em] text-champagne uppercase">{meta}</p>
      ) : null}
      <h3 className="font-serif text-2xl text-charcoal group-hover:text-charcoal-soft">
        {title}
      </h3>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-charcoal/65">{description}</p>
      ) : null}
    </Link>
  );
}
