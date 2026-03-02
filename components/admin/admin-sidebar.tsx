"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { LayoutDashboard, Columns3, Flame, ExternalLink, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pipeline", label: "Pipeline", icon: Columns3 },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Brand */}
      <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-bold">
          N
        </div>
        <span className="font-sans text-base font-semibold text-sidebar-foreground tracking-tight">
          NexoDigital
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}

        {/* HOT leads shortcut */}
        <div className="mt-4 border-t border-sidebar-border pt-4">
          <span className="mb-2 block px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
            Acceso rapido
          </span>
          <Link
            href="/admin/pipeline"
            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <Flame className="h-4 w-4 text-red-400" />
            Leads HOT
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-3 py-3 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-sidebar-foreground/50 transition-colors hover:text-sidebar-foreground"
        >
          <ExternalLink className="h-3 w-3" />
          Ver landing page
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-sidebar-foreground/50 transition-colors hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <LogOut className="h-3 w-3" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
