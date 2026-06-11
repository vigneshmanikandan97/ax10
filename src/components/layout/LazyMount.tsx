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
    return () => observer.disconnect()
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
