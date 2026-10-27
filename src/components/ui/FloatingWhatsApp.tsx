"use client";

export function FloatingWhatsApp() {
  const phoneNumber = "584129221902";
  const defaultMessage = "¡Hola Rame Parfum! Me gustaría consultar sobre su catálogo de perfumes.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <aside
      aria-label="Atención al cliente por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 group"
    >
      {/* Tooltip flotante */}
      <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-charcoal/90 px-3 py-1.5 text-xs text-white shadow-lg backdrop-blur-sm opacity-90 transition-opacity group-hover:opacity-100">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
        </span>
        <span className="font-medium tracking-wide">¿Dudas? Escríbenos</span>
      </div>

      {/* Botón circular principal */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir chat de WhatsApp con Rame Parfum"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_30px_rgba(37,211,102,0.55)] active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="currentColor"
          className="translate-x-[0.5px]"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.02L7.55 18.84L4.44 19.66L5.27 16.63L5.07 16.31C4.24 15 3.81 13.48 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.69C7.02 10.9 7.9 12.07 8.02 12.24C8.15 12.4 9.7 14.94 12.16 15.91C14.21 16.71 14.62 16.55 15.07 16.51C15.52 16.47 16.52 15.91 16.72 15.33C16.93 14.75 16.93 14.25 16.86 14.15C16.8 14.05 16.64 13.99 16.39 13.86C16.14 13.74 14.93 13.14 14.71 13.06C14.48 12.98 14.32 12.94 14.15 13.19C13.99 13.44 13.52 14.05 13.38 14.22C13.23 14.38 13.09 14.4 12.84 14.28C12.59 14.15 11.78 13.89 10.82 13.03C10.07 12.36 9.56 11.53 9.42 11.28C9.27 11.03 9.4 10.9 9.53 10.77C9.64 10.66 9.78 10.48 9.9 10.34C10.03 10.2 10.07 10.1 10.15 9.93C10.24 9.77 10.19 9.62 10.13 9.5C10.07 9.38 9.6 8.23 9.4 7.76C9.21 7.3 9.02 7.36 8.87 7.35C8.73 7.35 8.57 7.33 8.53 7.33Z" />
        </svg>
      </a>
    </aside>
  );
}
