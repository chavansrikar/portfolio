import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { toAscii } from '@/lib/ascii'

type Props = {
  text: string
  className?: string
  /** JetBrains Mono advance width is exactly 0.6em. */
  charWidthRatio?: number
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
  charWidthRatio = 0.63,
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
  const [size, setSize] = useState(min)
  const lines = toAscii(text)
  const charCount = Math.max(...lines.map((l) => l.length), 1)

  // toAscii emits 6 columns per character (5 glyph columns + 1 spacer).
  const letters = text
    .toUpperCase()
    .split('')
    .map((_, i) => lines.map((line) => line.slice(i * 6, i * 6 + 6)))

  useLayoutEffect(() => {
    if (fontSize != null) return
    const el = wrapRef.current
    if (!el) return

    const measure = () => {
      const w = el.clientWidth
      if (!w) return
      const next = Math.min(max, Math.max(min, w / (charCount * charWidthRatio)))
      setSize(Math.floor(next * 100) / 100)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [charCount, charWidthRatio, max, min, fontSize])

  return (
    <div
      ref={wrapRef}
      className={`w-full ${clip ? 'overflow-hidden' : ''} ${className}`}
    >
      <div
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