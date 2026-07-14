import Image from "next/image"
import { cn } from "@/lib/utils"

export function Logo({ className, variant = "dark" }: { className?: string; variant?: "dark" | "light" }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo.png"
        alt="Brújula"
        width={32}
        height={32}
        className="h-18 w-18 rounded-lg object-contain"
        priority
      />
      <span className={cn(
        "font-sans text-lg font-semibold tracking-tight",
        variant === "dark" ? "text-foreground" : "text-primary-foreground"
      )}>
      </span>
    </div>
  )
}
