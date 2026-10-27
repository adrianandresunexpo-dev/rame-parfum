"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { houses } from "@/data/houses";
import { perfumeTypes, occasions as allOccasions } from "@/data/taxonomies";
import type { Perfume, PerfumeType, Gender, Occasion } from "@/types/perfume";

const ADMIN_PIN = "rame2026";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Perfume list state
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedHouse, setSelectedHouse] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [page, setPage] = useState(1);
  const limit = 25;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerfume, setEditingPerfume] = useState<Perfume | null>(null);
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    houseSlug: "lattafa",
    customHouse: "",
    type: "arabe" as PerfumeType,
    gender: "unisex" as Gender,
    price: 60,
    sizeMl: 100,
    concentration: "Eau de Parfum",
    longevity: "Alta",
    sillage: "Moderada-alta",
    imageUrl: "",
    description: "",
    occasions: ["dia", "casual"] as Occasion[],
    topNotes: "",
    heartNotes: "",
    baseNotes: "",
  });

  const [formSaving, setFormSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // GitHub token for cloud syncing
  const [githubToken, setGithubToken] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  // Check authentication
  useEffect(() => {
    const auth = sessionStorage.getItem("rame_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    const savedToken = localStorage.getItem("rame_github_token") || "";
    setGithubToken(savedToken);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem("rame_admin_auth", "true");
      setPinError(false);
    } else {
      setPinError(true);
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    sessionStorage.removeItem("rame_admin_auth");
  }

  // Fetch perfumes from API
  const fetchPerfumes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/perfumes?limit=2000");
      if (res.ok) {
        const data = await res.json();
        setPerfumes(data.perfumes || []);
      }
    } catch (err) {
      console.error("Error loading perfumes:", err);
      showToast("Error al cargar perfumes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPerfumes();
    }
  }, [isAuthenticated]);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  // Filtered perfumes
  const filteredPerfumes = useMemo(() => {
    const q = search.toLowerCase().trim();
    return perfumes.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.houseSlug.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q);

      const matchesHouse = !selectedHouse || p.houseSlug === selectedHouse;
      const matchesType = !selectedType || p.type === selectedType;
      const matchesGender = !selectedGender || p.gender === selectedGender;

      return matchesSearch && matchesHouse && matchesType && matchesGender;
    });
  }, [perfumes, search, selectedHouse, selectedType, selectedGender]);

  // Paginated perfumes
  const totalPages = Math.ceil(filteredPerfumes.length / limit) || 1;
  const paginatedPerfumes = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredPerfumes.slice(start, start + limit);
  }, [filteredPerfumes, page, limit]);

  // Open Create Modal
  function handleOpenCreate() {
    setEditingPerfume(null);
    setFormData({
      name: "",
      houseSlug: houses[0]?.slug || "lattafa",
      customHouse: "",
      type: "arabe",
      gender: "unisex",
      price: 60,
      sizeMl: 100,
      concentration: "Eau de Parfum",
      longevity: "Alta",
      sillage: "Moderada-alta",
      imageUrl: "",
      description: "",
      occasions: ["dia", "casual"],
      topNotes: "Notas cítricas, Especias frescas",
      heartNotes: "Acordes florales, Maderas aromáticas",
      baseNotes: "Ámbar, Almizcle, Cedro",
    });
    setIsModalOpen(true);
  }

  // Open Edit Modal
  function handleOpenEdit(perfume: Perfume) {
    setEditingPerfume(perfume);
    const heroImg = perfume.images.find((img) => img.role === "hero") || perfume.images[0];
    setFormData({
      name: perfume.name,
      houseSlug: perfume.houseSlug,
      customHouse: "",
      type: perfume.type,
      gender: perfume.gender,
      price: perfume.price,
      sizeMl: perfume.sizeMl,
      concentration: perfume.concentration || "Eau de Parfum",
      longevity: perfume.longevity || "Alta",
      sillage: perfume.sillage || "Moderada-alta",
      imageUrl: heroImg?.src || "",
      description: perfume.description || "",
      occasions: perfume.occasions || ["dia"],
      topNotes: perfume.notes?.top?.join(", ") || "",
      heartNotes: perfume.notes?.heart?.join(", ") || "",
      baseNotes: perfume.notes?.base?.join(", ") || "",
    });
    setIsModalOpen(true);
  }

  // Save Perfume (Create or Update)
  async function handleSavePerfume(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Por favor ingresa el nombre del perfume", "error");
      return;
    }

    setFormSaving(true);

    const house = formData.customHouse.trim()
      ? formData.customHouse.trim().toLowerCase().replace(/\s+/g, "-")
      : formData.houseSlug;

    const payload = {
      ...(editingPerfume ? { slug: editingPerfume.slug } : {}),
      name: formData.name.trim(),
      houseSlug: house,
      type: formData.type,
      gender: formData.gender,
      price: Number(formData.price),
      sizeMl: Number(formData.sizeMl),
      concentration: formData.concentration,
      longevity: formData.longevity,
      sillage: formData.sillage,
      description: formData.description.trim() || `${formData.name} de ${house}. Creación equilibrada y elegante.`,
      imageUrl: formData.imageUrl.trim() || "/placeholders/bottle.svg",
      occasions: formData.occasions,
      notes: {
        top: formData.topNotes.split(",").map((s) => s.trim()).filter(Boolean),
        heart: formData.heartNotes.split(",").map((s) => s.trim()).filter(Boolean),
        base: formData.baseNotes.split(",").map((s) => s.trim()).filter(Boolean),
      },
    };

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (githubToken) headers["x-github-token"] = githubToken;

      const res = await fetch("/api/admin/perfumes", {
        method: editingPerfume ? "PUT" : "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(
          editingPerfume
            ? `Perfume "${payload.name}" actualizado con éxito`
            : `Perfume "${payload.name}" agregado con éxito`
        );
        setIsModalOpen(false);
        fetchPerfumes();
      } else {
        showToast(data.error || "Error al guardar perfume", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error de conexión al guardar", "error");
    } finally {
      setFormSaving(false);
    }
  }

  // Delete Perfume
  async function handleDeletePerfume(slug: string) {
    try {
      const headers: Record<string, string> = {};
      if (githubToken) headers["x-github-token"] = githubToken;

      const res = await fetch(`/api/admin/perfumes?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
        headers,
      });

      const data = await res.json();
      if (data.success) {
        showToast("Perfume eliminado correctamente");
        setDeleteConfirmSlug(null);
        fetchPerfumes();
      } else {
        showToast(data.error || "Error al eliminar perfume", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error al conectar para eliminar", "error");
    }
  }

  // Save GitHub Token
  function handleSaveToken(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("rame_github_token", githubToken.trim());
    showToast("Token de GitHub guardado");
    setShowSettings(false);
  }

  // If not logged in, show Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#edf3f8] px-4 py-12">
        <div className="w-full max-w-md bg-white border border-beige shadow-lg p-8 text-center rounded-xs">
          <div className="relative h-20 w-20 overflow-hidden rounded-full shadow-md ring-4 ring-[#edf3f8] bg-white mx-auto mb-4">
            <Image src="/brand/logo.jpg" alt="Logo Rame Parfum" fill className="object-cover scale-110" priority />
          </div>
          <h1 className="font-serif text-2xl tracking-[0.2em] text-charcoal uppercase">RAME PARFUM</h1>
          <p className="text-xs tracking-[0.3em] text-champagne uppercase font-medium mt-1">Panel de Control</p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label htmlFor="pin-input" className="block text-xs uppercase tracking-wider text-charcoal/70 mb-2 font-medium">
                Clave de Acceso
              </label>
              <input
                id="pin-input"
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Ingresa la clave..."
                autoFocus
                className="w-full text-center tracking-widest text-lg font-mono border border-beige px-4 py-3 bg-[#edf3f8]/50 focus:border-champagne outline-none transition-colors"
              />
              {pinError && <p className="text-red-500 text-xs mt-2 font-medium">Clave incorrecta. Inténtalo de nuevo.</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-champagne hover:bg-champagne-light text-white text-xs uppercase tracking-[0.16em] py-3.5 font-semibold transition-colors shadow-sm"
            >
              Entrar al Panel
            </button>

            <p className="text-[11px] text-charcoal/50 pt-2">
              Clave por defecto: <code className="bg-slate-100 px-1 py-0.5 font-mono text-charcoal">rame2026</code>
            </p>
          </form>

          <div className="mt-6 pt-6 border-t border-beige/60">
            <Link href="/" className="text-xs text-charcoal/60 hover:text-charcoal underline underline-offset-4">
              ← Volver a la tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-charcoal pb-20">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 text-xs tracking-wider uppercase font-semibold text-white shadow-xl flex items-center gap-2 transition-all duration-300 animate-bounce ${
            toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-beige px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-beige">
              <Image src="/brand/logo.jpg" alt="Logo Rame" fill className="object-cover scale-110" />
            </div>
            <div>
              <p className="font-serif text-lg tracking-wider font-semibold text-charcoal leading-none">RAME PARFUM</p>
              <p className="text-[10px] tracking-[0.25em] text-champagne uppercase font-medium mt-1">Admin Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-3 py-2 border border-beige hover:border-champagne text-xs text-charcoal/80 uppercase tracking-wider transition-colors flex items-center gap-1.5"
              title="Configurar sincronización en la nube (GitHub)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span>GitHub Sync</span>
            </button>

            <Link
              href="/catalogo"
              target="_blank"
              className="px-3 py-2 border border-beige hover:border-champagne text-xs text-charcoal/80 uppercase tracking-wider transition-colors"
            >
              Ver Tienda ↗
            </Link>

            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-champagne hover:bg-champagne-light text-white text-xs uppercase tracking-wider font-semibold transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>+</span>
              <span>Nuevo Perfume</span>
            </button>

            <button
              onClick={handleLogout}
              className="text-xs text-charcoal/50 hover:text-red-600 uppercase tracking-wider ml-1"
              title="Salir del panel"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* GitHub Sync Modal / Drawer */}
      {showSettings && (
        <div className="bg-[#edf3f8] border-b border-beige px-4 sm:px-8 py-5">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-serif text-lg font-semibold text-charcoal">Sincronización Automática con la Nube (GitHub)</h2>
                <p className="text-xs text-charcoal/70 mt-1 leading-relaxed">
                  Si pegas tu Token de GitHub (Personal Access Token), cada vez que agregues, edites o borres un perfume,
                  el cambio se enviará a GitHub y Vercel/Netlify se actualizará en vivo automáticamente en 1 minuto.
                </p>
              </div>
              <button onClick={() => setShowSettings(false)} className="text-xs text-charcoal/50 hover:text-charcoal uppercase">✕</button>
            </div>

            <form onSubmit={handleSaveToken} className="mt-4 flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (GitHub Personal Access Token)"
                className="flex-1 bg-white border border-beige px-3.5 py-2 text-xs font-mono outline-none focus:border-champagne"
              />
              <button
                type="submit"
                className="bg-charcoal hover:bg-black text-white text-xs uppercase tracking-wider px-5 py-2 font-medium"
              >
                Guardar Token
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        {/* Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-white border border-beige p-4 sm:p-5">
            <p className="text-[10px] tracking-wider text-charcoal/50 uppercase font-medium">Total Perfumes</p>
            <p className="font-serif text-2xl sm:text-3xl text-champagne font-semibold mt-1">{perfumes.length}</p>
          </div>
          <div className="bg-white border border-beige p-4 sm:p-5">
            <p className="text-[10px] tracking-wider text-charcoal/50 uppercase font-medium">Casas / Marcas</p>
            <p className="font-serif text-2xl sm:text-3xl text-charcoal font-semibold mt-1">
              {new Set(perfumes.map((p) => p.houseSlug)).size}
            </p>
          </div>
          <div className="bg-white border border-beige p-4 sm:p-5">
            <p className="text-[10px] tracking-wider text-charcoal/50 uppercase font-medium">Filtrados</p>
            <p className="font-serif text-2xl sm:text-3xl text-emerald-700 font-semibold mt-1">{filteredPerfumes.length}</p>
          </div>
          <div className="bg-white border border-beige p-4 sm:p-5">
            <p className="text-[10px] tracking-wider text-charcoal/50 uppercase font-medium">Páginas</p>
            <p className="font-serif text-2xl sm:text-3xl text-charcoal/80 font-semibold mt-1">
              {page} <span className="text-xs font-sans text-charcoal/40 font-normal">de {totalPages}</span>
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-beige p-4 mb-6 shadow-2xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Search */}
            <div className="sm:col-span-2 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Buscar por nombre, casa o slug..."
                className="w-full bg-[#edf3f8]/50 border border-beige px-3.5 py-2.5 text-xs text-charcoal outline-none focus:border-champagne"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-2.5 text-xs text-charcoal/40 hover:text-charcoal"
                >
                  ✕
                </button>
              )}
            </div>

            {/* House filter */}
            <div>
              <select
                value={selectedHouse}
                onChange={(e) => {
                  setSelectedHouse(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#edf3f8]/50 border border-beige px-3 py-2.5 text-xs text-charcoal outline-none focus:border-champagne capitalize"
              >
                <option value="">Todas las Casas ({new Set(perfumes.map((p) => p.houseSlug)).size})</option>
                {Array.from(new Set(perfumes.map((p) => p.houseSlug)))
                  .sort()
                  .map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
              </select>
            </div>

            {/* Type filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#edf3f8]/50 border border-beige px-3 py-2.5 text-xs text-charcoal outline-none focus:border-champagne"
              >
                <option value="">Todos los Tipos</option>
                {perfumeTypes.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Perfume List Table */}
        <div className="bg-white border border-beige shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-xs tracking-widest text-charcoal/50 uppercase animate-pulse">
              Cargando catálogo completo de perfumes...
            </div>
          ) : paginatedPerfumes.length === 0 ? (
            <div className="p-16 text-center text-charcoal/60">
              <p className="font-serif text-xl">No se encontraron perfumes</p>
              <p className="text-xs text-charcoal/40 mt-1">Prueba con otro término de búsqueda o limpia los filtros.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#edf3f8] border-b border-beige text-[10px] tracking-[0.16em] uppercase text-charcoal/70">
                  <tr>
                    <th className="py-3 px-4 w-14">Foto</th>
                    <th className="py-3 px-4">Perfume</th>
                    <th className="py-3 px-4">Casa</th>
                    <th className="py-3 px-4">Tipo</th>
                    <th className="py-3 px-4">Género</th>
                    <th className="py-3 px-4">Precio</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige/50">
                  {paginatedPerfumes.map((perfume) => {
                    const hero = perfume.images?.find((img) => img.role === "hero") || perfume.images?.[0];
                    return (
                      <tr key={perfume.slug} className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-2.5 px-4">
                          <div className="relative h-10 w-10 bg-[#edf3f8] border border-beige/60 overflow-hidden shrink-0">
                            {hero?.src ? (
                              <Image
                                src={hero.src}
                                alt={perfume.name}
                                fill
                                sizes="40px"
                                className="object-contain p-1"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-[8px] text-charcoal/30">N/A</div>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 font-medium text-charcoal max-w-xs">
                          <p className="font-serif text-sm font-semibold text-charcoal leading-snug line-clamp-1">{perfume.name}</p>
                          <p className="text-[10px] text-charcoal/40 font-mono mt-0.5 truncate">{perfume.slug}</p>
                        </td>
                        <td className="py-2.5 px-4 capitalize text-charcoal/80 font-medium">
                          {perfume.houseSlug}
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="inline-block px-2 py-0.5 text-[9px] uppercase tracking-wider bg-slate-100 text-charcoal border border-slate-200">
                            {perfume.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 capitalize text-charcoal/70">{perfume.gender}</td>
                        <td className="py-2.5 px-4 font-semibold text-champagne">
                          ${perfume.price} <span className="text-[10px] text-charcoal/40 font-normal">({perfume.sizeMl}ml)</span>
                        </td>
                        <td className="py-2.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              href={`/perfume/${perfume.slug}`}
                              target="_blank"
                              className="px-2 py-1 text-[10px] text-charcoal/60 hover:text-charcoal border border-beige hover:border-charcoal transition-colors"
                              title="Ver en la tienda"
                            >
                              Ver ↗
                            </Link>

                            <button
                              onClick={() => handleOpenEdit(perfume)}
                              className="px-2.5 py-1 text-[10px] bg-champagne hover:bg-champagne-light text-white font-medium transition-colors"
                            >
                              Editar
                            </button>

                            <button
                              onClick={() => setDeleteConfirmSlug(perfume.slug)}
                              className="px-2 py-1 text-[10px] text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                              title="Eliminar perfume"
                            >
                              Borrar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          <div className="bg-[#edf3f8] border-t border-beige px-4 py-3 flex items-center justify-between text-xs">
            <span className="text-charcoal/60">
              Mostrando {paginatedPerfumes.length} de {filteredPerfumes.length} perfumes
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 bg-white border border-beige hover:border-champagne disabled:opacity-40 disabled:cursor-not-allowed uppercase text-[10px] tracking-wider"
              >
                ← Anterior
              </button>
              <span className="px-2 font-mono text-[11px] font-semibold text-charcoal">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 bg-white border border-beige hover:border-champagne disabled:opacity-40 disabled:cursor-not-allowed uppercase text-[10px] tracking-wider"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white border border-beige p-6 shadow-2xl text-center">
            <h3 className="font-serif text-xl font-bold text-charcoal">¿Eliminar perfume?</h3>
            <p className="text-xs text-charcoal/70 mt-2 leading-relaxed">
              ¿Estás seguro de que deseas eliminar permanentemente el perfume{" "}
              <code className="font-mono bg-slate-100 px-1 py-0.5 text-charcoal font-semibold">{deleteConfirmSlug}</code>?
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmSlug(null)}
                className="px-4 py-2 border border-beige text-xs uppercase tracking-wider font-medium hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeletePerfume(deleteConfirmSlug)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider font-semibold shadow-sm"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white border border-beige shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-beige/80 pb-4 mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-charcoal">
                  {editingPerfume ? `Editar: ${editingPerfume.name}` : "Agregar Nuevo Perfume"}
                </h2>
                <p className="text-xs text-champagne uppercase tracking-wider font-medium mt-1">
                  {editingPerfume ? `Slug: ${editingPerfume.slug}` : "Rellena los datos para publicar el perfume"}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-sm text-charcoal/50 hover:text-charcoal">
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePerfume} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                  Nombre del Perfume *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Khamrah Dukhan, Sauvage, Hawas..."
                  className="w-full bg-[#edf3f8]/50 border border-beige px-3 py-2 text-sm text-charcoal outline-none focus:border-champagne"
                />
              </div>

              {/* Casa y Tipo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    Casa / Marca *
                  </label>
                  <select
                    value={formData.houseSlug}
                    onChange={(e) => setFormData({ ...formData, houseSlug: e.target.value })}
                    className="w-full bg-[#edf3f8]/50 border border-beige px-3 py-2 text-xs text-charcoal outline-none focus:border-champagne capitalize"
                  >
                    {houses.map((h) => (
                      <option key={h.slug} value={h.slug}>
                        {h.name} ({h.slug})
                      </option>
                    ))}
                    <option value="otra">+ Otra casa no listada...</option>
                  </select>
                  {formData.houseSlug === "otra" && (
                    <input
                      type="text"
                      placeholder="Escribe el nombre de la nueva casa..."
                      value={formData.customHouse}
                      onChange={(e) => setFormData({ ...formData, customHouse: e.target.value })}
                      className="mt-2 w-full bg-[#edf3f8]/50 border border-champagne px-3 py-1.5 text-xs text-charcoal outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    Tipo de Perfume *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as PerfumeType })}
                    className="w-full bg-[#edf3f8]/50 border border-beige px-3 py-2 text-xs text-charcoal outline-none focus:border-champagne"
                  >
                    {perfumeTypes.map((t) => (
                      <option key={t.slug} value={t.slug}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Género, Precio y Tamaño */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    Género *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                    className="w-full bg-[#edf3f8]/50 border border-beige px-3 py-2 text-xs text-charcoal outline-none focus:border-champagne"
                  >
                    <option value="hombre">Hombre</option>
                    <option value="mujer">Mujer</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    Precio ($ USD) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-[#edf3f8]/50 border border-beige px-3 py-2 text-sm font-semibold text-champagne outline-none focus:border-champagne"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    Tamaño (ml) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.sizeMl}
                    onChange={(e) => setFormData({ ...formData, sizeMl: Number(e.target.value) })}
                    className="w-full bg-[#edf3f8]/50 border border-beige px-3 py-2 text-sm text-charcoal outline-none focus:border-champagne"
                  />
                </div>
              </div>

              {/* Concentración */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    Concentración
                  </label>
                  <input
                    type="text"
                    value={formData.concentration}
                    onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
                    placeholder="Eau de Parfum, Eau de Toilette..."
                    className="w-full bg-[#edf3f8]/50 border border-beige px-3 py-2 text-xs text-charcoal outline-none focus:border-champagne"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    URL de la Imagen
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://...imagen.jpg"
                    className="w-full bg-[#edf3f8]/50 border border-beige px-3 py-2 text-xs text-charcoal outline-none focus:border-champagne"
                  />
                </div>
              </div>

              {/* Vista previa de imagen */}
              {formData.imageUrl && (
                <div className="p-3 bg-[#edf3f8] border border-beige flex items-center gap-4">
                  <div className="relative h-16 w-16 bg-white border border-beige overflow-hidden shrink-0">
                    <img src={formData.imageUrl} alt="Vista previa" className="h-full w-full object-contain p-1" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-medium text-champagne">Vista previa de la imagen</p>
                    <p className="text-xs text-charcoal/60 truncate max-w-sm mt-0.5">{formData.imageUrl}</p>
                  </div>
                </div>
              )}

              {/* Descripción */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve reseña del perfume y su carácter..."
                  className="w-full bg-[#edf3f8]/50 border border-beige px-3 py-2 text-xs text-charcoal outline-none focus:border-champagne leading-relaxed"
                />
              </div>

              {/* Ocasiones */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal/80 mb-1.5">
                  Ocasiones de Uso
                </label>
                <div className="flex flex-wrap gap-2">
                  {allOccasions.map((occ) => {
                    const isSelected = formData.occasions.includes(occ.slug);
                    return (
                      <button
                        type="button"
                        key={occ.slug}
                        onClick={() => {
                          const updated = isSelected
                            ? formData.occasions.filter((o) => o !== occ.slug)
                            : [...formData.occasions, occ.slug];
                          setFormData({ ...formData, occasions: updated });
                        }}
                        className={`px-3 py-1 text-[11px] uppercase tracking-wider border transition-colors ${
                          isSelected
                            ? "bg-champagne text-white border-champagne font-medium"
                            : "bg-white text-charcoal/70 border-beige hover:border-champagne"
                        }`}
                      >
                        {occ.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notas Olfativas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-charcoal/70 mb-1">
                    Notas de Salida (separadas por coma)
                  </label>
                  <input
                    type="text"
                    value={formData.topNotes}
                    onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
                    placeholder="Bergamota, Limón..."
                    className="w-full bg-[#edf3f8]/50 border border-beige px-2.5 py-1.5 text-xs text-charcoal outline-none focus:border-champagne"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-charcoal/70 mb-1">
                    Notas de Corazón (separadas por coma)
                  </label>
                  <input
                    type="text"
                    value={formData.heartNotes}
                    onChange={(e) => setFormData({ ...formData, heartNotes: e.target.value })}
                    placeholder="Rosa, Lavanda..."
                    className="w-full bg-[#edf3f8]/50 border border-beige px-2.5 py-1.5 text-xs text-charcoal outline-none focus:border-champagne"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-charcoal/70 mb-1">
                    Notas de Fondo (separadas por coma)
                  </label>
                  <input
                    type="text"
                    value={formData.baseNotes}
                    onChange={(e) => setFormData({ ...formData, baseNotes: e.target.value })}
                    placeholder="Ámbar, Almizcle, Vainilla..."
                    className="w-full bg-[#edf3f8]/50 border border-beige px-2.5 py-1.5 text-xs text-charcoal outline-none focus:border-champagne"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-beige/80 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-beige text-xs uppercase tracking-wider hover:bg-slate-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formSaving}
                  className="px-6 py-2.5 bg-champagne hover:bg-champagne-light disabled:opacity-50 text-white text-xs uppercase tracking-wider font-semibold shadow-sm transition-colors"
                >
                  {formSaving ? "Guardando..." : editingPerfume ? "Actualizar Perfume" : "Crear Perfume"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
