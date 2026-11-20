import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { toAscii } from '@/lib/ascii'

type Props = {
  text: string
  className?: string
  min?: number
  max?: number
  /** Seconds between consecutive letters dropping in. */
  stagger?: number
  /** Seconds before the first letter drops. */
  delay?: number
  /** Animate each letter falling in from above. */
  fall?: boolean
  /** How far above its resting place each letter starts. */
  from?: string
  /** Clip the falling letters to the name box. Disable for full-screen boots. */
  clip?: boolean
  /** Centre the row inside its container. */
  center?: boolean
  /** Fixed CSS font size — skips container measurement. */
  fontSize?: string | number
  /** Hold the letters hidden until this becomes true. */
  play?: boolean
}

/**
 * Renders text as ASCII block-art that always fits its container width.
 *
 * Each character is its own 6-column glyph, so the letters can drop in
 * one at a time instead of revealing as whole rows. The font size is
 * derived from the measured container width, keeping the art legible on
 * a phone and large on a desktop with no horizontal scrolling.
 */
export function AsciiName({
  text,
  className = '',
  min = 2.2,
  max = 14,
  stagger = 0.04,
  delay = 0,
  fall = true,
  from = '-140%',
  clip = true,
  center = false,
  fontSize,
  play = true,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const rulerRef = useRef<HTMLSpanElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(min)
  const [fitTick, setFitTick] = useState(0)
  const lines = toAscii(text)

  // toAscii emits 6 columns per character (5 glyph columns + 1 spacer).
  const letters = text
    .toUpperCase()
    .split('')
    .map((_, i) => lines.map((line) => line.slice(i * 6, i * 6 + 6)))

  useLayoutEffect(() => {
    if (fontSize != null) return
    const el = wrapRef.current
    const ruler = rulerRef.current
    if (!el || !ruler) return

    const measure = () => {
      const w = el.clientWidth
      // Measure one full row of glyphs at 100px so the real font metrics
      // decide the fit. A hard-coded advance ratio overflows on fallback fonts.
      const unit = ruler.getBoundingClientRect().width / 100
      if (!w || !unit) return
      const cells = Math.max(1, lines[0]?.length ?? 1)
      const advance = unit / cells
      let next = Math.min(max, Math.max(min, (w * 0.985) / unit))
      // Chrome rounds each glyph advance to a whole pixel at small sizes.
      // Step down until even that rounded row still fits the container.
      for (let i = 0; i < 24; i++) {
        if (cells * Math.round(advance * next) <= w) break
        const lower = Math.round((next - 0.05) * 100) / 100
        if (lower <= min) {
          next = min
          break
        }
        next = lower
      }
      setSize(Math.floor(next * 100) / 100)
      setFitTick((t) => t + 1)
    }

    measure()
    const ro = new ResizeObserver(measure)
    // The ruler is fixed at 100px, so its box only changes when the font loads.
    ro.observe(ruler)
    window.addEventListener('resize', measure)

    // Re-measure once the mono font swaps in — the fallback advance differs.
    const fonts = document.fonts
    fonts?.ready.then(measure).catch(() => {})
    fonts?.addEventListener?.('loadingdone', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
      fonts?.removeEventListener?.('loadingdone', measure)
    }
  }, [max, min, fontSize])

  // Fonts round each glyph cell to a subpixel grid, so the calculated size can
  // still overflow by a few pixels on very narrow screens. Re-measure the real
  // row after paint and shrink once more until it fits.
  useEffect(() => {
    if (fontSize != null) return
    const el = wrapRef.current
    const row = rowRef.current
    if (!el || !row) return
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        const w = el.clientWidth
        if (!w) return
        const rowRect = row.getBoundingClientRect()
        const last = row.lastElementChild?.getBoundingClientRect()
        const actual = Math.max(row.scrollWidth, last ? last.right - rowRect.left : 0)
        if (actual <= w + 0.5) return
        const next = Math.max(min, (size * w * 0.97) / actual)
        if (next < size - 0.05) setSize(Math.floor(next * 100) / 100)
      })
    })
    return () => cancelAnimationFrame(raf)
  }, [size, min, fontSize, fitTick])

  return (
    <div
      ref={wrapRef}
      className={`relative w-full max-w-full min-w-0 ${clip ? 'overflow-hidden' : ''} ${className}`}
    >
      {/* Invisible metric ruler — one full glyph row at 100px. */}
      {fontSize == null && (
        <span
          aria-hidden
          className="pointer-events-none invisible absolute left-0 top-0 block h-px w-px overflow-hidden"
        >
          <span
            ref={rulerRef}
            className="ascii block w-max whitespace-pre leading-none"
            style={{ fontSize: '100px' }}
          >
            {lines[0]}
          </span>
        </span>
      )}
      <div
        ref={rowRef}
        className={`ascii flex leading-[1.05] ${center ? 'justify-center' : ''}`}
        style={{ fontSize: fontSize ?? `${size}px` }}
        aria-hidden
      >
        {letters.map((glyph, i) => (
          <span
            key={i}
            className={fall && play ? 'ascii-fall block will-change-transform' : 'block'}
            style={
              {
                animationDelay: `${delay + i * stagger}s`,
                '--fall': from,
                opacity: play ? undefined : 0,
              } as CSSProperties
            }
          >
            <span className="block whitespace-pre">{glyph.join('\n')}</span>
          </span>
        ))}
      </div>
    </div>
  )
}