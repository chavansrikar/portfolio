import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { AsciiName } from './ui/AsciiName'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type Props = { onDone: () => void }

const RAIN = '01<>/\\|[]{}+*=_-~░▒▓█▄▀'

/** Minimum time the boot screen stays up, even on a fast connection. */
const MIN_MS = 1000
/** Absolute ceiling so a slow font/image never traps the visitor. */
const MAX_MS = 1800
/** Exit animation length. */
const EXIT_MS = 360

const LOG = [
  { at: 0, text: '$ boot --profile chavansrikar' },
  { at: 12, text: '  ▸ glyph engine      ready' },
  { at: 32, text: '  ▸ ascii atlas       loaded' },
  { at: 52, text: '  ▸ motion runtime    armed' },
  { at: 72, text: '  ▸ github feed       syncing' },
  { at: 90, text: '  ▸ scene graph       ready' },
]

/**
 * The ASCII Motion boot screen.
 *
 * A canvas of falling glyphs sits behind two lines of solid-block ASCII,
 * a block progress bar and a typed boot log. It is deliberately short:
 * it waits for fonts + the hero portrait, then leaves in under half a
 * second — no artificial multi-second hold.
 */
export function AsciiBoot({ onDone }: Props) {
  const reduced = usePrefersReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const doneRef = useRef(false)

  // Short, real readiness gate: fonts + the hero portrait, with a hard cap.
  useEffect(() => {
    if (reduced) {
      const t = window.setTimeout(() => {
        setPct(100)
        setLeaving(true)
        window.setTimeout(() => {
          if (doneRef.current) return
          doneRef.current = true
          onDone()
        }, 180)
      }, 220)
      return () => window.clearTimeout(t)
    }

    let cancelled = false
    const start = performance.now()
    let ready = false
    let finished = false

    const loaders: Promise<unknown>[] = []
    if (document.fonts?.ready) loaders.push(document.fonts.ready)
    const img = new Image()
    img.src = `${import.meta.env.BASE_URL}profile-full.webp`
    if (img.decode) loaders.push(img.decode().catch(() => undefined))
    else
      loaders.push(
        new Promise((resolve) => {
          img.onload = resolve
          img.onerror = resolve
        })
      )

    const finish = () => {
      if (cancelled || finished) return
      finished = true
      setPct(100)
      setLeaving(true)
      window.setTimeout(() => {
        if (cancelled || doneRef.current) return
        doneRef.current = true
        onDone()
      }, EXIT_MS)
    }

    Promise.all(loaders).then(() => {
      ready = true
    })

    let raf = 0
    const tick = () => {
      if (cancelled) return
      const elapsed = performance.now() - start
      // Ease toward 92% while waiting, then let readiness close the gap.
      const waiting = Math.min(0.92, elapsed / MAX_MS)
      const next = ready && elapsed >= MIN_MS ? 100 : Math.round(waiting * 100)
      setPct((v) => (next > v ? next : v))

      if (next >= 100) {
        // Hold one frame so the bar visibly completes.
        window.setTimeout(finish, 120)
        return
      }
      if (elapsed >= MAX_MS) {
        finish()
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [onDone, reduced])

  // Glyph rain — 20fps, column count scales with viewport width.
  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let last = 0
    let w = 0
    let h = 0
    let drops: { y: number; speed: number; ch: string; tone: number }[] = []
    const CELL = 18

    const reset = (i: number, initial = false) => {
      drops[i] = {
        // Seed the first generation across the whole screen, then respawn
        // above the top edge so the rain keeps falling.
        y: initial ? Math.random() * h : -40 - Math.random() * h * 0.6,
        speed: 12 + Math.random() * 22,
        ch: RAIN[(Math.random() * RAIN.length) | 0],
        tone: Math.random(),
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cols = Math.max(12, Math.floor(w / CELL))
      drops = Array.from({ length: cols }, (_, i) => {
        reset(i, true)
        return drops[i]
      })
      ctx.clearRect(0, 0, w, h)
    }

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw)
      if (time - last < 48) return
      last = time

      // Fade the previous frame instead of clearing — cheap motion trails.
      ctx.fillStyle = 'rgba(0,0,0,0.22)'
      ctx.fillRect(0, 0, w, h)
      ctx.font = "13px 'JetBrains Mono', monospace"
      ctx.textBaseline = 'top'

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i]
        const x = i * CELL + 3
        d.y += d.speed
        if (d.y > h + 40) {
          reset(i)
          continue
        }
        ctx.fillStyle =
          d.tone > 0.72
            ? 'rgba(94,234,212,0.55)'
            : d.tone > 0.3
              ? 'rgba(192,132,252,0.45)'
              : 'rgba(139,92,246,0.28)'
        ctx.fillText(d.ch, x, d.y)
      }

      // Slow horizontal scan band.
      const bandY = ((time / 18) % (h + 200)) - 100
      const grad = ctx.createLinearGradient(0, bandY, 0, bandY + 90)
      grad.addColorStop(0, 'rgba(45,212,191,0)')
      grad.addColorStop(0.5, 'rgba(45,212,191,0.06)')
      grad.addColorStop(1, 'rgba(45,212,191,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, bandY, w, 90)
    }

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reduced])

  const lines = Math.max(0, Math.round((pct / 100) * 22))
  const bar = '█'.repeat(lines) + '░'.repeat(22 - lines)
  const visibleLog = LOG.filter((l) => pct >= l.at)
  const status =
    pct < 25
      ? 'mounting glyph engine'
      : pct < 55
        ? 'loading ascii atlas'
        : pct < 85
          ? 'arming motion runtime'
          : pct < 100
            ? 'syncing feed'
            : 'ready'

  return (
    <motion.div
      className="fixed inset-0 z-[200] overflow-hidden bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
      style={{ pointerEvents: leaving ? 'none' : 'auto' }}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      {/* Falling glyph field */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 h-full w-full opacity-60"
      />

      {/* Vignette keeps the centre readable */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.86) 62%, #000 100%)',
        }}
      />

      {/* Corner HUD */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden p-5 font-mono text-[9px] uppercase tracking-[0.24em] text-mist/35 sm:block"
      >
        <div className="absolute left-5 top-5 flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-blink rounded-full bg-teal-400" />
          sys.boot · ascii motion
        </div>
        <div className="absolute right-5 top-5">17.5100° n · 78.8800° e</div>
        <div className="absolute bottom-5 left-5">chavansrikar@bhongir</div>
        <div className="absolute bottom-5 right-5 flex items-center gap-2">
          <span className="text-purple-300/70">v2.6</span>
          <span className="animate-blink text-teal-300">▌</span>
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 py-8">
        {/* ASCII wordmark — letters drop in one by one */}
        <div className="w-full max-w-[52rem]">
          <div className="ascii ascii-3d mb-1 text-purple-400 sm:mb-2">
            <AsciiName
              text="CHAVAN"
              fontSize="clamp(6px, 3.1vw, 30px)"
              stagger={0.04}
              delay={0}
              clip={false}
              center
              from="-62vh"
            />
          </div>
          <div className="ascii ascii-3d mb-5 text-teal-300 sm:mb-8">
            <AsciiName
              text="SRIKAR"
              fontSize="clamp(6px, 3.1vw, 30px)"
              stagger={0.04}
              delay={0.26}
              clip={false}
              center
              from="-62vh"
            />
          </div>
        </div>

        {/* Block progress */}
        <div className="w-full max-w-[22rem]">
          <div className="mb-2 flex items-baseline justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-mist/70">
            <span className="truncate">{status}</span>
            <span className="tabular-nums text-purple-300">
              {String(pct).padStart(3, '0')}%
            </span>
          </div>

          <div className="relative overflow-hidden rounded-md border border-purple-400/20 bg-purple-500/[0.06] px-2 py-[7px]">
            <div className="ascii text-[10px] leading-none tracking-[0.08em] text-purple-300/90 sm:text-[12px]">
              {bar}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              style={{ animation: 'shimmer 1.8s linear infinite', backgroundSize: '200% 100%' }}
            />
          </div>

          {/* Boot log */}
          <div className="mt-4 hidden min-h-[5.5rem] font-mono text-[9.5px] leading-relaxed text-mist/55 sm:block">
            {visibleLog.map((l) => (
              <div key={l.text} className="boot-log">
                {l.text}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[8.5px] uppercase tracking-[0.3em] text-mist/40 sm:hidden">
            <span className="inline-block h-1 w-1 animate-blink rounded-full bg-teal-400" />
            ascii motion
          </div>
        </div>
      </div>

      {/* ASCII column rails — transparent so the glyph rain stays visible */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={i}
            className="h-full flex-1 border-r border-white/[0.035]"
            initial={{ opacity: 0 }}
            animate={{ opacity: leaving ? 0 : 1 }}
            transition={{ duration: 0.6, delay: i * 0.03 }}
          />
        ))}
      </div>
    </motion.div>
  )
}