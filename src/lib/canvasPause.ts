type Listener = () => void

let paused = false
const listeners = new Set<Listener>()

/**
 * Pauses background canvas loops while the Why Us horizontal pin is active.
 * Keeps scroll-linked sections at 60fps on lower-end devices.
 */
export function setCanvasPaused(value: boolean) {
  if (paused === value) return
  paused = value
  listeners.forEach((listener) => listener())
}

export function isCanvasPaused() {
  return paused
}

export function subscribeCanvasPause(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
