import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../../lib/gsap'

type Point = { x: number; y: number }
type PageSize = { width: number; height: number }
type GlobeBounds = {
  left: number
  right: number
  top: number
  bottom: number
  width: number
  height: number
}

const PAGE_ROOT_SELECTOR = '[data-page-root]'
const GLOBE_SELECTOR = '[data-hero-globe]'
const ENTRY_SELECTOR = '[data-thread-entry]'

/** Magenta filament — chromatic opposite of the site green. */
const THREAD = {
  track: 'rgba(240, 171, 252, 0.14)',
  stroke: '#F0ABFC',
  dotFill: '#FAE8FF',
  dotStroke: '#D946EF',
  originGlow: 'rgba(217, 70, 239, 0.42)',
  originCore: 'rgba(244, 114, 182, 0.55)',
} as const

function getPageRoot() {
  return document.querySelector<HTMLElement>(PAGE_ROOT_SELECTOR)
}

function getAnchors() {
  return {
    page: getPageRoot(),
    globe: document.querySelector<HTMLElement>(GLOBE_SELECTOR),
    entry: document.querySelector<HTMLElement>(ENTRY_SELECTOR),
    email: document.getElementById('footer-contact-email'),
  }
}

function toPageCoords(
  pageEl: HTMLElement,
  targetEl: HTMLElement,
  anchorX: number,
  anchorY: number,
): Point {
  const pageRect = pageEl.getBoundingClientRect()
  const targetRect = targetEl.getBoundingClientRect()

  return {
    x: targetRect.left - pageRect.left + targetRect.width * anchorX,
    y: targetRect.top - pageRect.top + targetRect.height * anchorY,
  }
}

function getGlobeBounds(pageEl: HTMLElement, globeEl: HTMLElement): GlobeBounds {
  const pageRect = pageEl.getBoundingClientRect()
  const globeRect = globeEl.getBoundingClientRect()

  return {
    left: globeRect.left - pageRect.left,
    right: globeRect.right - pageRect.left,
    top: globeRect.top - pageRect.top,
    bottom: globeRect.bottom - pageRect.top,
    width: globeRect.width,
    height: globeRect.height,
  }
}

/** Smooth open spline — duplicated endpoints give gentle start/end tangents. */
function catmullRomPath(points: Point[], tension = 1): string {
  if (points.length === 0) return ''
  if (points.length === 1) {
    return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
  }

  const padded = [points[0], ...points, points[points.length - 1]]
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
  const t = tension / 6

  for (let i = 1; i < padded.length - 2; i += 1) {
    const p0 = padded[i - 1]
    const p1 = padded[i]
    const p2 = padded[i + 1]
    const p3 = padded[i + 2]

    const cp1x = p1.x + (p2.x - p0.x) * t
    const cp1y = p1.y + (p2.y - p0.y) * t
    const cp2x = p2.x - (p3.x - p1.x) * t
    const cp2y = p2.y - (p3.y - p1.y) * t

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }

  return d
}

function buildSwingPath(
  pageEl: HTMLElement,
  globeEl: HTMLElement,
  entryEl: HTMLElement,
  emailEl: HTMLElement | null,
  pageHeight: number,
): { d: string; origin: Point } {
  const width = pageEl.clientWidth
  const narrow = width < 640
  const tablet = width < 1024
  const globe = getGlobeBounds(pageEl, globeEl)
  const entry = toPageCoords(pageEl, entryEl, 0, 0.5)
  const end = emailEl
    ? toPageCoords(pageEl, emailEl, 0.02, 0.5)
    : { x: width * 0.12, y: pageHeight - 96 }

  const offLeft = narrow ? -28 : tablet ? -52 : -68
  const offRight = width + (narrow ? 28 : tablet ? 52 : 68)
  const span = Math.max(end.y - entry.y, 220)

  const origin: Point = {
    x: globe.left + globe.width * 0.14,
    y: globe.top + globe.height * 0.56,
  }

  const waypoints: Point[] = [
    origin,
    // peel off the globe toward the left edge
    {
      x: globe.left + globe.width * 0.02,
      y: globe.top + globe.height * 0.72,
    },
    // arc outside the left viewport
    {
      x: offLeft + (narrow ? 16 : 32),
      y: origin.y + (entry.y - origin.y) * 0.22,
    },
    {
      x: offLeft,
      y: origin.y + (entry.y - origin.y) * 0.48,
    },
    // swing back in at the section entry
    {
      x: width * (narrow ? 0.22 : 0.16),
      y: entry.y - (narrow ? 16 : 24),
    },
    {
      x: entry.x + (narrow ? 8 : 14),
      y: entry.y,
    },
  ]

  const swingCount = narrow ? 3 : tablet ? 4 : 5
  for (let i = 0; i < swingCount; i += 1) {
    const phase = (i + 1) / (swingCount + 0.5)
    const y = entry.y + span * (0.1 + phase * 0.78)
    const exitRight = i % 2 === 0

    waypoints.push({
      x: exitRight ? offRight : offLeft,
      y,
    })
  }

  waypoints.push(
    {
      x: end.x + (narrow ? 56 : 80),
      y: end.y - (narrow ? 48 : 72),
    },
    {
      x: end.x + (narrow ? 10 : 16),
      y: end.y - (narrow ? 12 : 18),
    },
    end,
  )

  return { d: catmullRomPath(waypoints, 1.2), origin }
}

function measurePage(page: HTMLElement): PageSize {
  return {
    width: Math.max(page.clientWidth, 1),
    height: Math.max(page.scrollHeight, page.offsetHeight, page.clientHeight, 1),
  }
}

function sameSize(a: PageSize, b: PageSize) {
  return a.width === b.width && a.height === b.height
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/** Scroll-driven magenta filament that swings in and out of the viewport. */
export function ScrollThread() {
  const location = useLocation()
  const pathRef = useRef<SVGPathElement>(null)
  const trackRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const originGlowRef = useRef<SVGCircleElement>(null)
  const originCoreRef = useRef<SVGCircleElement>(null)
  const progressRef = useRef(0)
  const pathLengthRef = useRef(0)
  const pathDRef = useRef('')
  const originRef = useRef<Point>({ x: 0, y: 0 })
  const pageSizeRef = useRef<PageSize>({ width: 0, height: 0 })

  const [pageEl, setPageEl] = useState<HTMLElement | null>(null)
  const [pathD, setPathD] = useState('')
  const [origin, setOrigin] = useState<Point>({ x: 0, y: 0 })
  const [pageSize, setPageSize] = useState<PageSize>({ width: 0, height: 0 })

  useEffect(() => {
    progressRef.current = 0
    pathLengthRef.current = 0
    pathDRef.current = ''
    pageSizeRef.current = { width: 0, height: 0 }
    originRef.current = { x: 0, y: 0 }
    setPageEl(null)
    setPathD('')
    setOrigin({ x: 0, y: 0 })
    setPageSize({ width: 0, height: 0 })
    ScrollTrigger.getById('scroll-thread')?.kill()

    let disposed = false
    let rafId = 0
    let attempts = 0

    const resolvePage = () => {
      if (disposed) return
      const page = getPageRoot()
      if (page) {
        setPageEl(page)
        return
      }

      attempts += 1
      if (attempts < 120) {
        rafId = requestAnimationFrame(resolvePage)
      }
    }

    resolvePage()

    return () => {
      disposed = true
      cancelAnimationFrame(rafId)
      ScrollTrigger.getById('scroll-thread')?.kill()
    }
  }, [location.key])

  const updateDraw = useCallback(() => {
    const path = pathRef.current
    const dot = dotRef.current
    if (!path || !dot) return

    const length = path.getTotalLength()
    if (!Number.isFinite(length) || length <= 0) return

    pathLengthRef.current = length

    const progress = clamp(progressRef.current, 0, 1)
    const drawn = length * progress

    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length - drawn}`

    const point = path.getPointAtLength(drawn)
    dot.setAttribute('cx', String(point.x))
    dot.setAttribute('cy', String(point.y))

    const fadeIn = clamp(progress / 0.04, 0, 1)
    const fadeOut = progress >= 0.96 ? clamp(1 - (progress - 0.96) / 0.04, 0, 1) : 1
    const visibility = fadeIn * fadeOut

    dot.style.opacity = String(visibility)
    path.style.opacity = String(0.88 * visibility)
    trackRef.current?.setAttribute('opacity', String(visibility * 0.85))
    originGlowRef.current?.setAttribute('opacity', String(visibility * 0.9))
    originCoreRef.current?.setAttribute('opacity', String(visibility))
  }, [])

  useLayoutEffect(() => {
    if (!pageEl) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let disposed = false
    let retryId = 0
    let resizeId = 0
    let refreshId = 0
    let retries = 0

    const syncProgress = () => {
      const trigger = ScrollTrigger.getById('scroll-thread')
      if (trigger) {
        progressRef.current = trigger.progress
      }
      updateDraw()
    }

    const applyLayout = () => {
      const { globe, entry, email } = getAnchors()
      if (!globe || !entry) return false

      const size = measurePage(pageEl)
      if (size.width <= 0 || size.height <= 80) return false

      const built = buildSwingPath(pageEl, globe, entry, email, size.height)
      if (!built.d || built.d.length < 8) return false

      const sizeChanged = !sameSize(pageSizeRef.current, size)
      const pathChanged = pathDRef.current !== built.d

      if (sizeChanged) {
        pageSizeRef.current = size
        setPageSize(size)
      }

      if (pathChanged) {
        pathDRef.current = built.d
        originRef.current = built.origin
        setPathD(built.d)
        setOrigin(built.origin)
      }

      if (sizeChanged || pathChanged) {
        window.clearTimeout(refreshId)
        refreshId = window.setTimeout(() => {
          if (disposed) return
          ScrollTrigger.refresh()
          syncProgress()
        }, 100)
      } else {
        syncProgress()
      }

      return true
    }

    const retryApply = () => {
      if (disposed) return
      if (applyLayout()) return

      retries += 1
      if (retries < 80) {
        retryId = window.setTimeout(retryApply, 80)
      }
    }

    retryApply()

    const ctx = gsap.context(() => {
      ScrollTrigger.getById('scroll-thread')?.kill()

      ScrollTrigger.create({
        id: 'scroll-thread',
        trigger: pageEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progressRef.current = self.progress
          updateDraw()
        },
      })
    }, pageEl)

    requestAnimationFrame(() => {
      if (disposed) return
      ScrollTrigger.refresh()
      syncProgress()
    })

    const settleId = window.setTimeout(() => {
      if (disposed) return
      ScrollTrigger.refresh()
      syncProgress()
    }, 180)

    const observer = new ResizeObserver(() => {
      window.clearTimeout(resizeId)
      resizeId = window.setTimeout(() => {
        if (disposed) return
        applyLayout()
      }, 120)
    })
    observer.observe(pageEl)

    const { globe, entry, email } = getAnchors()
    if (globe) observer.observe(globe)
    if (entry) observer.observe(entry)
    if (email) observer.observe(email)

    if (reduced) {
      progressRef.current = 1
      updateDraw()
    }

    return () => {
      disposed = true
      window.clearTimeout(retryId)
      window.clearTimeout(resizeId)
      window.clearTimeout(refreshId)
      window.clearTimeout(settleId)
      ctx.revert()
      observer.disconnect()
    }
  }, [pageEl, updateDraw, location.key])

  useLayoutEffect(() => {
    if (!pathD) return
    ScrollTrigger.refresh()
    const trigger = ScrollTrigger.getById('scroll-thread')
    progressRef.current = trigger?.progress ?? 0
    updateDraw()
  }, [pathD, updateDraw])

  if (!pageEl) return null

  const width = pageSize.width || pageEl.clientWidth || 1
  const height = pageSize.height || Math.max(pageEl.scrollHeight, pageEl.clientHeight, 1)
  const originPoint = origin.x > 0 ? origin : originRef.current
  const originRadius = width < 640 ? 18 : 24

  const svg = (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible mix-blend-screen"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      data-scroll-thread
    >
      <defs>
        <radialGradient id="thread-origin-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={THREAD.originCore} />
          <stop offset="55%" stopColor={THREAD.originGlow} />
          <stop offset="100%" stopColor={THREAD.originGlow} stopOpacity="0" />
        </radialGradient>
      </defs>

      {pathD ? (
        <>
          <circle
            ref={originGlowRef}
            cx={originPoint.x}
            cy={originPoint.y}
            r={originRadius * 1.35}
            fill="url(#thread-origin-glow)"
            opacity="0"
          />
          <circle
            ref={originCoreRef}
            cx={originPoint.x}
            cy={originPoint.y}
            r={originRadius * 0.28}
            fill={THREAD.dotFill}
            stroke={THREAD.dotStroke}
            strokeWidth="1"
            opacity="0"
          />

          <path
            ref={trackRef}
            d={pathD}
            fill="none"
            stroke={THREAD.track}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0"
          />

          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke={THREAD.stroke}
            strokeWidth={width < 640 ? 2 : 1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0"
          />

          <circle
            ref={dotRef}
            r="5"
            fill={THREAD.dotFill}
            stroke={THREAD.dotStroke}
            strokeWidth="1.5"
            style={{ opacity: 0 }}
          />
        </>
      ) : null}
    </svg>
  )

  return createPortal(svg, pageEl)
}
