import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { skillCategories, skills } from '@/data/site'
import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { SkillTile } from './ui/SkillTile'

export function Skills() {
  const [cat, setCat] = useState<string>('All')
  const cats = ['All', ...skillCategories]

  const filtered = useMemo(
    () => (cat === 'All' ? skills : skills.filter((s) => s.category === cat)),
    [cat]
  )

  const avg = Math.round(
    filtered.reduce((sum, s) => sum + s.level, 0) / (filtered.length || 1)
  )

  return (
    <Section
      id="skills"
      index="03"
      eyebrow="Toolkit"
      title={
        <>
          A stack that <span className="text-gradient-static">actually ships</span>.
        </>
      }
      description="Hover a tile. Everything else is noise."
    >
      {/* Minimal filter */}
      <Reveal>
        <div className="mb-10 flex flex-wrap items-center gap-x-5 gap-y-3">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className="relative font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-300"
              style={{ color: cat === c ? '#fbbf24' : '#a09bb8' }}
            >
              {c}
              {cat === c && (
                <motion.span
                  layoutId="skill-underline"
                  className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-purple-400 to-teal-400"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          ))}

          <span className="ml-auto hidden font-mono text-[11px] tabular-nums text-mist/60 sm:block">
            {filtered.length} tools · avg {avg}%
          </span>
        </div>
      </Reveal>

      {/* Minimal tile grid */}
      <motion.div
        layout
        className="flex flex-wrap justify-start gap-x-2.5 gap-y-6 sm:gap-x-4 sm:gap-y-8"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((s, i) => (
            <SkillTile
              key={s.name}
              label={s.name}
              category={s.category}
              index={i}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Single minimal terminal line */}
      <Reveal delay={0.12}>
        <div className="mt-14 border-t border-white/[0.07] pt-6">
          <pre className="overflow-x-auto font-mono text-[10px] leading-relaxed text-mist/60 sm:text-[11.5px]">
            {[
              '$ stack --list',
              `  ${['python', 'typescript', 'mediapipe', 'tensorflow', 'next.js', 'opencv', 'yolov8', 'gradio', 'streamlit', 'sqlalchemy', 'node.js', 'scikit-learn', 'sanity', 'tailwind', 'sqlite', 'huggingface', 'docker', 'fastapi', 'plotly', 'pandas'].join(' · ')}`,
              '  status       : always learning',
            ].join('\n')}
          </pre>
        </div>
      </Reveal>
    </Section>
  )
}
