import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

/** Luminance ramp — dark → light. */
const RAMP = ' .,:;irsXA253hMHGS#9B&@'

/** Characters that spawn in the cursor trail over the photo. */
const TRAIL = '01<>/*+-=░▒▓█▄▀¦╱╲╳'

type Props = {
  src: string
  alt: string
  className?: string
  cols?: number
}

type Trail = { x: number; y: number; ch: string; life: number }

/**
 * Profile photo that converts into live ASCII art under the cursor.
 *
 * - the photo desaturates and dims
 * - a canvas renders the image as coloured ASCII characters
 * - a bright scan bar sweeps down through the character grid
 * - characters spawn and decay in the cursor's wake
 */
export function AsciiPortrait({ src, alt, className = '', cols = 56 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const hoverRef = useRef(false)
  const pointerRef = useRef({ x: -999, y: -999 })
  const trailRef = useRef<Trail[]>([])
  const [hovered, setHovered] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    type Cell = { ch: string; r: number; g: number; b: number }
    let grid: Cell[][] = []
    let raf = 0
    let progress = 0
    let cellW = 6
    let cellH = 11
    let lastTrail = 0

    const buildGrid = () => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const w = rect.width
      const h = rect.height
      cellW = w / cols
      cellH = cellW * 1.62
      const rows = Math.max(1, Math.floor(h / cellH))

      const off = document.createElement('canvas')
      off.width = cols
      off.height = rows
      const octx = off.getContext('2d')
      if (!octx) return
      octx.drawImage(img, 0, 0, cols, rows)

      const data = octx.getImageData(0, 0, cols, rows).data
      grid = []
      for (let y = 0; y < rows; y++) {
        const row: Cell[] = []
        for (let x = 0; x < cols; x++) {
          const idx = (y * cols + x) * 4
          const r = data[idx]
          const g = data[idx + 1]
          const b = data[idx + 2]
          // Boost contrast so the ASCII grid reads clearly
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
          const boosted = Math.min(1, Math.max(0, (lum - 0.12) * 1.55))
          const ci = Math.min(RAMP.length - 1, Math.floor(boosted * RAMP.length))
          row.push({ ch: RAMP[ci], r, g, b })
        }
        grid.push(row)
      }
    }

    const draw = () => {
      raf = requestAnimationFrame(draw)
      if (!grid.length) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      const now = performance.now()

      // Ease the reveal
      const target = hoverRef.current ? 1 : 0
      progress += (target - progress) * (hoverRef.current ? 0.09 : 0.14)
      const p = Math.min(1, Math.max(0, progress))

      ctx.clearRect(0, 0, w, h)
      ctx.font = `${cellH * 0.88}px 'JetBrains Mono', monospace`
      ctx.textBaseline = 'top'

      const totalRows = grid.length
      const sweep = p * (totalRows + 16)

      // ---- Character grid ----
      for (let y = 0; y < totalRows; y++) {
        const local = Math.min(1, Math.max(0, sweep - y))
        if (local <= 0) continue
        const row = grid[y]
        for (let x = 0; x < row.length; x++) {
          const cell = row[x]
          const jitter = ((x * 7 + y * 13) % 11) / 48
          const a = Math.min(1, local * (1 - jitter * 0.45))
          if (a <= 0.02) continue

          const glow = 1 - Math.min(1, Math.abs(y - sweep) / 11)
          const alpha = a * (0.34 + glow * 0.66)

          if (glow > 0.45) {
            ctx.fillStyle = `rgba(253,224,71,${alpha})` // amber-300
          } else {
            ctx.fillStyle = `rgba(${cell.r},${cell.g},${cell.b},${alpha * 0.92})`
          }
          ctx.fillText(cell.ch, x * cellW, y * cellH)
        }
      }

      // ---- Bright scan bar ----
      if (p > 0.005 && p < 0.995) {
        const grad = ctx.createLinearGradient(
          0,
          (sweep - 1.2) * cellH,
          0,
          (sweep + 1.8) * cellH
        )
        grad.addColorStop(0, 'rgba(251,191,36,0)')
        grad.addColorStop(0.5, 'rgba(251,191,36,0.42)')
        grad.addColorStop(1, 'rgba(251,191,36,0)')
        ctx.fillStyle = grad
        ctx.fillRect(0, (sweep - 1.2) * cellH, w, cellH * 3)
      }

      // ---- Cursor trail ----
      if (hoverRef.current && now - lastTrail > 42) {
        lastTrail = now
        const gx = Math.round(pointerRef.current.x / cellW)
        const gy = Math.round(pointerRef.current.y / cellH)
        for (let i = 0; i < 3; i++) {
          trailRef.current.push({
            x: gx + (Math.random() * 5 - 2) | 0,
            y: gy + (Math.random() * 4 - 2) | 0,
            ch: TRAIL[(Math.random() * TRAIL.length) | 0],
            life: 1,
          })
        }
        if (trailRef.current.length > 260) {
          trailRef.current.splice(0, trailRef.current.length - 260)
        }
      }

      for (let i = trailRef.current.length - 1; i >= 0; i--) {
        const t = trailRef.current[i]
        t.life -= 0.032
        if (t.life <= 0) {
          trailRef.current.splice(i, 1)
          continue
        }
        const row = grid[t.y]
        if (!row || !row[t.x]) continue
        ctx.fillStyle = `rgba(253,224,71,${t.life * 0.95})`
        ctx.fillText(t.ch, t.x * cellW, t.y * cellH)
      }
    }

    const onLoad = () => {
      buildGrid()
      setLoaded(true)
    }
    const onResize = () => {
      if (img.complete && img.naturalWidth > 0) buildGrid()
    }

    if (img.complete && img.naturalWidth > 0) onLoad()
    else img.addEventListener('load', onLoad)
    window.addEventListener('resize', onResize)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      img.removeEventListener('load', onLoad)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // anime.js drives the cross-fade between photo and ASCII
  useEffect(() => {
    hoverRef.current = hovered
    let cancelled = false
    const run = async () => {
      const { animate } = await import('animejs')
      if (cancelled) return
      const canvas = canvasRef.current
      if (!canvas) return
      animate(canvas, {
        opacity: hovered ? 1 : 0,
        duration: hovered ? 700 : 550,
        ease: hovered ? 'outExpo' : 'inOutQuad',
      })
    }
    run()
    return () => {
      cancelled = true
    }
  }, [hovered])

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  return (
    <div
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerMove={handleMove}
      className={`group relative overflow-hidden ${className}`}
      data-cursor="none"
    >
      <motion.img
        ref={imgRef}
        src={src}
        alt={alt}
        initial={{ filter: 'grayscale(0.1) contrast(1.05) brightness(0.96)' }}
        animate={{
          filter: hovered
            ? 'grayscale(1) contrast(1.6) brightness(0.4)'
            : 'grayscale(0.1) contrast(1.05) brightness(0.96)',
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full object-cover"
      />

      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* CRT scanlines */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          background:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.26) 0px, rgba(0,0,0,0.26) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* Corner brackets */}
      <div className="pointer-events-none absolute inset-3">
        {[
          'left-0 top-0 border-l-2 border-t-2',
          'right-0 top-0 border-r-2 border-t-2',
          'left-0 bottom-0 border-l-2 border-b-2',
          'right-0 bottom-0 border-r-2 border-b-2',
        ].map((c) => (
          <span
            key={c}
            className={`absolute h-5 w-5 border-amber-400/80 transition-all duration-500 ${c}`}
            style={{ opacity: hovered ? 1 : 0 }}
          />
        ))}
      </div>

      {/* Hover readout */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-3 transition-opacity duration-400"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        <span className="ascii rounded-md border border-amber-400/40 bg-void/85 px-2 py-1 text-[9px] text-amber-300 backdrop-blur-sm">
          ▓▒░ ASCII MODE ░▒▓
        </span>
        <span className="ascii rounded-md border border-white/12 bg-void/85 px-2 py-1 text-[9px] text-mist backdrop-blur-sm">
          {loaded ? 'rend 60fps' : 'load'}
        </span>
      </div>
    </div>
  )
}
