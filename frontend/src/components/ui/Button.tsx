import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

import { cn } from '@/lib/cn'

const variants = {
  primary:
    'bg-gradient-to-r from-cyan-500 to-violet-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:brightness-110',
  secondary: 'border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10',
  ghost: 'text-slate-200 hover:bg-white/5',
  danger: 'bg-rose-600 text-white hover:bg-rose-500',
} as const

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
} as const

type Variant = keyof typeof variants
type Size = keyof typeof sizes

function buttonClasses(variant: Variant, size: Size, className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )
}

type Common = {
  variant?: Variant
  size?: Size
  className?: string
}

type ButtonAsButton = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: undefined
  }

type ButtonAsLink = Common &
  Omit<LinkProps, 'className'> & {
    to: string
  }

export type ButtonProps = ButtonAsButton | ButtonAsLink

export function Button(props: ButtonProps) {
  const variant = props.variant ?? 'primary'
  const size = props.size ?? 'md'
  const className = buttonClasses(variant, size, props.className)

  if ('to' in props && props.to) {
    const { to, variant, size, className: ignoredClassName, children, ...rest } = props as ButtonAsLink
    void variant
    void size
    void ignoredClassName
    return (
      <Link to={to} className={className} {...rest}>
        {children}
      </Link>
    )
  }

  const { type = 'button', children, ...rest } = props as ButtonAsButton
  return (
    <button type={type} className={className} {...rest}>
      {children}
    </button>
  )
}
