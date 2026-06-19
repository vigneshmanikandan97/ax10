import { useEffect, useRef, useState, type ReactNode } from 'react'

type LazyMountProps = {
  children: ReactNode
  className?: string
  rootMargin?: string
  minHeight?: string
  fallback?: ReactNode
}

/** Renders children only when the placeholder nears the viewport. */
export function LazyMount({
  children,
  className = '',
  rootMargin = '240px 0px',
  minHeight = 'min-h-[50vh]',
  fallback,
}: LazyMountProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold: 0.01 },
    )

    observer.observe(host)

    // Fallback: mount during idle even if never scrolled into view, so the page
    // settles to its final height shortly after load. Scroll-driven effects
    // (ScrollThread) then build stable geometry once instead of jittering as
    // sections mount mid-scroll. Children still gate their own heavy work
    // (canvas loops) via internal IntersectionObservers, so idle mount only
    // adds cheap DOM.
    const idleWindow = window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    let idleId = 0
    let timeoutId = 0
    const mountNow = () => {
      setVisible(true)
      observer.disconnect()
    }
    if (typeof idleWindow.requestIdleCallback === 'function') {
      idleId = idleWindow.requestIdleCallback(mountNow, { timeout: 2000 })
    } else {
      timeoutId = window.setTimeout(mountNow, 1200)
    }

    return () => {
      observer.disconnect()
      if (idleId && idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(idleId)
      window.clearTimeout(timeoutId)
    }
  }, [rootMargin])

  return (
    <div ref={hostRef} className={className}>
      {visible ? (
        children
      ) : (
        fallback ?? <div className={minHeight} aria-hidden="true" />
      )}
    </div>
  )
}
