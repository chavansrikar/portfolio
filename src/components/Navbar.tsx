import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { navLinks, profile } from '@/data/site'
import { useScrollSpy } from '@/hooks/useAnimation'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { CloseIcon, GithubIcon, LinkedinIcon, MenuIcon } from './ui/icons'
import { Magnetic } from './ui/Magnetic'

const ids = navLinks.map((l) => l.id)

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useScrollSpy(ids)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 })
  const reduced = usePrefersReducedMotion()
  const runnerX = useTransform(progress, (v) => `${Math.min(100, Math.max(0, v * 100))}%`)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Scroll progress */}
      <motion.div
        className="fixed left-0 top-0 z-[120] h-[2px] w-full origin-left bg-gradient-to-r from-purple-400 via-teal-400 to-violet-500"
        style={{ scaleX: progress }}
      />
      {/* A single glyph rides the progress rail — visible on every viewport. */}
      {!reduced && (
        <motion.span
          aria-hidden
          style={{ left: runnerX }}
          className="pointer-events-none fixed top-0 z-[121] -translate-x-1/2 -translate-y-[3px] font-mono text-[10px] leading-none text-teal-300 [text-shadow:0_0_10px_rgba(45,212,191,0.85)]"
        >
          ◆
        </motion.span>
      )}

      <header
        className={`fixed inset-x-0 top-0 z-[110] transition-all duration-500 ${
          scrolled
            ? 'border-b border-white/[0.07] bg-void/70 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <nav className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* Logo */}
          <button
            onClick={() => go('home')}
            className="group flex items-center gap-3"
            aria-label="Back to top"
          >
            <span className="relative grid h-11 w-11 place-items-center rounded-lg bg-purple-500/15 ring-1 ring-purple-400/30 sm:h-10 sm:w-10">
              <span className="ascii ascii-3d-sm font-mono text-sm font-bold text-purple-300">
                CS
              </span>
              <span className="absolute inset-0 rounded-lg opacity-0 ring-2 ring-teal-400/50 transition-opacity duration-300 group-hover:opacity-100" />
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block font-display text-sm font-bold tracking-tight text-chalk">
                {profile.name}
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-mist">
                AI Generalist
              </span>
            </span>
          </button>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => go(link.id)}
                  data-active={active === link.id}
                  className="link-underline relative inline-flex min-h-11 items-center rounded-lg px-3.5 py-2 font-mono text-[12px] uppercase tracking-[0.14em] transition-colors duration-300 hover:text-chalk"
                  style={{
                    color: active === link.id ? '#e8eaf4' : '#8b93b0',
                  }}
                >
                  {link.label}
                  {active === link.id && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-purple-400"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2.5">
            <Magnetic strength={0.22}>
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub profile"
                className="hidden h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-mist transition-colors duration-300 hover:border-purple-400/45 hover:text-purple-300 sm:grid"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            </Magnetic>

            <Magnetic strength={0.22}>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn profile"
                className="hidden h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-mist transition-colors duration-300 hover:border-teal-400/45 hover:text-teal-300 sm:grid"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            </Magnetic>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-chalk lg:hidden"
            >
              {open ? <CloseIcon className="h-4.5 w-4.5" /> : <MenuIcon className="h-4.5 w-4.5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[105] bg-void/80 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              className="fixed right-0 top-0 z-[108] flex h-full w-[min(20rem,86vw)] flex-col border-l border-white/10 bg-abyss/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            >
              <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-mist">
                  Navigation
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-11 w-11 place-items-center rounded-lg border border-white/10 text-mist"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>

              <ul className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button
                      onClick={() => go(link.id)}
                      className="group flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left transition-colors duration-300 hover:bg-white/[0.05]"
                    >
                      <span className="font-mono text-[10px] text-purple-400/60">
                        0{i + 1}
                      </span>
                      <span
                        className={`font-display text-lg font-semibold tracking-tight transition-colors ${
                          active === link.id ? 'text-purple-300' : 'text-chalk'
                        }`}
                      >
                        {link.label}
                      </span>
                      <span className="ml-auto h-px w-0 bg-gradient-to-r from-purple-400 to-transparent transition-all duration-300 group-hover:w-10" />
                    </button>
                  </motion.li>
                ))}
              </ul>

              <div className="border-t border-white/8 p-6">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-mist">
                  Find me
                </p>
                <div className="flex gap-3">
                  <a
                    href={profile.links.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-mist transition-colors hover:text-purple-300"
                    aria-label="GitHub"
                  >
                    <GithubIcon className="h-4 w-4" />
                  </a>
                  <a
                    href={profile.links.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-mist transition-colors hover:text-indigo-300"
                    aria-label="LinkedIn"
                  >
                    <LinkedinIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
