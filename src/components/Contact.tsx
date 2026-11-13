import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '@/data/site'
import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { Button } from './ui/Button'
import { Magnetic } from './ui/Magnetic'
import {
  CheckIcon,
  CopyIcon,
  GithubIcon,
  HuggingFaceIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  SendIcon,
  SparklesIcon,
} from './ui/icons'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const SOCIALS = [
  {
    name: 'GitHub',
    href: profile.links.github,
    icon: GithubIcon,
    color: 'hover:text-cyan-300',
    ring: 'hover:border-cyan-400/50',
    glow: 'rgba(34,211,238,0.35)',
  },
  {
    name: 'LinkedIn',
    href: profile.links.linkedin,
    icon: LinkedinIcon,
    color: 'hover:text-indigo-300',
    ring: 'hover:border-indigo-400/50',
    glow: 'rgba(129,140,248,0.35)',
  },
  {
    name: 'Instagram',
    href: profile.links.instagram,
    icon: InstagramIcon,
    color: 'hover:text-pink-300',
    ring: 'hover:border-pink-400/50',
    glow: 'rgba(244,114,182,0.35)',
  },
  {
    name: 'Hugging Face',
    href: profile.links.huggingface,
    icon: HuggingFaceIcon,
    color: 'hover:text-purple-300',
    ring: 'hover:border-purple-400/50',
    glow: 'rgba(251,191,36,0.35)',
  },
]

export function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (status !== 'sent') return
    const t = setTimeout(() => setStatus('idle'), 6000)
    return () => clearTimeout(t)
  }, [status])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (form.message.trim().length < 10) e.message = 'Tell me a little more (10+ chars)'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setStatus('sending')

    // Open the user's mail client with the composed message.
    const subject = encodeURIComponent(`Hello ${form.name} — via portfolio`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`

    setTimeout(() => {
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    }, 900)
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      /* clipboard unavailable */
    }
  }

  const field =
    'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-base text-chalk placeholder:text-mist/50 outline-none transition-all duration-300 focus:border-purple-400/60 focus:bg-purple-500/[0.05] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.15)] sm:text-sm'

  return (
    <Section
      id="contact"
      index="07"
      eyebrow="Contact"
      title={
        <>
          Got a problem worth solving?{' '}
          <span className="text-gradient-static">Let&apos;s build it.</span>
        </>
      }
      description="Open to collaborations on AI/CV projects, hackathons, or anything that needs a fast prototype to prove it's worth building."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
        {/* Left — contact details */}
        <Reveal>
          <div className="flex h-full flex-col gap-5">
            <div className="glass card-hover relative overflow-hidden rounded-2xl p-6">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-500/15 blur-2xl" />
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.24em] text-mist">
                Direct line
              </p>
              <button
                onClick={copyEmail}
                className="group mt-1 flex w-full items-center gap-3 text-left"
              >
                <span className="font-display text-lg font-bold tracking-tight text-chalk transition-colors group-hover:text-cyan-300 sm:text-xl">
                  {profile.email}
                </span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 text-mist transition-all duration-300 group-hover:border-cyan-400/40 group-hover:text-cyan-300">
                  {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
                </span>
              </button>
              <AnimatePresence>
                {copied && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 font-mono text-[10px] text-lime-300"
                  >
                    ✓ Copied to clipboard
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="glass card-hover rounded-2xl p-6">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-mist">
                Find me online
              </p>
              <div className="grid grid-cols-2 gap-3">
                {SOCIALS.map((s, i) => {
                  const Icon = s.icon
                  return (
                    <motion.a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.5 }}
                      whileHover={{ scale: 1.04, y: -3 }}
                      className={`group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 transition-all duration-300 ${s.ring}`}
                      style={{ transition: 'all .3s' }}
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.05] text-mist transition-all duration-300 group-hover:text-chalk ${s.color}`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-mono text-[11px] text-chalk">
                          {s.name}
                        </span>
                        <span className="block truncate font-mono text-[9px] text-mist/60">
                          /{profile.handle}
                        </span>
                      </span>
                    </motion.a>
                  )
                })}
              </div>
            </div>

            {/* ASCII promo */}
            <Reveal delay={0.12}>
              <div className="glass relative overflow-hidden rounded-2xl p-6">
                <pre className="ascii overflow-x-auto text-[9px] leading-relaxed text-cyan-300/70 sm:text-[10px]">
                  {[
                    '  ┌────────────────────────────┐',
                    '  │  got a problem worth       │',
                    '  │  solving? give me 5-10 min  │',
                    '  │  and i\'ll show you it\'s    │',
                    '  │  possible.                 │',
                    '  └────────────────────────────┘',
                  ].join('\n')}
                </pre>
                <div className="mt-4 flex items-center gap-2 font-mono text-[10px] text-mist/70">
                  <SparklesIcon className="h-3.5 w-3.5 text-cyan-400/70" />
                  <span>
                    Based in {profile.location} · {profile.company}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </Reveal>

        {/* Right — form */}
        <Reveal delay={0.1}>
          <form
            ref={formRef}
            onSubmit={submit}
            noValidate
            className="glass relative h-full overflow-hidden rounded-2xl p-6 sm:p-8"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

            <div className="mb-6 flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mist/70">
                new-message.sh
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
                  Your name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ada Lovelace"
                  className={field}
                />
                {errors.name && (
                  <p className="mt-1.5 font-mono text-[10px] text-rose-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  className={field}
                />
                {errors.email && (
                  <p className="mt-1.5 font-mono text-[10px] text-rose-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell me about the idea, the deadline and the data you have…"
                  className={`${field} resize-none`}
                />
                {errors.message && (
                  <p className="mt-1.5 font-mono text-[10px] text-rose-400">{errors.message}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Magnetic strength={0.25}>
                  <Button type="submit" className="!px-7">
                    {status === 'sending' ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-void/30 border-t-void" />
                        Sending…
                      </>
                    ) : status === 'sent' ? (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        Sent
                      </>
                    ) : (
                      <>
                        <SendIcon className="h-4 w-4" />
                        Send message
                      </>
                    )}
                  </Button>
                </Magnetic>

                <Button href={`mailto:${profile.email}`} variant="ghost">
                  <MailIcon className="h-4 w-4" />
                  Open mail app
                </Button>
              </div>

              <AnimatePresence>
                {status === 'sent' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2.5 rounded-xl border border-lime-400/25 bg-lime-400/[0.07] px-4 py-3">
                      <CheckIcon className="h-4 w-4 shrink-0 text-lime-400" />
                      <p className="text-[12.5px] text-lime-200/90">
                        Your mail client should have opened. If not, email me directly
                        at{' '}
                        <a
                          href={`mailto:${profile.email}`}
                          className="font-semibold underline underline-offset-2"
                        >
                          {profile.email}
                        </a>
                        .
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  )
}
