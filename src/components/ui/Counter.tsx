import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

type Props = {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
  pad?: number
}

/** Odometer-style counter that ticks up when scrolled into view. */
export function Counter({
  value,
  suffix = '',
  prefix = '',
  duration = 1900,
  className = '',
  pad = 0,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let cancelled = false

    const run = async () => {
      const { animate } = await import('animejs')
      if (cancelled) return
      const obj = { v: 0 }
      animate(obj, {
        v: value,
        duration,
        ease: 'outExpo',
        onUpdate: () => {
          if (!cancelled) setDisplay(Math.round(obj.v))
        },
        onComplete: () => {
          if (!cancelled) setDisplay(value)
        },
      })
    }
    run()

    return () => {
      cancelled = true
    }
  }, [inView, value, duration])

  const text = pad > 0 ? String(display).padStart(pad, '0') : String(display)

  return (
    <span ref={ref} className={className}>
      {prefix}
      {text}
      {suffix}
    </span>
  )
}
