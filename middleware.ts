import { withAuth } from "next-auth/middleware"
import { NextResponse, type NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// ============================================
// Rate Limiting (en memoria - para desarrollo)
// En producción usar Redis/Upstash
// ============================================
const rateLimitMap = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minuto
const MAX_REQUESTS = 10 // máximo 10 intentos por minuto

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  
  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
    return false
  }
  
  if (record.count >= MAX_REQUESTS) {
    return true
  }
  
  record.count++
  return false
}

// Limpiar registros antiguos cada 5 minutos
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now - record.timestamp > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(ip)
    }
  }
}, 5 * 60 * 1000)

// ============================================
// Security Headers
// ============================================
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevenir clickjacking
  response.headers.set("X-Frame-Options", "DENY")
  
  // Prevenir sniffing de MIME type
  response.headers.set("X-Content-Type-Options", "nosniff")
  
  // Habilitar protección XSS del navegador
  response.headers.set("X-XSS-Protection", "1; mode=block")
  
  // Política de referrer
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  
  // Permisos de funcionalidades
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  )
  
  return response
}

// ============================================
// Logging de accesos
// ============================================
function logAccess(req: NextRequest, status: string) {
  const timestamp = new Date().toISOString()
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
  const path = req.nextUrl.pathname
  const method = req.method
  
  console.log(`[${timestamp}] [ADMIN] ${method} ${path} - IP: ${ip} - ${status}`)
}

// ============================================
// Middleware principal
// ============================================
export default withAuth(
  async function middleware(req) {
    const ip = req.headers.get("x-forwarded-for") || 
               req.headers.get("x-real-ip") || 
               "127.0.0.1"
    
    const path = req.nextUrl.pathname
    const isLoginPage = path === "/admin/login"
    const isApiAuth = path.startsWith("/api/auth")
    
    // Rate limiting para página de login (protección contra fuerza bruta)
    if (isLoginPage && req.method === "POST") {
      if (isRateLimited(ip)) {
        logAccess(req, "RATE_LIMITED")
        return new NextResponse(
          JSON.stringify({ error: "Demasiados intentos. Espera un momento." }),
          { 
            status: 429, 
            headers: { "Content-Type": "application/json" } 
          }
        )
      }
    }
    
    // Obtener token para verificar autenticación
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    
    // Si está autenticado y va a login, redirigir a admin
    if (isLoginPage && token) {
      logAccess(req, "REDIRECT_TO_ADMIN")
      return NextResponse.redirect(new URL("/admin", req.url))
    }
    
    // Logging de acceso exitoso
    if (token) {
      logAccess(req, "AUTHENTICATED")
    } else if (isLoginPage) {
      logAccess(req, "LOGIN_PAGE")
    }
    
    // Crear response con headers de seguridad
    const response = NextResponse.next()
    return addSecurityHeaders(response)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        const isLoginPage = path === "/admin/login"
        const isApiAuth = path.startsWith("/api/auth")
        
        // Permitir rutas de autenticación y login sin token
        if (isLoginPage || isApiAuth) {
          return true
        }
        
        // Para otras rutas admin, requerir autenticación
        return !!token
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
)

// ============================================
// Rutas protegidas
// ============================================
export const config = {
  matcher: [
    // Proteger solo rutas admin
    "/admin/:path*",
  ],
}
