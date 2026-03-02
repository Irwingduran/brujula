import { listLeads } from "@/lib/store"
import { MetricsCards } from "@/components/admin/metrics-cards"
import { LeadsTable } from "@/components/admin/leads-table"
import { DashboardCharts } from "@/components/admin/dashboard-charts"

export default function AdminDashboardPage() {
  const leads = listLeads()

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-sans text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vista general de tu pipeline de leads y metricas clave.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <MetricsCards leads={leads} />
        <DashboardCharts leads={leads} />

        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Leads Recientes</h2>
          <LeadsTable leads={leads.slice(0, 10)} />
        </div>
      </div>
    </div>
  )
}
