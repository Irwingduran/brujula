import { cn } from "@/lib/utils"
import { Compass } from "lucide-react"

export function Logo({ className, variant = "dark" }: { className?: string; variant?: "dark" | "light" }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg",
        variant === "dark"
          ? "bg-primary text-primary-foreground"
          : "bg-primary-foreground text-primary"
      )}>
        <Compass className="h-5 w-5" />
      </div>
      <span className={cn(
        "font-sans text-lg font-semibold tracking-tight",
        variant === "dark" ? "text-foreground" : "text-primary-foreground"
      )}>
        Brújula
      </span>
    </div>
  )
}
