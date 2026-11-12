import { useEffect, useRef, useState } from 'react'

/**
 * Counts a number up when the element scrolls into view.
 * Uses anime.js for the eased tween.
 */
export function useCountUp(
  target: number,
  options: { duration?: number; delay?: number; start?: boolean } = {}
) {
  const { duration = 1800, delay = 0, start = false } = options
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start || !ref.current) return
    let cancelled = false

    const run = async () => {
      const { animate } = await import('animejs')
      if (cancelled) return
      const obj = { v: 0 }
      animate(obj, {
        v: target,
        duration,
        delay,
        ease: 'outExpo',
        onUpdate: () => setValue(Math.round(obj.v)),
      })
    }
    run()

    return () => {
      cancelled = true
    }
  }, [start, target, duration, delay])

  return { ref, value }
}

/** Tracks the active section id based on scroll position. */
export function useScrollSpy(ids: readonly string[], offset = 140): string {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    const onScroll = () => {
      let current = ids[0] ?? ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= offset) current = id
      }
      // Pin the last section when the page bottom is reached.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 80) {
        current = ids[ids.length - 1] ?? current
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids, offset])

  return active
}

/** Returns the scroll progress of the page as 0 → 1. */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return progress
}

/** Tracks pointer position relative to an element, as CSS custom properties. */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      el.style.setProperty('--my', `${e.clientY - rect.top}px`)
    }

    el.addEventListener('pointermove', onMove)
    return () => el.removeEventListener('pointermove', onMove)
  }, [])

  return ref
}
