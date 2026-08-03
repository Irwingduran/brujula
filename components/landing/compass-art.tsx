/**
 * Ilustraciones de la metáfora de la brújula.
 *
 * Son SVG puros y sin estado, por lo que se renderizan en el servidor.
 * Las tres son decorativas dentro de un bloque que ya explica el contraste con
 * texto, así que se marcan con `aria-hidden` y no duplican el mensaje para
 * lectores de pantalla.
 */

/** Aguja errática: un negocio sin diagnóstico no sabe hacia dónde ir. */
export function ErraticNeedle() {
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24" aria-hidden="true" focusable="false">
      <circle cx="60" cy="60" r="46" fill="none" stroke="#E5E1FA" strokeWidth="2" strokeDasharray="4 5" />
      <g opacity="0.35">
        <line x1="60" y1="60" x2="88" y2="34" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="60" x2="90" y2="70" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      </g>
      <line x1="60" y1="60" x2="32" y2="42" stroke="#7C3AED" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="60" r="5" fill="#7C3AED" />
    </svg>
  )
}

/** Aguja asentada: apunta a una ruta clara. */
export function SettledNeedle() {
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24" aria-hidden="true" focusable="false">
      <circle cx="60" cy="60" r="46" fill="none" stroke="#CFEBDD" strokeWidth="2" />
      <line x1="60" y1="60" x2="60" y2="18" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="60" x2="60" y2="90" stroke="#D1D5DB" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="60" r="5" fill="#047857" />
      <path d="M60 8 l5 12 h-10 z" fill="#059669" />
    </svg>
  )
}

const ROSE_DEGREES = [0, 45, 90, 135, 180, 225, 270, 315]
const ROSE_CENTER = 80
const ROSE_RADIUS = 68

/** Rosa de los vientos: ancla visual de la sección de valor. */
export function CompassRose() {
  return (
    <svg
      viewBox="0 0 160 160"
      className="h-32 w-32 sm:h-40 sm:w-40"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx={ROSE_CENTER} cy={ROSE_CENTER} r="70" fill="none" stroke="#DDD6FE" strokeWidth="1.5" />
      <circle cx={ROSE_CENTER} cy={ROSE_CENTER} r="52" fill="none" stroke="#EDE9FE" strokeWidth="1" />
      {ROSE_DEGREES.map((degree) => {
        const radians = (degree * Math.PI) / 180
        const isCardinal = degree % 90 === 0
        return (
          <line
            key={degree}
            x1={ROSE_CENTER}
            y1={ROSE_CENTER}
            x2={ROSE_CENTER + ROSE_RADIUS * Math.sin(radians)}
            y2={ROSE_CENTER - ROSE_RADIUS * Math.cos(radians)}
            stroke="#C4B5FD"
            strokeWidth={isCardinal ? 1.5 : 1}
            opacity={isCardinal ? 0.8 : 0.4}
          />
        )
      })}
      <path d="M80 20 L92 80 L80 140 L68 80 Z" fill="#6D28D9" opacity="0.9" />
      <path d="M20 80 L80 68 L140 80 L80 92 Z" fill="#A78BFA" opacity="0.55" />
      <circle cx={ROSE_CENTER} cy={ROSE_CENTER} r="7" fill="#4C1D95" />
    </svg>
  )
}
