import Link from "next/link";

type Props = {
  href: string;
  title: string;
  description: string;
};

export function OccasionCard({ href, title, description }: Props) {
  return (
    <Link
      href={href}
      className="group flex min-h-[11rem] flex-col justify-end border border-beige bg-ivory p-6 transition-colors hover:bg-[#efeae1]"
    >
      <h3 className="font-serif text-2xl text-charcoal">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{description}</p>
    </Link>
  );
}
