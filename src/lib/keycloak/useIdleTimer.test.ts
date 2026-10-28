import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useIdleTimer } from './useIdleTimer'

describe('useIdleTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('fires onWarn at idleMs - warnBeforeMs without yet firing onIdle', () => {
    const onWarn = vi.fn()
    const onIdle = vi.fn()

    renderHook(() => useIdleTimer({ idleMs: 1000, warnBeforeMs: 300, onWarn, onIdle }))

    act(() => {
      vi.advanceTimersByTime(700)
    })

    expect(onWarn).toHaveBeenCalledTimes(1)
    expect(onIdle).not.toHaveBeenCalled()
  })

  it('fires onIdle once the full idle duration elapses', () => {
    const onWarn = vi.fn()
    const onIdle = vi.fn()

    renderHook(() => useIdleTimer({ idleMs: 1000, warnBeforeMs: 300, onWarn, onIdle }))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(onIdle).toHaveBeenCalledTimes(1)
  })

  it('restarts the clock when reset() is called', () => {
    const onWarn = vi.fn()
    const onIdle = vi.fn()

    const { result } = renderHook(() => useIdleTimer({ idleMs: 1000, warnBeforeMs: 300, onWarn, onIdle }))

    act(() => {
      vi.advanceTimersByTime(600)
      result.current.reset()
      vi.advanceTimersByTime(600)
    })

    // 1200ms of real elapsed time, but reset() at 600ms means only 600ms
    // has passed since the last reset — under the 700ms warn threshold.
    expect(onWarn).not.toHaveBeenCalled()
  })

  it('resets on a tracked DOM activity event', () => {
    const onWarn = vi.fn()
    const onIdle = vi.fn()

    renderHook(() => useIdleTimer({ idleMs: 1000, warnBeforeMs: 300, onWarn, onIdle }))

    act(() => {
      vi.advanceTimersByTime(600)
      window.dispatchEvent(new Event('keydown'))
      vi.advanceTimersByTime(600)
    })

    expect(onWarn).not.toHaveBeenCalled()
  })
})
