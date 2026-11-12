import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { skillCategories, skills } from '@/data/site'
import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { SkillTile } from './ui/SkillTile'

/** Compact ASCII marks for each technology. */
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
      index="02"
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
                  className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-amber-400 to-coral-400"
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
        className="flex flex-wrap justify-start gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-9"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((s, i) => (
            <SkillTile
              key={s.name}
              glyph={GLYPHS[s.name] ?? s.ascii}
              label={s.name}
              percent={s.level}
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
