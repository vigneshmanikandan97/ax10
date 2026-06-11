import { useEffect, useRef, type RefObject } from 'react'

type DrawFn = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  dpr: number,
) => void

const MAX_BUFFER_EDGE = 960

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
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawRef = useRef(draw)
  drawRef.current = draw

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

    const resize = () => {
      const { width: layoutWidth, height: layoutHeight } = measureElement(container)
      if (layoutWidth <= 0 || layoutHeight <= 0) return

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

    const observer = new ResizeObserver(resize)
    observer.observe(container)
    window.addEventListener('resize', resize)
    requestAnimationFrame(resize)

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true
        if (visible) resize()
      },
      { threshold: 0.01 },
    )
    visibilityObserver.observe(container)

    const loop = (time: number) => {
      if (visible && bufferWidth > 0 && bufferHeight > 0) {
        drawRef.current(
          ctx,
          bufferWidth,
          bufferHeight,
          time,
          Math.min(window.devicePixelRatio || 1, 2),
        )
      }
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      visibilityObserver.disconnect()
      window.removeEventListener('resize', resize)
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
