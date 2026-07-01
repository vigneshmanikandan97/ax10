import { useCallback, useEffect, useRef } from 'react'
import type { BlobPointer } from '../../lib/organicBlob'
import { drawGradientField } from '../../lib/gradientField'
import { useCanvasSurface } from '../../hooks/useCanvasSurface'
import { useAppReady } from '../../context/AppReadyContext'
import { useCoarsePointer } from '../../hooks/useCoarsePointer'

/** Animated canvas layer. Split out so it only mounts (and runs its RAF) when wanted. */
function AtmosphereCanvas() {
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
      drawGradientField(ctx, width, height, time, pointerRef.current, {
        scrollY: scrollRef.current,
        grain: 0.06,
      })
    },
    [],
  )

  const canvas = useCanvasSurface(draw, containerRef, '', {
    maxBufferEdge: 640,
    maxFps: 20,
    pauseOnScroll: true,
  })

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {canvas}
    </div>
  )
}

/** Fixed cinematic atmosphere for the landing page — monopo-inspired, AX10 palette. */
export function LandingAtmosphere() {
  const appReady = useAppReady()
  const coarse = useCoarsePointer()

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-surface-deep"
      aria-hidden="true"
    >
      {appReady && !coarse ? <AtmosphereCanvas /> : null}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(8,9,10,0.35)_100%)]" />
    </div>
  )
}
