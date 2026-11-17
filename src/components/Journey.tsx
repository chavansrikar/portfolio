import { motion } from 'framer-motion'
import { achievements, timeline } from '@/data/site'
import type { TimelineEntry } from '@/data/site'
import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import {
  AwardIcon,
  BriefcaseIcon,
  GraduationIcon,
  SparklesIcon,
} from './ui/icons'

const TYPE_META: Record<
  TimelineEntry['type'],
  { icon: typeof BriefcaseIcon; color: string; label: string }
> = {
  work: { icon: BriefcaseIcon, color: 'text-cyan-300', label: 'Experience' },
  education: { icon: GraduationIcon, color: 'text-indigo-300', label: 'Education' },
  certification: { icon: AwardIcon, color: 'text-purple-300', label: 'Certification' },
  achievement: { icon: SparklesIcon, color: 'text-lime-300', label: 'Achievement' },
}

export function Journey() {
  return (
    <Section
      id="journey"
      index="04"
      eyebrow="Journey"
      title={
        <>
          Education, certifications and{' '}
          <span className="text-gradient-static">the work in between</span>.
        </>
      }
      description="A diploma in AI & Machine Learning, an engineering degree alongside it, and a habit of shipping on the side."
    >
      <div className="relative">
        {/* Center line (desktop) */}
        <motion.div
          className="absolute left-[19px] top-0 hidden w-px bg-gradient-to-b from-cyan-400/50 via-indigo-400/30 to-transparent md:block"
          initial={{ height: 0 }}
          whileInView={{ height: '100%' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />

        <div className="space-y-4">
          {timeline.map((entry, i) => {
            const meta = TYPE_META[entry.type]
            const Icon = meta.icon

            return (
              <motion.div
                key={`${entry.title}-${entry.period}`}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: Math.min(i * 0.06, 0.4), duration: 0.6 }}
                className="group relative md:pl-14"
              >
                {/* Node */}
                <div className="absolute left-0 top-6 z-10 hidden md:block">
                  <div className="relative grid h-[38px] w-[38px] place-items-center rounded-xl border border-white/12 bg-abyss shadow-[0_0_0_5px_rgba(5,6,10,1)] transition-all duration-500 group-hover:border-cyan-400/60">
                    <Icon className={`h-4 w-4 ${meta.color}`} />
                    <span className="absolute inset-0 animate-pulse-ring rounded-xl border border-cyan-400/30" />
                  </div>
                </div>

                <div className="glass card-hover shine relative overflow-hidden rounded-2xl p-5 sm:p-6 md:p-7">
                  {/* Left accent */}
                  <span className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-cyan-400/70 via-indigo-400/50 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`font-mono text-[9px] uppercase tracking-[0.2em] ${meta.color}`}
                    >
                      {meta.label}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-mist/40" />
                    <span className="font-mono text-[10px] text-mist/70">{entry.period}</span>
                    {entry.current && (
                      <span className="flex items-center gap-1.5 rounded-full border border-lime-400/25 bg-lime-400/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-lime-300">
                        <span className="h-1 w-1 rounded-full bg-lime-400 glow-dot" />
                        current
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-chalk sm:text-xl">
                    {entry.title}
                  </h3>
                  <p className="mt-0.5 text-[13px] font-medium text-cyan-200/80">
                    {entry.org}
                    <span className="ml-2 font-mono text-[11px] font-normal text-mist/60">
                      · {entry.location}
                    </span>
                  </p>

                  <ul className="mt-3.5 space-y-2">
                    {entry.points.map((p, pi) => (
                      <motion.li
                        key={p}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + pi * 0.07, duration: 0.45 }}
                        className="flex gap-2.5 text-[13px] leading-relaxed text-mist/90"
                      >
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-cyan-400/70" />
                        {p}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Achievement badges */}
      <Reveal delay={0.1}>
        <div className="mt-14">
          <div className="mb-5 flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-400/80">
              Badges &amp; recognition
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-cyan-400/40 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 20, rotateX: -12 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="glass card-hover group flex items-center gap-3.5 rounded-xl px-4 py-3.5"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-xl ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  {a.emoji}
                </span>
                <div className="min-w-0">
                  <div className="break-words font-display text-[13.5px] font-semibold leading-snug tracking-tight text-chalk">
                    {a.title}
                  </div>
                  <div className="mt-0.5 break-words font-mono text-[10px] leading-snug text-mist/70">
                    {a.detail}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
