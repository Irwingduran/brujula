import { prisma } from "@/lib/prisma"
import { Logo } from "@/components/shared/logo"
import { Footer } from "@/components/landing/footer"
import { TrackingPixel } from "@/components/shared/tracking-pixel"
import { DiagnosisSummary } from "@/components/diagnosis/diagnosis-summary"
import { CheckCircle, Lightbulb, Target, RocketLaunch, Star } from "@phosphor-icons/react/dist/ssr"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { DiagnosisResult, ScoreBreakdown } from "@/lib/types"
import { ResultadoCTAs } from "@/components/diagnosis/resultado-ctas"
import { ServiciosRecomendados } from "@/components/diagnosis/servicios-recomendados"

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
  const summary: Record<string, { title: string; description: string; badge: string }> = {
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
  }
  return summary[segmento] || summary.COLD
}

const URGENCY_COLORS: Record<string, string> = {
  inmediata: "bg-red-100 text-red-800",
  corto: "bg-amber-100 text-amber-800",
  largo: "bg-blue-100 text-blue-800",
}

function MadurezIndicator({ nivel }: { nivel: number }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`h-5 w-5 ${n <= nivel ? "text-primary fill-primary" : "text-muted-foreground/30"}`} weight={n <= nivel ? "fill" : "regular"} />
      ))}
      <span className="ml-2 text-sm font-medium text-muted-foreground">{nivel}/5</span>
    </div>
  )
}

export default async function ResultadoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const lead = await prisma.lead.findUnique({ where: { id } })

  if (!lead || (!lead.diagnostico && !lead.diagnostico_v2) || !lead.score) {
    notFound()
  }

  const score = lead.score as unknown as ScoreBreakdown
  const isV2 = lead.pipeline_version === "v2"

  const websiteAnalysis = lead.website_analisis as { titulo?: string } | null
  const businessName = websiteAnalysis?.titulo

  return (
    <div className="min-h-screen bg-background">
      <TrackingPixel leadId={id} />

      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-center px-4 py-4">
          <Logo />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
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

        {isV2 && lead.diagnostico_v2 ? (
          <V2Resultado diagnostico={lead.diagnostico_v2 as unknown as V2Diagnostico} score={score} leadId={id} email={lead.email} telefono={lead.telefono} nombre={lead.nombre} />
        ) : (
          <LegacyResultado lead={lead} score={score} businessName={businessName} id={id} />
        )}
      </main>

      <Footer />
    </div>
  )
}

const ctaMessages: Record<string, string> = {
  HOT: "Tu negocio tiene oportunidades inmediatas. Un especialista puede ayudarte a priorizarlas.",
  WARM: "Hay puntos claros donde mejorar. Un especialista puede armar un plan contigo.",
  COLD: "Tienes una base sólida. Un especialista puede identificar oportunidades que la IA no alcanza a ver.",
}

interface V2Sintoma {
  sintomaId: string
  score: number
  evidencia: string
  evidenceIds?: string[]
  confidence?: "alta" | "media" | "baja"
}

interface V2Evidence {
  id: string
  label: string
  source: "questionnaire" | "adaptive_answer" | "website" | "google_business" | "admin"
  reliability: "declared" | "observed" | "inferred"
}

interface V2Finding {
  id: string
  symptomIds: string[]
  evidenceIds: string[]
  severity: number
  title: string
  summary: string
  businessImpact: string
  confidence: "alta" | "media" | "baja"
  missingInformation: string[]
  contradictions: string[]
}

interface V2Capability {
  id: string
  name: string
  description: string
  level: "inicial" | "consolidacion" | "escalable"
}

interface V2Metric {
  id: string
  name: string
  baselineStatus: "known" | "declared" | "por_medir"
}

interface V2Recommendation {
  id: string
  title: string
  objective: string
  actions: string[]
  horizon: "ahora" | "despues" | "cuando_haya_evidencia"
  prerequisites: string[]
  notRecommendedYet: string[]
  metricIds: string[]
}

interface V2Accion {
  accionId: string
  prioridad: 1 | 2 | 3
  justificacion: string
}

interface V2PlanAccion {
  paso: string
  descripcion: string
  urgencia: string
}

interface V2Redaccion {
  resumen: string
  sintomasPrincipales: string[]
  planDeAccion: V2PlanAccion[]
  scoreTexto: string
}

interface V2Clasificacion {
  segmento: string
  madurezDigital: number
  perfilRiesgo: string
}

interface V2Diagnostico {
  clasificacion: V2Clasificacion
  evidence?: V2Evidence[]
  sintomas: V2Sintoma[]
  findings?: V2Finding[]
  capabilities?: V2Capability[]
  recommendations?: V2Recommendation[]
  metrics?: V2Metric[]
  acciones: V2Accion[]
  redaccion: V2Redaccion
}

function V2Resultado({ diagnostico, score, leadId, email, telefono, nombre }: { diagnostico: V2Diagnostico; score: ScoreBreakdown; leadId: string; email: string; telefono: string; nombre: string }) {
  const PRIORIDAD_ICONOS = [RocketLaunch, Target, Lightbulb]
  const PRIORIDAD_LABELS = ["Prioridad 1 — Más urgente", "Prioridad 2 — Siguiente paso", "Prioridad 3 — A futuro"]

  return (
    <div className="mt-10 flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-lg leading-relaxed text-foreground">
          {diagnostico.redaccion.resumen}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-sans text-xl font-bold">Tu nivel de madurez digital</h2>
        <p className="mt-1 text-sm text-muted-foreground">{diagnostico.redaccion.scoreTexto}</p>
        <div className="mt-4">
          <MadurezIndicator nivel={diagnostico.clasificacion.madurezDigital} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-sans text-xl font-bold">Tus 3 síntomas principales</h2>
        <div className="mt-4 flex flex-col gap-3">
          {diagnostico.redaccion.sintomasPrincipales.map((sintoma, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </div>
              <p className="text-sm text-foreground">{sintoma}</p>
            </div>
          ))}
        </div>
        {diagnostico.evidence && diagnostico.evidence.length > 0 && (
          <div className="mt-5 border-t border-border pt-4">
            <h3 className="text-sm font-semibold text-foreground">Por qué detectamos esto</h3>
            <div className="mt-3 space-y-3">
              {diagnostico.sintomas.map((sintoma) => {
                const references = (sintoma.evidenceIds ?? [])
                  .map((id) => diagnostico.evidence?.find((evidence) => evidence.id === id))
                  .filter((evidence): evidence is V2Evidence => Boolean(evidence))
                if (!references.length) return null
                return (
                  <div key={sintoma.sintomaId} className="rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold capitalize text-foreground">{sintoma.sintomaId.replace(/_/g, " ")}</span>
                      {sintoma.confidence && <span className="text-[11px] text-muted-foreground">Confianza {sintoma.confidence}</span>}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{sintoma.evidencia}</p>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {references.map((evidence) => <li key={evidence.id}>• {evidence.label}</li>)}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {(diagnostico.findings?.length ?? 0) > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-sans text-xl font-bold">Hallazgos prioritarios</h2>
          <p className="mt-1 text-sm text-muted-foreground">Interpretamos estas señales como impacto probable, no como resultados garantizados.</p>
          <div className="mt-4 space-y-3">
            {diagnostico.findings?.map((finding) => (
              <article key={finding.id} className="rounded-lg border border-amber-100 bg-amber-50/40 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground">{finding.title}</h3>
                  <div className="flex gap-2 text-[11px] text-muted-foreground">
                    <span>Severidad {finding.severity}/5</span>
                    <span>Confianza {finding.confidence}</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-foreground">{finding.summary}</p>
                <p className="mt-2 text-sm text-muted-foreground"><strong className="text-foreground">Impacto probable:</strong> {finding.businessImpact}</p>
                {(finding.missingInformation.length > 0 || finding.contradictions.length > 0) && (
                  <div className="mt-3 border-t border-amber-100 pt-3 text-xs text-muted-foreground space-y-1">
                    {finding.missingInformation.length > 0 && <p><strong className="text-foreground">Para confirmarlo conviene conocer:</strong> {finding.missingInformation.join(" · ")}</p>}
                    {finding.contradictions.length > 0 && <p><strong className="text-foreground">Información a revisar:</strong> {finding.contradictions.join(" · ")}</p>}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      )}

      {(diagnostico.capabilities?.length ?? 0) > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-sans text-xl font-bold">Lo que conviene desarrollar ahora</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">{diagnostico.capabilities?.map((capability) => <div key={capability.id} className="rounded-lg bg-primary/5 p-4"><div className="flex justify-between gap-2"><h3 className="text-sm font-semibold">{capability.name}</h3><span className="text-xs text-primary capitalize">{capability.level}</span></div><p className="mt-2 text-xs text-muted-foreground">{capability.description}</p></div>)}</div>
          {(diagnostico.recommendations?.length ?? 0) > 0 && <div className="mt-5 space-y-3 border-t border-border pt-4"><h3 className="text-sm font-semibold">Ruta recomendada</h3>{diagnostico.recommendations?.map((recommendation) => { const metric = diagnostico.metrics?.find((item) => recommendation.metricIds.includes(item.id)); return <article key={recommendation.id} className="rounded-lg border border-border p-4"><div className="flex justify-between gap-2"><h4 className="font-semibold">{recommendation.title}</h4><span className="text-xs text-muted-foreground">{recommendation.horizon.replaceAll("_", " ")}</span></div><p className="mt-2 text-sm text-muted-foreground">{recommendation.objective}</p><ul className="mt-2 text-sm text-muted-foreground">{recommendation.actions.map((action) => <li key={action}>• {action}</li>)}</ul><p className="mt-2 text-xs text-muted-foreground"><strong className="text-foreground">Antes de avanzar:</strong> {recommendation.prerequisites.join(" · ")}</p>{metric && <p className="mt-1 text-xs text-muted-foreground"><strong className="text-foreground">Métrica:</strong> {metric.name} — {metric.baselineStatus === "por_medir" ? "por medir" : metric.baselineStatus}</p>}</article>})}</div>}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-sans text-xl font-bold">Tu plan de acción</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ordenado por prioridad e impacto para tu negocio
        </p>
        <div className="mt-4 flex flex-col gap-4">
          {diagnostico.redaccion.planDeAccion.map((item, i) => {
            const Icon = PRIORIDAD_ICONOS[i]
            return (
              <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-foreground">{item.paso}</h3>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${URGENCY_COLORS[item.urgencia] || "bg-gray-100 text-gray-800"}`}>
                        {item.urgencia === "inmediata" ? "Urgente" : item.urgencia === "corto" ? "Corto plazo" : "Largo plazo"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{item.descripcion}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <ServiciosRecomendados leadId={leadId} />

      <ResultadoCTAs
        leadId={leadId}
        email={email}
        telefono={telefono}
        nombre={nombre}
        segmento={score.segmento}
        ctaMessages={ctaMessages}
      />
    </div>
  )
}

async function LegacyResultado({
  lead,
  score,
  businessName,
  id,
}: {
  lead: { diagnostico: unknown; diagnostico_ia: unknown; nombre: string; score: unknown; segmento: string; email: string; telefono: string }
  score: ScoreBreakdown
  businessName?: string
  id: string
}) {
  const raw = lead.diagnostico_ia as Record<string, unknown> | null
  const diagnosis = lead.diagnostico as unknown as DiagnosisResult

  // Map legacy or new AI diagnosis
  const r = raw || {}
  const rPlan90 = r.plan_90_dias as { mes_1?: string; mes_2?: string; mes_3?: string } | undefined
  const rPlan30 = r.plan_30_60_90 as { dia_30?: string; dia_60?: string; dia_90?: string } | undefined
  const aiPatron = (r.patron_negocio ?? r.diagnostico_texto ?? diagnosis.patron_negocio) as string
  const aiRiesgo = (r.riesgo_principal ?? "") as string
  const aiCambio = (r.cambio_clave ?? r.sugerencia_mejora ?? diagnosis.cambio_clave) as string
  const aiPlan = rPlan90
    ? [rPlan90.mes_1 || "", rPlan90.mes_2 || "", rPlan90.mes_3 || ""]
    : rPlan30
      ? [rPlan30.dia_30 || "", rPlan30.dia_60 || "", rPlan30.dia_90 || ""]
      : [diagnosis.plan_90_dias.mes_1, diagnosis.plan_90_dias.mes_2, diagnosis.plan_90_dias.mes_3]

  return (
    <div className="mt-10 flex flex-col gap-6">
      <DiagnosisSummary
        patronNegocio={String(aiPatron ?? "")}
        riesgoPrincipal={String(aiRiesgo ?? "")}
        cambioClave={String(aiCambio ?? "")}
        plan={aiPlan as string[]}
      />

      <ServiciosRecomendados leadId={id} />

      <ResultadoCTAs
        leadId={id}
        email={lead.email}
        telefono={lead.telefono}
        nombre={lead.nombre}
        segmento={score.segmento}
        ctaMessages={ctaMessages}
      />
    </div>
  )
}
