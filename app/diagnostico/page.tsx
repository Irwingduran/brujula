import { WizardShell } from "@/components/wizard/wizard-shell"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Diagnóstico Digital Gratuito | Brújula",
  description: "Responde algunas preguntas sobre tu negocio y recibe un plan personalizado para digitalizarte y crecer.",
}

export default function DiagnosticoPage() {
  return <WizardShell />
}
