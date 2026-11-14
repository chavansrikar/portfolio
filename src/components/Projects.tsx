import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { projects } from '@/data/site'
import type { Project } from '@/data/site'
import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { TiltCard } from './ui/TiltCard'
import { Button } from './ui/Button'
import { ArrowUpRightIcon, ExternalLinkIcon, GithubIcon } from './ui/icons'

const FILTERS = ['All', 'AI / ML', 'Computer Vision', 'Full-Stack', 'Blockchain', 'DevTools'] as const

export function Projects() {
  const [filter, setFilter] = useState<string>('All')
  const [open, setOpen] = useState<Project | null>(null)

  const filtered =
    filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <Section
      id="work"
      index="03"
      eyebrow="Selected work"
      title={
        <>
          Things I&apos;ve <span className="text-gradient-static">built and shipped</span>.
        </>
      }
      description="Nine of twenty public repos, with the ones that taught me the most up front."
    >
      {/* Filters */}
      <Reveal>
        <div className="no-scrollbar mb-10 flex gap-2 overflow-x-auto pb-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`relative shrink-0 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                filter === f ? 'text-void' : 'text-mist hover:text-chalk'
              }`}
            >
              {filter === f && (
                <motion.span
                  layoutId="proj-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300 to-indigo-400"
                  transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                />
              )}
              {filter !== f && (
                <span className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.03]" />
              )}
              <span className="relative z-10">{f}</span>
            </button>
          ))}
        </div>
      </Reveal>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p, i) => (
          <motion.div
            key={p.slug}
            layout
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProjectCard project={p} onOpen={() => setOpen(p)} />
          </motion.div>
        ))}
      </motion.div>

      {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
    </Section>
  )
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <TiltCard max={7} className="h-full">
      <article
        onClick={onOpen}
        data-cursor="VIEW"
        className="glass card-hover shine group relative flex h-full flex-col overflow-hidden rounded-2xl"
      >
        {/* Gradient wash */}
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${project.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
        />

        {/* Top strip */}
        <div className="relative flex items-start justify-between gap-3 p-5 pb-0">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-void/50 text-xl backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
              {project.ascii}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400/70">
                  {project.category}
                </span>
                <span className="h-1 w-1 rounded-full bg-mist/40" />
                <span className="font-mono text-[9px] text-mist/60">{project.year}</span>
              </div>
              <h3 className="mt-0.5 truncate font-display text-[15px] font-bold leading-tight tracking-tight text-chalk">
                {project.title}
              </h3>
            </div>
          </div>
          <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-mist/50 transition-all duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-300" />
        </div>

        {/* Tagline */}
        <p className="relative mt-4 px-5 font-mono text-[11px] leading-relaxed text-cyan-200/75">
          {project.tagline}
        </p>

        {/* Description */}
        <p className="relative mt-3 flex-1 px-5 text-[13px] leading-relaxed text-mist/90">
          {project.description}
        </p>

        {/* Metrics */}
        {project.metrics && (
          <div className="relative mx-5 mt-4 grid grid-cols-3 gap-2 rounded-xl border border-white/8 bg-void/40 p-3">
            {project.metrics.map((m) => (
              <div key={m.label} className="text-center">
                <div className="font-display text-[13px] font-bold text-gradient-static">
                  {m.value}
                </div>
                <div className="mt-0.5 font-mono text-[8px] uppercase leading-tight tracking-[0.1em] text-mist/70">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stack */}
        <div className="relative mt-4 flex flex-wrap gap-1.5 px-5">
          {project.stack.slice(0, 5).map((s) => (
            <span
              key={s}
              className="rounded-md border border-white/8 bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] text-mist/85 transition-colors duration-300 group-hover:border-cyan-400/25 group-hover:text-chalk/90"
            >
              {s}
            </span>
          ))}
          {project.stack.length > 5 && (
            <span className="rounded-md border border-white/8 px-2 py-0.5 font-mono text-[9px] text-mist/50">
              +{project.stack.length - 5}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="relative mt-5 flex items-center justify-between border-t border-white/8 px-5 py-3.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mist/60 transition-colors duration-300 group-hover:text-cyan-300/90">
            Read case study
          </span>
          <div className="flex items-center gap-3">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer noopener"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Open live demo of ${project.title}`}
                className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 text-mist transition-all duration-300 hover:border-lime-400/40 hover:text-lime-300"
              >
                <ExternalLinkIcon className="h-3.5 w-3.5" />
              </a>
            )}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer noopener"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Open GitHub repo for ${project.title}`}
                className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 text-mist transition-all duration-300 hover:border-cyan-400/40 hover:text-cyan-300"
              >
                <GithubIcon className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[130] flex items-start justify-center overflow-y-auto p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-void/85 backdrop-blur-md" />

      <motion.div
        className="glass-strong relative z-10 my-auto w-full max-w-3xl overflow-hidden rounded-2xl"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-br ${project.accent} opacity-60 blur-2xl`}
        />

        <div className="relative flex items-start gap-4 border-b border-white/8 p-6">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-void/50 text-2xl">
            {project.ascii}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/80">
                {project.category}
              </span>
              <span className="h-1 w-1 rounded-full bg-mist/40" />
              <span className="font-mono text-[10px] text-mist/60">{project.year}</span>
            </div>
            <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-chalk sm:text-2xl">
              {project.title}
            </h3>
            <p className="mt-1 font-mono text-[11px] text-cyan-200/70">{project.tagline}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 text-mist transition-colors hover:bg-white/10 hover:text-chalk"
          >
            ✕
          </button>
        </div>

        <div className="relative space-y-6 p-6">
          {project.metrics && (
            <div className="grid grid-cols-3 gap-3">
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-white/8 bg-white/[0.03] p-3 text-center"
                >
                  <div className="font-display text-lg font-bold text-gradient-static">
                    {m.value}
                  </div>
                  <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-mist/70">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Block label="The problem" body={project.problem} accent="text-rose-300/80" />
          <Block label="What I built" body={project.built} accent="text-cyan-300/80" />
          <Block label="Why it matters" body={project.why} accent="text-lime-300/80" />

          <div>
            <h4 className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-mist">
              Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-lg border border-cyan-400/20 bg-cyan-400/[0.06] px-2.5 py-1 font-mono text-[11px] text-cyan-200/90"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            {project.url && (
              <Button href={project.url} target="_blank" rel="noreferrer noopener">
                <GithubIcon className="h-4 w-4" />
                View source
              </Button>
            )}
            {project.demo && (
              <Button
                href={project.demo}
                target="_blank"
                rel="noreferrer noopener"
                variant="ghost"
              >
                <ExternalLinkIcon className="h-4 w-4" />
                Live demo
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Block({
  label,
  body,
  accent,
}: {
  label: string
  body: string
  accent: string
}) {
  return (
    <div>
      <h4 className={`mb-2 font-mono text-[10px] uppercase tracking-[0.24em] ${accent}`}>
        {label}
      </h4>
      <p className="text-[13.5px] leading-relaxed text-mist sm:text-sm">{body}</p>
    </div>
  )
}
