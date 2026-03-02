import { cn } from "@/lib/utils"
import type { LeadSegment } from "@/lib/types"

const SEGMENT_STYLES: Record<LeadSegment, string> = {
  HOT: "bg-red-100 text-red-800",
  WARM: "bg-amber-100 text-amber-800",
  COLD: "bg-blue-100 text-blue-800",
}

export function ScoreBadge({ score, segment }: { score: number; segment: LeadSegment }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-foreground">{score}</span>
      <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", SEGMENT_STYLES[segment])}>
        {segment}
      </span>
    </div>
  )
}
