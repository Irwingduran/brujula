import { prisma } from "@/lib/prisma"
import { Logo } from "@/components/shared/logo"
import { Footer } from "@/components/landing/footer"
import { TrackingPixel } from "@/components/shared/tracking-pixel"
import { DiagnosisSummary } from "@/components/diagnosis/diagnosis-summary"
import { CheckCircle, Calendar, ArrowRight, Envelope, UserCircle } from "@phosphor-icons/react/dist/ssr"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { DiagnosisResult, ScoreBreakdown } from "@/lib/types"

export const metadata: Metadata = {
  title: "Tu Diagnóstico | Brújula",
  description: "Resultados de tu diagnóstico digital personalizado.",
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

  const ctaMessages: Record<string, string> = {
    HOT: "Tu negocio tiene oportunidades inmediatas. Un especialista puede ayudarte a priorizarlas.",
    WARM: "Hay puntos claros donde mejorar. Un especialista puede armar un plan contigo.",
    COLD: "Tienes una base sólida. Un especialista puede identificar oportunidades que la IA no alcanza a ver.",
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
            {`Tu diagnóstico, ${lead.nombre}`}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Esto es lo que encontramos después de analizar tu negocio.
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

          {/* Qué encontramos */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-sans text-xl font-bold text-card-foreground">Análisis de tu situación</h2>
            <p className="mt-3 text-sm leading-relaxed text-card-foreground">{diagnosis.diagnostico_texto}</p>
          </div>

          {/* Oportunidades detectadas */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-sans text-base font-semibold text-card-foreground">Oportunidades detectadas</h3>
            <div className="flex flex-col gap-3">
              {diagnosis.beneficios.map((b) => (
                <div key={b} className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span className="text-sm text-card-foreground">{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Handoff — Hablar con un especialista */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <UserCircle className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-4 sm:mt-0">
                <h3 className="font-sans text-lg font-bold text-foreground">
                  ¿Quieres ayuda para implementar esto?
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {ctaMessages[score.segmento] || ctaMessages.COLD}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  La llamada es gratuita y el especialista ya conoce tu diagnóstico.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="mailto:hola@somosbrujula.com.mx?subject=Quiero%20hablar%20sobre%20mi%20diagn%C3%B3stico&body=Hola%2C%20acabo%20de%20completar%20mi%20diagn%C3%B3stico%20en%20Br%C3%BAjula%20y%20me%20gustar%C3%ADa%20hablar%20con%20un%20especialista."
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
                  >
                    <Envelope className="h-4 w-4" />
                    Agendar llamada gratuita
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Sin compromiso · Respuesta en menos de 24h
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
