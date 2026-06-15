import { prisma } from "@/lib/prisma"
import { VideoCamera, Bell, Users, CaretRight } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const [
    leadsConReunion,
    leadsSinAtencion,
    actividadReciente,
    totalLeads,
  ] = await Promise.all([
    // 1. Próximas reuniones
    prisma.lead.findMany({
      where: {
        enlace_reunion: { not: null },
        estado_pipeline: { notIn: ["cerrado", "archivado"] },
      },
      orderBy: { llamada_agendada_at: "asc" },
      take: 10,
    }),

    // 2. Leads calientes sin seguimiento (HOT/WARM sin reunión)
    prisma.lead.findMany({
      where: {
        segmento: { in: ["HOT", "WARM"] },
        enlace_reunion: null,
        estado_pipeline: { notIn: ["cerrado", "archivado"] },
      },
      orderBy: [{ segmento: "asc" }, { created_at: "desc" }],
      take: 10,
    }),

    // 3. Actividad reciente (últimos 15 leads creados)
    prisma.lead.findMany({
      orderBy: { ultima_actividad_at: "desc" },
      take: 15,
    }),

    // 4. Total de leads activos
    prisma.lead.count({
      where: { estado_pipeline: { notIn: ["archivado"] } },
    }),
  ])

  const hotCount = await prisma.lead.count({
    where: { segmento: "HOT", estado_pipeline: { notIn: ["cerrado", "archivado"] } },
  })

  const llamadasHoy = leadsConReunion.filter((l) => {
    if (!l.llamada_agendada_at) return false
    const hoy = new Date()
    return l.llamada_agendada_at.toDateString() === hoy.toDateString()
  })

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-sans text-2xl font-bold text-foreground">Panel de Control</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {totalLeads} leads activos · {hotCount} HOT · {llamadasHoy.length} reuniones hoy
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* 1. PRÓXIMAS REUNIONES */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <VideoCamera className="h-5 w-5 text-primary" weight="fill" />
              Próximas reuniones
            </h2>
            <Link href="/admin/pipeline" className="text-xs text-primary hover:underline">
              Ver pipeline completo
            </Link>
          </div>

          {leadsConReunion.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
              <VideoCamera className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                No hay reuniones agendadas aún.
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Cuando guardes un enlace de Meet en un lead, aparecerá aquí.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {leadsConReunion.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground truncate">{lead.nombre}</h3>
                      <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      lead.segmento === "HOT" ? "bg-red-100 text-red-800" :
                      lead.segmento === "WARM" ? "bg-amber-100 text-amber-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {lead.segmento}
                    </span>
                  </div>

                  {lead.llamada_agendada_at && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {new Date(lead.llamada_agendada_at).toLocaleDateString("es-MX", {
                        weekday: "long", day: "numeric", month: "long",
                      })}
                    </div>
                  )}

                  {lead.enlace_reunion && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                      <VideoCamera className="h-3 w-3" weight="fill" />
                      <span className="truncate">{lead.enlace_reunion.replace(/^https?:\/\//, "")}</span>
                    </div>
                  )}

                  {lead.notas_llamada && (
                    <p className="mt-1.5 text-[10px] text-muted-foreground line-clamp-1 italic">
                      &ldquo;{lead.notas_llamada}&rdquo;
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 2. LEADS QUE REQUIEREN ATENCIÓN */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500" weight="fill" />
              Leads que requieren atención
            </h2>
            <span className="text-xs text-muted-foreground">{leadsSinAtencion.length} pendientes</span>
          </div>

          {leadsSinAtencion.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground">Todos los leads calientes tienen seguimiento.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {leadsSinAtencion.slice(0, 5).map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors"
                >
                  <div className={`h-2 w-2 shrink-0 rounded-full ${
                    lead.segmento === "HOT" ? "bg-red-500" : "bg-amber-500"
                  }`} />
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-foreground">{lead.nombre}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{lead.industria}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(lead.created_at).toLocaleDateString("es-MX")}
                  </div>
                  <CaretRight className="h-4 w-4 text-muted-foreground/50" />
                </Link>
              ))}
              {leadsSinAtencion.length > 5 && (
                <div className="px-4 py-2 text-center text-xs text-muted-foreground">
                  +{leadsSinAtencion.length - 5} más
                </div>
              )}
            </div>
          )}
        </section>

        {/* 3. ACTIVIDAD RECIENTE */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              Actividad reciente
            </h2>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="divide-y divide-border">
              {actividadReciente.slice(0, 10).map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors text-sm"
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${
                    lead.segmento === "HOT" ? "bg-red-500" :
                    lead.segmento === "WARM" ? "bg-amber-500" : "bg-blue-500"
                  }`} />
                  <span className="font-medium text-foreground min-w-[120px]">{lead.nombre}</span>
                  <span className="text-muted-foreground">
                    {lead.enlace_reunion ? "🔗 Reunión agendada" :
                     lead.estado_pipeline === "llamada_agendada" ? "📞 Llamada solicitada" :
                     lead.estado_pipeline === "email_enviado" ? "✉️ Email enviado" :
                     lead.estado_pipeline === "cerrado" ? "✅ Cerrado" :
                     "📋 Nuevo diagnóstico"}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(lead.ultima_actividad_at).toLocaleDateString("es-MX", {
                      day: "numeric", month: "short",
                    })}
                  </span>
                </Link>
              ))}
              {actividadReciente.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No hay actividad reciente.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
