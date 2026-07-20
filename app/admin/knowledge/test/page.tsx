import { RetrievalTester } from "@/components/admin/knowledge/retrieval-tester"

export const dynamic = "force-dynamic"

export default function TestRetrievalPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-sans text-2xl font-bold text-foreground">Test de Retrieval</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Prueba qué chunks recupera el RAG para una query específica
        </p>
      </div>
      <RetrievalTester />
    </div>
  )
}
