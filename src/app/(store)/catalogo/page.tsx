import { CatalogRoute, type SearchParams } from "@/components/catalog/CatalogRoute";

export default function CatalogoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <CatalogRoute
      locked={{}}
      title="Catálogo"
      description="Todos los perfumes. Combina género, tipo, casa, perfil, ocasión y precio. La búsqueda cubre nombre, casa, notas y carácter aromático."
      searchParams={searchParams}
    />
  );
}
