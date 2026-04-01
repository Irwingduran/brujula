"use client"

import { Logo } from "@/components/shared/logo"
import { Hero } from "@/components/landing/hero"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkle, Shield } from "@phosphor-icons/react"

const CTA_BENEFITS = [
  { icon: Sparkle, text: "100% gratuito" },
  { icon: Shield, text: "Sin compromiso" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
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

        {/* Final CTA */}
        <section className="relative overflow-hidden px-4 py-20 md:py-28">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90" />
          <div className="absolute inset-0">
            <div className="absolute -top-[50%] -right-[25%] h-[600px] w-[600px] rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-[50%] -left-[25%] h-[500px] w-[500px] rounded-full bg-accent/20 blur-3xl" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto max-w-3xl text-center"
          >
            
            <h2 className="mt-6 text-balance font-sans text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
              No tienes nada que perder
            </h2>
            <p className="mt-4 text-pretty text-lg text-white/80 md:text-xl">
              El diagnóstico es gratis, el plan es tuyo y nadie te va a llamar si no quieres.
            </p>
            
            <div className="mt-8">
              <Link
                href="/diagnostico"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-primary shadow-xl shadow-black/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
              >
                Comenzar diagnóstico gratuito
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              {CTA_BENEFITS.map((benefit) => (
                <div key={benefit.text} className="flex items-center gap-2 text-white/90">
                  <benefit.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
