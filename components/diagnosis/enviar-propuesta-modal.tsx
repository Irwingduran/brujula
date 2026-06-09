"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Envelope, CheckCircle } from "@phosphor-icons/react"

interface Props {
  leadId: string
  email: string
  open: boolean
  onClose: () => void
}

export function EnviarPropuestaModal({ leadId, email, open, onClose }: Props) {
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    setEnviando(true)
    setError("")

    try {
      const res = await fetch(`/api/leads/${leadId}/enviar-propuesta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Error al enviar propuesta")
      }

      setExito(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo salió mal. Intenta de nuevo.")
    } finally {
      setEnviando(false)
    }
  }

  const handleClose = () => {
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
            <h3 className="mt-4 text-lg font-bold text-foreground">Propuesta enviada</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Revisa tu bandeja de entrada en <strong>{email}</strong>. Si no lo ves, revisa la carpeta de spam.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Envelope className="h-5 w-5 text-primary" />
              </div>
              <DialogTitle className="mt-2">Recibir propuesta por email</DialogTitle>
              <DialogDescription>
                Te enviaremos el diagnóstico completo a <strong>{email}</strong> con todos los detalles, el plan de acción y las recomendaciones.
              </DialogDescription>
            </DialogHeader>

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
                disabled={enviando}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {enviando ? "Enviando..." : "Enviar propuesta"}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
