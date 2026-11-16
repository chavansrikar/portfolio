import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type Spark = {
  angle: number
  /** Radius as a fraction of the burst's maximum radius. */
  rf: number
  size: number
  char: string
  rgb: string
  alpha: number
  phase: number
  flick: number
  delay: number
  /** Leave two shrinking echoes trailing inward behind this glyph. */
  echo: boolean
}

type Burst = {
  x: number
  y: number
  born: number
  ttl: number
  maxR: number
  sparks: Spark[]
}

const TAU = Math.PI * 2

/** Dense shockwave glyphs, weighted toward '+' as in the reference. */
const GLYPHS = ['+', '+', '+', '+', '+', '+', '*', '*', '*', '#', '#', '·', '×', ':', '░']

/** Purple-forward palette with teal counterpoints and a few white-hot marks. */
const COLOR_POOL: string[] = (() => {
  const weighted: Array<[string, number]> = [
    ['168,85,247', 24], // violet-500
    ['192,132,252', 14], // purple-400
    ['217,70,239', 10], // fuchsia-500
    ['216,180,254', 8], // lilac-300
    ['45,212,191', 16], // teal-400
    ['34,211,238', 8], // cyan-400
    ['129,140,248', 8], // indigo-400
    ['255,255,255', 5], // white-hot
  ]
  const pool: string[] = []
  for (const [rgb, weight] of weighted) {
    for (let i = 0; i < weight; i++) pool.push(rgb)
  }
  return pool
})()

const pick = <T,>(list: T[]) => list[(Math.random() * list.length) | 0]

/**
 * Left-click ASCII shockwave.
 *
 * Every left click blooms a thick, dense ring of `+`, `*` and `#` glyphs
 * that snaps outward from the pointer, hangs in the air for a beat, then
 * dissolves. Purple and teal marks stay saturated on the dark canvas, a
 * white-hot core marks the click itself, and short shrinking echoes trail
 * inward behind the larger characters.
 *
 * The canvas floats above the page but never intercepts pointer events.
 */
export function ClickBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const mobile = window.matchMedia('(max-width: 767px)').matches
    const bursts: Burst[] = []
    let raf = 0
    let w = 0
    let h = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const makeBurst = (x: number, y: number): Burst => {
      const maxR = mobile
        ? Math.min(180, Math.max(125, Math.min(w, h) * 0.28))
        : Math.min(240, Math.max(170, Math.min(w, h) * 0.28))

      const sparks: Spark[] = []
      const add = (
        angle: number,
        rf: number,
        size: number,
        alpha: number,
        chars: string[] = GLYPHS
      ) => {
        sparks.push({
          angle,
          rf,
          size: Math.max(4, Math.round(size / 2) * 2),
          char: pick(chars),
          rgb: pick(COLOR_POOL),
          alpha,
          phase: Math.random() * TAU,
          flick: 0.6 + Math.random() * 1.8,
          delay: Math.random() < 0.3 ? Math.random() * 0.07 : 0,
          echo: Math.random() < 0.4,
        })
      }

      // 1 — Main ring: a thick, churning band with a dark hole at its centre.
      const outer = mobile ? 220 : 360
      for (let i = 0; i < outer; i++) {
        const a = (i / outer) * TAU + (Math.random() - 0.5) * 0.13
        add(
          a,
          0.78 + Math.random() * 0.22,
          11 + Math.random() ** 1.35 * 22,
          0.75 + Math.random() * 0.25
        )
      }

      // 2 — Shoulder: a sparse inner edge that gives the ring some weight.
      const inner = mobile ? 38 : 60
      for (let i = 0; i < inner; i++) {
        const a = (i / inner) * TAU + (Math.random() - 0.5) * 0.22
        add(
          a,
          0.6 + Math.random() * 0.14,
          8 + Math.random() * 14,
          0.42 + Math.random() * 0.35
        )
      }

      // 3 — Spray: a light dusting just beyond the ring.
      const scatter = mobile ? 16 : 28
      for (let i = 0; i < scatter; i++) {
        add(
          Math.random() * TAU,
          1.02 + Math.random() * 0.18,
          11 + Math.random() * 18,
          0.32 + Math.random() * 0.35
        )
      }

      // 4 — Large shards punctuating the ring.
      const shards = mobile ? 8 : 18
      for (let i = 0; i < shards; i++) {
        add(
          Math.random() * TAU,
          0.8 + Math.random() * 0.2,
          28 + Math.random() * 20,
          0.65 + Math.random() * 0.3,
          ['#', '*', '+']
        )
      }

      // Sort by size so the canvas font only changes a handful of times per
      // frame instead of once per glyph.
      sparks.sort((a, b) => a.size - b.size)

      return { x, y, born: performance.now(), ttl: 1100, maxR, sparks }
    }

    const launch = (x: number, y: number) => {
      bursts.push(makeBurst(x, y))
      if (bursts.length > 3) bursts.shift()
      if (!raf) raf = requestAnimationFrame(frame)
    }

    const drawBurst = (b: Burst, now: number) => {
      const p = Math.min(1, (now - b.born) / b.ttl)
      if (p >= 1) return false

      // The ring snaps outward, then hangs while it dissolves.
      const grow = Math.min(1, p / 0.5)
      const ease = 1 - Math.pow(1 - grow, 4)
      const creep = 1 + Math.max(0, p - 0.5) * 0.09
      const fade = p < 0.55 ? 1 : Math.max(0, 1 - (p - 0.55) / 0.45)

      // Quick white-hot punch at the click point.
      if (p < 0.14) {
        ctx.globalCompositeOperation = 'lighter'
        const k = 1 - p / 0.14
        const r = 6 + p * 280
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r)
        grad.addColorStop(0, `rgba(255,255,255,${(0.5 * k).toFixed(3)})`)
        grad.addColorStop(0.35, `rgba(192,132,252,${(0.32 * k).toFixed(3)})`)
        grad.addColorStop(1, 'rgba(94,234,212,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(b.x, b.y, r, 0, TAU)
        ctx.fill()
      }

      // Glyphs paint opaque so purples and teals stay saturated instead of
      // clipping to white where many of them overlap.
      ctx.globalCompositeOperation = 'source-over'

      let lastFont = ''
      const drawGlyph = (
        x: number,
        y: number,
        size: number,
        char: string,
        rgb: string,
        alpha: number
      ) => {
        if (alpha <= 0.012) return
        const font = `700 ${size}px 'JetBrains Mono', ui-monospace, monospace`
        if (font !== lastFont) {
          ctx.font = font
          lastFont = font
        }
        ctx.fillStyle = `rgba(${rgb},${alpha.toFixed(3)})`
        ctx.fillText(char, x, y)
      }

      for (const s of b.sparks) {
        const q = (p - s.delay) / (1 - s.delay)
        if (q <= 0) continue

        const wobble =
          1 +
          0.05 * Math.sin(s.angle * 2.6 + s.phase) +
          0.03 * Math.sin(s.angle * 6.1 + s.phase * 2)
        const reach = b.maxR * s.rf * ease * creep * wobble
        const radius = 8 + reach
        const twinkle = 0.8 + 0.2 * Math.sin(now * 0.02 * s.flick + s.phase)
        const alpha = s.alpha * fade * Math.min(1, q / 0.08) * twinkle

        drawGlyph(
          b.x + Math.cos(s.angle) * radius,
          b.y + Math.sin(s.angle) * radius,
          s.size,
          s.char,
          s.rgb,
          alpha
        )
      }

      // Second pass: two shrinking echoes trail inward behind the ring.
      for (const s of b.sparks) {
        if (!s.echo) continue
        const q = (p - s.delay) / (1 - s.delay)
        if (q <= 0) continue

        const wobble =
          1 +
          0.05 * Math.sin(s.angle * 2.6 + s.phase) +
          0.03 * Math.sin(s.angle * 6.1 + s.phase * 2)
        const reach = b.maxR * s.rf * ease * creep * wobble
        const cos = Math.cos(s.angle)
        const sin = Math.sin(s.angle)
        const twinkle = 0.8 + 0.2 * Math.sin(now * 0.02 * s.flick + s.phase)
        const alpha = s.alpha * fade * Math.min(1, q / 0.08) * twinkle
        if (alpha <= 0.2) continue

        drawGlyph(
          b.x + cos * (8 + reach * 0.92),
          b.y + sin * (8 + reach * 0.92),
          Math.max(4, Math.round((s.size * 0.7) / 2) * 2),
          s.char,
          s.rgb,
          alpha * 0.34
        )
        drawGlyph(
          b.x + cos * (8 + reach * 0.84),
          b.y + sin * (8 + reach * 0.84),
          Math.max(4, Math.round((s.size * 0.48) / 2) * 2),
          s.char,
          s.rgb,
          alpha * 0.16
        )
      }

      return true
    }

    const frame = (now: number) => {
      raf = 0

      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      let alive = false
      for (let i = bursts.length - 1; i >= 0; i--) {
        if (drawBurst(bursts[i], now)) alive = true
        else bursts.splice(i, 1)
      }

      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1

      if (alive) raf = requestAnimationFrame(frame)
      else ctx.clearRect(0, 0, w, h)
    }

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      launch(e.clientX, e.clientY)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointerdown', onDown, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      data-click-burst
      className="pointer-events-none fixed inset-0 z-[100] h-full w-full"
    />
  )
}
