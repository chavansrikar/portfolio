import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Reveal } from './Reveal'
import { ScrambleText } from './ScrambleText'

type Props = {
  id: string
  index: string
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  className?: string
}

/** Consistent section shell: ASCII frame, index, eyebrow, heading, description. */
export function Section({
  id,
  index,
  eyebrow,
  title,
  description,
  children,
  className = '',
}: Props) {
  return (
    <section id={id} className={`relative scroll-mt-24 py-24 sm:py-32 ${className}`}>
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="relative mb-14 flex flex-col gap-5 sm:mb-20">
            {/* ASCII corner brackets around the section header */}
            <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
              {[
                'left-0 top-0 border-l border-t',
                'right-0 top-0 border-r border-t',
                'left-0 bottom-0 border-l border-b',
                'right-0 bottom-0 border-r border-b',
              ].map((c) => (
                <span
                  key={c}
                  className={`absolute h-3 w-3 border-purple-400/20 ${c}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-4 sm:px-3">
              <span className="ascii text-[10px] leading-none text-purple-400/50">
                ┌
              </span>
              <span className="font-mono text-xs tracking-[0.3em] text-purple-400/80">
                [{index}]
              </span>
              <span className="ascii text-[9px] leading-none tracking-[0.1em] text-teal-300/45">
                ▓▒░
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-mist">
                <ScrambleText text={eyebrow} duration={620} />
              </span>
              <span className="ml-auto hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-mist/40 sm:flex">
                <span className="h-1 w-1 animate-blink rounded-full bg-teal-400" />
                section.{index} · live
              </span>
            </div>

            {/* Masked heading reveal */}
            <div className="overflow-hidden">
              <motion.h2
                className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:px-3 sm:text-5xl lg:text-6xl"
                initial={{ y: '0.28em', opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                {title}
              </motion.h2>
            </div>

            {description && (
              <p className="max-w-2xl text-base leading-relaxed text-mist sm:px-3 sm:text-lg">
                {description}
              </p>
            )}

            {/* Animated character rule */}
            <div aria-hidden className="mt-2 flex items-center gap-2 sm:px-3">
              <span className="ascii text-[10px] leading-none text-purple-400/40">
                ╾
              </span>
              <div className="relative h-px flex-1 overflow-hidden bg-white/[0.07]">
                <div className="ascii-rule-sweep absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-purple-400/80 to-transparent" />
              </div>
              <span className="ascii text-[10px] leading-none text-teal-300/35">
                ╼
              </span>
            </div>
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  )
}