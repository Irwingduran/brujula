import { PipelineBoard } from "@/components/admin/pipeline-board"

export default function PipelinePage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-sans text-2xl font-bold text-foreground">Pipeline</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Arrastra las tarjetas entre columnas para actualizar el estado de cada lead.
        </p>
      </div>

      <PipelineBoard />
    </div>
  )
}
