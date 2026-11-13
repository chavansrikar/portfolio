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
  /** Text shown in the custom-cursor pill on hover. */
  dataCursor?: string
}

const base =
  'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-all duration-300 sm:text-[15px]'

const variants: Record<Variant, string> = {
  primary:
    'bg-purple-500 text-black shadow-[0_10px_40px_-12px_rgba(168,85,247,0.75)] hover:bg-purple-400 hover:shadow-[0_16px_54px_-10px_rgba(168,85,247,0.9)] hover:-translate-y-0.5',
  ghost:
    'border border-white/12 bg-white/[0.04] text-chalk backdrop-blur-md hover:border-purple-400/50 hover:bg-purple-500/10 hover:-translate-y-0.5',
  outline:
    'border border-teal-400/50 text-teal-300 hover:border-teal-300 hover:bg-teal-400/10 hover:-translate-y-0.5',
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
  dataCursor,
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
        data-cursor={dataCursor}
      >
        {inner}
      </a>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cls}
      data-cursor={dataCursor}
    >
      {inner}
    </button>
  )
}
