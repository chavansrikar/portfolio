import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type Trail = { x: number; y: number; life: number }

/**
 * ASCII Motion's signature background.
 *
 * A field of `·` characters sits on a canvas. Wherever the cursor goes,
 * the dots bloom into brighter `+` and `*` glyphs that decay back to dots,
 * leaving a luminous trail in the character's wake.
 *
 * Performance: the static dot field is rendered once to an offscreen
 * canvas and blitted each frame, so only the handful of live cells near
 * the cursor are ever re-drawn.
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

    const CELL = 17
    const RADIUS = 165
    const TRAIL_MAX = 26

    let w = 0
    let h = 0
    let cols = 0
    let rows = 0
    let raf = 0
    let last = 0

    const mouse = { x: -9999, y: -9999, active: false }
    const trail: Trail[] = []

    // Offscreen layer holding the static dot field.
    const base = document.createElement('canvas')
    const bctx = base.getContext('2d')

    const buildBase = () => {
      if (!bctx) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      base.width = w * dpr
      base.height = h * dpr
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      bctx.clearRect(0, 0, w, h)
      bctx.font = `${CELL - 3}px 'JetBrains Mono', monospace`
      bctx.textBaseline = 'middle'
      bctx.textAlign = 'center'
      bctx.fillStyle = 'rgba(167,139,250,0.30)'
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          bctx.fillText('·', x * CELL + CELL / 2, y * CELL + CELL / 2)
        }
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
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
    }

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw)
      if (time - last < 33) return
      last = time

      ctx.clearRect(0, 0, w, h)
      if (base.width) ctx.drawImage(base, 0, 0, w, h)

      ctx.font = `${CELL - 3}px 'JetBrains Mono', monospace`
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'

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

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
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
