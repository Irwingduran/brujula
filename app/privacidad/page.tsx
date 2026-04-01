import { Logo } from "@/components/shared/logo"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Aviso de Privacidad | Brújula",
  description: "Aviso de privacidad de Brújula. Conoce cómo protegemos tus datos personales.",
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver al inicio
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Aviso de Privacidad
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Última actualización: abril 2026
        </p>

        <div className="mt-10 space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground">Responsable</h2>
            <p className="mt-2">
              Brújula (en adelante &ldquo;nosotros&rdquo;), con domicilio en México, es responsable del
              tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos
              Personales en Posesión de los Particulares (LFPDPPP).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Datos que recopilamos</h2>
            <p className="mt-2">Recabamos los siguientes datos personales:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li><strong className="text-foreground">Identificación:</strong> nombre completo.</li>
              <li><strong className="text-foreground">Contacto:</strong> correo electrónico y número telefónico.</li>
              <li><strong className="text-foreground">Información del negocio:</strong> industria, tamaño de empresa, herramientas utilizadas, principales desafíos, presupuesto estimado y urgencia.</li>
              <li><strong className="text-foreground">Respuestas del diagnóstico:</strong> las respuestas que proporcionas durante el cuestionario.</li>
              <li><strong className="text-foreground">Datos de uso:</strong> apertura de correos electrónicos, visitas a tu página de resultados y fecha de última actividad.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Finalidades del tratamiento</h2>
            <p className="mt-2">Utilizamos tus datos para:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Generar tu diagnóstico digital personalizado.</li>
              <li>Enviarte los resultados de tu diagnóstico por correo electrónico.</li>
              <li>Conectarte con un experto si así lo solicitas.</li>
              <li>Mejorar nuestros servicios y la experiencia del diagnóstico.</li>
            </ul>
            <p className="mt-3">
              <strong className="text-foreground">No vendemos, compartimos ni transferimos</strong> tus
              datos personales a terceros sin tu consentimiento.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Derechos ARCO</h2>
            <p className="mt-2">
              Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus datos
              personales (derechos ARCO). Para ejercerlos, envía un correo a{" "}
              <a
                href="mailto:hola@somosbrujula.com.mx"
                className="text-primary underline underline-offset-2 hover:text-primary/80"
              >
                hola@somosbrujula.com.mx
              </a>{" "}
              con tu nombre y la descripción de tu solicitud. Responderemos en un plazo máximo de 20
              días hábiles.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Uso de cookies y analítica</h2>
            <p className="mt-2">
              Utilizamos herramientas de analítica (Vercel Analytics) para entender cómo se usa
              nuestro sitio. Estas herramientas pueden recopilar información anónima sobre tu
              navegación. No recopilamos datos personales a través de cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Cambios al aviso</h2>
            <p className="mt-2">
              Nos reservamos el derecho de modificar este aviso de privacidad. Cualquier cambio será
              publicado en esta página con la fecha de actualización correspondiente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Contacto</h2>
            <p className="mt-2">
              Para cualquier duda sobre este aviso de privacidad, escríbenos a{" "}
              <a
                href="mailto:hola@somosbrujula.com.mx"
                className="text-primary underline underline-offset-2 hover:text-primary/80"
              >
                hola@somosbrujula.com.mx
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
