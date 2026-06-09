"use client"

import { Logo } from "@/components/shared/logo"
import { Hero } from "@/components/landing/hero"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <div className="flex items-center gap-4">
            <Link
              href="/diagnostico"
              className="group inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:shadow-primary/20"
            >
              Iniciar diagnóstico
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <Hero />
      </main>

      <Footer />
    </div>
  )
}
