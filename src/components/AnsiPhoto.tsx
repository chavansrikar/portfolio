import { AnsiNoise } from './AnsiNoise'
import { useInteractive } from '@/hooks/useInteractive'

type Props = {
  src: string
  alt: string
  className?: string
  cols?: number
}

/**
 * A photo that dissolves into ANSI character art on hover (or tap).
 *
 * The real photograph stays visible underneath at all times; the ANSI
 * canvas fades in over it and keeps shimmering while you hold the
 * pointer there.
 */
export function AnsiPhoto({ src, alt, className = '', cols = 72 }: Props) {
  const touch = useInteractive({ duration: 3000 })

  return (
    <div
      {...touch.handlers}
      className={`group relative h-full overflow-hidden ${className}`}
      data-cursor="ASCII"
    >
      {/* The real photo — always visible underneath */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
      />

      {/* ANSI layer fades in on hover */}
      <AnsiNoise
        src={src}
        cols={cols}
        speed={0.9}
        hoverOnly
        active={touch.active}
        className="absolute inset-0 h-full w-full mix-blend-screen"
      />

      {/* CRT scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          opacity: touch.active ? 0.5 : 0,
          background:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* Corner brackets */}
      <div className="pointer-events-none absolute inset-3">
        {[
          'left-0 top-0 border-l-2 border-t-2',
          'right-0 top-0 border-r-2 border-t-2',
          'left-0 bottom-0 border-l-2 border-b-2',
          'right-0 bottom-0 border-r-2 border-b-2',
        ].map((c) => (
          <span
            key={c}
            className={`absolute h-4 w-4 border-pink-400/80 transition-all duration-500 ${c}`}
            style={{ opacity: touch.active ? 1 : 0 }}
          />
        ))}
      </div>

      {/* Hover hint */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-end p-3">
        <span className="ascii rounded-md border border-pink-400/30 bg-void/85 px-2 py-1 text-[9px] text-pink-300 opacity-0 backdrop-blur-sm transition-opacity duration-400 group-hover:opacity-100">
          ▓▒░ ascii ░▒▓
        </span>
      </div>
    </div>
  )
}
