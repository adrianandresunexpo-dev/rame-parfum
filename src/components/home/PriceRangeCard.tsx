import Link from "next/link";

type Props = {
  href: string;
  title: string;
  hint: string;
};

export function PriceRangeCard({ href, title, hint }: Props) {
  return (
    <Link
      href={href}
      className="group block border border-beige bg-ivory px-6 py-8 text-center"
    >
      <h3 className="font-serif text-2xl text-charcoal">{title}</h3>
      <p className="mt-3 text-sm text-charcoal/55">{hint}</p>
    </Link>
  );
}
