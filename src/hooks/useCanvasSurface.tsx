import { useEffect, useRef, type RefObject } from 'react'

type DrawFn = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  dpr: number,
) => void

export type CanvasSurfaceOptions = {
  /** Cap internal buffer edge length (px). Lower = less GPU/CPU per frame. */
  maxBufferEdge?: number
  /** Target draw rate while animating. */
  maxFps?: number
  /** Skip draws while the user is scrolling to keep interactions responsive. */
  pauseOnScroll?: boolean
  /** Gate the draw loop without unmounting the canvas. */
  enabled?: boolean
}

const DEFAULT_MAX_BUFFER_EDGE = 960
const DEFAULT_MAX_FPS = 60
const SCROLL_IDLE_MS = 140

function measureElement(element: Element) {
  const rect = element.getBoundingClientRect()
  return {
    width: Math.max(1, Math.round(rect.width), Math.round(element.clientWidth)),
    height: Math.max(
      1,
      Math.round(rect.height),
      Math.round(element.clientHeight),
      Math.round(element.scrollHeight),
    ),
  }
}

/** Canvas RAF loop sized to a container element. */
export function useCanvasSurface(
  draw: DrawFn,
  containerRef: RefObject<HTMLElement | null>,
  className = '',
  options: CanvasSurfaceOptions = {},
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawRef = useRef(draw)
  const optionsRef = useRef(options)
  drawRef.current = draw
  optionsRef.current = options

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true,
    })
    if (!ctx) return

    let raf = 0
    let bufferWidth = 0
    let bufferHeight = 0
    let visible = true
    let scrolling = false
    let scrollIdleTimer = 0
    let lastDraw = 0

    const resize = () => {
      const { width: layoutWidth, height: layoutHeight } = measureElement(container)
      if (layoutWidth <= 0 || layoutHeight <= 0) return

      const maxEdge =
        optionsRef.current.maxBufferEdge ?? DEFAULT_MAX_BUFFER_EDGE
      const scale = Math.min(1, maxEdge / Math.max(layoutWidth, layoutHeight))
      bufferWidth = Math.max(1, Math.round(layoutWidth * scale))
      bufferHeight = Math.max(1, Math.round(layoutHeight * scale))

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = bufferWidth * dpr
      canvas.height = bufferHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingEnabled = true
    }

    const onScroll = () => {
      if (!optionsRef.current.pauseOnScroll) return
      scrolling = true
      window.clearTimeout(scrollIdleTimer)
      scrollIdleTimer = window.setTimeout(() => {
        scrolling = false
      }, SCROLL_IDLE_MS)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(container)
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    requestAnimationFrame(resize)

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true
        if (visible) resize()
      },
      { threshold: 0.2 },
    )
    visibilityObserver.observe(container)

    const loop = (time: number) => {
      const maxFps = optionsRef.current.maxFps ?? DEFAULT_MAX_FPS
      const frameInterval = 1000 / maxFps
      const enabled = optionsRef.current.enabled ?? true
      const canDraw =
        enabled &&
        visible &&
        !scrolling &&
        bufferWidth > 0 &&
        bufferHeight > 0 &&
        time - lastDraw >= frameInterval

      if (canDraw) {
        drawRef.current(
          ctx,
          bufferWidth,
          bufferHeight,
          time,
          Math.min(window.devicePixelRatio || 1, 2),
        )
        lastDraw = time
      }
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(scrollIdleTimer)
      observer.disconnect()
      visibilityObserver.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [containerRef])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 block h-full w-full overflow-visible ${className}`}
      aria-hidden="true"
    />
  )
}
