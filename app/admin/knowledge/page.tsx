import { CoverageDashboard } from "@/components/admin/knowledge/coverage-dashboard"

export const dynamic = "force-dynamic"

export default function KnowledgePage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-sans text-2xl font-bold text-foreground">Knowledge Base</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cobertura de contenido RAG por industria
          </p>
        </div>
        <a
          href="/admin/knowledge/chunks"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Ver chunks
        </a>
      </div>
      <CoverageDashboard />
    </div>
  )
}
