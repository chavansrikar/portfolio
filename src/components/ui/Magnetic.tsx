import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useIsDesktop } from '@/hooks/useMediaQuery'

type Props = {
  children: ReactNode
  className?: string
  strength?: number
  radius?: number
}

/**
 * Magnetic hover — the element leans toward the cursor while inside it.
 * Falls back to a plain wrapper on touch devices.
 */
export function Magnetic({ children, className = '', strength = 0.32, radius = 1 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isDesktop = useIsDesktop()

  useEffect(() => {
    if (!isDesktop) return
    const el = ref.current
    if (!el) return

    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let active = false

    const loop = () => {
      cx += (tx - cx) * 0.18
      cy += (ty - cy) * 0.18
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1 || active) {
        raf = requestAnimationFrame(loop)
      } else {
        raf = 0
      }
    }

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const relX = e.clientX - (rect.left + rect.width / 2)
      const relY = e.clientY - (rect.top + rect.height / 2)
      tx = relX * strength * radius
      ty = relY * strength * radius
      active = true
      if (!raf) raf = requestAnimationFrame(loop)
    }

    const onLeave = () => {
      tx = 0
      ty = 0
      active = false
      if (!raf) raf = requestAnimationFrame(loop)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [isDesktop, strength, radius])

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  )
}
