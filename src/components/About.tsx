import { motion } from 'framer-motion'
import { focusAreas, profile } from '@/data/site'
import { asset } from '@/lib/assets'
import { Section } from './ui/Section'
import { Reveal, RevealGroup, RevealItem } from './ui/Reveal'
import { Counter } from './ui/Counter'
import { TiltCard } from './ui/TiltCard'
import {
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
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400/20 to-coral-500/20 ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-110">
                        <Icon className="h-4.5 w-4.5 text-amber-300" />
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

            {/* Outdoor shot */}
            <Reveal delay={0.18}>
              <figure className="group relative mt-4 overflow-hidden rounded-2xl border border-white/8">
                <img
                  src={asset('/portrait-alt.jpg')}
                  alt={`${profile.name} outdoors in Bhongir`}
                  loading="lazy"
                  className="h-56 w-full object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-105 sm:h-64"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
                <figcaption className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.18em] text-mist/80">
                  Bhongir, Telangana
                </figcaption>
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
