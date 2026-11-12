import { lazy, Suspense, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { AnimatePresence, motion } from 'framer-motion'

import { Preloader } from './components/Preloader'
import { Cursor } from './components/Cursor'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Marquee } from './components/ui/Marquee'
import { marqueeItems } from './data/site'

const About = lazy(() => import('./components/About').then((m) => ({ default: m.About })))
const Skills = lazy(() => import('./components/Skills').then((m) => ({ default: m.Skills })))
const Projects = lazy(() => import('./components/Projects').then((m) => ({ default: m.Projects })))
const Journey = lazy(() => import('./components/Journey').then((m) => ({ default: m.Journey })))
const Posts = lazy(() => import('./components/Posts').then((m) => ({ default: m.Posts })))
const Github = lazy(() => import('./components/Github').then((m) => ({ default: m.Github })))
const Contact = lazy(() => import('./components/Contact').then((m) => ({ default: m.Contact })))
const Footer = lazy(() => import('./components/Footer').then((m) => ({ default: m.Footer })))

export default function App() {
  const [loading, setLoading] = useState(true)

  // Smooth scrolling with Lenis, driven from a rAF loop.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.15,
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

  // Lock scroll while the preloader is up.
  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [loading])

  return (
    <>
      <AnimatePresence>
        {loading && <Preloader onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <Cursor />
      <Navbar />

      <main>
        <Hero />

        <div className="relative border-y border-white/6 bg-abyss/30 py-3">
          <Marquee items={marqueeItems} />
        </div>

        <Suspense fallback={<SectionFallback />}>
          <About />
          <Skills />
          <Projects />
          <Journey />
          <Posts />
          <Github />
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
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="ascii text-[10px] text-mist/40"
      >
        loading modules…
      </motion.div>
    </div>
  )
}
