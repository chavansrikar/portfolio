import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { myBharat, posts } from '@/data/site'
import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { LinkedinIcon, ArrowUpRightIcon } from './ui/icons'

export function Posts() {
  const [active, setActive] = useState(0)

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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.25fr] lg:gap-10">
        {/* Post list */}
        <Reveal>
          <ul className="space-y-1.5">
            {posts.map((post, i) => (
              <li key={post.title}>
                <button
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`group relative w-full rounded-xl border px-4 py-3.5 text-left transition-all duration-400 ${
                    active === i
                      ? 'border-amber-400/35 bg-amber-400/[0.05]'
                      : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <LinkedinIcon className="h-3 w-3 shrink-0 text-indigo-400/80" />
                        <span className="truncate font-display text-[13.5px] font-semibold tracking-tight text-chalk">
                          {post.title}
                        </span>
                      </div>
                      <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-mist/50">
                        {post.date} · {post.tags.slice(0, 2).join(' ')}
                      </div>
                    </div>
                    <ArrowUpRightIcon
                      className={`mt-0.5 h-3.5 w-3.5 shrink-0 transition-all duration-300 ${
                        active === i
                          ? 'text-amber-300'
                          : 'text-mist/25 group-hover:text-mist/60'
                      }`}
                    />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Active post + My Bharat card */}
        <div className="flex flex-col gap-5">
          <Reveal delay={0.08}>
            <div className="glass relative min-h-[15rem] overflow-hidden rounded-2xl p-6 sm:p-7">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <div className="mb-4 flex items-center gap-2">
                    <LinkedinIcon className="h-4 w-4 text-indigo-400" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mist/70">
                      {posts[active].date} · LinkedIn
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold leading-tight tracking-tight text-chalk sm:text-2xl">
                    {posts[active].title}
                  </h3>

                  <p className="mt-3 text-[14px] leading-relaxed text-mist">
                    {posts[active].excerpt}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {posts[active].tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-indigo-400/20 bg-indigo-400/[0.07] px-2 py-0.5 font-mono text-[9.5px] text-indigo-200/85"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>

          {/* My Bharat feature card */}
          <Reveal delay={0.14}>
            <div className="glass glow-ring relative overflow-hidden rounded-2xl p-6 sm:p-7">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
              <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-coral-500/12 blur-3xl" />

              <div className="relative">
                <div className="mb-1 flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-amber-300/90">
                    {myBharat.programme}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold tracking-tight text-chalk sm:text-xl">
                  {myBharat.teamName} — {myBharat.theme}
                </h3>

                <p className="mt-1.5 font-mono text-[11px] text-mist/75">
                  Team ID {myBharat.teamId} · {myBharat.state} ·{' '}
                  <span className="text-amber-300">{myBharat.role}</span>
                </p>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                    <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-mist/60">
                      Level
                    </div>
                    <div className="mt-0.5 font-display text-sm font-bold text-amber-300">
                      State level
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                    <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-mist/60">
                      Team role
                    </div>
                    <div className="mt-0.5 font-display text-sm font-bold text-coral-300">
                      Team Lead
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                    <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-mist/60">
                      Partners
                    </div>
                    <div className="mt-0.5 font-display text-sm font-bold text-violet-300">
                      MoYAS + IITB
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {myBharat.team.map((m, i) => (
                    <span
                      key={m}
                      className={`rounded-lg border px-2.5 py-1 font-mono text-[10px] ${
                        i === 0
                          ? 'border-amber-400/30 bg-amber-400/[0.07] text-amber-200'
                          : 'border-white/10 bg-white/[0.03] text-mist/80'
                      }`}
                    >
                      {m}
                      {i === 0 && ' · lead'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
