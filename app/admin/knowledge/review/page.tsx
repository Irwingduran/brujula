import { ReviewQueue } from "@/components/admin/knowledge/review-queue"

export const dynamic = "force-dynamic"

export default function ReviewPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-sans text-2xl font-bold text-foreground">Revisión de chunks</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Chunks auto-generados pendientes de aprobación
        </p>
      </div>
      <ReviewQueue />
    </div>
  )
}
