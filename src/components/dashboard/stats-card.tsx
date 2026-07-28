import { ArrowUpRight, Info, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle: string
  percentage: string
  icon?: LucideIcon
  trend?: "up" | "down"
  variant?: "default" | "dark"
  info?: string // ADDED — optional explanatory text shown in a hover tooltip
}

export function StatsCard({
  title,
  value,
  subtitle,
  percentage,
  icon: Icon,
  trend = "up",
  variant = "default",
  info,
}: StatsCardProps) {
  const isPositive = trend === "up"
  const isDark = variant === "dark"

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl md:rounded-2xl p-4 md:p-6 transition-all duration-300",
        "hover:shadow-xl hover:scale-[1.02]",
        isDark
          ? "bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] text-white border border-white/10"
          : "bg-gradient-to-br from-primary/90 to-primary border border-primary/20"
      )}
    >
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex-1 flex items-center gap-1.5">
          <p className={cn("text-xs md:text-sm font-medium mb-1", isDark ? "text-gray-400" : "text-primary-foreground/80")}>
            {title}
          </p>
          {info && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "mb-1 shrink-0 rounded-full opacity-70 hover:opacity-100 transition-opacity",
                    isDark ? "text-gray-400" : "text-primary-foreground/80"
                  )}
                  aria-label={`What is ${title}?`}
                >
                  <Info className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[220px] text-xs leading-snug">
                {info}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <button className={cn(
          "p-1.5 md:p-2 rounded-lg transition-all duration-300 flex-shrink-0",
          isDark ? "bg-white/10 hover:bg-[#FFD550] hover:text-black" : "bg-primary-foreground/20 hover:bg-primary-foreground/30"
        )}>
          <ArrowUpRight className="size-3 md:size-4" />
        </button>
      </div>

      <div className="space-y-2">
        <h3 className={cn("text-2xl md:text-3xl lg:text-4xl font-bold", isDark ? "text-white" : "text-primary-foreground")}>
          {value}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <p className={cn("text-[10px] md:text-xs truncate", isDark ? "text-gray-400" : "text-primary-foreground/70")}>
            {subtitle}
          </p>
          <span className={cn(
            "text-[10px] md:text-xs font-bold px-2 md:px-2.5 py-1 rounded-full flex-shrink-0",
            isPositive ? "bg-success/20 text-success-foreground" : "bg-destructive/20 text-destructive"
          )}>
            {percentage}
          </span>
        </div>
      </div>

      {Icon && (
        <div className={cn("absolute -bottom-4 md:-bottom-6 -right-4 md:-right-6 opacity-10 transition-opacity", "group-hover:opacity-20")}>
          <Icon className="size-24 md:size-32 lg:size-40" />
        </div>
      )}
    </div>
  )
}