import { ChunksTable } from "@/components/admin/knowledge/chunks-table"

export const dynamic = "force-dynamic"

export default function ChunksPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-sans text-2xl font-bold text-foreground">Chunks</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Buscar, crear, editar y eliminar chunks de la knowledge base
        </p>
      </div>
      <ChunksTable />
    </div>
  )
}
