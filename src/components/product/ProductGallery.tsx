"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types/perfume";

interface ProductGalleryProps {
  images: ProductImage[];
  name: string;
  houseName?: string;
  concentration?: string;
  sizeMl?: number;
}

export function ProductGallery({
  images,
  name,
  houseName,
  concentration,
  sizeMl,
}: ProductGalleryProps) {
  const hero = images.find((item) => item.role === "hero") ?? images[0];

  // Modos de visualización: Estudio 360 interactivo o Fotografía HD
  const [activeTab, setActiveTab] = useState<"360" | "photo">("360");

  // Estado del visor 360
  const [rotationY, setRotationY] = useState(0);
  const [tiltX, setTiltX] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [speed, setSpeed] = useState<"slow" | "normal">("slow");
  const [isZoomed, setIsZoomed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Referencias para animación y arrastre
  const stageRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastPointerPos = useRef<{ x: number; y: number } | null>(null);
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Velocidad de giro: "slow" muy pausado para detallar (~0.22°/frame) o "normal" (~0.5°/frame)
  const rotationIncrement = speed === "slow" ? 0.22 : 0.55;

  // Ciclo de animación continua (Auto-rotación e inercia)
  const updateLoop = useCallback(() => {
    if (isAutoRotating && !isDragging) {
      setRotationY((prev) => (prev + rotationIncrement) % 360);
    } else if (!isDragging && (Math.abs(velocityRef.current.x) > 0.02 || Math.abs(velocityRef.current.y) > 0.02)) {
      // Inercia suave al soltar el arrastre
      setRotationY((prev) => (prev + velocityRef.current.x) % 360);
      setTiltX((prev) => Math.max(-14, Math.min(14, prev + velocityRef.current.y)));
      velocityRef.current.x *= 0.92;
      velocityRef.current.y *= 0.92;
    }

    animFrameRef.current = requestAnimationFrame(updateLoop);
  }, [isAutoRotating, isDragging, rotationIncrement]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(updateLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [updateLoop]);

  // Manejo de eventos de puntero (Mouse, Touch en iOS/Android, Stylus)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setHasInteracted(true);
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { x: 0, y: 0 };

    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !lastPointerPos.current) return;

    const deltaX = e.clientX - lastPointerPos.current.x;
    const deltaY = e.clientY - lastPointerPos.current.y;

    lastPointerPos.current = { x: e.clientX, y: e.clientY };

    // Sensibilidad táctil afinada para respuesta inmediata sin saltos
    const sensitivity = 0.55;
    const moveX = deltaX * sensitivity;
    const moveY = -deltaY * 0.25;

    velocityRef.current = { x: moveX, y: moveY };

    setRotationY((prev) => (prev + moveX + 360) % 360);
    setTiltX((prev) => Math.max(-14, Math.min(14, prev + moveY)));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // En navegadores antiguos
      }
      setIsDragging(false);

      // Reanuda la rotación lenta automáticamente tras 3.5 segundos de inactividad
      if (isAutoRotating) {
        resumeTimerRef.current = setTimeout(() => {
          // Permanece auto-rotando
        }, 3500);
      }
    }
  };

  const handleReset = () => {
    setRotationY(0);
    setTiltX(0);
    velocityRef.current = { x: 0, y: 0 };
  };

  // Cálculo del reflejo de luz dinámico según el ángulo (efecto cristal 3D)
  const normalizedAngle = ((rotationY % 360) + 360) % 360;
  const isFacingBack = normalizedAngle > 90 && normalizedAngle < 270;
  const specularPos = ((normalizedAngle / 360) * 200 - 50).toFixed(1);

  return (
    <div className="border border-beige bg-[#edf3f8] shadow-sm select-none">
      {/* Selector de modo: 360° Interactivo vs Fotografía */}
      <div className="flex border-b border-beige/70 bg-ivory/80 text-xs tracking-[0.16em] uppercase">
        <button
          type="button"
          onClick={() => setActiveTab("360")}
          className={`flex-1 py-3 px-3 text-center transition-colors flex items-center justify-center gap-2 ${
            activeTab === "360"
              ? "bg-[#edf3f8] font-medium text-charcoal border-b-2 border-champagne"
              : "text-charcoal/60 hover:text-charcoal"
          }`}
        >
          <span className="inline-flex items-center justify-center rounded-full bg-champagne/15 px-1.5 py-0.5 text-[9px] font-semibold text-champagne">
            360°
          </span>
          Estudio 360° Interactivo
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("photo")}
          className={`flex-1 py-3 px-3 text-center transition-colors ${
            activeTab === "photo"
              ? "bg-[#edf3f8] font-medium text-charcoal border-b-2 border-champagne"
              : "text-charcoal/60 hover:text-charcoal"
          }`}
        >
          Fotografía HD
        </button>
      </div>

      {/* Contenedor Principal */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {activeTab === "photo" ? (
          /* VISTA FOTOGRÁFICA CLÁSICA */
          <div className="relative h-full w-full flex items-center justify-center p-8 bg-gradient-to-b from-[#ffffff] to-[#edf3f8]">
            {hero ? (
              <Image
                src={hero.src}
                alt={hero.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-contain p-8 transition-transform duration-300 hover:scale-105"
                priority
              />
            ) : (
              <div className="text-sm text-charcoal/40">Sin imagen</div>
            )}
          </div>
        ) : (
          /* ESTUDIO 360° INTERACTIVO */
          <div
            ref={stageRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{ touchAction: "none" }}
            className={`relative h-full w-full flex items-center justify-center bg-gradient-to-b from-[#f8fafc] via-[#edf3f8] to-[#d8e2ed] overflow-hidden ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {/* Iluminación de estudio superior (foco difuso de luz cenital) */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/70 via-white/20 to-transparent"
              aria-hidden="true"
            />

            {/* Pedestal circular 3D de exhibición */}
            <div
              className="pointer-events-none absolute bottom-12 h-36 w-72 rounded-full border border-champagne/40 bg-gradient-to-b from-white/90 via-[#d8e2ed] to-[#94a3b8] shadow-[0_20px_40px_rgba(15,35,60,0.18)]"
              style={{
                transform: `rotateX(68deg) scale(${isZoomed ? 1.2 : 1})`,
                transition: "transform 0.3s ease-out",
              }}
              aria-hidden="true"
            >
              {/* Anillo de luz en el pedestal */}
              <div className="absolute inset-2 rounded-full border border-champagne/60 bg-gradient-to-b from-white/40 to-transparent" />
            </div>

            {/* Sombra proyectada del frasco sobre el pedestal */}
            <div
              className="pointer-events-none absolute bottom-20 h-8 w-44 rounded-full bg-charcoal/25 blur-md"
              style={{
                transform: `scale(${isZoomed ? 1.25 : 1}) rotate(${tiltX}deg)`,
                opacity: 0.35 + Math.abs(Math.sin((rotationY * Math.PI) / 180)) * 0.15,
                transition: "transform 0.2s ease-out",
              }}
              aria-hidden="true"
            />

            {/* OBJETO 3D DEL PERFUME */}
            <div
              className="relative flex items-center justify-center transition-transform duration-75 preserve-3d"
              style={{
                width: isZoomed ? "88%" : "72%",
                height: isZoomed ? "88%" : "72%",
                transform: `perspective(1100px) rotateX(${tiltX}deg) rotateY(${rotationY}deg) scale(${
                  isZoomed ? 1.25 : 1
                })`,
                transition: isDragging ? "none" : "transform 0.15s ease-out",
              }}
            >
              {/* CARA FRONTAL (FRENTE DEL PERFUME CON BRILLOS DINÁMICOS) */}
              <div
                className="absolute inset-0 flex items-center justify-center backface-hidden"
                style={{
                  transform: "rotateY(0deg)",
                }}
              >
                {hero ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={hero.src}
                      alt={hero.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.18)]"
                      priority
                      draggable={false}
                    />

                    {/* Reflejo especular que recorre el vidrio de la botella al girar */}
                    <div
                      className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-40 transition-opacity"
                      style={{
                        background: `linear-gradient(115deg, transparent ${Math.max(
                          0,
                          Number(specularPos) - 25
                        )}%, rgba(255,255,255,0.85) ${specularPos}%, transparent ${Math.min(
                          100,
                          Number(specularPos) + 25
                        )}%)`,
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-sm text-charcoal/40">{name}</div>
                )}
              </div>

              {/* CARA TRASERA (VISTA POSTERIOR CON CRISTAL ESMERILADO Y TIPOGRAFÍA DE LUJO) */}
              <div
                className="absolute inset-0 flex items-center justify-center backface-hidden"
                style={{
                  transform: "rotateY(180deg)",
                }}
              >
                {hero ? (
                  <div className="relative h-full w-full flex items-center justify-center">
                    {/* Silueta reflejada del frasco con efecto cristal esmerilado */}
                    <div className="relative h-full w-full opacity-70 filter blur-[0.6px] brightness-90">
                      <Image
                        src={hero.src}
                        alt={`${hero.alt} (Reverso)`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 45vw"
                        className="object-contain scale-x-[-1] drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)]"
                        draggable={false}
                      />
                    </div>

                    {/* Etiqueta trasera de lujo grabada en el vidrio */}
                    <div className="absolute inset-x-12 flex flex-col items-center justify-center text-center bg-ivory/80 backdrop-blur-sm border border-champagne/50 px-4 py-3 shadow-md rounded-sm max-w-[210px]">
                      <p className="text-[9px] tracking-[0.25em] text-champagne uppercase font-medium">
                        {houseName ?? "RAME PARFUM"}
                      </p>
                      <p className="mt-1 font-serif text-xs text-charcoal font-semibold line-clamp-1">
                        {name}
                      </p>
                      <div className="my-1.5 h-px w-8 bg-champagne/40" />
                      <p className="text-[8px] tracking-[0.18em] text-charcoal/70 uppercase">
                        {concentration ?? "EAU DE PARFUM"}
                      </p>
                      <p className="text-[8px] tracking-[0.14em] text-charcoal/50">
                        {sizeMl ? `${sizeMl} ML · 3.4 FL. OZ.` : "EDICIÓN PREMIUM"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-charcoal/40">{name} (Dorso)</div>
                )}
              </div>
            </div>

            {/* HUD / Indicador de ángulo en vivo */}
            <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 rounded-full border border-beige/80 bg-ivory/90 px-3 py-1 text-[10px] tracking-[0.16em] text-charcoal shadow-sm backdrop-blur-md uppercase">
              <span className="inline-block h-2 w-2 rounded-full bg-champagne animate-pulse" />
              <span>
                360° · {Math.round(normalizedAngle)}° {isFacingBack ? "(Reverso)" : "(Frontal)"}
              </span>
            </div>

            {/* Botón de Zoom en la esquina superior derecha */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed((prev) => !prev);
              }}
              className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-beige/80 bg-ivory/90 px-3 py-1 text-[10px] tracking-[0.14em] text-charcoal shadow-sm hover:border-champagne hover:bg-ivory active:scale-95 transition-all uppercase"
              aria-label={isZoomed ? "Reducir zoom" : "Acercar botella"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                {isZoomed ? (
                  <line x1="8" y1="11" x2="14" y2="11" />
                ) : (
                  <>
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </>
                )}
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>{isZoomed ? "1x" : "Zoom"}</span>
            </button>

            {/* Guía visual interactiva inicial (desaparece al interactuar) */}
            {!hasInteracted && (
              <div className="pointer-events-none absolute bottom-16 inset-x-4 flex justify-center animate-bounce">
                <div className="rounded-full bg-charcoal/80 text-ivory text-[10px] tracking-[0.16em] uppercase px-4 py-1.5 shadow-lg backdrop-blur-sm flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                  </svg>
                  Arrastra con tu dedo o ratón para rotar
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Barra de Controles Inferior del Visor 360 */}
      {activeTab === "360" && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-beige/80 bg-ivory/80 px-4 py-3 text-[11px] tracking-[0.14em] uppercase text-charcoal">
          {/* Botón Play / Pausa de rotación */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAutoRotating((prev) => !prev)}
              className="flex items-center gap-1.5 border border-beige px-3 py-1.5 hover:border-champagne hover:bg-ivory active:scale-95 transition-all font-medium"
              aria-label={isAutoRotating ? "Pausar giro automático" : "Reanudar giro"}
            >
              {isAutoRotating ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>Giro lento</span>
                </>
              )}
            </button>

            {/* Alternar velocidad */}
            <button
              type="button"
              onClick={() => setSpeed((prev) => (prev === "slow" ? "normal" : "slow"))}
              className="border border-beige px-2.5 py-1.5 text-[10px] text-charcoal/70 hover:border-champagne hover:text-charcoal transition-all"
              title="Cambiar velocidad de giro automático"
            >
              Vel: {speed === "slow" ? "Lenta (Detalle)" : "Normal"}
            </button>
          </div>

          {/* Botón Reiniciar vista al frente */}
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-[10px] text-charcoal/60 hover:text-charcoal underline underline-offset-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Reiniciar (0°)
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Indicador de compatibilidad e instrucciones interactivas
 */
export function BottleViewerPlaceholder() {
  return (
    <div className="mt-4 border border-beige bg-ivory/50 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-champagne/20 text-xs text-champagne font-bold">
          360°
        </span>
        <div>
          <p className="text-[10px] tracking-[0.2em] text-champagne uppercase font-medium">
            Visor 360° Universal
          </p>
          <p className="mt-1 text-xs leading-relaxed text-charcoal/75">
            Gira libremente el perfume con tu dedo o ratón. Optimizado para pantallas táctiles y móviles (Android, iPhone / iPad, Windows y Mac).
          </p>
        </div>
      </div>
    </div>
  );
}
