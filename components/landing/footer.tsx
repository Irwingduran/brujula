import Link from "next/link"
import { Logo } from "@/components/shared/logo"
import { Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              Tu brújula hacia el éxito digital. Diagnósticos personalizados para impulsar tu negocio.
            </p>
          </div>
          
          {/* Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground">Enlaces</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/diagnostico" className="transition-colors hover:text-foreground">
                Diagnóstico
              </Link>
              <Link href="/admin" className="transition-colors hover:text-foreground">
                Admin
              </Link>
              <span className="cursor-pointer hover:text-foreground">Política de privacidad</span>
            </div>
          </div>
          
          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground">Contacto</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>hola@brujula.digital</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>LATAM</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Brújula. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Hecho con 💜 para negocios que quieren crecer
          </p>
        </div>
      </div>
    </footer>
  )
}
