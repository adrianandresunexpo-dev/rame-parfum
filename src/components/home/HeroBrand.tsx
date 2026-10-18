import Image from "next/image";

export function HeroBrand() {
  return (
    <section className="relative overflow-hidden border-b border-beige">
      <div className="mx-auto grid min-h-[82vh] max-w-6xl md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-end px-5 py-20 md:px-8 md:py-28">
          <p className="text-[11px] tracking-[0.4em] text-champagne uppercase font-semibold">
            Rame Parfum
          </p>
          <h1 className="mt-8 max-w-lg font-serif text-4xl leading-[1.05] tracking-wide md:text-6xl text-charcoal">
            El aroma que buscas, antes del nombre.
          </h1>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-charcoal/65 md:text-base">
            Un catálogo editorial para descubrir perfume por carácter, ocasión, casa
            y género. Diseñador, árabe, nicho e inspiración en un mismo gesto.
          </p>
        </div>

        <div
          className="relative hidden min-h-[420px] border-l border-beige md:flex md:items-center md:justify-center overflow-hidden"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[#edf3f8]" />
          <div className="absolute inset-y-16 right-16 left-16 border border-beige/80" />
          <div className="absolute top-1/2 left-1/2 h-[65%] w-px -translate-x-1/2 -translate-y-1/2 bg-champagne/30" />
          
          <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
            <div className="relative h-44 w-44 overflow-hidden rounded-full shadow-[0_20px_45px_rgba(15,35,60,0.18)] ring-4 ring-white/90 bg-white">
              <Image
                src="/brand/logo.jpg"
                alt="Emblema Rame Parfum"
                fill
                className="object-cover scale-[1.12]"
                priority
              />
            </div>
            <p className="mt-6 font-serif text-2xl tracking-[0.25em] text-charcoal uppercase">
              RAME
            </p>
            <p className="mt-1 text-[10px] tracking-[0.45em] text-champagne uppercase font-medium">
              Parfum
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
