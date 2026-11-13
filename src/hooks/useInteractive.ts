import { useCallback, useEffect, useRef, useState } from 'react'

type Options = {
  /** How long a tap keeps the effect alive on touch devices. */
  duration?: number
}

/**
 * Touch-aware hover state.
 *
 * On a fine pointer (mouse/trackpad) this is plain hover behaviour.
 * On a coarse pointer (phone/tablet) the same effect is triggered by a
 * tap and auto-releases after `duration` — so every hover effect on the
 * site is reachable without a mouse.
 */
export function useInteractive({ duration = 2600 }: Options = {}) {
  const [active, setActive] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const clear = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current)
      timer.current = undefined
    }
  }, [])

  useEffect(() => clear, [clear])

  const activate = useCallback(() => {
    clear()
    setActive(true)
  }, [clear])

  const deactivate = useCallback(() => {
    clear()
    setActive(false)
  }, [clear])

  const onPointerEnter = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      activate()
    },
    [activate]
  )

  const onPointerLeave = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      deactivate()
    },
    [deactivate]
  )

  /** Tap toggles the effect and auto-releases it. */
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse') return
      clear()
      setActive((v) => {
        if (!v) {
          timer.current = window.setTimeout(() => setActive(false), duration)
        }
        return !v
      })
    },
    [clear, duration]
  )

  const onClick = useCallback((e: React.MouseEvent) => {
    // Mouse clicks are handled by hover; only touch needs the toggle.
    if (e.detail === 0) return
  }, [])

  return {
    active,
    handlers: {
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      onClick,
    },
  }
}
