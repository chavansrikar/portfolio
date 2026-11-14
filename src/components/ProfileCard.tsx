import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '@/data/site'
import { asset } from '@/lib/assets'
import { AsciiPortrait } from './AsciiPortrait'
import { GithubIcon, LinkedinIcon } from './ui/icons'

/**
 * The profile card: a live photo that turns into ASCII art on hover,
 * with a quiet status readout beneath it.
 */
export function ProfileCard() {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      setTilt({ x: py * -8, y: px * 8 })
    }
    const onLeave = () => setTilt({ x: 0, y: 0 })

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div className="relative mx-auto w-full max-w-[18rem] sm:max-w-[19rem] lg:max-w-[21rem]">
      {/* Glow halo */}
      <div className="pointer-events-none absolute -inset-8 rounded-full bg-gradient-to-br from-purple-500/25 via-teal-500/15 to-violet-600/20 blur-3xl" />

      {/* Orbit ring */}
      <div className="pointer-events-none absolute -inset-4 rounded-[2rem] border border-dashed border-purple-300/15 animate-spin-slower" />

      <motion.div
        ref={ref}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        className="perspective relative"
      >
        <div className="preserve-3d relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-abyss shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)]">
          {/* Photo with ASCII hover */}
          <AsciiPortrait
            src={asset('/profile-full.webp')}
            alt={`${profile.name}, AI generalist and full-stack builder`}
            className="aspect-[3/4] w-full"
            cols={48}
          />

          {/* Gradient scrim */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/10 to-transparent" />

          {/* Name plate */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-lime-400" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-400" />
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-lime-300/90">
                online · bhongir, in
              </span>            </div>
            <h2 className="font-display text-lg font-bold leading-tight tracking-tight text-chalk">
              {profile.name}
            </h2>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-purple-300/90">
              {profile.role}
            </p>
          </div>
        </div>

        {/* Social row */}
        <div
          className="preserve-3d absolute -bottom-5 right-4 flex gap-2"
          style={{ transform: 'translateZ(40px)' }}
        >
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-abyss/95 text-mist shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:text-cyan-300"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn"
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-abyss/95 text-mist shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/50 hover:text-indigo-300"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
        </div>
      </motion.div>
    </div>
  )
}
