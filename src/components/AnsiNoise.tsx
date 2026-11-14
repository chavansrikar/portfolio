import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

/**
 * ANSI palette — the classic 8/16 colour terminals, trimmed to the
 * magenta / cyan / blue / white set the reference uses.
 */
const ANSI = [
  'rgba(255,0,170,',   // magenta
  'rgba(0,229,255,',  // cyan
  'rgba(90,60,220,',  // blue
  'rgba(200,120,255,', // violet
  'rgba(255,255,255,', // white
  'rgba(0,160,120,',  // green
]

/** Ordered-dither ramp — gives the noisy, blocky ANSI texture. */
const RAMP = ' .:-=+*#%@'

type Props = {
  src?: string
  className?: string
  /** Grid density. */
  cols?: number
  /** Seconds per full noise cycle. */
  speed?: number
  /** Only render the ANSI layer while the element is active (hover/tap). */
  hoverOnly?: boolean
  /** True while the element is hovered / tapped. */
  active?: boolean
}

/**
 * ANSI Noise — the ASCII Motion signature.
 *
 * An image (or pure noise) is sampled into a dense character grid. Each
 * cell picks a glyph from an ordered-dither ramp and a colour from the
 * ANSI palette. A noise field continuously perturbs the dither, so the
 * whole panel shimmers like a live terminal.
 *
 * Performance: the base rendering is drawn once to an offscreen canvas
 * and blitted each frame; only a moving band of cells is re-dithered, so
 * the cost stays flat regardless of grid size.
 */
export function AnsiNoise({
  src,
  className = '',
  cols = 96,
  speed = 1,
  hoverOnly = false,
  active = true,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()
  const activeRef = useRef(active)
  const loopRef = useRef<() => void>(() => {})

  useEffect(() => {
    activeRef.current = active
    if (active) loopRef.current()
  }, [active])

  // Fade the ASCII layer in and out with anime.js.
  useEffect(() => {
    if (!hoverOnly) return
    let cancelled = false
    const run = async () => {
      const { animate } = await import('animejs')
      if (cancelled) return
      const canvas = canvasRef.current
      if (!canvas) return
      animate(canvas, {
        opacity: active ? 1 : 0,
        duration: active ? 650 : 420,
        ease: active ? 'outExpo' : 'inOutQuad',
      })
    }
    run()
    return () => {
      cancelled = true
    }
  }, [active, hoverOnly])

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    type Cell = { lum: number; hue: number }
    let cells: Cell[] = []
    let gridW = 0
    let gridH = 0
    let cellW = 6
    let cellH = 10
    let raf = 0
    let last = 0
    let bandY = 0
    const visible = { current: true }

    const base = document.createElement('canvas')
    const bctx = base.getContext('2d')

    // Cheap value noise — smooth enough to read as a shimmer.
    const hash = (x: number, y: number, t: number) => {
      const n = Math.sin(x * 12.9898 + y * 78.233 + t * 37.719) * 43758.5453
      return n - Math.floor(n)
    }
    const noise = (x: number, y: number, t: number) => {
      const xi = Math.floor(x)
      const yi = Math.floor(y)
      const xf = x - xi
      const yf = y - yi
      const u = xf * xf * (3 - 2 * xf)
      const v = yf * yf * (3 - 2 * yf)
      const a = hash(xi, yi, t)
      const b = hash(xi + 1, yi, t)
      const c = hash(xi, yi + 1, t)
      const d = hash(xi + 1, yi + 1, t)
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
    }

    const buildCells = (img?: HTMLImageElement) => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = rect.width
      const h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      cellW = w / cols
      cellH = cellW * 1.68
      gridW = cols
      gridH = Math.max(1, Math.floor(h / cellH))

      cells = new Array(gridW * gridH)

      if (img) {
        const off = document.createElement('canvas')
        off.width = gridW
        off.height = gridH
        const octx = off.getContext('2d')
        if (octx) {
          octx.drawImage(img, 0, 0, gridW, gridH)
          const data = octx.getImageData(0, 0, gridW, gridH).data
          for (let y = 0; y < gridH; y++) {
            for (let x = 0; x < gridW; x++) {
              const i = (y * gridW + x) * 4
              const r = data[i]
              const g = data[i + 1]
              const b = data[i + 2]
              const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
              // Boost contrast so the grid reads clearly.
              const boosted = Math.min(1, Math.max(0, (lum - 0.22) * 1.8))
              // hue drives the ANSI colour choice
              const hue = (Math.atan2(b - r, g - r) + Math.PI) / (Math.PI * 2)
              cells[y * gridW + x] = { lum: boosted, hue }
            }
          }
        }
      } else {
        for (let y = 0; y < gridH; y++) {
          for (let x = 0; x < gridW; x++) {
            cells[y * gridW + x] = {
              lum: hash(x, y, 0),
              hue: hash(x * 0.7, y * 1.3, 3),
            }
          }
        }
      }
    }

    const drawBase = () => {
      if (!bctx) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      base.width = canvas.width
      base.height = canvas.height
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      bctx.clearRect(0, 0, base.width, base.height)
      bctx.font = `${cellH * 0.92}px 'JetBrains Mono', monospace`
      bctx.textBaseline = 'top'
      bctx.textAlign = 'center'
      for (let y = 0; y < gridH; y++) {
        for (let x = 0; x < gridW; x++) {
          const c = cells[y * gridW + x]
          if (!c) continue
          // Blend the image with noise so it dithers like a live terminal.
          const n = noise(x * 0.3, y * 0.3, 0)
          const v = Math.min(1, Math.max(0, c.lum * 0.72 + n * 0.42))
          const ch = RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))]
          const ci = Math.min(
            ANSI.length - 1,
            Math.floor((c.hue * 0.75 + n * 0.45) * ANSI.length) % ANSI.length
          )
          bctx.fillStyle = `${ANSI[ci]}${0.55 + v * 0.45})`
          bctx.fillText(ch, x * cellW + cellW / 2, y * cellH)
        }
      }
    }

    const draw = (time: number) => {
      if (!visible.current || (hoverOnly && !activeRef.current)) {
        raf = 0
        return
      }
      if (time - last < 40) {
        raf = requestAnimationFrame(draw)
        return
      }
      last = time
      const t = time / 1000 / speed

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.width / dpr
      const h = canvas.height / dpr

      ctx.clearRect(0, 0, w, h)
      if (base.width) ctx.drawImage(base, 0, 0, w, h)

      // Re-dither a moving band so the panel shimmers like a live terminal.
      const bandH = Math.max(3, Math.floor(gridH * 0.22))
      bandY = (bandY + 1) % (gridH + bandH)

      ctx.font = `${cellH * 0.92}px 'JetBrains Mono', monospace`
      ctx.textBaseline = 'top'
      ctx.textAlign = 'center'

      for (let k = 0; k < bandH; k++) {
        const y = (bandY + k) % gridH
        for (let x = 0; x < gridW; x++) {
          const c = cells[y * gridW + x]
          if (!c) continue
          const n = noise(x * 0.22, y * 0.22, t)
          const v = Math.min(1, Math.max(0, c.lum * 0.65 + n * 0.5))
          const ch = RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))]
          const ci = Math.min(
            ANSI.length - 1,
            Math.floor((c.hue + n * 0.2) * ANSI.length) % ANSI.length
          )
          ctx.fillStyle = `${ANSI[ci]}${0.55 + n * 0.45})`
          ctx.fillText(ch, x * cellW + cellW / 2, y * cellH)
        }
      }

      raf = requestAnimationFrame(draw)
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }
    loopRef.current = kick

    const start = () => {
      if (src) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          buildCells(img)
          drawBase()
        }
        img.onerror = () => {
          buildCells()
          drawBase()
        }
        img.src = src
      } else {
        buildCells()
        drawBase()
      }
    }

    const onResize = () => {
      buildCells()
      drawBase()
    }

    start()
    kick()

    // Pause the loop when the panel scrolls out of view.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting
        if (entry.isIntersecting) kick()
      },
      { threshold: 0.02 }
    )
    io.observe(canvas)

    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      raf = 0
      io.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [src, cols, speed, reduced, hoverOnly])

  if (reduced) {
    return (
      <div
        className={`relative overflow-hidden bg-black ${className}`}
        aria-hidden
      >
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(255,0,170,0.10) 0px, rgba(255,0,170,0.10) 1px, transparent 1px, transparent 4px)',
          }}
        />
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none h-full w-full ${className}`}
      style={hoverOnly ? { opacity: active ? 1 : 0 } : undefined}
    />
  )
}
