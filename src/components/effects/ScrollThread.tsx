import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

type ScrollThreadProps = {
  pageRef: React.RefObject<HTMLElement | null>
  globeRef: React.RefObject<HTMLElement | null>
  footerEmailRef: React.RefObject<HTMLElement | null>
}

function buildThreadPath(
  pageEl: HTMLElement,
  globeEl: HTMLElement,
  emailEl: HTMLElement,
) {
  const pageTop = pageEl.getBoundingClientRect().top + window.scrollY
  const toPageY = (clientY: number) => clientY + window.scrollY - pageTop

  const globe = globeEl.getBoundingClientRect()
  const email = emailEl.getBoundingClientRect()

  const startX = globe.left + globe.width * 0.38
  const startY = toPageY(globe.top + globe.height * 0.58)
  const endX = email.left + email.width * 0.1
  const endY = toPageY(email.top + email.height * 0.55)

  const width = pageEl.offsetWidth
  const span = endY - startY

  const points = [
    { x: startX, y: startY },
    { x: width * 0.34, y: startY + span * 0.16 },
    { x: width * 0.8, y: startY + span * 0.34 },
    { x: width * 0.24, y: startY + span * 0.52 },
    { x: width * 0.72, y: startY + span * 0.7 },
    { x: width * 0.36, y: startY + span * 0.86 },
    { x: endX, y: endY },
  ]

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i]
    const p1 = points[i + 1]
    const cp1x = p0.x + (p1.x - p0.x) * 0.42
    const cp1y = p0.y + (p1.y - p0.y) * 0.12
    const cp2x = p0.x + (p1.x - p0.x) * 0.58
    const cp2y = p0.y + (p1.y - p0.y) * 0.88
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`
  }

  return d
}

/** Scroll-driven SVG thread from the hero globe to the footer contact email. */
export function ScrollThread({
  pageRef,
  globeRef,
  footerEmailRef,
}: ScrollThreadProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const [pathD, setPathD] = useState('')
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 })
  const progressRef = useRef(0)

  useLayoutEffect(() => {
    const page = pageRef.current
    const globe = globeRef.current
    const email = footerEmailRef.current
    const path = pathRef.current
    const dot = dotRef.current
    if (!page || !globe || !email || !path || !dot) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const refresh = () => {
      setPageSize({ width: page.offsetWidth, height: page.offsetHeight })
      setPathD(buildThreadPath(page, globe, email))
    }

    refresh()

    const updateDraw = () => {
      const length = path.getTotalLength()
      if (length <= 0) return
      const drawn = length * progressRef.current
      path.style.strokeDasharray = `${length}`
      path.style.strokeDashoffset = `${length - drawn}`

      const point = path.getPointAtLength(drawn)
      dot.setAttribute('cx', String(point.x))
      dot.setAttribute('cy', String(point.y))
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: page,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          progressRef.current = self.progress
          updateDraw()
        },
      })
    }, page)

    const observer = new ResizeObserver(() => {
      refresh()
      requestAnimationFrame(updateDraw)
    })
    observer.observe(page)
    observer.observe(globe)
    observer.observe(email)

    const onResize = () => {
      refresh()
      requestAnimationFrame(updateDraw)
    }

    window.addEventListener('resize', onResize)
    ScrollTrigger.addEventListener('refreshInit', refresh)

    if (reduced) {
      progressRef.current = 1
      updateDraw()
    } else {
      requestAnimationFrame(updateDraw)
    }

    return () => {
      ctx.revert()
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      ScrollTrigger.removeEventListener('refreshInit', refresh)
    }
  }, [pageRef, globeRef, footerEmailRef])

  if (!pathD || pageSize.height <= 0 || pageSize.width <= 0) return null

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 z-[3] hidden w-full overflow-visible lg:block"
      height={pageSize.height}
      viewBox={`0 0 ${pageSize.width} ${pageSize.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="scroll-thread-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9FFFB0" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#69C991" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#FF8FAB" stopOpacity="0.55" />
        </linearGradient>
        <filter id="scroll-thread-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="url(#scroll-thread-gradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
        filter="url(#scroll-thread-glow)"
      />

      <circle
        ref={dotRef}
        r="4"
        fill="#9FFFB0"
        stroke="#69C991"
        strokeWidth="1.5"
        filter="url(#scroll-thread-glow)"
      />
    </svg>
  )
}
