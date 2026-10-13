type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function SectionHeader({ eyebrow, title, description, action }: Props) {
  return (
    <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-3 text-[11px] tracking-[0.28em] text-champagne uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-serif text-3xl leading-tight text-charcoal md:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-charcoal/70">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
