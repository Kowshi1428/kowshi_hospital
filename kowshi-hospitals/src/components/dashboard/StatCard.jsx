import React from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Tilt3D from '@/components/ui/Tilt3D'
import { CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const toneGlows = {
  primary: 'rgba(62, 107, 250, 0.18)',
  cyan: 'rgba(34, 211, 238, 0.18)',
  success: 'rgba(52, 211, 153, 0.18)',
  warning: 'rgba(251, 191, 36, 0.18)',
  destructive: 'rgba(248, 113, 113, 0.18)',
}

export default function StatCard({ label, value, delta, deltaLabel, icon: Icon, tone = 'primary', suffix }) {
  const isPositive = delta === undefined ? null : delta >= 0
  const toneClasses = {
    primary: 'from-primary-500/15 text-primary-300',
    cyan: 'from-cyan/15 text-cyan',
    success: 'from-success/15 text-success',
    warning: 'from-warning/15 text-warning',
    destructive: 'from-destructive/15 text-destructive',
  }

  return (
    <Tilt3D className="group relative overflow-hidden border border-border" glowColor={toneGlows[tone]}>
      <div className={cn('absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br to-transparent blur-2xl', toneClasses[tone])} />
      <CardContent className="relative p-5">
        <div className="flex items-start justify-between">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          {Icon && (
            <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br to-transparent', toneClasses[tone])}>
              <Icon className="h-4 w-4" />
            </div>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-display text-2xl font-bold text-foreground mono-tabular">{value}</span>
          {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
        </div>
        {delta !== undefined && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            <span className={cn('flex items-center gap-0.5 font-medium', isPositive ? 'text-success' : 'text-destructive')}>
              {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(delta)}%
            </span>
            <span className="text-muted-foreground">{deltaLabel}</span>
          </div>
        )}
      </CardContent>
    </Tilt3D>
  )
}
