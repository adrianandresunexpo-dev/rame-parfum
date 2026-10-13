import Link from "next/link";

type Props = {
  href: string;
  title: string;
  accent: string;
};

export function ScentProfileCard({ href, title, accent }: Props) {
  return (
    <Link href={href} className="group relative block overflow-hidden border border-beige bg-ivory">
      <span
        className="absolute inset-y-0 left-0 w-1.5 transition-all duration-300 group-hover:w-2.5"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      <div className="px-7 py-8">
        <p className="text-[10px] tracking-[0.24em] text-charcoal/40 uppercase">Perfil</p>
        <h3 className="mt-3 font-serif text-2xl text-charcoal">{title}</h3>
      </div>
    </Link>
  );
}
