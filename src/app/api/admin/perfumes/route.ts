import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { Perfume } from "@/types/perfume";

const PERFUMES_FILE = path.join(process.cwd(), "src", "data", "perfumes.json");
const GITHUB_REPO = "adrianandresunexpo-dev/rame-parfum";
const GITHUB_FILE_PATH = "src/data/perfumes.json";

function getPerfumesData(): Perfume[] {
  try {
    if (fs.existsSync(PERFUMES_FILE)) {
      const content = fs.readFileSync(PERFUMES_FILE, "utf8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading perfumes.json:", err);
  }
  return [];
}

function savePerfumesData(data: Perfume[]): boolean {
  try {
    fs.writeFileSync(PERFUMES_FILE, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error saving to local file (read-only environment):", err);
    return false;
  }
}

async function syncWithGitHub(token: string, data: Perfume[], message: string) {
  try {
    const getFileUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
    const getRes = await fetch(getFileUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    let sha: string | undefined;
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    const contentBase64 = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

    const putRes = await fetch(getFileUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content: contentBase64,
        sha,
        branch: "main",
      }),
    });

    return putRes.ok;
  } catch (err) {
    console.error("Error pushing to GitHub:", err);
    return false;
  }
}

function createSlug(name: string, houseSlug: string, existingSlugs: Set<string>): string {
  const base = `${name} ${houseSlug}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  let slug = base || "perfume";
  let count = 2;
  while (existingSlugs.has(slug)) {
    slug = `${base}-${count}`;
    count++;
  }
  return slug;
}

// GET: Obtener lista o buscar perfumes
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase().trim() || "";
  const house = searchParams.get("house")?.toLowerCase().trim() || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const perfumes = getPerfumesData();

  let filtered = perfumes;

  if (q) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.houseSlug.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
    );
  }

  if (house) {
    filtered = filtered.filter((p) => p.houseSlug.toLowerCase() === house);
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const results = filtered.slice(start, start + limit);

  return NextResponse.json({
    total,
    page,
    totalPages: Math.ceil(total / limit),
    perfumes: results,
  });
}

// POST: Crear nuevo perfume
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const githubToken = req.headers.get("x-github-token") || process.env.GITHUB_TOKEN;

    const perfumes = getPerfumesData();
    const existingSlugs = new Set(perfumes.map((p) => p.slug));

    const slug = body.slug ? body.slug.trim() : createSlug(body.name, body.houseSlug, existingSlugs);

    const newPerfume: Perfume = {
      slug,
      name: body.name.trim(),
      houseSlug: body.houseSlug.trim(),
      type: body.type || "disenador",
      gender: body.gender || "unisex",
      price: Number(body.price) || 0,
      sizeMl: Number(body.sizeMl) || 100,
      concentration: body.concentration || "Eau de Parfum",
      longevity: body.longevity || "Alta",
      sillage: body.sillage || "Moderada-alta",
      description: body.description?.trim() || `${body.name} de ${body.houseSlug}. Creación exclusiva.`,
      occasions: Array.isArray(body.occasions) && body.occasions.length > 0 ? body.occasions : ["dia", "casual"],
      notes: {
        top: Array.isArray(body.notes?.top) ? body.notes.top : ["Notas cítricas", "Especias frescas"],
        heart: Array.isArray(body.notes?.heart) ? body.notes.heart : ["Acordes florales", "Maderas aromáticas"],
        base: Array.isArray(body.notes?.base) ? body.notes.base : ["Ámbar", "Almizcle", "Cedro"],
      },
      profile: body.profile || { fresco: 75, amaderado: 70 },
      images: [
        {
          src: body.imageUrl?.trim() || "https://assets.domun.co/placeholders/bottle.svg",
          alt: `${body.name} de ${body.houseSlug}`,
          role: "hero",
        },
      ],
      featured: Boolean(body.featured),
      ...(body.inspiredBy ? { inspiredBy: body.inspiredBy } : {}),
    };

    // Añadir al inicio para que el nuevo perfume aparezca de primero
    perfumes.unshift(newPerfume);

    const savedLocal = savePerfumesData(perfumes);

    let syncedGitHub = false;
    if (githubToken) {
      syncedGitHub = await syncWithGitHub(
        githubToken,
        perfumes,
        `Admin: Agregar perfume ${newPerfume.name}`
      );
    }

    return NextResponse.json({
      success: true,
      perfume: newPerfume,
      savedLocal,
      syncedGitHub,
    });
  } catch (error) {
    console.error("Error creating perfume:", error);
    return NextResponse.json({ success: false, error: "Error al crear el perfume" }, { status: 500 });
  }
}

// PUT: Editar perfume existente
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const githubToken = req.headers.get("x-github-token") || process.env.GITHUB_TOKEN;

    if (!body.slug) {
      return NextResponse.json({ success: false, error: "Slug es requerido para editar" }, { status: 400 });
    }

    const perfumes = getPerfumesData();
    const index = perfumes.findIndex((p) => p.slug === body.slug);

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Perfume no encontrado" }, { status: 404 });
    }

    const current = perfumes[index];

    const updatedPerfume: Perfume = {
      ...current,
      name: body.name ? body.name.trim() : current.name,
      houseSlug: body.houseSlug ? body.houseSlug.trim() : current.houseSlug,
      type: body.type || current.type,
      gender: body.gender || current.gender,
      price: body.price !== undefined ? Number(body.price) : current.price,
      sizeMl: body.sizeMl !== undefined ? Number(body.sizeMl) : current.sizeMl,
      concentration: body.concentration || current.concentration,
      longevity: body.longevity || current.longevity,
      sillage: body.sillage || current.sillage,
      description: body.description !== undefined ? body.description.trim() : current.description,
      occasions: Array.isArray(body.occasions) ? body.occasions : current.occasions,
      notes: {
        top: Array.isArray(body.notes?.top) ? body.notes.top : current.notes.top,
        heart: Array.isArray(body.notes?.heart) ? body.notes.heart : current.notes.heart,
        base: Array.isArray(body.notes?.base) ? body.notes.base : current.notes.base,
      },
      profile: body.profile || current.profile,
      images: body.imageUrl
        ? [
            {
              src: body.imageUrl.trim(),
              alt: `${body.name || current.name} de ${body.houseSlug || current.houseSlug}`,
              role: "hero",
            },
          ]
        : current.images,
      featured: body.featured !== undefined ? Boolean(body.featured) : current.featured,
      ...(body.inspiredBy ? { inspiredBy: body.inspiredBy } : {}),
    };

    perfumes[index] = updatedPerfume;

    const savedLocal = savePerfumesData(perfumes);

    let syncedGitHub = false;
    if (githubToken) {
      syncedGitHub = await syncWithGitHub(
        githubToken,
        perfumes,
        `Admin: Editar perfume ${updatedPerfume.name}`
      );
    }

    return NextResponse.json({
      success: true,
      perfume: updatedPerfume,
      savedLocal,
      syncedGitHub,
    });
  } catch (error) {
    console.error("Error updating perfume:", error);
    return NextResponse.json({ success: false, error: "Error al actualizar el perfume" }, { status: 500 });
  }
}

// DELETE: Borrar perfume
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const githubToken = req.headers.get("x-github-token") || process.env.GITHUB_TOKEN;

    if (!slug) {
      return NextResponse.json({ success: false, error: "Slug es requerido para borrar" }, { status: 400 });
    }

    let perfumes = getPerfumesData();
    const perfumeToDelete = perfumes.find((p) => p.slug === slug);

    if (!perfumeToDelete) {
      return NextResponse.json({ success: false, error: "Perfume no encontrado" }, { status: 404 });
    }

    perfumes = perfumes.filter((p) => p.slug !== slug);

    const savedLocal = savePerfumesData(perfumes);

    let syncedGitHub = false;
    if (githubToken) {
      syncedGitHub = await syncWithGitHub(
        githubToken,
        perfumes,
        `Admin: Eliminar perfume ${perfumeToDelete.name}`
      );
    }

    return NextResponse.json({
      success: true,
      deletedSlug: slug,
      savedLocal,
      syncedGitHub,
    });
  } catch (error) {
    console.error("Error deleting perfume:", error);
    return NextResponse.json({ success: false, error: "Error al borrar el perfume" }, { status: 500 });
  }
}
