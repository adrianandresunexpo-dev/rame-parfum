import Link from "next/link";

type Props = {
  href: string;
  title: string;
  description: string;
};

export function TypeCard({ href, title, description }: Props) {
  return (
    <Link
      href={href}
      className="group block border border-beige bg-ivory p-8 md:p-10"
    >
      <p className="text-[10px] tracking-[0.24em] text-champagne uppercase">Tipo</p>
      <h3 className="mt-4 font-serif text-3xl text-charcoal md:text-4xl">{title}</h3>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal/65">{description}</p>
      <p className="mt-8 text-[11px] tracking-[0.18em] text-charcoal/40 uppercase transition-colors group-hover:text-champagne">
        Casas y perfumes
      </p>
    </Link>
  );
}
