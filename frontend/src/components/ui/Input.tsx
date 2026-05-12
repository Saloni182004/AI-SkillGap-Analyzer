import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  error?: string
}

export function Input({ id, label, hint, error, className, ...props }: InputProps) {
  const inputId = id ?? props.name
  return (
    <label className="block space-y-1.5 text-left" htmlFor={inputId}>
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <input
        id={inputId}
        className={cn(
          'h-11 w-full rounded-xl border border-white/10 bg-surface-1 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/20',
          error && 'border-rose-500/60 focus:border-rose-400 focus:ring-rose-500/20',
          className,
        )}
        {...props}
      />
      {hint && !error ? <p className="text-xs text-slate-500">{hint}</p> : null}
      {error ? <p className="text-xs text-rose-400">{error}</p> : null}
    </label>
  )
}
