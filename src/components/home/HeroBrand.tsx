import Image from "next/image";
import Link from "next/link";

export function HeroBrand() {
  const whatsappUrl = `https://wa.me/584129221902?text=${encodeURIComponent(
    "¡Hola Rame Parfum! Me comunico desde su página web, quisiera consultar sobre su catálogo."
  )}`;

  return (
    <section className="relative overflow-hidden border-b border-beige bg-gradient-to-b from-white/60 via-transparent to-[#edf3f8]/40">
      <div className="mx-auto grid max-w-6xl md:min-h-[78vh] md:grid-cols-[1.1fr_0.9fr]">
        {/* Contenido principal (Móvil y Desktop) */}
        <div className="flex flex-col justify-center px-5 py-10 sm:py-16 md:px-8 md:py-24 text-center md:text-left items-center md:items-start">
          {/* Logo en grande para Móvil (aparece solo en pantallas pequeñas) */}
          <div className="md:hidden mb-7 flex flex-col items-center">
            <div className="relative h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-full shadow-[0_15px_35px_rgba(15,35,60,0.18)] ring-4 ring-white bg-white">
              <Image
                src="/brand/logo.jpg"
                alt="Logo Rame Parfum"
                fill
                className="object-cover scale-[1.12]"
                priority
              />
            </div>
            <p className="mt-3.5 font-serif text-2xl tracking-[0.25em] text-charcoal uppercase">
              RAME
            </p>
            <p className="text-[10px] tracking-[0.45em] text-champagne uppercase font-medium">
              Parfum
            </p>
          </div>

          <p className="text-[11px] tracking-[0.35em] text-champagne uppercase font-semibold">
            Rame Parfum · Catálogo Exclusivo
          </p>

          <h1 className="mt-4 sm:mt-6 max-w-lg font-serif text-3xl sm:text-5xl md:text-6xl leading-[1.1] tracking-wide text-charcoal">
            El aroma que buscas, antes del nombre.
          </h1>

          <p className="mt-4 sm:mt-6 max-w-md text-xs sm:text-sm md:text-base leading-relaxed text-charcoal/70">
            Un catálogo editorial para descubrir perfume por carácter, ocasión, casa
            y género. Diseñador, árabe, nicho e inspiración en un mismo lugar.
          </p>

          {/* Botones de acción rápida */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/catalogo"
              className="w-full sm:w-auto text-center px-6 py-3 bg-champagne hover:bg-champagne-light text-white text-xs tracking-[0.16em] uppercase font-medium transition-colors shadow-sm"
            >
              Ver Catálogo Completo
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 border border-[#25D366] bg-white hover:bg-[#25D366] text-[#25D366] hover:text-white text-xs tracking-[0.14em] uppercase font-medium transition-all shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.02L7.55 18.84L4.44 19.66L5.27 16.63L5.07 16.31C4.24 15 3.81 13.48 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.69C7.02 10.9 7.9 12.07 8.02 12.24C8.15 12.4 9.7 14.94 12.16 15.91C14.21 16.71 14.62 16.55 15.07 16.51C15.52 16.47 16.52 15.91 16.72 15.33C16.93 14.75 16.93 14.25 16.86 14.15C16.8 14.05 16.64 13.99 16.39 13.86C16.14 13.74 14.93 13.14 14.71 13.06C14.48 12.98 14.32 12.94 14.15 13.19C13.99 13.44 13.52 14.05 13.38 14.22C13.23 14.38 13.09 14.4 12.84 14.28C12.59 14.15 11.78 13.89 10.82 13.03C10.07 12.36 9.56 11.53 9.42 11.28C9.27 11.03 9.4 10.9 9.53 10.77C9.64 10.66 9.78 10.48 9.9 10.34C10.03 10.2 10.07 10.1 10.15 9.93C10.24 9.77 10.19 9.62 10.13 9.5C10.07 9.38 9.6 8.23 9.4 7.76C9.21 7.3 9.02 7.36 8.87 7.35C8.73 7.35 8.57 7.33 8.53 7.33Z" />
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Panel lateral con Medallón (Visible en Pantallas Medianas y Grandes) */}
        <div
          className="relative hidden min-h-[420px] border-l border-beige md:flex md:items-center md:justify-center overflow-hidden"
          aria-hidden="true"
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
