import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

type Props = {
  art: string[]
  label: string
  percent: number
  category: string
  index: number
}

/** Characters used for the hover burst. */
const BURST = '·:*+░▒▓█▄▀<>/\\|=+-'
const GLITCH = '!<>-_\\/[]{}—=+*^?#░▒▓█▄▀'

/**
 * A single, minimal tech tile.
 *
 * Resting state: a quiet square holding a small ASCII illustration.
 * Hover state: the tile lifts, the art scrambles and re-settles, a
 * progress arc draws around it, and a burst of ASCII characters sprays
 * outward — all driven by anime.js.
 */
export function SkillTile({ art, label, percent, category, index }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const burstRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [display, setDisplay] = useState(art)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  const R = 27
  const CIRC = 2 * Math.PI * R

  // Glitch the art while hovered, then let it settle back.
  useEffect(() => {
    if (!hovered) {
      setDisplay(art)
      return
    }

    let frame = 0
    let raf = 0

    const tick = () => {
      frame++
      // ramp up the scramble, then ease it back down
      const intensity = frame < 12 ? frame / 12 : frame < 26 ? 1 : Math.max(0, 1 - (frame - 26) / 18)
      if (intensity > 0.02) {
        setDisplay(
          art.map((line) =>
            line
              .split('')
              .map((c) =>
                c !== ' ' && Math.random() < intensity * 0.4
                  ? GLITCH[(Math.random() * GLITCH.length) | 0]
                  : c
              )
              .join('')
          )
        )
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [hovered, art])

  // anime.js drives the outward character burst.
  useEffect(() => {
    if (!hovered) return
    let cancelled = false

    const run = async () => {
      const { animate, utils } = await import('animejs')
      if (cancelled) return
      const host = burstRef.current
      if (!host) return

      host.innerHTML = ''
      const bits: HTMLElement[] = []
      for (let i = 0; i < 11; i++) {
        const span = document.createElement('span')
        span.textContent = BURST[(Math.random() * BURST.length) | 0]
        span.className = 'ascii absolute left-1/2 top-1/2 text-[11px] leading-none text-amber-300'
        host.appendChild(span)
        bits.push(span)
      }

      animate(bits, {
        x: () => utils.random(-44, 44),
        y: () => utils.random(-50, 14),
        rotate: () => utils.random(-90, 90),
        opacity: [{ to: 1, duration: 90 }, { to: 0, duration: 620, delay: 90 }],
        scale: [{ to: 1.25, duration: 130 }, { to: 0.5, duration: 520 }],
        duration: 760,
        ease: 'outExpo',
        delay: utils.stagger(22),
      })
    }
    run()

    return () => {
      cancelled = true
    }
  }, [hovered])

  return (
    <motion.div
      ref={ref}
      className="group relative flex flex-col items-center"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ delay: Math.min(index * 0.025, 0.3), duration: 0.45 }}
    >
      <div
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        data-cursor="none"
        style={{ '--arc-offset': `${CIRC - (percent / 100) * CIRC}` } as React.CSSProperties}
        className="relative grid h-[68px] w-[68px] place-items-center overflow-visible rounded-2xl border border-white/[0.09] bg-white/[0.025] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-amber-400/45 hover:bg-amber-400/[0.06] hover:shadow-[0_10px_34px_-12px_rgba(251,191,36,0.75)] sm:h-[74px] sm:w-[74px]"
      >
        {/* Burst host */}
        <div ref={burstRef} className="pointer-events-none absolute inset-0 z-20" />

        {/* Progress arc */}
        <svg
          viewBox="0 0 64 64"
          className="pointer-events-none absolute -inset-1.5 -rotate-90 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        >
          <defs>
            <linearGradient
              id={`arc-${label.replace(/\W/g, '')}`}
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="60%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke={`url(#arc-${label.replace(/\W/g, '')})`}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC}
            style={{ transition: 'stroke-dashoffset .85s cubic-bezier(.22,1,.36,1)' }}
            className="group-hover:[stroke-dashoffset:var(--arc-offset)]"
          />
        </svg>

        {/* ASCII illustration */}
        <pre
          className="ascii pointer-events-none relative z-10 whitespace-pre text-center leading-[1.1] text-mist/85 transition-all duration-500 group-hover:text-amber-200 group-hover:drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]"
          style={{ fontSize: '9px' }}
        >
          {display.join('\n')}
        </pre>

        {/* Percent tick */}
        <span className="absolute -bottom-0.5 right-0.5 rounded-md bg-abyss px-1 font-mono text-[8px] tabular-nums text-amber-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {percent}
        </span>
      </div>

      {/* Label */}
      <div className="mt-2.5 flex flex-col items-center">
        <span className="text-center font-mono text-[10px] leading-tight text-mist/70 transition-colors duration-300 group-hover:text-chalk sm:text-[11px]">
          {label}
        </span>
        <span className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-mist/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {category}
        </span>
      </div>
    </motion.div>
  )
}
