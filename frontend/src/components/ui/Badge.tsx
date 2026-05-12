import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

type BadgeProps = {
  children: ReactNode
  tone?: 'neutral' | 'success' | 'warning' | 'accent'
  className?: string
}

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          neutral: 'bg-white/5 text-slate-300 ring-1 ring-white/10',
          success: 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30',
          warning: 'bg-amber-500/15 text-amber-100 ring-1 ring-amber-400/30',
          accent: 'bg-cyan-500/15 text-cyan-100 ring-1 ring-cyan-400/30',
        }[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
