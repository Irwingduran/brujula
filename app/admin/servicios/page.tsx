import { prisma } from "@/lib/prisma"
import { ServicesTable } from "./services-table"

export const dynamic = "force-dynamic"

export default async function ServiciosPage() {
  const services = await prisma.service.findMany({
    orderBy: [{ sort_order: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { leads: true } },
    },
  })

  const totalLeadsAsignados = services.reduce((acc, s) => acc + s._count.leads, 0)

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-sans text-2xl font-bold text-foreground">Servicios</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Catálogo de {services.length} servicios &mdash; {totalLeadsAsignados} asignaciones a leads
        </p>
      </div>

      <ServicesTable services={services} />
    </div>
  )
}
