import { useEffect, useRef, useState } from 'react'
import { useInteractive } from '@/hooks/useInteractive'

type Props = {
  art: string[]
  className?: string
  fontSize?: number
  /** Re-runs the entrance animation whenever this changes. */
  trigger?: string | number
}

const GLITCH = '!<>-_\\/[]{}—=+*^?#░▒▓█▄▀'

/**
 * Animated ASCII illustration.
 *
 * On mount (and whenever `trigger` changes) the glyphs scramble and
 * re-settle into the target art. Hovering keeps a low-grade shimmer
 * running so the piece never feels static.
 */
export function AsciiArt({
  art,
  className = '',
  fontSize = 9,
  trigger = 0,
}: Props) {
  const [display, setDisplay] = useState(art)
  const [hovered, setHovered] = useState(false)
  const raf = useRef(0)
  const touch = useInteractive({ duration: 2400 })
  const isActive = hovered || touch.active

  useEffect(() => {
    let frame = 0
    let cancelled = false

    const tick = () => {
      frame++
      // Scramble hard for a moment, then ease back to the real art.
      const intensity =
        frame < 10 ? frame / 10 : frame < 30 ? 1 : Math.max(0, 1 - (frame - 30) / 22)
      if (intensity > 0.02) {
        setDisplay(
          art.map((line) =>
            line
              .split('')
              .map((c) =>
                c !== ' ' && Math.random() < intensity * 0.45
                  ? GLITCH[(Math.random() * GLITCH.length) | 0]
                  : c
              )
              .join('')
          )
        )
        raf.current = requestAnimationFrame(tick)
      } else {
        // Settle on the real art and stop burning frames.
        setDisplay(art)
        raf.current = 0
      }
    }

    raf.current = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf.current)
      void cancelled
    }
  }, [art, trigger])

  // Idle shimmer while hovered or tapped.
  useEffect(() => {
    if (!isActive) return
    let raf = 0
    const tick = () => {
      setDisplay(
        art.map((line) =>
          line
            .split('')
            .map((c) =>
              c !== ' ' && Math.random() < 0.045
                ? GLITCH[(Math.random() * GLITCH.length) | 0]
                : c
            )
            .join('')
        )
      )
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isActive, art])

  return (
    <pre
      {...touch.handlers}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={`ascii whitespace-pre leading-[1.1] ${className}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      {display.map((line, i) => (
        <span
          key={i}
          className="block will-change-transform"
          style={{
            animation: `ascii-wave ${2.8 + (i % 3) * 0.35}s ease-in-out ${i * 0.14}s infinite`,
          }}
        >
          {line}
        </span>
      ))}
    </pre>
  )
}
