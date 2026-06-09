"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, Phone } from "@phosphor-icons/react"

interface Props {
  leadId: string
  telefono: string
  open: boolean
  onClose: () => void
}

export function SolicitarLlamadaModal({ leadId, telefono, open, onClose }: Props) {
  const [preferencia, setPreferencia] = useState("")
  const [telefonoEdit, setTelefonoEdit] = useState(telefono)
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!preferencia.trim()) return
    setEnviando(true)
    setError("")

    try {
      const res = await fetch(`/api/leads/${leadId}/solicitar-llamada`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferencia_horaria: preferencia.trim() }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Error al solicitar llamada")
      }

      setExito(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo salió mal. Intenta de nuevo.")
    } finally {
      setEnviando(false)
    }
  }

  const handleClose = () => {
    setPreferencia("")
    setTelefonoEdit(telefono)
    setEnviando(false)
    setExito(false)
    setError("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent className="sm:max-w-md">
        {exito ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" weight="fill" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-foreground">¡Listo!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Te contactaremos en menos de 24h al {telefonoEdit}. Un especialista revisará tu diagnóstico antes de llamarte.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <DialogTitle className="mt-2">¿Cuándo te llamamos?</DialogTitle>
              <DialogDescription>
                Dinos tu disponibilidad y te contactamos sin compromiso.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Días y horarios en los que prefieres que te llamemos
                </label>
                <textarea
                  value={preferencia}
                  onChange={(e) => setPreferencia(e.target.value)}
                  placeholder="Ej: Martes o jueves por la tarde, después de las 3pm"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  rows={3}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Teléfono de contacto
                </label>
                <input
                  type="tel"
                  value={telefonoEdit}
                  onChange={(e) => setTelefonoEdit(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={enviando || !preferencia.trim()}
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {enviando ? "Enviando..." : "Solicitar llamada"}
                </button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
