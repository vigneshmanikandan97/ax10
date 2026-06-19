import { useEffect, useRef } from 'react'
import { isCanvasPaused, subscribeCanvasPause } from '../lib/canvasPause'

type DrawFn = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  dpr: number,
) => void

const MAX_BUFFER_EDGE = 960
// Decorative section backdrops don't need more than ~48fps; cap so high-refresh
// (120/144Hz) displays don't burn frames redrawing them every vsync.
const MAX_FPS = 48

function measureHost(host: Element) {
  const section = host.closest('section')
  const target = section ?? host
  const rect = target.getBoundingClientRect()

  return {
    width: Math.max(
      1,
      Math.round(rect.width),
      Math.round(target.clientWidth),
      section ? Math.round(section.clientWidth) : 0,
    ),
    height: Math.max(
      1,
      Math.round(rect.height),
      Math.round(target.scrollHeight),
      Math.round(target.clientHeight),
      section ? Math.round(section.offsetHeight) : 0,
    ),
  }
}

/** Shared RAF loop for section background canvases. Sizes to the parent section. */
export function useCanvasLoop(draw: DrawFn, className?: string) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawRef = useRef(draw)
  drawRef.current = draw

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true,
    })
    if (!ctx) return

    let raf = 0
    let bufferWidth = 0
    let bufferHeight = 0
    let skipDraw = isCanvasPaused()
    let visible = true
    let lastDraw = 0
    const frameInterval = 1000 / MAX_FPS

    const unsubPause = subscribeCanvasPause(() => {
      skipDraw = isCanvasPaused()
    })

    const getHost = () =>
      canvas.closest('[data-section-backdrop]') ??
      canvas.closest('section') ??
      canvas.parentElement ??
      canvas

    const resize = () => {
      const host = getHost()
      const { width: layoutWidth, height: layoutHeight } = measureHost(host)

      if (layoutWidth <= 0 || layoutHeight <= 0) return

      // Keep the backdrop box matched to the section while the canvas fills it via CSS.
      if (host instanceof HTMLElement && host.dataset.sectionBackdrop !== undefined) {
        host.style.width = '100%'
        host.style.height = `${layoutHeight}px`
      }

      // Draw at a capped resolution, then scale up via CSS for smoother performance.
      const scale = Math.min(
        1,
        MAX_BUFFER_EDGE / Math.max(layoutWidth, layoutHeight),
      )
      bufferWidth = Math.max(1, Math.round(layoutWidth * scale))
      bufferHeight = Math.max(1, Math.round(layoutHeight * scale))

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = bufferWidth * dpr
      canvas.height = bufferHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingEnabled = true
    }

    const host = getHost()
    const observer = new ResizeObserver(resize)
    observer.observe(host)

    const section = canvas.closest('section')
    if (section && section !== host) {
      observer.observe(section)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('load', resize)
    document.fonts?.ready.then(resize)

    const rafResize = requestAnimationFrame(() => {
      resize()
      requestAnimationFrame(resize)
    })

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true
        if (visible) resize()
      },
      { root: null, threshold: 0.01 },
    )
    visibilityObserver.observe(section ?? host)

    const loop = (time: number) => {
      if (
        !skipDraw &&
        visible &&
        bufferWidth > 0 &&
        bufferHeight > 0 &&
        time - lastDraw >= frameInterval
      ) {
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
      cancelAnimationFrame(rafResize)
      unsubPause()
      observer.disconnect()
      visibilityObserver.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('load', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 block h-full w-full min-h-full min-w-full will-change-transform ${className ?? ''}`}
      aria-hidden="true"
    />
  )
}
