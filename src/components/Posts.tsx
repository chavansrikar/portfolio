import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { postArt, postGlyph, posts } from '@/data/site'
import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { Button } from './ui/Button'
import { AsciiArt } from './ui/AsciiArt'
import {
  ArrowUpRightIcon,
  ExternalLinkIcon,
  LinkedinIcon,
} from './ui/icons'

export function Posts() {
  const [active, setActive] = useState(0)
  const post = posts[active]
  const art = postArt[post.title] ?? ['•']

  return (
    <Section
      id="posts"
      index="05"
      eyebrow="Writing"
      title={
        <>
          Notes from the <span className="text-gradient-static">build</span>.
        </>
      }
      description="Posts published on LinkedIn — field notes on the AI/ML track, the hackathon circuit and shipping things that matter."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr] lg:gap-10">
        {/* Post list */}
        <Reveal>
          <ul className="space-y-1.5">
            {posts.map((p, i) => (
              <li key={p.title} className="relative">
                <button
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`group relative flex w-full items-center gap-3.5 rounded-xl border px-4 py-3 text-left transition-all duration-400 ${
                    active === i
                      ? 'border-amber-400/35 bg-amber-400/[0.05]'
                      : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15'
                  }`}
                >                  {/* Mini ASCII mark */}
                  <span
                    className={`ascii grid h-11 w-12 shrink-0 place-items-center overflow-hidden rounded-lg border text-[15px] leading-none transition-all duration-400 ${
                      active === i
                        ? 'border-amber-400/40 bg-amber-400/[0.08] text-amber-200'
                        : 'border-white/10 bg-white/[0.03] text-mist/60 group-hover:text-mist'
                    }`}
                  >
                    {postGlyph[p.title] ?? '·'}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <LinkedinIcon className="h-3 w-3 shrink-0 text-indigo-400/70" />
                      <span className="truncate font-display text-[13.5px] font-semibold tracking-tight text-chalk">
                        {p.title}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate font-mono text-[9px] uppercase tracking-[0.14em] text-mist/50">
                      {p.date} · {p.tags[0]}
                    </div>
                  </div>

                  <ArrowUpRightIcon
                    className={`h-3.5 w-3.5 shrink-0 transition-all duration-300 ${
                      active === i
                        ? 'text-amber-300'
                        : 'text-mist/25 group-hover:text-mist/60'
                    }`}
                  />
                </button>

                {/* Animated connector to the detail panel */}
                {i < posts.length - 1 && (
                  <div
                    aria-hidden
                    className="absolute -bottom-1 left-[2.35rem] h-1.5 w-px bg-gradient-to-b from-amber-400/50 to-transparent"
                  />
                )}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Active post */}
        <Reveal delay={0.08}>
          <div className="glass glow-ring scanline relative flex h-full min-h-[21rem] flex-col overflow-hidden rounded-2xl">
            {/* Warm glow */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-500/12 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-violet-600/12 blur-3xl" />

            {/* Animated ASCII art */}
            <div className="relative flex min-h-[13rem] items-center justify-center overflow-hidden border-b border-white/8 bg-void/35 px-4 py-8">
              {/* Faint grid behind the art */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                  maskImage:
                    'radial-gradient(ellipse at center, #000 10%, transparent 72%)',
                }}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.88, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <AsciiArt
                    art={art}
                    trigger={active}
                    fontSize={10}
                    className="text-center text-amber-300/85 drop-shadow-[0_0_16px_rgba(251,191,36,0.4)] transition-colors duration-300 hover:text-amber-200"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Corner ticks */}
              {[
                'left-3 top-3 border-l border-t',
                'right-3 top-3 border-r border-t',
                'left-3 bottom-3 border-l border-b',
                'right-3 bottom-3 border-r border-b',
              ].map((c) => (
                <span
                  key={c}
                  className={`pointer-events-none absolute h-3.5 w-3.5 border-amber-400/35 ${c}`}
                />
              ))}

              {/* Readout */}
              <span className="pointer-events-none absolute bottom-2 left-4 font-mono text-[8px] uppercase tracking-[0.2em] text-mist/35">
                post.{String(active + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Body */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`body-${active}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-1 flex-col p-6 sm:p-7"
              >
                <div className="mb-3 flex items-center gap-2">
                  <LinkedinIcon className="h-4 w-4 text-indigo-400" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mist/70">
                    {post.date} · LinkedIn
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold leading-tight tracking-tight text-chalk sm:text-2xl">
                  {post.title}
                </h3>

                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-mist">
                  {post.excerpt}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-indigo-400/20 bg-indigo-400/[0.07] px-2 py-0.5 font-mono text-[9.5px] text-indigo-200/85"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-6 border-t border-white/8 pt-5">
                  <Button
                    href={post.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    variant="ghost"
                    className="!px-5 !py-2.5 !text-[12.5px]"
                  >
                    <LinkedinIcon className="h-4 w-4" />
                    Read on LinkedIn
                    <ExternalLinkIcon className="h-3.5 w-3.5 opacity-60" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
