import { useEffect, useRef, useState } from 'react'
import { useInteractive } from '@/hooks/useInteractive'

type Props = {
  art: string
  className?: string
  /** Label shown in the corner readout. */
  label?: string
}

/**
 * A framed ASCII art panel that reacts to hover:
 *  - the glyphs get a glitch scramble
 *  - a scanline sweeps the panel
 *  - a frame readout appears
 *
 * The scramble is driven by anime.js on the panel's own opacity/blur while
 * the character swap is handled by a lightweight rAF ticker.
 */
export function AsciiHoverPanel({ art, className = '', label }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState(art)
  const raf = useRef(0)
  const touch = useInteractive({ duration: 2600 })
  const hovered = touch.active

  useEffect(() => {
    if (!hovered) {
      setDisplay(art)
      return
    }

    const glitchChars = '!<>-_\\/[]{}—=+*^?#░▒▓█▄▀'
    const lines = art.split('\n')
    let frame = 0

    const tick = () => {
      frame++
      // Ramp the scramble up then settle back into the original art
      const intensity = frame < 14 ? 1 - frame / 14 : frame < 22 ? 0.6 : 0.18
      if (intensity > 0.02 && Math.random() > 0.45) {
        setDisplay(
          lines
            .map((line) =>
              line
                .split('')
                .map((c) =>
                  c !== ' ' && Math.random() < intensity * 0.35
                    ? glitchChars[(Math.random() * glitchChars.length) | 0]
                    : c
                )
                .join('')
            )
            .join('\n')
        )
      }
      raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [hovered, art])

  // anime.js handles the glow + panel transitions
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const { animate } = await import('animejs')
      if (cancelled) return
      const el = ref.current
      if (!el) return
      animate(el, {
        boxShadow: hovered
          ? '0 0 0 1px rgba(168,85,247,0.4), 0 0 60px -14px rgba(45,212,191,0.5)'
          : '0 0 0 1px rgba(255,255,255,0.06), 0 0 0px -14px rgba(0,0,0,0)',
        duration: 700,
        ease: 'outExpo',
      })
    }
    run()
    return () => {
      cancelled = true
    }
  }, [hovered])

  return (
    <div
      ref={ref}
      {...touch.handlers}
      data-cursor="none"
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-void/60 ${className}`}
    >
      {/* Corner frame */}
      <div className="pointer-events-none absolute inset-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        {[
          'left-0 top-0 border-l border-t',
          'right-0 top-0 border-r border-t',
          'left-0 bottom-0 border-l border-b',
          'right-0 bottom-0 border-r border-b',
        ].map((c) => (
          <span key={c} className={`absolute h-4 w-4 border-purple-400/70 ${c}`} />
        ))}
      </div>

      {/* Scanline */}
      <div
        className="pointer-events-none absolute inset-x-0 h-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(180deg, transparent, rgba(168,85,247,0.09), transparent)',
          animation: 'scan 3.4s linear infinite',
        }}
      />

      <pre
        className="ascii relative overflow-x-auto px-5 py-6 text-[8px] leading-[1.15] text-purple-300/80 transition-all duration-500 group-hover:text-purple-200 sm:text-[10px]"
        style={{
          textShadow: hovered ? '0 0 14px rgba(251,191,36,0.55)' : 'none',
        }}
      >
        {display}
      </pre>

      {label && (
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-[0.2em] text-mist/45 transition-colors duration-500 group-hover:text-purple-300/80">
          {label}
        </div>
      )}
    </div>
  )
}
