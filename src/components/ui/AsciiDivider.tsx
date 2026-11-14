type Props = {
  index: string
  label: string
  reverse?: boolean
  /** Seconds for one full scroll. */
  speed?: number
}

const RAIL = '░▒▓█ · + × : ─────── · ░▒▓█ · × + : ────── · '

/**
 * A moving ASCII rail between sections.
 *
 * Two identical copies of the glyph row scroll at -50% for a seamless
 * loop. Pure CSS transform on the compositor — no JS per frame.
 */
export function AsciiDivider({ index, label, reverse = false, speed = 38 }: Props) {
  const row = RAIL.repeat(4)
  return (
    <div
      aria-hidden
      className="relative z-10 overflow-hidden border-y border-white/[0.055] bg-void/50 py-[7px]"
    >
      <div className="flex items-center gap-3 px-4 sm:px-6">
        <span className="ascii shrink-0 text-[10px] leading-none text-purple-400/45">
          ╞
        </span>

        <div className="mask-fade-x relative min-w-0 flex-1 overflow-hidden">
          <div
            className={`flex w-max ${reverse ? 'animate-marquee-rev' : 'animate-marquee'}`}
            style={{ animationDuration: `${speed}s` }}
          >
            <span className="ascii whitespace-pre text-[10px] leading-none text-mist/25">
              {row}
            </span>
            <span className="ascii whitespace-pre text-[10px] leading-none text-mist/25">
              {row}
            </span>
          </div>
        </div>

        <span className="ascii shrink-0 text-[9px] leading-none tracking-[0.14em] text-purple-300/60">
          [ {index} / {label} ]
        </span>

        <span className="ascii shrink-0 text-[10px] leading-none text-teal-400/40">
          ╡
        </span>
      </div>
    </div>
  )
}