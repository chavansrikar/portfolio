import { motion } from 'framer-motion'
import { focusAreas, myBharat, profile } from '@/data/site'
import { asset } from '@/lib/assets'
import { AnsiNoise } from './AnsiNoise'
import { Section } from './ui/Section'
import { Reveal, RevealGroup, RevealItem } from './ui/Reveal'
import { Counter } from './ui/Counter'
import { TiltCard } from './ui/TiltCard'
import {
  ArrowUpRightIcon,
  BrainIcon,
  CameraIcon,
  LayersIcon,
  SparklesIcon,
} from './ui/icons'

const ICONS = {
  camera: CameraIcon,
  brain: BrainIcon,
  sparkles: SparklesIcon,
  layers: LayersIcon,
} as const

const BUILD_LOOP = [
  {
    n: '01',
    title: 'Rapid Idea Validation',
    desc: 'A minimal inference demo in Gradio or Streamlit to prove the concept actually works.',
    ascii: '┌─┐\n│▓│\n└─┘',
  },
  {
    n: '02',
    title: 'Model & UX Improvement',
    desc: 'Real preprocessing, fine-tuning, annotated outputs — charts, videos, scored results.',
    ascii: '╱╲\n╱  ╲\n╲  ╱\n╲╱',
  },
  {
    n: '03',
    title: 'Productionize',
    desc: 'Containerize, add tests, wire up the database and auth as the product demands.',
    ascii: '▤▥▦\n▥▦▧\n▦▧█',
  },
  {
    n: '04',
    title: 'Iterate',
    desc: 'Refine against real data and real users, then tighten the metrics that matter.',
    ascii: '↻\n↻↻\n↻↻↻',
  },
]

export function About() {
  return (
    <Section
      id="about"
      index="01"
      eyebrow="About"
      title={
        <>
          The <span className="text-gradient-static">build-fast, harden-later</span>{' '}
          engineer.
        </>
      }
      description="Most of my work follows the same loop — get something running fast enough to see if the idea holds up, then go back and do it properly."
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        {/* Bio column */}
        <Reveal>
          <div className="flex flex-col gap-5">
            <p className="text-base leading-relaxed text-mist sm:text-lg">
              {profile.bio}
            </p>
            <p className="text-base leading-relaxed text-mist sm:text-lg">
              I use <span className="text-chalk">Gradio</span> and{' '}
              <span className="text-chalk">Streamlit</span> heavily for the first pass,
              and I'm comfortable moving between Python, Java and JavaScript/Node
              depending on what the project needs.
            </p>

            {/* Mission — the education arc + the why */}
            <div className="relative overflow-hidden rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-400/[0.07] via-transparent to-violet-600/[0.08] p-5">
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-purple-500/15 blur-2xl" />
              <div className="relative">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-purple-300/90">
                    The arc
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-purple-400/40 to-transparent" />
                </div>
                <p className="text-[13.5px] leading-relaxed text-mist sm:text-sm">
                  {profile.mission}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="ascii rounded-lg border border-purple-400/25 bg-purple-400/[0.07] px-2.5 py-1 text-[10px] text-purple-200">
                    diploma · AIML ✓
                  </span>
                  <span className="ascii text-mist/40">→</span>
                  <span className="ascii rounded-lg border border-violet-400/25 bg-violet-400/[0.07] px-2.5 py-1 text-[10px] text-violet-200">
                    btech · CSE (lateral)
                  </span>
                  <span className="ascii rounded-lg border border-teal-400/25 bg-teal-400/[0.07] px-2.5 py-1 text-[10px] text-teal-200">
                    TG ECET · rank 1965
                  </span>
                </div>
              </div>
            </div>

            <blockquote className="mt-2 rounded-2xl border-l-2 border-cyan-400/60 bg-gradient-to-r from-cyan-400/[0.07] to-transparent px-5 py-4">
              <p className="font-display text-base font-medium leading-relaxed text-chalk sm:text-lg">
                “For a well-scoped problem where the models, APIs or data already
                exist, I can go from concept to a clickable, working prototype in{' '}
                <span className="text-gradient-static">5–10 minutes</span>. From
                there, I iterate toward accuracy, robustness and production quality.”
              </p>
            </blockquote>

            {/* Focus areas */}
            <RevealGroup className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {focusAreas.map((area) => {
                const Icon = ICONS[area.icon as keyof typeof ICONS]
                return (
                  <RevealItem key={area.title}>
                    <div className="group glass card-hover shine h-full rounded-xl p-4">
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400/20 to-teal-500/20 ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-110">
                        <Icon className="h-4.5 w-4.5 text-purple-300" />
                      </div>
                      <h3 className="mb-1.5 font-display text-sm font-semibold tracking-tight text-chalk">
                        {area.title}
                      </h3>
                      <p className="text-[13px] leading-relaxed text-mist/90">
                        {area.desc}
                      </p>
                    </div>
                  </RevealItem>
                )
              })}
            </RevealGroup>

            {/* Outdoor shot — blurred backdrop keeps the whole photo visible */}
            <Reveal delay={0.18}>
              <figure className="group relative mt-4 overflow-hidden rounded-2xl border border-white/8 bg-void/50">
                <div className="relative aspect-[16/11] w-full sm:aspect-[16/9]">
                  {/* Blurred fill so the frame is never empty */}
                  <img
                    src={asset('/portrait-alt.jpg')}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="absolute inset-0 h-full w-full scale-110 object-cover object-center opacity-70 blur-xl saturate-150"
                  />
                  {/* The complete photo, always fully visible */}
                  <img
                    src={asset('/portrait-alt.jpg')}
                    alt={`${profile.name} outdoors in Bhongir`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-contain object-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/10 to-transparent" />
                  <figcaption className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.18em] text-mist/80">
                    Bhongir, Telangana
                  </figcaption>
                </div>
              </figure>
            </Reveal>
          </div>
        </Reveal>

        {/* Build loop */}
        <Reveal delay={0.1}>
          <div className="relative">
            <div className="mb-5 flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-400/80">
                How I build
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-cyan-400/40 to-transparent" />
            </div>

            <div className="relative space-y-3">
              {/* Animated connector */}
              <motion.div
                className="absolute left-[27px] top-6 hidden w-px bg-gradient-to-b from-cyan-400/60 via-indigo-400/40 to-transparent sm:block"
                initial={{ height: 0 }}
                whileInView={{ height: 'calc(100% - 3rem)' }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              />

              {BUILD_LOOP.map((step, i) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, x: 26 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: 0.12 * i, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex items-start gap-4"
                >
                  <div className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-white/10 bg-abyss shadow-[0_0_0_6px_rgba(5,6,10,1)] transition-colors duration-400 group-hover:border-cyan-400/50">
                    <pre className="ascii text-[9px] leading-[1.15] text-cyan-300/90">
                      {step.ascii}
                    </pre>
                  </div>

                  <div className="glass card-hover flex-1 rounded-xl px-5 py-4">
                    <div className="mb-1 flex items-center gap-3">
                      <span className="font-mono text-[10px] tracking-widest text-cyan-400/70">
                        {step.n}
                      </span>
                      <h3 className="font-display text-[15px] font-semibold tracking-tight text-chalk">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-[13px] leading-relaxed text-mist/90">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Row 2 — visual / recognition band */}
      <RevealGroup className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* VBYLD certificate */}
        <RevealItem className="lg:col-span-4">
          <a
            href="https://lnkd.in/p/d5VwF7Dm"
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="OPEN"
            className="group relative block h-full overflow-hidden rounded-2xl border border-white/10 bg-black"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <img
                src={asset('/my-bharat-post.jpg')}
                alt="Viksit Bharat Young Leaders Dialogue 2026 — state championship participation certificate"
                loading="lazy"
                className="h-full w-full object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/25 to-transparent" />

              {/* Scanline */}
              <div className="pointer-events-none absolute inset-0 opacity-45 mix-blend-overlay">
                <div
                  className="h-full w-full"
                  style={{
                    background:
                      'repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 1px, transparent 3px)',
                  }}
                />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-amber-300">
                    VBYLD 2026
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-amber-400/50 to-transparent" />
                </div>
                <h3 className="font-display text-sm font-bold leading-tight tracking-tight text-chalk">
                  State Championship — Team Leader
                </h3>
                <p className="mt-1 font-mono text-[10px] text-mist/80">
                  Govt. of Telangana · Dept. of Youth Services
                </p>
              </div>
            </div>

            {/* ASCII corner frame */}
            <span className="ascii pointer-events-none absolute left-3 top-3 text-[10px] text-amber-300/70">
              ╔══╗
            </span>
          </a>
        </RevealItem>

        {/* ANSI noise art */}
        <RevealItem className="lg:col-span-4">
          <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-black">
            <div className="relative aspect-[4/5] w-full sm:aspect-auto sm:h-full">
              <AnsiNoise
                src={asset('/profile-full.jpg')}
                cols={72}
                speed={0.9}
                className="h-full w-full"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-pink-300">
                    ANSI Noise
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-pink-400/50 to-transparent" />
                </div>
                <h3 className="font-display text-sm font-bold leading-tight tracking-tight text-chalk">
                  Rendered, not photographed
                </h3>
                <p className="mt-1 font-mono text-[10px] text-mist/80">
                  every pixel is a character
                </p>
              </div>
            </div>
          </div>
        </RevealItem>

        {/* My Bharat / VBYLD details */}
        <RevealItem className="lg:col-span-4">
          <div className="glass relative flex h-full flex-col overflow-hidden rounded-2xl p-6">
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-500/12 blur-3xl" />

            <div className="relative mb-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-amber-300/90">
                {myBharat.programme}
              </span>
              <h3 className="mt-1.5 font-display text-lg font-bold tracking-tight text-chalk">
                {myBharat.teamName}
              </h3>
              <p className="mt-0.5 font-mono text-[10px] text-mist/70">
                Team ID {myBharat.teamId} · {myBharat.state}
              </p>
            </div>

            <div className="relative space-y-2.5">
              {[
                { k: 'Theme', v: myBharat.theme },
                { k: 'Role', v: myBharat.role },
                { k: 'Organiser', v: myBharat.organiser },
                { k: 'Status', v: myBharat.status },
              ].map((row) => (
                <div
                  key={row.k}
                  className="flex items-baseline justify-between gap-3 border-b border-white/6 pb-2"
                >
                  <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.18em] text-mist/55">
                    {row.k}
                  </span>
                  <span className="text-right text-[12px] text-chalk/90">
                    {row.v}
                  </span>
                </div>
              ))}
            </div>

            <div className="relative mt-4 flex flex-wrap gap-1.5">
              {myBharat.team.map((m, i) => (
                <span
                  key={m}
                  className={`rounded-lg border px-2 py-1 font-mono text-[10px] ${
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

            <a
              href="https://lnkd.in/p/d5VwF7Dm"
              target="_blank"
              rel="noreferrer noopener"
              className="relative mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-amber-300 transition-colors hover:text-amber-200"
            >
              Read the VBYLD 2026 journey
              <ArrowUpRightIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </RevealItem>
      </RevealGroup>

      {/* Stats strip */}
      <RevealGroup className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          { v: 19, s: '', l: 'Public repos', sub: 'shipped & public' },
          { v: 11, s: '', l: 'GitHub stars', sub: 'earned on open source' },
          { v: 35, s: '+', l: 'Hackathon tools', sub: 'curated & shared' },
          { v: 17, s: '', l: 'Health modules', sub: 'in one platform' },
        ].map((stat) => (
          <RevealItem key={stat.l}>
            <TiltCard max={6}>
              <div className="glass card-hover relative overflow-hidden rounded-2xl px-5 py-6 text-center sm:px-6 sm:py-8">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
                <div className="font-display text-4xl font-black tracking-tight text-gradient sm:text-5xl">
                  <Counter value={stat.v} suffix={stat.s} />
                </div>
                <div className="mt-2 font-display text-sm font-semibold text-chalk">
                  {stat.l}
                </div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-mist/70">
                  {stat.sub}
                </div>
              </div>
            </TiltCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
