import { motion } from 'framer-motion'
import { nasaAward } from '@/data/site'
import { asset } from '@/lib/assets'
import { Globe } from './ui/Globe'
import { ArrowUpRightIcon, GithubIcon } from './ui/icons'

const MISSION = [
  { id: '01', label: 'What is changing?', text: 'Scan 25 NASA POWER variables at once and rank what actually moves.' },
  { id: '02', label: 'Where?', text: 'Map the trend grid cell by grid cell across a region, not just one point.' },
  { id: '03', label: 'How much?', text: "Sen's slope per decade, fitted change and a non-parametric interval." },
  { id: '04', label: 'Is it real?', text: 'Mann–Kendall significance, corrected for testing many variables.' },
]

const TICKER = [
  'NASA POWER',
  'NASA GIBS',
  'NASA EONET',
  'USGS WATER',
  'ECCC GEOMET',
  '30 YEARS OF DATA',
  '25 VARIABLES',
  '1ST PLACE · WARANGAL',
]

const CONSOLE = [
  { cmd: 'mission --status', out: '1st place · Warangal local event', hot: true },
  { cmd: 'cat project.txt', out: 'ATLAS Earth · Trend Detective' },
  { cmd: 'data --source', out: 'NASA POWER · NASA GIBS' },
  { cmd: 'globe --engine', out: 'NASA Blue Marble · WebGL' },
]

const reveal = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
}

/** NASA Space Apps 2026 first-place mission log, in a TERRA-CORE-style report. */
export function MissionLog() {
  return (
    <section
      id="nasa"
      aria-labelledby="nasa-heading"
      className="relative scroll-mt-20 overflow-hidden border-y-2 border-[#111] bg-[#f1eee3] text-[#111]"
    >
      {/* graph-paper grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(17,17,17,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,17,0.07) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        {/* Mission bar */}
        <motion.div
          {...reveal}
          className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#111] pb-4"
        >
          <span className="inline-flex items-center gap-2 border-2 border-[#111] bg-[#fbf9f2] px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] sm:text-[10px]">
            <span className="grid h-4 w-4 place-items-center bg-[#111] text-[8px] text-[#ffd400]">
              ✳
            </span>
            // Mission log · 002
          </span>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[8px] font-bold uppercase tracking-[0.16em] sm:text-[9px]">
            <span className="border-2 border-[#111] bg-[#fbf9f2] px-2 py-1">
              NASA Space Apps 2026
            </span>
            <span className="border-2 border-[#111] bg-[#ffd400] px-2 py-1 shadow-[3px_3px_0_#111]">
              First place
            </span>
            <span className="border-2 border-[#111] bg-[#fbf9f2] px-2 py-1">
              Warangal · 14–15 Nov
            </span>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
          {/* Report */}
          <motion.div {...reveal}>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#555] sm:text-[10px]">
              // Team Ace Azael · ATLAS Earth
            </p>

            <h2
              id="nasa-heading"
              className="mt-3 font-display text-[clamp(2.1rem,8vw,4.7rem)] font-black uppercase leading-[0.9] tracking-[-0.045em]"
            >
              First place.
              <br />
              Whole planet.
              <br />
              <span className="mt-1 inline-block bg-[#ffd400] px-2 pb-0.5 shadow-[5px_5px_0_#111]">
                Live.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-[#222] sm:text-[15.5px]">
              We won <strong className="bg-[#ffd400]/70 px-0.5">first place</strong> at the{' '}
              <strong>NASA Space Apps Challenge 2026 Warangal local event</strong> with{' '}
              <strong>ATLAS Earth</strong> — a trend detective that turns 30 years of NASA
              climate data into plain-language answers about what is changing, where, and
              whether the trend is real.
            </p>

            {/* Console */}
            <div className="mt-6 border-2 border-[#111] bg-[#fbf9f2] shadow-[6px_6px_0_#111]">
              <div className="flex items-center gap-1.5 border-b-2 border-[#111] px-3 py-2">
                <span className="h-2 w-2 rounded-full border border-[#111] bg-[#ff5f57]" />
                <span className="h-2 w-2 rounded-full border border-[#111] bg-[#febc2e]" />
                <span className="h-2 w-2 rounded-full border border-[#111] bg-[#28c840]" />
                <span className="ml-2 truncate font-mono text-[8px] uppercase tracking-[0.18em] text-[#666] sm:text-[9px]">
                  atlas@nasa:~/warangal
                </span>
              </div>
              <div className="space-y-1 px-3 py-2.5 font-mono text-[10px] leading-relaxed sm:px-4 sm:py-3 sm:text-[11.5px]">
                {CONSOLE.map((line) => (
                  <p key={line.cmd} className="flex flex-wrap gap-x-2">
                    <span className="text-[#888]">~</span>
                    <span className="font-bold text-[#111]">{line.cmd}</span>
                    <span className="text-[#b3006b]">→</span>
                    <span className={line.hot ? 'bg-[#ffd400]/60 px-1' : 'text-[#333]'}>
                      {line.out}
                    </span>
                  </p>
                ))}
                <p className="flex items-center gap-2 pt-0.5 text-[#666]">
                  <span className="text-[#888]">~</span>
                  <span className="inline-block h-3 w-1.5 animate-blink bg-[#111]" />
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <a
                href={nasaAward.live}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex min-h-11 items-center justify-center gap-2 border-2 border-[#111] bg-[#111] px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#ffd400] shadow-[4px_4px_0_#ffd400] transition-transform hover:-translate-y-0.5 sm:text-[11px]"
              >
                Open ATLAS Earth
                <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href={asset(nasaAward.certificate)}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-11 items-center justify-center gap-2 border-2 border-[#111] bg-[#fbf9f2] px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#111] shadow-[4px_4px_0_#111] transition-transform hover:-translate-y-0.5 sm:text-[11px]"
              >
                View certificate
                <ArrowUpRightIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href={nasaAward.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-11 items-center justify-center gap-2 border-2 border-[#111] bg-[#fbf9f2] px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#111] shadow-[4px_4px_0_#111] transition-transform hover:-translate-y-0.5 sm:text-[11px]"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                Source
              </a>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { v: '1st', l: 'Place', s: 'Warangal event' },
                { v: '30', l: 'Years', s: 'NASA POWER data' },
                { v: '25', l: 'Variables', s: 'tested at once' },
              ].map((stat) => (
                <div
                  key={stat.l}
                  className="border-2 border-[#111] bg-[#fbf9f2] px-2 py-3 text-center shadow-[3px_3px_0_#111]"
                >
                  <div className="font-display text-2xl font-black leading-none sm:text-3xl">
                    {stat.v}
                  </div>
                  <div className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.14em] sm:text-[9px]">
                    {stat.l}
                  </div>
                  <div className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.08em] text-[#777] sm:text-[8px]">
                    {stat.s}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Globe tab */}
          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }}>
            <div className="border-2 border-[#111] bg-[#fbf9f2] shadow-[6px_6px_0_#111]">
              {/* tab strip */}
              <div className="grid grid-cols-3 border-b-2 border-[#111] font-mono text-[8px] font-bold uppercase tracking-[0.14em] sm:text-[9px]">
                <span className="border-r-2 border-[#111] px-2 py-2 text-center text-[#888]">
                  Trends
                </span>
                <span className="border-r-2 border-[#111] bg-[#ffd400] px-2 py-2 text-center">
                  Globe ●
                </span>
                <span className="px-2 py-2 text-center text-[#888]">Data</span>
              </div>

              <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square">
                <Globe />
                <div className="pointer-events-none absolute left-3 top-3 font-mono text-[7px] uppercase tracking-[0.18em] text-white/55 sm:text-[8px]">
                  ATLAS · GLOBE TAB
                </div>
                <div className="pointer-events-none absolute bottom-3 left-3 font-mono text-[7px] uppercase tracking-[0.16em] text-white/60 sm:text-[8px]">
                  <span className="text-[#ffd400]">◉</span> Warangal · 17.97°N 79.59°E
                </div>
                <div className="pointer-events-none absolute bottom-3 right-3 font-mono text-[7px] uppercase tracking-[0.16em] text-white/40 sm:text-[8px]">
                  Drag to turn
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-[#111] px-3 py-2 font-mono text-[8px] uppercase tracking-[0.14em] text-[#444] sm:text-[9px]">
                <span>NASA Blue Marble</span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-blink rounded-full bg-[#111]" />
                  Live WebGL
                </span>
              </div>
            </div>

            <p className="mt-3 font-mono text-[8px] uppercase leading-relaxed tracking-[0.12em] text-[#666] sm:text-[9px]">
              The same NASA Blue Marble globe from ATLAS Earth&apos;s Globe tab, rendered
              live in the portfolio. Imagery: NASA.
            </p>
          </motion.div>
        </div>

        {/* Certificate + capability list */}
        <div className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-[1.45fr_1fr]">
          <motion.a
            {...reveal}
            href={asset(nasaAward.certificate)}
            target="_blank"
            rel="noreferrer noopener"
            className="group block border-2 border-[#111] bg-[#fbf9f2] p-2 shadow-[6px_6px_0_#111] transition-transform hover:-translate-y-0.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#111] px-2 pb-2">
              <span className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] sm:text-[9px]">
                Certificate of appreciation
              </span>
              <span className="bg-[#ffd400] px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.14em] shadow-[2px_2px_0_#111] sm:text-[9px]">
                First place
              </span>
            </div>
            <img
              src={asset(nasaAward.certificate)}
              srcSet={`${asset(nasaAward.certificateSmall)} 800w, ${asset(nasaAward.certificate)} 1600w`}
              sizes="(min-width: 1024px) 58vw, 100vw"
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
              alt="NASA Space Apps Challenge 2026 Warangal certificate of appreciation awarded to Ace Azazel for first place with Be An Earth System Trend Detective"
              className="mt-2 w-full border border-[#111] object-cover"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-2 font-mono text-[7px] uppercase tracking-[0.12em] text-[#666] sm:text-[8px]">
              <span>NASA Space Apps 2026 · Warangal · 14–15 Nov 2026</span>
              <span className="inline-flex items-center gap-1 text-[#111] underline decoration-2 underline-offset-2">
                View full certificate
                <ArrowUpRightIcon className="h-3 w-3" />
              </span>
            </div>
          </motion.a>

          <motion.div
            {...reveal}
            transition={{ ...reveal.transition, delay: 0.08 }}
            className="border-2 border-[#111] bg-[#fbf9f2] p-4 shadow-[6px_6px_0_#111] sm:p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-base font-black uppercase tracking-tight sm:text-lg">
                What ATLAS does
              </h3>
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#777]">
                The detective
              </span>
            </div>
            <ul className="mt-3 divide-y divide-[#111]/15 border-y border-[#111]/15">
              {MISSION.map((m) => (
                <li key={m.id} className="flex gap-3 py-2.5">
                  <span className="mt-0.5 font-mono text-[9px] font-bold text-[#b3006b]">
                    {m.id}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-[12.5px] font-bold leading-tight">
                      {m.label}
                    </p>
                    <p className="mt-0.5 font-mono text-[8.5px] leading-relaxed text-[#555] sm:text-[9.5px]">
                      {m.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3 bg-[#111] px-3 py-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#ffd400] sm:text-[9px]">
              NASA POWER · NASA GIBS · NASA EONET · USGS · ECCC
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ticker */}
      <div className="relative border-t-2 border-[#111] bg-[#111] py-2.5">
        <div className="flex w-max animate-marquee items-center gap-6 pr-6">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-6" aria-hidden={copy === 1}>
              {TICKER.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="flex items-center gap-6 whitespace-nowrap font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#f1eee3] sm:text-[10px]"
                >
                  {item}
                  <span className="text-[#ffd400]">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
