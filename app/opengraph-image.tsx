import { ImageResponse } from "next/og"
import { SITE_DESCRIPTION, SITE_TITLE } from "./layout"

/**
 * Imagen de la vista previa al compartir el enlace.
 *
 * Se genera por código en lugar de mantener un archivo binario: así el texto no
 * puede quedar desincronizado del título del sitio, y no hay que exportar una
 * imagen nueva cada vez que cambie la redacción. `logo.png` no servía para esto
 * porque es cuadrado y pesa más de 500 KB.
 */
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = SITE_TITLE

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "14px",
              height: "56px",
              borderRadius: "999px",
              backgroundColor: "#6d28d9",
            }}
          />
          <div
            style={{
              fontSize: "34px",
              fontWeight: 700,
              color: "#4c1d95",
              letterSpacing: "-0.02em",
            }}
          >
            Brújula
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "68px",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.035em",
              color: "#030712",
            }}
          >
            Diagnóstico digital gratuito para tu negocio
          </div>
          <div
            style={{
              marginTop: "28px",
              fontSize: "30px",
              lineHeight: 1.4,
              color: "#6b7280",
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>

        {/* Los cuatro eslabones del resultado, en el mismo orden que la landing. */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {["Evidencia", "Hallazgo", "Capacidad", "Primer paso"].map((step, index) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  display: "flex",
                  fontSize: "24px",
                  fontWeight: 600,
                  color: index === 3 ? "#047857" : "#6d28d9",
                  backgroundColor: index === 3 ? "#ecfdf5" : "#f5f3ff",
                  borderRadius: "999px",
                  padding: "12px 24px",
                }}
              >
                {step}
              </div>
              {index < 3 && <div style={{ display: "flex", fontSize: "24px", color: "#d1d5db" }}>→</div>}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
