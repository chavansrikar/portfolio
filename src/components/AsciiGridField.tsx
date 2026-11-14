import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type Trail = { x: number; y: number; life: number }
type Mote = {
  x: number
  y: number
  vx: number
  vy: number
  phase: number
  speed: number
  size: number
  glyph: string
}

const AMBIENT = ['·', '+', '*', ':', '×', '░', '▒']

/**
 * ASCII Motion's signature background.
 *
 * A field of `·` characters sits on a canvas. Ambient glyphs drift slowly
 * across it like dust in a terminal, and wherever the cursor goes the dots
 * bloom into brighter `+` and `*` glyphs that decay back — leaving a
 * luminous trail in the character's wake.
 *
 * Performance:
 *  - the static dot field is rendered once to an offscreen canvas and blitted;
 *  - only the cells near the cursor are redrawn live;
 *  - 30fps cap, DPR capped at 1.5, paused when off-screen or hidden.
 */
export function AsciiGridField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const mobile = window.matchMedia('(max-width: 767px)').matches
    const CELL = mobile ? 20 : 17
    const RADIUS = mobile ? 130 : 170
    const TRAIL_MAX = 26

    let w = 0
    let h = 0
    let cols = 0
    let rows = 0
    let raf = 0
    let last = 0
    let visible = true
    let running = true

    const mouse = { x: -9999, y: -9999, active: false }
    const trail: Trail[] = []
    let motes: Mote[] = []

    // Offscreen layer holding the static dot field.
    const base = document.createElement('canvas')
    const bctx = base.getContext('2d')

    const buildBase = () => {
      if (!bctx) return
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      base.width = w * dpr
      base.height = h * dpr
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      bctx.clearRect(0, 0, w, h)
      bctx.font = `${CELL - 3}px 'JetBrains Mono', monospace`
      bctx.textBaseline = 'middle'
      bctx.textAlign = 'center'
      bctx.fillStyle = 'rgba(167,139,250,0.24)'
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          bctx.fillText('·', x * CELL + CELL / 2, y * CELL + CELL / 2)
        }
      }
    }

    const buildMotes = () => {
      const count = Math.min(mobile ? 14 : 28, Math.floor((w * h) / 34000))
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.8,
        size: 8 + Math.random() * 5,
        glyph: AMBIENT[(Math.random() * AMBIENT.length) | 0],
      }))
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(w / CELL)
      rows = Math.ceil(h / CELL)
      buildBase()
      buildMotes()
    }

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw)
      if (!visible || !running) return
      if (time - last < 33) return
      const dt = Math.min(48, time - last)
      last = time

      ctx.clearRect(0, 0, w, h)
      if (base.width) ctx.drawImage(base, 0, 0, w, h)

      // --- ambient drifting glyphs ---
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      for (const m of motes) {
        m.x += m.vx * (dt / 16)
        m.y += m.vy * (dt / 16)
        if (m.x < -20) m.x = w + 20
        if (m.x > w + 20) m.x = -20
        if (m.y < -20) m.y = h + 20
        if (m.y > h + 20) m.y = -20

        const pulse = 0.28 + 0.42 * (0.5 + 0.5 * Math.sin(time / 900 + m.phase))
        ctx.font = `${m.size}px 'JetBrains Mono', monospace`
        ctx.fillStyle =
          m.glyph === '×' || m.glyph === '+'
            ? `rgba(94,234,212,${pulse * 0.55})`
            : `rgba(192,132,252,${pulse * 0.6})`
        ctx.fillText(m.glyph, m.x, m.y)
      }

      ctx.font = `${CELL - 3}px 'JetBrains Mono', monospace`

      // --- live halo around the cursor ---
      if (mouse.active) {
        const gx = mouse.x / CELL
        const gy = mouse.y / CELL
        const gr = RADIUS / CELL

        for (let y = Math.floor(gy - gr); y <= Math.ceil(gy + gr); y++) {
          if (y < 0 || y >= rows) continue
          for (let x = Math.floor(gx - gr); x <= Math.ceil(gx + gr); x++) {
            if (x < 0 || x >= cols) continue
            const d = Math.hypot(x - gx, y - gy)
            if (d > gr) continue
            const f = 1 - d / gr
            const ch = f > 0.66 ? '*' : '+'
            ctx.fillStyle =
              f > 0.66
                ? `rgba(216,180,254,${0.35 + f * 0.6})`
                : `rgba(45,212,191,${0.22 + f * 0.5})`
            ctx.fillText(ch, x * CELL + CELL / 2, y * CELL + CELL / 2)
          }
        }
      }

      // --- decaying trail ---
      for (let i = trail.length - 1; i >= 0; i--) {
        const t = trail[i]
        t.life -= 0.022
        if (t.life <= 0) {
          trail.splice(i, 1)
          continue
        }
        ctx.fillStyle = `rgba(167,139,250,${t.life * 0.75})`
        ctx.fillText('*', t.x, t.y)
      }

      // --- traveling scan band ---
      const bandY = ((time / 30) % (h + 260)) - 130
      const grad = ctx.createLinearGradient(0, bandY, 0, bandY + 110)
      grad.addColorStop(0, 'rgba(45,212,191,0)')
      grad.addColorStop(0.5, 'rgba(45,212,191,0.035)')
      grad.addColorStop(1, 'rgba(45,212,191,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, bandY, w, 110)
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (!mouse.active) {
        mouse.active = true
        mouse.x = x
        mouse.y = y
      } else {
        // Sample the trail along the path so fast moves still leave a line.
        const dx = x - mouse.x
        const dy = y - mouse.y
        const dist = Math.hypot(dx, dy)
        const steps = Math.min(6, Math.floor(dist / (CELL * 0.7)))
        for (let i = 1; i <= steps; i++) {
          trail.push({
            x: mouse.x + (dx * i) / steps,
            y: mouse.y + (dy * i) / steps,
            life: 1,
          })
        }
        if (trail.length > TRAIL_MAX * 8) {
          trail.splice(0, trail.length - TRAIL_MAX * 8)
        }
        mouse.x = x
        mouse.y = y
      }
    }

    const onLeave = () => {
      mouse.active = false
    }

    const onVisibility = () => {
      running = !document.hidden
    }

    resize()
    raf = requestAnimationFrame(draw)

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { threshold: 0.01 }
    )
    io.observe(canvas)

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)

    // Fonts may arrive after the first paint; rebuild the dot atlas then.
    document.fonts?.ready.then(() => {
      if (visible) buildBase()
    })

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  )
}