import { useCallback, useEffect, useRef } from 'react'
import { drawAtmosphereScene, type BlobPointer } from '../../lib/organicBlob'
import { useCanvasSurface } from '../../hooks/useCanvasSurface'

/** Fixed cinematic atmosphere for the landing page — monopo-inspired, AX10 palette. */
export function LandingAtmosphere() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<BlobPointer>({ x: 0, y: 0 })
  const scrollRef = useRef(0)

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      pointerRef.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      }
    }

    const onScroll = () => {
      scrollRef.current = window.scrollY
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      time: number,
    ) => {
      drawAtmosphereScene(ctx, width, height, time, pointerRef.current, {
        scrollY: scrollRef.current,
        grain: 0.09,
      })
    },
    [],
  )

  const canvas = useCanvasSurface(draw, containerRef)

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-surface-deep"
      aria-hidden="true"
    >
      {canvas}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(8,9,10,0.35)_100%)]" />
    </div>
  )
}
