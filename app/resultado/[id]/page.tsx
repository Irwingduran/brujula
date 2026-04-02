import { prisma } from "@/lib/prisma"
import { Logo } from "@/components/shared/logo"
import { Footer } from "@/components/landing/footer"
import { TrackingPixel } from "@/components/shared/tracking-pixel"
import { DiagnosisSummary } from "@/components/diagnosis/diagnosis-summary"
import { CheckCircle, Calendar, TrendUp, CurrencyDollar, ArrowRight, Phone, Envelope } from "@phosphor-icons/react/dist/ssr"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { DiagnosisResult, ScoreBreakdown } from "@/lib/types"

export const metadata: Metadata = {
  title: "Tu Propuesta Personalizada | Brújula",
  description: "Revisa tu diagnostico y propuesta personalizada para digitalizar tu negocio.",
}

function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value}/{max}</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function SegmentSummary({ segmento }: { segmento: string }) {
  const summary = {
    HOT: {
      title: "Oportunidad alta",
      description: "Tu negocio tiene un potencial considerable para mejorar con una intervención rápida. Es momento de avanzar con un plan concreto.",
      badge: "bg-red-100 text-red-800",
    },
    WARM: {
      title: "Oportunidad moderada",
      description: "Estás en camino, pero hay puntos claros que requieren foco para escalar. Una propuesta puntual ayudará a acelerar los resultados.",
      badge: "bg-amber-100 text-amber-800",
    },
    COLD: {
      title: "Oportunidad inicial",
      description: "La situación es más estable, pero hay espacio para ganar eficiencia y visibilidad. Un plan estructurado reduce fricción.",
      badge: "bg-blue-100 text-blue-800",
    },
  } as const

  return summary[segmento as keyof typeof summary] || summary.COLD
}

export default async function ResultadoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const lead = await prisma.lead.findUnique({ where: { id } })

  if (!lead || !lead.diagnostico || !lead.score) {
    notFound()
  }

  const diagnosis = lead.diagnostico as unknown as DiagnosisResult
  const score = lead.score as unknown as ScoreBreakdown

  const segmentColors = {
    HOT: "bg-red-100 text-red-800",
    WARM: "bg-amber-100 text-amber-800",
    COLD: "bg-blue-100 text-blue-800",
  }

  const ctaData = {
    HOT: { label: "Agendar llamada estratégica", url: "#/agendar" },
    WARM: { label: "Recibir plan de acción rápido", url: "#/plan" },
    COLD: { label: "Solicitar evaluación gratuita", url: "#/evaluacion" },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Tracking pixel - registra visitas a la propuesta */}
      <TrackingPixel leadId={id} />

      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-center px-4 py-4">
          <Logo />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
            <CheckCircle className="h-7 w-7 text-accent" />
          </div>
          <h1 className="mt-4 font-sans text-3xl font-bold text-foreground md:text-4xl">
            {`Propuesta para ${lead.nombre}`}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Diagnostico personalizado basado en el analisis de tu negocio.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-6">
          <DiagnosisSummary
            title="Resumen rápido"
            subtitle="Diagnóstico y prioridades para tu negocio"
            readinessLabel={SegmentSummary({ segmento: score.segmento }).title}
            readinessColor={SegmentSummary({ segmento: score.segmento }).badge.includes("red") ? "text-red-700" : SegmentSummary({ segmento: score.segmento }).badge.includes("amber") ? "text-amber-700" : "text-blue-700"}
            readinessDescription={SegmentSummary({ segmento: score.segmento }).description}
            diagnosticExecutive={diagnosis.diagnostico_texto}
            priorities={diagnosis.beneficios.slice(0, 3)}
            plan={[
              "30d: diagnóstico fino + piloto de solución",
              "60d: implementación en procesos clave",
              "90d: escalado con indicadores de ROI",
            ]}
            insights={[
              { name: "Urgencia", value: score.urgencia >= 18 ? "Alta" : score.urgencia >= 10 ? "Media" : "Baja" },
              { name: "Impacto esperado", value: score.total >= 70 ? "Muy alto" : score.total >= 40 ? "Alto" : "Moderado" },
              { name: "Claridad del reto", value: score.claridad_problema >= 12 ? "Muy clara" : score.claridad_problema >= 8 ? "Clara" : "A definir" },
            ]}
            leadId={id}
          />

          {/* Service recommendation */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-sans text-xl font-bold text-card-foreground">{diagnosis.titulo_servicio}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{diagnosis.diagnostico_texto}</p>
            <p className="mt-3 text-sm leading-relaxed text-card-foreground">{diagnosis.descripcion}</p>
          </div>

          {/* Benefits */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-sans text-base font-semibold text-card-foreground">Beneficios esperados</h3>
            <div className="flex flex-col gap-3">
              {diagnosis.beneficios.map((b) => (
                <div key={b} className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span className="text-sm text-card-foreground">{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ROI & Price */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TrendUp className="h-4 w-4" />
                ROI estimado
              </div>
              <p className="mt-2 text-sm font-semibold text-card-foreground">{diagnosis.roi_estimado}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CurrencyDollar className="h-4 w-4" />
                Inversion estimada
              </div>
              <p className="mt-2 text-sm font-semibold text-card-foreground">{diagnosis.precio_rango}</p>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
            <h3 className="font-sans text-lg font-bold text-foreground">
              Listo para dar el siguiente paso?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {diagnosis.siguiente_paso}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={ctaData[score.segmento as keyof typeof ctaData].url}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Calendar className="h-4 w-4" />
                {ctaData[score.segmento as keyof typeof ctaData].label}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {lead.telefono}
              </span>
              <span className="flex items-center gap-1">
                <Envelope className="h-3 w-3" />
                {lead.email}
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
