import { cn } from '@/lib/cn'

export function Spinner({ className, label }: { className?: string; label?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-slate-400', className)}>
      <span
        className="size-5 animate-spin rounded-full border-2 border-white/15 border-t-cyan-400"
        aria-hidden
      />
      {label ? <span className="text-sm">{label}</span> : null}
    </span>
  )
}
