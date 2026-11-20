import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { profile, roles } from '@/data/site'
import { asciiArt } from '@/lib/ascii'
import { AsciiName } from './ui/AsciiName'
import { AsciiHoverPanel } from './AsciiHoverPanel'
import { AsciiGridField } from './AsciiGridField'
import { ProfileCard } from './ProfileCard'
import { Button } from './ui/Button'
import { Magnetic } from './ui/Magnetic'
import {
  ArrowRightIcon,
  GithubIcon,
  LocationIcon,
  SparklesIcon,
} from './ui/icons'

function Typewriter({ words }: { words: readonly string[] }) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[index]
    const full = word

    if (!deleting && text === full) {
      const t = setTimeout(() => setDeleting(true), 1600)
      return () => clearTimeout(t)
    }
    if (deleting && text === '') {
      setDeleting(false)
      setIndex((i) => (i + 1) % words.length)
      return
    }

    const speed = deleting ? 45 : 85
    const t = setTimeout(() => {
      setText((prev) =>
        deleting ? full.slice(0, prev.length - 1) : full.slice(0, prev.length + 1)
      )
    }, speed)

    return () => clearTimeout(t)
  }, [text, deleting, index, words])

  return (
    <span className="text-gradient-static">
      {text}
      <span className="ml-0.5 inline-block animate-blink text-purple-400">▊</span>
    </span>
  )
}

export function Hero({ ready = true }: { ready?: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 140])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94])
  const artY = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20 sm:pt-32"
    >
      {/* Background layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-void" />
        <AsciiGridField />
        <motion.div
          style={{ y: artY }}
          className="absolute -left-32 top-[-10%] h-[34rem] w-[34rem] rounded-full bg-purple-600/20 blur-[130px]"
        />
        <motion.div
          style={{ y: artY }}
          className="absolute -right-24 top-[18%] h-[30rem] w-[30rem] rounded-full bg-teal-500/12 blur-[130px]"
        />
        <div className="absolute bottom-[-12%] left-1/3 h-[26rem] w-[26rem] rounded-full bg-violet-600/16 blur-[130px]" />
        <div className="absolute inset-0 noise opacity-[0.12] mix-blend-overlay" />

        {/* Ambient ASCII constellation — desktop only, very low contrast */}
        <div
          aria-hidden
          className="absolute right-[2%] top-[8%] hidden select-none opacity-[0.07] xl:block"
        >
          <pre className="ascii text-[10px] leading-[1.1] text-purple-300">
            {asciiArt.neural.split('\n').map((line, i) => (
              <span
                key={i}
                className="block"
                style={{
                  animation: `ascii-wave ${3.4 + (i % 4) * 0.4}s ease-in-out ${i * 0.2}s infinite`,
                }}
              >
                {line}
              </span>
            ))}
          </pre>
        </div>

        {/* Periodic CRT scan band */}
        <div className="hero-scan absolute inset-x-0 h-28" />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void" />
      </div>

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.35fr_1fr] lg:gap-8"
      >
        {/* Left column */}
        <div className="flex min-w-0 flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-purple-400/30 bg-purple-400/[0.07] px-4 py-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-purple-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-400" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-purple-200/90 sm:text-[11px]">
              Available for collaborations
            </span>
          </motion.div>

          {/* ASCII name — each letter drops in after the boot screen clears */}
          <div className="ascii ascii-3d ascii-glitch mb-6 w-full max-w-full min-w-0 text-purple-400">
            <AsciiName
              text={profile.name}
              max={13}
              min={2.4}
              stagger={0.03}
              delay={0.04}
              play={ready}
            />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl text-4xl font-black leading-[1.03] tracking-[-0.035em] sm:text-5xl lg:text-[3.9rem]"
          >
            I turn ideas into{' '}
            <span className="relative inline-block">
              <span className="text-gradient">prototypes</span>
              <motion.span
                className="absolute -bottom-1 left-0 h-[3px] rounded-full bg-gradient-to-r from-purple-400 via-teal-400 to-violet-500"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-mist sm:text-lg"
          >
            Aspiring entrepreneur and AI generalist turning{' '}
            <span className="text-chalk">real-world problems</span> into working
            products across <span className="text-chalk">computer vision</span>,{' '}
            <span className="text-chalk">deep learning</span> and{' '}
            <span className="text-chalk">LLM tooling</span> — shipping solutions,
            not slideware.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.8 }}
            className="mt-7 flex items-center gap-2 font-mono text-sm sm:text-base"
          >
            <span className="text-mist">&gt;</span>
            <Typewriter words={roles} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.74, duration: 0.8 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic strength={0.28}>
              <Button href="#work" onClick={() => scrollToSection('work')}>
                <SparklesIcon className="h-4 w-4" />
                View my work
              </Button>
            </Magnetic>
            <Magnetic strength={0.28}>
              <Button
                href={profile.links.github}
                target="_blank"
                rel="noreferrer noopener"
                variant="ghost"
              >
                <GithubIcon className="h-4 w-4" />
                GitHub
                <ArrowRightIcon className="h-3.5 w-3.5 opacity-70" />
              </Button>
            </Magnetic>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-mist/80"
          >
            <span className="flex items-center gap-2">
              <LocationIcon className="h-3.5 w-3.5 text-purple-400/70" />
              {profile.location}
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-mist/50" />
              {profile.company}
            </span>
          </motion.div>
        </div>

        {/* Right column — profile photo (ASCII on hover) + terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto flex w-full min-w-0 max-w-md flex-col items-center gap-8 lg:max-w-none"
        >
          <ProfileCard />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8 }}
            className="relative mt-8 w-full"
          >
            <TerminalCard />
            <FloatTag
              className="-right-2 -top-5 sm:-right-6"
              delay={1.25}
              drift={['0 0 0px', '0 -12px 0px', '0 0 0px']}
              text="// vibe coder"
            />
            <FloatTag
              className="-bottom-5 -left-2 sm:-left-6"
              delay={1.45}
              drift={['0 0 0px', '0 12px 0px', '0 0 0px']}
              text="[ AI / ML ]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="hidden w-full sm:block"
          >
            <AsciiHoverPanel art={asciiArt.cpu} label="sys.status" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-mist/60">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 7, 0], opacity: [0.9, 0.25, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="h-9 w-[22px] rounded-full border border-white/20 p-1"
        >
          <span className="block h-1.5 w-1.5 rounded-full bg-purple-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}

function FloatTag({
  className,
  text,
  delay,
  drift,
}: {
  className: string
  text: string
  delay: number
  drift: [string, string, string]
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6 }}
      className={`absolute z-20 ${className}`}
    >
      <motion.div
        animate={{ y: drift }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        className="ascii rounded-lg border border-white/10 bg-abyss/85 px-3 py-1.5 text-[10px] text-purple-300/90 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.9)] backdrop-blur-md"
      >
        {text}
      </motion.div>
    </motion.div>
  )
}

function TerminalCard() {
  const lines = [
    { p: '~', t: 'whoami', o: 'chavan-srikar' },
    { p: '~', t: 'cat focus.txt', o: 'computer-vision | deep-learning | llm-tooling' },
    { p: '~', t: 'ls ./projects', o: '21 repos · 12 stars' },
    { p: '~', t: 'echo $STACK', o: 'Python · TypeScript · Java · Node.js' },
    { p: '~', t: 'python build.py --fast', o: '✔ prototype shipped' },
  ]

  return (
    <div className="glass glow-ring scanline relative overflow-hidden rounded-2xl">
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mist/70">
          srikar@ai — zsh
        </span>
      </div>

      <div className="space-y-2.5 px-4 py-5 font-mono text-[11px] leading-relaxed sm:text-[12.5px]">
        {lines.map((l, i) => (
          <motion.div
            key={l.t}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + i * 0.18, duration: 0.4 }}
            className="flex flex-wrap gap-x-2"
          >
            <span className="text-purple-400/80">{l.p}</span>
            <span className="text-teal-300/90">{l.t}</span>
            <span className="text-mist/40">→</span>
            <span className="text-chalk/85">{l.o}</span>
          </motion.div>
        ))}
        <div className="flex gap-2 pt-1">
          <span className="text-purple-400">❯</span>
          <span className="inline-block h-4 w-2 animate-blink bg-purple-300/80" />
        </div>
      </div>
    </div>
  )
}

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 72,
      behavior: 'smooth',
    })
  }
}
