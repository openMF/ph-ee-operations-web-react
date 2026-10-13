import { useEffect, useRef } from 'react'
import { on } from '@/lib/events'

interface UseIdleTimerOptions {
  idleMs: number
  warnBeforeMs: number
  onWarn: () => void
  onIdle: () => void
}

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'touchstart', 'scroll'] as const

// Tracks inactivity independent of JWT expiry — driven by real user
// interaction (DOM events) and API activity (the 'activity' event emitted
// by the axios interceptors), not by the access token's exp claim.
export function useIdleTimer({ idleMs, warnBeforeMs, onWarn, onIdle }: UseIdleTimerOptions) {
  const warnTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Keep the latest callbacks in refs so `reset` doesn't need to change
  // identity every time a consumer passes a fresh inline function. Synced
  // in an effect, not during render, to avoid mutating a ref while rendering.
  const onWarnRef = useRef(onWarn)
  const onIdleRef = useRef(onIdle)
  useEffect(() => {
    onWarnRef.current = onWarn
    onIdleRef.current = onIdle
  }, [onWarn, onIdle])

  const reset = () => {
    if (warnTimeoutRef.current) clearTimeout(warnTimeoutRef.current)
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)

    const warnDelay = Math.max(idleMs - warnBeforeMs, 0)
    warnTimeoutRef.current = setTimeout(() => onWarnRef.current(), warnDelay)
    idleTimeoutRef.current = setTimeout(() => onIdleRef.current(), idleMs)
  }

  useEffect(() => {
    reset()

    const handleActivity = () => reset()
    for (const type of ACTIVITY_EVENTS) {
      window.addEventListener(type, handleActivity, { passive: true })
    }
    const unsubscribeActivity = on('activity', handleActivity)

    return () => {
      if (warnTimeoutRef.current) clearTimeout(warnTimeoutRef.current)
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
      for (const type of ACTIVITY_EVENTS) {
        window.removeEventListener(type, handleActivity)
      }
      unsubscribeActivity()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idleMs, warnBeforeMs])

  return { reset }
}
