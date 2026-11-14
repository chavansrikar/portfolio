import { lazy, Suspense, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { AnimatePresence, motion } from 'framer-motion'

import { AsciiBoot } from './components/AsciiBoot'
import { Cursor } from './components/Cursor'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Marquee } from './components/ui/Marquee'
import { AsciiDivider } from './components/ui/AsciiDivider'
import { marqueeItems } from './data/site'

const About = lazy(() => import('./components/About').then((m) => ({ default: m.About })))
const Skills = lazy(() => import('./components/Skills').then((m) => ({ default: m.Skills })))
const Projects = lazy(() => import('./components/Projects').then((m) => ({ default: m.Projects })))
const Journey = lazy(() => import('./components/Journey').then((m) => ({ default: m.Journey })))
const Posts = lazy(() => import('./components/Posts').then((m) => ({ default: m.Posts })))
const Github = lazy(() => import('./components/Github').then((m) => ({ default: m.Github })))
const Contact = lazy(() => import('./components/Contact').then((m) => ({ default: m.Contact })))
const Footer = lazy(() => import('./components/Footer').then((m) => ({ default: m.Footer })))

const GLYPH_RAIL = [
  '┌', '┐', '└', '┘', '├', '┤', '┬', '┴', '┼', '╭', '╮', '╰', '╯',
  '█', '▓', '▒', '░', '+', '×', '·', '═', '║', '◉', '●', '○', '◆', '◇',
]

export default function App() {
  // Only run the boot sequence on a fresh visit — reloads skip straight
  // to the site. `?boot` forces it for demos.
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return true
    try {
      if (new URLSearchParams(window.location.search).has('boot')) return true
      return sessionStorage.getItem('srikar:booted') !== '1'
    } catch {
      return true
    }
  })

  // Smooth scrolling with Lenis, driven from a rAF loop.
  // Disabled on touch devices so native momentum scrolling stays intact.
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!finePointer) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  // Lock scroll while the boot screen is up.
  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [loading])

  const finishBoot = () => {
    try {
      sessionStorage.setItem('srikar:booted', '1')
    } catch {
      /* storage unavailable */
    }
    setLoading(false)
  }

  return (
    <>
      <AnimatePresence>
        {loading && <AsciiBoot onDone={finishBoot} />}
      </AnimatePresence>

      <Cursor />
      <Navbar />

      <main>
        <Hero ready={!loading} />

        {/* Dual-speed ASCII ticker */}
        <div className="relative border-y border-white/[0.07] bg-abyss/30">
          <Marquee
            items={marqueeItems}
            separator="░"
            className="py-3"
            itemClassName="px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-mist/85 transition-colors duration-300 hover:text-purple-300 sm:text-sm"
            separatorClassName="text-[9px] text-teal-400/35"
          />
          <div className="border-t border-white/[0.045]">
            <Marquee
              reverse
              items={GLYPH_RAIL}
              separator="·"
              className="py-1.5"
              itemClassName="ascii px-2 text-[9px] leading-none text-mist/20"
              separatorClassName="ascii text-[8px] leading-none text-purple-400/20"
              speed={26}
            />
          </div>
        </div>

        <AsciiDivider index="01" label="ABOUT" />

        <Suspense fallback={<SectionFallback />}>
          <About />
          <AsciiDivider index="02" label="TOOLKIT" reverse />
          <Skills />
          <AsciiDivider index="03" label="WORK" />
          <Projects />
          <AsciiDivider index="04" label="JOURNEY" reverse />
          <Journey />
          <AsciiDivider index="05" label="WRITING" />
          <Posts />
          <AsciiDivider index="06" label="CODE" reverse />
          <Github />
          <AsciiDivider index="07" label="CONTACT" />
          <Contact />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  )
}

function SectionFallback() {
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <motion.div
        animate={{ opacity: [0.25, 1, 0.25] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        className="flex flex-col items-center gap-2"
      >
        <span className="ascii text-[11px] tracking-[0.16em] text-purple-300/60">
          ▓▓▓▒▒░░░
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-mist/40">
          mounting modules
        </span>
      </motion.div>
    </div>
  )
}