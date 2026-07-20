import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default: 'border-primary-500/30 bg-primary-500/10 text-primary-300',
        secondary: 'border-border bg-secondary text-secondary-foreground',
        success: 'border-success/30 bg-success/10 text-success',
        warning: 'border-warning/30 bg-warning/10 text-warning',
        destructive: 'border-destructive/30 bg-destructive/10 text-destructive',
        outline: 'border-border text-muted-foreground',
        cyan: 'border-cyan/30 bg-cyan/10 text-cyan',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
