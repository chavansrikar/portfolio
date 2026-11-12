import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { skillCategories, skills } from '@/data/site'
import type { Skill } from '@/data/site'
import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'

/** Small ASCII glyph per technology, used as the card's icon. */
const GLYPHS: Record<string, string> = {
  Python: '>>>',
  'TensorFlow / Keras': 'TF',
  PyTorch: 'PT',
  'scikit-learn': 'SKL',
  'LSTM / Time-Series': 'LSTM',
  'Isolation Forest': 'IF',
  'Pandas / NumPy': 'PD',
  'LLM Tool Orchestration': 'LLM',
  OpenCV: 'CV',
  'MediaPipe Pose': 'MP',
  YOLOv8: 'YOLO',
  'Image Processing': 'IMG',
  'ffmpeg / Video IO': 'FF',
  JavaScript: 'JS',
  Java: 'JV',
  TypeScript: 'TS',
  SQL: 'SQL',
  'C / C++': 'C',
  'React / Next.js': 'RX',
  'Tailwind CSS': 'TW',
  Gradio: 'GR',
  Streamlit: 'ST',
  'HTML / CSS': 'HTML',
  'Framer Motion': 'FM',
  'Node.js / Express': 'ND',
  SQLite: 'SQLITE',
  SQLAlchemy: 'SA',
  Pydantic: 'PD',
  'Plotly / Matplotlib': 'PLOT',
  'REST APIs': 'API',
  'Git / GitHub': 'GIT',
  Docker: 'DOCK',
  'Hugging Face Spaces': 'HF',
  'Vercel / Render': 'VER',
  'Linux / Bash': 'UX',
}

const ACCENTS = [
  { text: 'text-amber-300', ring: 'group-hover:border-amber-400/50', bar: 'from-amber-400 to-coral-400' },
  { text: 'text-coral-300', ring: 'group-hover:border-coral-400/50', bar: 'from-coral-400 to-violet-400' },
  { text: 'text-violet-300', ring: 'group-hover:border-violet-400/50', bar: 'from-violet-400 to-indigo-400' },
  { text: 'text-lime-300', ring: 'group-hover:border-lime-400/50', bar: 'from-lime-400 to-teal-400' },
]

export function Skills() {
  const [cat, setCat] = useState<string>('All')
  const cats = ['All', ...skillCategories]

  const filtered = useMemo(
    () => (cat === 'All' ? skills : skills.filter((s) => s.category === cat)),
    [cat]
  )

  return (
    <Section
      id="skills"
      index="02"
      eyebrow="Toolkit"
      title={
        <>
          The stack I reach for,{' '}
          <span className="text-gradient-static">every single time</span>.
        </>
      }
      description="Tools change. The fundamentals — clean data, sound preprocessing, a UI someone can actually use — do not."
    >
      {/* Category tabs */}
      <Reveal>
        <div className="no-scrollbar mb-10 flex gap-2 overflow-x-auto pb-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`relative shrink-0 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                cat === c ? 'text-void' : 'text-mist hover:text-chalk'
              }`}
            >
              {cat === c && (
                <motion.span
                  layoutId="skill-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-300 via-coral-400 to-violet-400"
                  transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                />
              )}
              {cat !== c && (
                <span className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.03]" />
              )}
              <span className="relative z-10">{c}</span>
            </button>
          ))}
        </div>
      </Reveal>

      {/* Skill cards */}
      <motion.div
        layout
        className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((s, i) => (
            <SkillCard key={s.name} skill={s} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ASCII stack dump */}
      <Reveal delay={0.15}>
        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[1.25fr_1fr]">
          <div className="glass overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-coral-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-lime-400/70" />
              <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mist/70">
                stack.sh
              </span>
            </div>
            <pre className="overflow-x-auto px-5 py-5 font-mono text-[10px] leading-relaxed text-mist/85 sm:text-[11.5px]">
              {[
                '$ stack --list',
                '  languages    : python · typescript · java · javascript · sql',
                '  ai           : tensorflow · pytorch · scikit-learn · lstm',
                '  vision       : opencv · mediapipe · yolov8 · ffmpeg',
                '  app-layer    : gradio · streamlit · next.js · fastapi',
                '  data-infra   : sqlite · sqlalchemy · pydantic · pandas · plotly',
                '  deploy       : huggingface · vercel · render · docker · linux',
                '  status       : always learning',
              ].join('\n')}
            </pre>
          </div>

          {/* Big ASCII badge */}
          <div className="glass relative flex flex-col items-center justify-center overflow-hidden rounded-2xl p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(251,191,36,0.16),transparent_62%)]" />
            <pre className="ascii relative whitespace-pre text-center text-[7px] leading-[1.25] text-amber-300/85 sm:text-[9px]">
              {[
                '   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄',
                '  █ ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ █',
                '  █ █ ▄▄▄▄▄▄▄▄▄▄▄▄ █',
                '  █ █ █ ▄▄▄▄▄▄▄▄ █ █',
                '  █ █ █ █ ▄▄▄▄▄ █ █ █',
                '  █ █ █ █ █ ▄▄ █ █ █ █',
                '  █ █ █ █ █ █ █ █ █ █ █',
                '  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀',
                '      ▀▀▀▀▀▀▀▀▀▀',
              ].join('\n')}
            </pre>
            <div className="relative mt-4 text-center">
              <div className="font-display text-sm font-bold tracking-tight text-chalk">
                35+ tools shipped
              </div>
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-mist/70">
                &amp; counting
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const accent = ACCENTS[index % ACCENTS.length]
  const glyph = GLYPHS[skill.name] ?? skill.ascii

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ delay: Math.min(index * 0.028, 0.35), duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
    >
      <div
        data-cursor={String(skill.level)}
        className={`glass group relative overflow-hidden rounded-xl p-4 transition-all duration-400 ${accent.ring}`}
      >
        {/* Hover sweep */}
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-full" />

        <div className="relative flex items-center gap-3">
          {/* ASCII glyph badge */}
          <span className="ascii grid h-10 w-12 shrink-0 place-items-center rounded-lg border border-white/10 bg-void/60 text-[10px] font-bold tracking-tight text-mist transition-all duration-400 group-hover:border-amber-400/40 group-hover:text-amber-200 group-hover:shadow-[0_0_18px_-4px_rgba(251,191,36,0.6)]">
            {glyph}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="truncate font-display text-[13.5px] font-semibold tracking-tight text-chalk transition-colors duration-300 group-hover:text-amber-200">
                {skill.name}
              </h3>
              <span className="shrink-0 font-mono text-[10px] tabular-nums text-mist/70 transition-colors duration-300 group-hover:text-amber-300">
                {skill.level}%
              </span>
            </div>
            <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-mist/50">
              {skill.category}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative mt-3 h-1 overflow-hidden rounded-full bg-white/[0.07]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: inView ? `${skill.level}%` : 0 }}
            transition={{ duration: 1.2, delay: 0.1 + index * 0.025, ease: [0.22, 1, 0.36, 1] }}
            className={`h-full rounded-full bg-gradient-to-r ${accent.bar} shadow-[0_0_10px_rgba(251,191,36,0.45)]`}
          />
        </div>
      </div>
    </motion.div>
  )
}
