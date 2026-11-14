import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '@/data/site'
import { toAscii } from '@/lib/ascii'
import { Marquee } from './ui/Marquee'
import {
  ArrowUpRightIcon,
  GithubIcon,
  HuggingFaceIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
} from './ui/icons'

export function Footer() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      setTime(
        new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date())
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const nameArt = toAscii(profile.name)

  const links = [
    { name: 'GitHub', href: profile.links.github, icon: GithubIcon },
    { name: 'LinkedIn', href: profile.links.linkedin, icon: LinkedinIcon },
    { name: 'Instagram', href: profile.links.instagram, icon: InstagramIcon },
    { name: 'Hugging Face', href: profile.links.huggingface, icon: HuggingFaceIcon },
    { name: 'Email', href: profile.links.email, icon: MailIcon },
  ]

  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-abyss/50">
      {/* Giant ASCII name */}
      <div className="pointer-events-none relative overflow-hidden py-10 opacity-[0.07]">
        <div
          className="ascii whitespace-pre text-center text-cyan-300"
          style={{ fontSize: 'clamp(5px, 1.5vw, 14px)' }}
        >
          {nameArt.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>

      <Marquee
        items={['Let’s build something', 'AI / ML', 'Computer Vision', 'Full-Stack', 'Available for work']}
        className="border-y border-white/6 py-3"
      />

      <div className="mx-auto w-full max-w-7xl px-5 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-14 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 ring-1 ring-white/10">
                <span className="font-mono text-sm font-bold text-cyan-300">CS</span>
              </span>
              <div>
                <div className="font-display text-base font-bold tracking-tight text-chalk">
                  {profile.name}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
                  {profile.role}
                </div>
              </div>
            </div>
            <p className="max-w-sm text-[13px] leading-relaxed text-mist/80">
              Aspiring entrepreneur and AI generalist working across computer vision,
              deep learning and LLM tooling — shipping prototypes fast and products
              properly.
            </p>
            <div className="mt-5 flex items-center gap-2 font-mono text-[10px] text-mist/70">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-lime-400" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-400" />
              </span>
              <span>Local time (IST)</span>
              <span className="tabular-nums text-chalk">{time}</span>
            </div>
          </div>

          {/* Nav */}
          <div>
            <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-mist">
              Navigate
            </h3>
            <ul className="space-y-2.5">
              {[
                ['About', 'about'],
                ['Skills', 'skills'],
                ['Work', 'work'],
                ['Journey', 'journey'],
                ['Posts', 'posts'],
                ['GitHub', 'github'],
                ['Contact', 'contact'],
              ].map(([label, id]) => (
                <li key={id}>
                  <button
                    onClick={() => {
                      const el = document.getElementById(id)
                      if (el)
                        window.scrollTo({
                          top: el.getBoundingClientRect().top + window.scrollY - 72,
                          behavior: 'smooth',
                        })
                    }}
                    className="link-underline font-mono text-[12px] text-mist transition-colors hover:text-chalk"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-mist">
              Elsewhere
            </h3>
            <ul className="space-y-2.5">
              {links.map((l) => {
                const Icon = l.icon
                return (
                  <li key={l.name}>
                    <a
                      href={l.href}
                      target={l.href.startsWith('mailto') ? undefined : '_blank'}
                      rel="noreferrer noopener"
                      className="group inline-flex items-center gap-2 font-mono text-[12px] text-mist transition-colors hover:text-chalk"
                    >
                      <Icon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:text-cyan-300" />
                      {l.name}
                      <ArrowUpRightIcon className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-60" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-7 sm:flex-row">
          <p className="font-mono text-[10px] text-mist/60">
            © {new Date().getFullYear()} {profile.name}. Built with React, Tailwind,
            Framer Motion &amp; anime.js.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-mist/50">
              Made in Bhongir, India
            </span>
            <span className="h-3 w-px bg-white/10" />
            <span className="font-mono text-[10px] text-mist/50">
              <span className="text-rose-400">♥</span> &amp; a lot of coffee
            </span>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <BackToTop />
    </footer>
  )
}

function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      initial={false}
      animate={{
        opacity: show ? 1 : 0,
        scale: show ? 1 : 0.7,
        pointerEvents: show ? 'auto' : 'none',
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Back to top"
      className="group fixed bottom-6 right-5 z-[100] grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-abyss/90 text-mist backdrop-blur-md transition-colors duration-300 hover:border-cyan-400/50 hover:text-cyan-300 sm:right-8"
    >
      <span className="absolute inset-0 rounded-full bg-cyan-400/0 blur-md transition-all duration-500 group-hover:bg-cyan-400/25" />
      <svg viewBox="0 0 24 24" className="relative h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5m-7 7 7-7 7 7" />
      </svg>
    </motion.button>
  )
}
