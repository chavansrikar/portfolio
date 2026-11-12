import type { ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'outline'

type Props = {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: Variant
  className?: string
  target?: string
  rel?: string
  type?: 'button' | 'submit'
  ariaLabel?: string
}

const base =
  'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-all duration-300 sm:text-[15px]'

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-500 text-void shadow-[0_10px_40px_-12px_rgba(34,211,238,0.6)] hover:shadow-[0_16px_54px_-10px_rgba(34,211,238,0.8)] hover:-translate-y-0.5',
  ghost:
    'border border-white/12 bg-white/[0.04] text-chalk backdrop-blur-md hover:border-white/25 hover:bg-white/[0.08] hover:-translate-y-0.5',
  outline:
    'border border-cyan-400/40 text-cyan-300 hover:border-cyan-300 hover:bg-cyan-400/10 hover:-translate-y-0.5',
}

export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  target,
  rel,
  type = 'button',
  ariaLabel,
}: Props) {
  const cls = `${base} ${variants[variant]} ${className}`

  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        className={cls}
        onClick={onClick}
      >
        {inner}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} aria-label={ariaLabel} className={cls}>
      {inner}
    </button>
  )
}
