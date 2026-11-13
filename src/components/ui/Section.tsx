import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type Props = {
  id: string
  index: string
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  className?: string
}

/** Consistent section shell: index, eyebrow, gradient heading, description. */
export function Section({
  id,
  index,
  eyebrow,
  title,
  description,
  children,
  className = '',
}: Props) {
  return (
    <section id={id} className={`relative scroll-mt-24 py-24 sm:py-32 ${className}`}>
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-14 flex flex-col gap-5 sm:mb-20">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs tracking-[0.3em] text-cyan-400/80">
                {index}
              </span>
              <span className="h-px w-10 bg-gradient-to-r from-cyan-400/60 to-transparent" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-mist">
                {eyebrow}
              </span>
            </div>

            <h2 className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {title}
            </h2>

            {description && (
              <p className="max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
                {description}
              </p>
            )}          </div>
        </Reveal>
        {children}
      </div>
    </section>
  )
}
