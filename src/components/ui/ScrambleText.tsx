import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#░▒▓█▄▀ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

type Props = {
  text: string
  className?: string
  /** How long the scramble runs before the text resolves. */
  duration?: number
  /** Re-run the effect whenever this changes. */
  trigger?: string | number
}

/**
 * Text that resolves out of random glyphs when it scrolls into view.
 *
 * Only the characters that are still scrambled are re-rendered each
 * frame, and the effect stops the moment the text is legible.
 */
export function ScrambleText({
  text,
  className = '',
  duration = 750,
  trigger = 0,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    if (!inView) return
    let raf = 0
    let frame = 0
    const start = performance.now()
    const chars = text.split('')

    const tick = () => {
      const elapsed = performance.now() - start
      const p = Math.min(1, elapsed / duration)

      // Each character locks in at a staggered point.
      const next = chars
        .map((c, i) => {
          if (c === ' ') return ' '
          const lockAt = (i / chars.length) * 0.75
          if (p >= lockAt + 0.25) return c
          if (Math.random() > 0.82) {
            return GLYPHS[(Math.random() * GLYPHS.length) | 0]
          }
          return c
        })
        .join('')

      setDisplay(next)
      frame++

      if (p < 1) raf = requestAnimationFrame(tick)
      else setDisplay(text)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, text, duration, trigger])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
