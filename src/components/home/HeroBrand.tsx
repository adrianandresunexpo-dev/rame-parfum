export function HeroBrand() {
  return (
    <section className="relative overflow-hidden border-b border-beige">
      <div className="mx-auto grid min-h-[82vh] max-w-6xl md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-end px-5 py-20 md:px-8 md:py-28">
          <p className="text-[11px] tracking-[0.4em] text-champagne uppercase">
            Rame Parfum
          </p>
          <h1 className="mt-8 max-w-lg font-serif text-4xl leading-[1.05] tracking-wide md:text-6xl">
            El aroma que buscas, antes del nombre.
          </h1>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-charcoal/65 md:text-base">
            Un catálogo editorial para descubrir perfume por carácter, ocasión, casa
            y género. Diseñador, árabe, nicho e inspiración en un mismo gesto.
          </p>
        </div>

        <div
          className="relative hidden min-h-[420px] border-l border-beige md:block"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[#efeae1]" />
          <div className="absolute inset-y-16 right-16 left-16 border border-beige/80" />
          <div className="absolute top-1/2 left-1/2 h-[58%] w-px -translate-x-1/2 -translate-y-1/2 bg-champagne/70" />
          <p className="absolute right-10 bottom-12 font-serif text-5xl tracking-[0.28em] text-charcoal/12">
            RAME
          </p>
        </div>
      </div>
    </section>
  );
}
