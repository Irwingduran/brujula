"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Star, Quote, Users, TrendingUp, Clock, ThumbsUp } from "lucide-react"

const STATS = [
  { value: 150, suffix: "+", label: "Negocios diagnosticados", icon: Users },
  { value: 40, suffix: "%", label: "Incremento promedio en ventas", icon: TrendingUp },
  { value: 3, suffix: " min", label: "Tiempo de diagnóstico", icon: Clock },
  { value: 95, suffix: "%", label: "Satisfacción de clientes", icon: ThumbsUp },
]

const TESTIMONIALS = [
  {
    quote: "El diagnóstico me abrió los ojos. Tenía problemas que ni sabía que existían y ahora tengo un plan claro para los próximos 6 meses.",
    name: "Patricia Vargas",
    role: "Dueña de restaurante",
    location: "México",
    rating: 5,
    avatar: "PV",
  },
  {
    quote: "En 3 minutos entendí exactamente dónde estaba perdiendo dinero. La llamada de seguimiento fue muy profesional y me dieron pasos concretos.",
    name: "Andrés Morales",
    role: "Gerente de tienda retail",
    location: "Colombia",
    rating: 5,
    avatar: "AM",
  },
  {
    quote: "Implementamos las recomendaciones y en 2 meses nuestras ventas online crecieron un 35%. El ROI superó todas nuestras expectativas.",
    name: "Sofía Reyes",
    role: "Fundadora de academia",
    location: "Chile",
    rating: 5,
    avatar: "SR",
  },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

export function SocialProof() {
  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-28">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-background to-background" />
      
      <div className="relative mx-auto max-w-6xl">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-border bg-card p-8 shadow-lg md:p-12"
        >
          <div className="text-center mb-10">
            <h2 className="text-balance font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Resultados que hablan por sí solos
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="font-sans text-3xl font-bold text-primary md:text-4xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
              <Star className="h-4 w-4 fill-accent" />
              Testimonios reales
            </span>
            <h2 className="mt-4 text-balance font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Lo que dicen nuestros clientes
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-pretty text-muted-foreground md:text-lg">
              Historias de éxito de negocios que transformaron su operación digital.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Quote icon */}
                <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10 transition-colors group-hover:text-primary/20" />
                
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="mt-4 flex-1 text-base leading-relaxed text-foreground">
                  "{t.quote}"
                </blockquote>

                {/* Author */}
                <div className="mt-6 flex items-center gap-4 border-t border-border pt-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-bold text-primary-foreground">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{t.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {t.role} • {t.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
