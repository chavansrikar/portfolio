import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { RAIN_CHARS } from '@/lib/ascii'

/**
 * Canvas-driven "matrix" rain of ASCII glyphs. Low-cost: the character
 * grid only re-renders when a cell changes, and the whole thing is
 * disabled for reduced-motion users.
 */
export function AsciiRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let fontSize = 13
    let columns = 0
    let drops: number[] = []
    let raf = 0
    let last = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      fontSize = width < 640 ? 11 : 14
      columns = Math.floor(width / fontSize)
      drops = Array.from({ length: columns }, () => Math.random() * -60)
    }

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw)
      if (time - last < 55) return
      last = time

      ctx.clearRect(0, 0, width, height)
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`
      ctx.textBaseline = 'top'

      for (let i = 0; i < columns; i++) {
        const x = i * fontSize
        const y = drops[i] * fontSize

        if (y > 0 && y < height) {
          const ch = RAIN_CHARS[(Math.random() * RAIN_CHARS.length) | 0]
          const fade = Math.min(1, (height - y) / (height * 0.5))
          ctx.fillStyle = `rgba(34,211,238,${0.05 + fade * 0.16})`
          ctx.fillText(ch, x, y)

          // Bright head glyph
          ctx.fillStyle = `rgba(165,243,252,${0.25 + fade * 0.4})`
          ctx.fillText(ch, x, y - fontSize)
        }

        if (y > height && Math.random() > 0.975) {
          drops[i] = Math.random() * -20
        }
        drops[i] += 0.55
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0
      }
    }

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
    />
  )
}
