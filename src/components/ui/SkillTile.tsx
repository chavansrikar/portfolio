import { useEffect, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { motion, useInView } from 'framer-motion'
import { logos, logoTone } from '@/data/logos'
import { useInteractive } from '@/hooks/useInteractive'

type Props = {
  label: string
  category: string
  index: number
}

/** Monospace glyphs used for the cursor field and particle trail. */
const GLYPHS = '+·:*×/\\<>[]=~'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  ttl: number
  char: string
  bright: boolean
}

/**
 * A real, high-resolution brand mark inside a minimal tile.
 *
 * At rest the logo sits in its own colour. As the pointer enters, the tile
 * lifts and tints to the brand, the logo leans toward the cursor, and a live
 * ASCII field + glyph trail is painted on a canvas above it — every character
 * reacting to the pointer's path.
 */
export function SkillTile({ label, category, index }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const tileRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointer = useRef({ x: 0, y: 0, active: false })
  const particles = useRef<Particle[]>([])
  const lastMove = useRef({ x: 0, y: 0 })
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const touch = useInteractive({ duration: 2200 })
  const hovered = touch.active

  const logo = logos[label] ?? { paths: [], hex: '#a09bb8' }
  const brand = logoTone(logo.hex)

  // Canvas ASCII motion — one animation loop, only while this tile is hovered.
  useEffect(() => {
    const canvas = canvasRef.current
    const tile = tileRef.current
    if (!canvas || !tile) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (!hovered) {
      canvas.style.opacity = '0'
      const clear = window.setTimeout(() => {
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }, 260)
      return () => window.clearTimeout(clear)
    }

    const rect = tile.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    canvas.style.opacity = '1'

    const w = rect.width
    const h = rect.height
    const color = brand
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const spawn = (x: number, y: number, count: number, burst = false) => {
      for (let i = 0; i < count; i++) {
        const angle = burst ? (Math.PI * 2 * i) / count + Math.random() * 0.5 : Math.random() * Math.PI * 2
        const speed = burst ? 34 + Math.random() * 46 : 20 + Math.random() * 44
        particles.current.push({
          x: x + (burst ? 0 : (Math.random() - 0.5) * 34),
          y: y + (burst ? 0 : (Math.random() - 0.5) * 34),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 12,
          life: 0,
          ttl: 0.8 + Math.random() * 0.6,
          char: GLYPHS[(Math.random() * GLYPHS.length) | 0],
          bright: Math.random() < 0.32,
        })
      }
      if (particles.current.length > 80) particles.current.splice(0, particles.current.length - 80)
    }

    const p = pointer.current
    if (!reduced) spawn(p.x || w / 2, p.y || h / 2, 16, true)

    let raf = 0
    let last = performance.now()
    let trailAt = 0
    let ambientAt = 0
    const sweepStart = performance.now()
    const origin = { x: p.x || w / 2, y: p.y || h / 2 }

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      ctx.clearRect(0, 0, w, h)
      ctx.font = '700 10px "JetBrains Mono", ui-monospace, monospace'
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'

      const step = 12

      // Enter ripple: a ring of ASCII expands from where the pointer landed.
      if (!reduced) {
        const sweep = Math.min(1, (now - sweepStart) / 720)
        if (sweep < 1) {
          const ring = sweep * Math.hypot(w, h) * 0.72
          const phase = Math.floor(now / 90)
          for (let gx = step / 2; gx < w; gx += step) {
            for (let gy = step / 2; gy < h; gy += step) {
              const d = Math.hypot(gx - origin.x, gy - origin.y)
              const wave = 1 - Math.abs(d - ring) / 24
              if (wave <= 0) continue
              ctx.globalAlpha = wave * (1 - sweep) * 0.85
              ctx.fillStyle = (gx + gy) % 8 < 3 ? '#ffffff' : color
              ctx.fillText(GLYPHS[(gx * 5 + gy * 7 + phase) % GLYPHS.length], gx, gy)
            }
          }
        }
      }

      // A grid of glyphs that ignites around the pointer.
      if (p.active) {
        const radius = 36
        const t = Math.floor(now / 140)
        for (let gx = step; gx < w; gx += step) {
          for (let gy = step; gy < h; gy += step) {
            const d = Math.hypot(gx - p.x, gy - p.y)
            if (d > radius) continue
            const alpha = (1 - d / radius) ** 1.6 * 0.9
            const char = GLYPHS[(gx * 7 + gy * 13 + t) % GLYPHS.length]
            ctx.globalAlpha = alpha
            ctx.fillStyle = (gx * 3 + gy * 5) % 9 < 4 ? '#ffffff' : color
            ctx.fillText(char, gx, gy)
          }
        }

        // Cursor marker with a small brand glow.
        ctx.save()
        ctx.shadowColor = color
        ctx.shadowBlur = 8
        ctx.globalAlpha = 1
        ctx.fillStyle = '#ffffff'
        ctx.font = '700 12px "JetBrains Mono", ui-monospace, monospace'
        ctx.fillText('+', p.x, p.y)
        ctx.restore()
        ctx.font = '700 10px "JetBrains Mono", ui-monospace, monospace'
      }

      // Characters shed along the pointer path, slowing as they fade.
      if (p.active && now - trailAt > 24 && !reduced) {
        trailAt = now
        const dx = p.x - lastMove.current.x
        const dy = p.y - lastMove.current.y
        const dist = Math.hypot(dx, dy)
        if (dist > 1) {
          spawn(p.x, p.y, dist > 18 ? 4 : dist > 7 ? 3 : 2)
          lastMove.current = { x: p.x, y: p.y }
        }
      }

      // A slow ASCII trickle keeps the tile alive even when the cursor rests.
      if (p.active && !reduced && now - ambientAt > 130) {
        ambientAt = now
        spawn(p.x + (Math.random() - 0.5) * 22, p.y + (Math.random() - 0.5) * 22, 1)
      }

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const q = particles.current[i]
        q.life += dt
        if (q.life >= q.ttl) {
          particles.current.splice(i, 1)
          continue
        }
        q.x += q.vx * dt
        q.y += q.vy * dt
        q.vx *= 0.975
        q.vy = q.vy * 0.975 - 14 * dt
        const k = 1 - q.life / q.ttl
        ctx.globalAlpha = k * (q.bright ? 0.95 : 0.72)
        ctx.fillStyle = q.bright ? '#ffffff' : color
        ctx.fillText(q.char, q.x, q.y)
      }

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }

    if (!reduced) raf = requestAnimationFrame(tick)
    else {
      // Reduced motion: a single, static ASCII frame.
      ctx.clearRect(0, 0, w, h)
    }

    return () => {
      cancelAnimationFrame(raf)
      particles.current = []
    }
  }, [hovered, brand])

  const setPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    pointer.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    }
  }

  const magnet = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const rect = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    if (logoRef.current) {
      logoRef.current.style.transform = `translate(${nx * 5}px, ${ny * 5}px) scale(1.07)`
    }
  }

  const onEnter = (e: ReactPointerEvent<HTMLDivElement>) => {
    setPointer(e)
    lastMove.current = { x: pointer.current.x, y: pointer.current.y }
    magnet(e)
    touch.handlers.onPointerEnter(e)
  }

  const onLeave = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointer.current.active = false
    if (logoRef.current) logoRef.current.style.transform = ''
    touch.handlers.onPointerLeave(e)
  }

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    setPointer(e)
    lastMove.current = { x: pointer.current.x, y: pointer.current.y }
    touch.handlers.onPointerDown(e)
  }

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    setPointer(e)
    magnet(e)
  }

  return (
    <motion.div
      ref={ref}
      className="group relative flex w-[76px] flex-col items-center sm:w-[88px]"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ delay: Math.min(index * 0.025, 0.3), duration: 0.45 }}
    >
      <div
        ref={tileRef}
        {...touch.handlers}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onPointerDown={onDown}
        onPointerMove={onMove}
        data-cursor="none"
        style={{ '--brand': brand } as CSSProperties}
        className="skill-tile relative grid aspect-square w-full place-items-center rounded-2xl border"
      >
        {/* Brand bloom */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-5 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-25"
          style={{ backgroundColor: brand }}
        />

        {/* ASCII corner marks */}
        <span
          aria-hidden
          className="ascii pointer-events-none absolute inset-0 z-10 text-[9px] leading-none opacity-0 transition-opacity duration-300 group-hover:opacity-60"
          style={{ color: brand }}
        >
          <span className="absolute left-1.5 top-1">┌</span>
          <span className="absolute right-1.5 top-1">┐</span>
          <span className="absolute bottom-1 left-1.5">└</span>
          <span className="absolute bottom-1 right-1.5">┘</span>
        </span>

        {/* Real logo — inline vector, infinitely sharp */}
        <div
          ref={logoRef}
          className="pointer-events-none relative z-10 transition-transform duration-300 ease-out will-change-transform"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            className="h-[30px] w-[30px] opacity-90 saturate-[.95] transition-opacity duration-300 group-hover:opacity-100 sm:h-[38px] sm:w-[38px]"
            style={{ color: brand }}
          >
            <g
              fill={logo.stroke ? 'none' : 'currentColor'}
              stroke={logo.stroke ? 'currentColor' : 'none'}
              strokeWidth={logo.stroke ? 1.7 : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
              fillRule={logo.evenodd ? 'evenodd' : 'nonzero'}
            >
              {logo.paths.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </g>
          </svg>
        </div>

        {/* ASCII trail above the mark */}
        <canvas
          ref={canvasRef}
          aria-hidden
          width={2}
          height={2}
          className="pointer-events-none absolute inset-0 z-20 h-full w-full rounded-2xl opacity-0 transition-opacity duration-200"
        />

        </div>

      {/* Label — wraps inside the tile width so rows stay aligned */}
      <div className="mt-2.5 flex w-full flex-col items-center">
        <span className="line-clamp-3 min-h-[2.4rem] w-full break-words text-center font-mono text-[9px] leading-[1.2] text-mist/80 transition-colors duration-300 group-hover:text-chalk sm:text-[10px]">
          {label}
        </span>
        <span className="mt-0.5 h-2.5 font-mono text-[8px] uppercase tracking-[0.14em] text-mist/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {category}
        </span>
      </div>
    </motion.div>
  )
}