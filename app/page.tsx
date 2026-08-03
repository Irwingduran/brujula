import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { Logo } from "@/components/shared/logo"
import { Hero } from "@/components/landing/hero"
import { ProblemSection } from "@/components/landing/problem-section"
import { HowBrujulaThinks } from "@/components/landing/how-brujula-thinks"
import { FAQSection } from "@/components/landing/faq"
import { FinalCta } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"
import { DIAGNOSTIC_PATH } from "@/lib/landing-content"

/**
 * Landing pública. Es un componente de servidor: sólo las animaciones y el
 * acordeón del FAQ se hidratan en el cliente.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-violet-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Saltar al contenido
      </a>

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6" aria-label="Principal">
          <Link href="/" aria-label="Brújula, ir al inicio">
            <Logo />
          </Link>
          <Link
            href={DIAGNOSTIC_PATH}
            className="group inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-sm"
          >
            Iniciar diagnóstico
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </nav>
      </header>

      <main id="contenido">
        <Hero />
        <ProblemSection />
        <HowBrujulaThinks />
        <FAQSection />
        <FinalCta />
      </main>

      <Footer />
    </div>
  )
}
