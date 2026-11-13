import { useEffect, useState } from 'react'

/**
 * Tracks the active section id based on scroll position.
 * The last section stays active once the page bottom is reached.
 */
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
