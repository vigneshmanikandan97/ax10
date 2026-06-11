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
const SECTION_SELECTOR = '#what-we-do'
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
    section: document.querySelector<HTMLElement>(SECTION_SELECTOR),
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

function pickBounceCount(width: number): 1 | 2 {
  return width >= 900 ? 2 : 1
}

function appendCurveSegment(d: string, p0: Point, p1: Point) {
  const cp1x = p0.x + (p1.x - p0.x) * 0.42 + Math.sin(p0.y * 0.04) * 1.2
  const cp1y = p0.y + (p1.y - p0.y) * 0.08
  const cp2x = p0.x + (p1.x - p0.x) * 0.58
  const cp2y = p0.y + (p1.y - p0.y) * 0.9 + Math.cos(p1.x * 0.03) * 0.8
  return `${d} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`
}

function buildGlobeFilament(
  globe: GlobeBounds,
  sectionTop: number,
  narrow: boolean,
): { points: Point[]; origin: Point } {
  const margin = narrow ? 20 : 32
  const origin: Point = {
    x: globe.left + globe.width * 0.1,
    y: globe.top + globe.height * 0.62,
  }

  const exitLeft: Point = {
    x: globe.left - margin,
    y: globe.top + globe.height * 0.66,
  }

  const bendDown: Point = {
    x: globe.left - margin - (narrow ? 8 : 14),
    y: sectionTop + (narrow ? 28 : 40),
  }

  return {
    origin,
    points: [origin, exitLeft, bendDown],
  }
}

function buildSectionRoute(
  entry: Point,
  end: Point,
  width: number,
  narrow: boolean,
): Point[] {
  const lane = (pct: number) => width * pct
  const bounceCount = pickBounceCount(width)
  const span = Math.max(end.y - entry.y, 160)
  const points: Point[] = [
    { x: entry.x + (narrow ? 8 : 12), y: entry.y + span * 0.06 },
    { x: lane(narrow ? 0.14 : 0.1), y: entry.y + span * 0.18 },
  ]

  if (bounceCount === 2) {
    points.push(
      { x: lane(0.82), y: entry.y + span * 0.28 },
      { x: lane(0.48), y: entry.y + span * 0.42 },
      { x: lane(0.88), y: entry.y + span * 0.56 },
      { x: lane(0.44), y: entry.y + span * 0.7 },
      { x: lane(0.78), y: entry.y + span * 0.84 },
    )
  } else {
    points.push(
      { x: lane(0.84), y: entry.y + span * 0.34 },
      { x: lane(0.46), y: entry.y + span * 0.54 },
      { x: lane(0.8), y: entry.y + span * 0.74 },
    )
  }

  points.push(
    { x: end.x + (narrow ? 24 : 40), y: end.y - (narrow ? 32 : 48) },
    end,
  )

  return points
}

function buildThreadPath(
  pageEl: HTMLElement,
  globeEl: HTMLElement,
  sectionEl: HTMLElement,
  entryEl: HTMLElement,
  emailEl: HTMLElement | null,
  pageHeight: number,
) {
  const width = pageEl.clientWidth
  const narrow = width < 1024
  const globe = getGlobeBounds(pageEl, globeEl)
  const sectionTop = toPageCoords(pageEl, sectionEl, 0, 0).y
  const entry = toPageCoords(pageEl, entryEl, 0, 0.5)
  const end = emailEl
    ? toPageCoords(pageEl, emailEl, 0.02, 0.5)
    : { x: width * 0.1, y: pageHeight - 96 }

  const { origin, points: filament } = buildGlobeFilament(globe, sectionTop, narrow)
  const routePoints = buildSectionRoute(entry, end, width, narrow)

  let d = `M ${origin.x.toFixed(1)} ${origin.y.toFixed(1)}`

  for (let i = 0; i < filament.length - 1; i += 1) {
    const p0 = filament[i]
    const p1 = filament[i + 1]
    d = appendCurveSegment(d, p0, p1)
  }

  d = appendCurveSegment(d, filament[filament.length - 1], entry)

  for (let i = 0; i < routePoints.length; i += 1) {
    const p0 = i === 0 ? entry : routePoints[i - 1]
    d = appendCurveSegment(d, p0, routePoints[i])
  }

  return { d, origin }
}

function measurePage(page: HTMLElement): PageSize {
  return {
    width: Math.max(page.clientWidth, 1),
    height: Math.max(page.scrollHeight, page.offsetHeight, page.clientHeight, 1),
  }
}

function dotOpacityForProgress(progress: number) {
  if (progress <= 0.005) return 0
  if (progress >= 0.92) {
    return Math.max(0, 1 - (progress - 0.92) / 0.08)
  }
  return 1
}

function sameSize(a: PageSize, b: PageSize) {
  return a.width === b.width && a.height === b.height
}

/** Scroll-driven magenta filament from the hero globe into What We Do, ending at the footer email. */
export function ScrollThread() {
  const location = useLocation()
  const pathRef = useRef<SVGPathElement>(null)
  const trackRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const originGlowRef = useRef<SVGCircleElement>(null)
  const originCoreRef = useRef<SVGCircleElement>(null)
  const progressRef = useRef(0)
  const pathDRef = useRef('')
  const originRef = useRef<Point>({ x: 0, y: 0 })
  const pageSizeRef = useRef<PageSize>({ width: 0, height: 0 })

  const [pageEl, setPageEl] = useState<HTMLElement | null>(null)
  const [pathD, setPathD] = useState('')
  const [origin, setOrigin] = useState<Point>({ x: 0, y: 0 })
  const [pageSize, setPageSize] = useState<PageSize>({ width: 0, height: 0 })

  useEffect(() => {
    progressRef.current = 0
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

    const drawn = length * progressRef.current
    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${Math.max(0, length - drawn)}`

    const point = path.getPointAtLength(drawn)
    dot.setAttribute('cx', String(point.x))
    dot.setAttribute('cy', String(point.y))
    dot.style.opacity = String(dotOpacityForProgress(progressRef.current))
    path.style.opacity = String(
      progressRef.current >= 0.9
        ? Math.max(0.35, 1 - ((progressRef.current - 0.9) / 0.1) * 0.45)
        : 0.88,
    )

    const originOpacity =
      progressRef.current <= 0.005
        ? 0
        : Math.min(1, progressRef.current * 4) *
          (progressRef.current >= 0.92
            ? Math.max(0, 1 - (progressRef.current - 0.92) / 0.08)
            : 1)

    originGlowRef.current?.setAttribute('opacity', String(originOpacity * 0.9))
    originCoreRef.current?.setAttribute('opacity', String(originOpacity))
    trackRef.current?.setAttribute(
      'opacity',
      String(progressRef.current <= 0.005 ? 0 : 1),
    )
  }, [])

  useLayoutEffect(() => {
    if (!pageEl) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let disposed = false
    let rafId = 0
    let retryId = 0
    let resizeId = 0
    let scrollRefreshId = 0
    let retries = 0

    const syncProgress = () => {
      const trigger = ScrollTrigger.getById('scroll-thread')
      progressRef.current = trigger?.progress ?? 0
      updateDraw()
    }

    const applyLayout = () => {
      const { globe, section, entry, email } = getAnchors()
      if (!globe || !section || !entry) return false

      const size = measurePage(pageEl)
      if (size.width <= 0 || size.height <= 80) return false

      const built = buildThreadPath(pageEl, globe, section, entry, email, size.height)
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
        window.clearTimeout(scrollRefreshId)
        scrollRefreshId = window.setTimeout(() => {
          if (disposed) return
          ScrollTrigger.refresh()
          syncProgress()
        }, 120)
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

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(syncProgress)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return
      ScrollTrigger.refresh()
      syncProgress()
    }

    window.addEventListener('pageshow', onPageShow)

    const ctx = gsap.context(() => {
      ScrollTrigger.getById('scroll-thread')?.kill()

      const section = document.querySelector<HTMLElement>(SECTION_SELECTOR)

      ScrollTrigger.create({
        id: 'scroll-thread',
        trigger: section ?? pageEl,
        start: 'top 80%',
        endTrigger: pageEl,
        end: 'bottom bottom',
        scrub: 0.2,
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
      }, 80)
    })
    observer.observe(pageEl)

    const { globe, section, entry, email } = getAnchors()
    if (globe) observer.observe(globe)
    if (section) observer.observe(section)
    if (entry) observer.observe(entry)
    if (email) observer.observe(email)

    if (reduced) {
      progressRef.current = 1
      updateDraw()
    }

    return () => {
      disposed = true
      cancelAnimationFrame(rafId)
      window.clearTimeout(retryId)
      window.clearTimeout(resizeId)
      window.clearTimeout(scrollRefreshId)
      window.clearTimeout(settleId)
      ctx.revert()
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('pageshow', onPageShow)
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
            opacity="0.88"
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
