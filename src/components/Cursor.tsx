import { useEffect, useRef, useState } from 'react'
import { useIsDesktop } from '@/hooks/useMediaQuery'

/**
 * A two-part custom cursor: an instant dot and a lagging ring that
 * swells over interactive elements.
 *
 * An optional label (from `data-cursor`) rides below the ring in its own
 * pill so it never collides with the content underneath.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState<'default' | 'hover' | 'text'>('default')
  const [label, setLabel] = useState('')
  const isDesktop = useIsDesktop()

  useEffect(() => {
    if (!isDesktop) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let raf = 0

    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      setVisible(true)
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
    }

    const onLeave = () => setVisible(false)

    const loop = () => {
      ringX += (mouseX - ringX) * 0.16
      ringY += (mouseY - ringY) * 0.16
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, 40px)`
      }
      raf = requestAnimationFrame(loop)
    }

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement
      const labelled = target.closest('[data-cursor]')
      if (labelled) {
        const custom = labelled.getAttribute('data-cursor') ?? ''
        if (custom === 'none') {
          setMode('hover')
          setLabel('')
        } else {
          setMode(custom === 'text' ? 'text' : 'hover')
          setLabel(custom && custom !== 'text' ? custom : '')
        }
        return
      }
      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select'
      )
      if (interactive) {
        setMode('hover')
        setLabel('')
      } else {
        setMode('default')
        setLabel('')
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [isDesktop])

  if (!isDesktop) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[150] hidden lg:block"
      style={{ cursor: 'none' }}
    >
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-amber-300"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.25s',
          boxShadow: '0 0 12px rgba(251,191,36,0.9)',
        }}
      />

      <div
        ref={ringRef}
        className="absolute left-0 top-0 rounded-full border"
        style={{
          width: mode === 'hover' ? 48 : 32,
          height: mode === 'hover' ? 48 : 32,
          opacity: visible ? 1 : 0,
          borderColor:
            mode === 'hover' ? 'rgba(251,191,36,0.9)' : 'rgba(255,255,255,0.35)',
          backgroundColor:
            mode === 'hover' ? 'rgba(251,191,36,0.08)' : 'transparent',
          transition:
            'width 0.35s cubic-bezier(0.22,1,0.36,1), height 0.35s cubic-bezier(0.22,1,0.36,1), border-color 0.3s, background-color 0.3s, opacity 0.25s',
        }}
      />

      {label && (
        <div
          ref={labelRef}
          className="absolute left-0 top-0 whitespace-nowrap rounded-md border border-amber-400/40 bg-void/95 px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.18em] text-amber-200 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.95)] backdrop-blur-sm"
        >
          {label}
        </div>
      )}
    </div>
  )
}
