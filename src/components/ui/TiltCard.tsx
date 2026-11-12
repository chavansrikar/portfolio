import { useRef } from 'react'
import type { ReactNode } from 'react'
import { useIsDesktop } from '@/hooks/useMediaQuery'

type Props = {
  children: ReactNode
  className?: string
  max?: number
  glare?: boolean
}

/**
 * 3D tilt-on-hover card with an optional glare layer that tracks the pointer.
 */
export function TiltCard({ children, className = '', max = 9, glare = true }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isDesktop = useIsDesktop()

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDesktop) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height

    el.style.setProperty('--rx', `${(0.5 - py) * max * 2}deg`)
    el.style.setProperty('--ry', `${(px - 0.5) * max * 2}deg`)
    el.style.setProperty('--gx', `${px * 100}%`)
    el.style.setProperty('--gy', `${py * 100}%`)
  }

  const handleLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--gx', '50%')
    el.style.setProperty('--gy', '50%')
  }

  return (
    <div className="perspective">
      <div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className={`preserve-3d relative transition-transform duration-300 ease-out will-change-transform ${className}`}
        style={{
          transform:
            'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateZ(0)',
        }}
      >
        {children}
        {glare && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 hover:opacity-100"
            style={{
              background:
                'radial-gradient(600px circle at var(--gx,50%) var(--gy,50%), rgba(34,211,238,0.14), transparent 60%)',
            }}
          />
        )}
      </div>
    </div>
  )
}
