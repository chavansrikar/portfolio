import { useLayoutEffect, useRef, useState } from 'react'
import { toAscii } from '@/lib/ascii'

type Props = {
  text: string
  className?: string
  /** JetBrains Mono advance width is exactly 0.6em. */
  charWidthRatio?: number
  min?: number
  max?: number
  stagger?: number
}

/**
 * Renders text as ASCII block-art that always fits its container width.
 *
 * The font size is derived from the measured container width so the art
 * stays perfectly legible on a phone and scales up on a desktop, with no
 * horizontal scrolling at any breakpoint.
 */
export function AsciiName({
  text,
  className = '',
  charWidthRatio = 0.6,
  min = 2.5,
  max = 14,
  stagger = 0.1,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(min)
  const lines = toAscii(text)
  const charCount = Math.max(...lines.map((l) => l.length))

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const measure = () => {
      const w = el.clientWidth
      if (!w) return
      const next = Math.min(max, Math.max(min, w / (charCount * charWidthRatio)))
      setSize(next)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [charCount, charWidthRatio, max, min])

  return (
    <div ref={wrapRef} className={`w-full ${className}`}>
      <div
        className="ascii leading-[1.05]"
        style={{ fontSize: `${size}px` }}
        aria-hidden
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className="ascii-line whitespace-pre"
            style={{
              animation: `asciiLineIn 0.6s cubic-bezier(0.22,1,0.36,1) ${i * stagger}s both`,
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}
