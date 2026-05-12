import type { TextareaHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  hint?: string
}

export function Textarea({ id, label, hint, className, ...props }: TextareaProps) {
  const tid = id ?? props.name
  return (
    <label className="block space-y-1.5 text-left" htmlFor={tid}>
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <textarea
        id={tid}
        className={cn(
          'min-h-[120px] w-full rounded-xl border border-white/10 bg-surface-1 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/20',
          className,
        )}
        {...props}
      />
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </label>
  )
}
