import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '@/data/site'
import { AsciiName } from './ui/AsciiName'

export function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [done, setDone] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let cancelled = false

    const run = async () => {
      const { animate } = await import('animejs')
      if (cancelled) return

      const obj = { v: 0 }
      animate(obj, {
        v: 100,
        duration: 2100,
        ease: 'inOutQuart',
        onUpdate: () => {
          if (!cancelled) setPct(Math.round(obj.v))
        },
        onComplete: () => {
          if (cancelled) return
          setPct(100)
          setTimeout(() => {
            if (cancelled) return
            setDone(true)
            onDone()
          }, 420)
        },
      })
    }
    run()

    return () => {
      cancelled = true
    }
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-void"
      initial={{ opacity: 1 }}
      animate={done ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      style={{ pointerEvents: done ? 'none' : 'auto' }}
    >
      <motion.div
        className="absolute inset-0 grid-bg opacity-[0.35]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 0.8 }}
      />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6">
        <div className="mb-8 w-full max-w-3xl text-cyan-400/85 [text-shadow:0_0_18px_rgba(34,211,238,0.45)]">
          <AsciiName text={profile.name} max={11} min={2} />
        </div>

        <div className="mb-4 flex w-full max-w-md items-center gap-4">
          <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/8">
            <motion.div
              ref={barRef}
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="w-16 text-right font-mono text-sm tabular-nums text-cyan-300">
            {String(pct).padStart(3, '0')}%
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-mist/70 sm:text-[11px]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-lime-400 glow-dot" />
          {pct < 35
            ? 'Booting environment'
            : pct < 70
              ? 'Loading modules'
              : pct < 95
                ? 'Calibrating interface'
                : 'Ready'}
        </div>

        <pre className="mt-10 hidden font-mono text-[10px] leading-relaxed text-mist/35 sm:block">
          {[
            '$ python -m portfolio --profile chavansrikar',
            '  ✓ loading ascii font engine',
            '  ✓ mounting /projects',
            '  ✓ mounting /skills',
            '  ✓ connecting github api',
            '  ✓ rendering scenes',
          ].join('\n')}
        </pre>
      </div>

      {/* Curtain bars that wipe away */}
      <div className="pointer-events-none absolute inset-0 flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="h-full flex-1 bg-void"
            initial={{ scaleY: 1 }}
            animate={done ? { scaleY: 0 } : { scaleY: 1 }}
            transition={{
              duration: 0.8,
              delay: done ? i * 0.07 : 0,
              ease: [0.76, 0, 0.24, 1],
            }}
            style={{ originY: 0 }}
          />
        ))}
      </div>
    </motion.div>
  )
}
