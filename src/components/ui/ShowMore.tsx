type Props = {
  remaining: number
  label?: string
  onClick: () => void
  className?: string
}

/**
 * Compact "load more" control used where a long list would otherwise turn
 * into an endless mobile scroll. The glyph bar gets a slow one-shot scan
 * each time it mounts, so the control reads as part of the terminal theme.
 */
export function ShowMore({ remaining, label = 'more', onClick, className = '' }: Props) {
  return (
    <div className={`mt-8 flex justify-center sm:mt-10 ${className}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label={`Show ${remaining} ${label}`}
        className="group relative inline-flex min-h-11 items-center gap-3 overflow-hidden rounded-full border border-white/10 bg-white/[0.035] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-mist transition-all duration-300 hover:border-purple-400/45 hover:bg-purple-500/[0.08] hover:text-chalk active:scale-[0.98]"
      >
        <span aria-hidden className="ascii text-[9px] leading-none text-purple-400/70">
          ▓▒░
        </span>
        <span className="relative z-10">
          show {remaining} {label}
        </span>
        <span
          aria-hidden
          className="ascii text-[10px] leading-none text-teal-300/70 transition-transform duration-300 group-hover:translate-y-0.5"
        >
          ↓
        </span>
        {/* one-shot scan on mount */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{ animation: 'show-more-scan 1.8s cubic-bezier(0.45, 0, 0.55, 1) 0.2s 1 both' }}
        />
      </button>
    </div>
  )
}
