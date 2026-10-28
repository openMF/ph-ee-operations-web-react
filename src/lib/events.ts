// Tiny typed event bus bridging non-React modules (axios interceptors)
// back into the React tree — e.g. a 403 response has no React context to
// navigate/toast from, so it emits an event a component can subscribe to.
export type AppEventType = 'forbidden' | 'activity'

const target = new EventTarget()

export function emit(type: AppEventType) {
  target.dispatchEvent(new Event(type))
}

export function on(type: AppEventType, handler: () => void): () => void {
  target.addEventListener(type, handler)
  return () => target.removeEventListener(type, handler)
}
