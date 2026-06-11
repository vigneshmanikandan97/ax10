import { useCallback, useEffect, useRef } from 'react'
import { drawOrganicScene, type BlobPointer } from '../../lib/organicBlob'
import { useCanvasSurface } from '../../hooks/useCanvasSurface'

type OrganicBlobCanvasProps = {
  className?: string
  sphereScale?: number
  sphereX?: number
  sphereY?: number
  progress?: number
  interactive?: boolean
  atmosphere?: boolean
  grain?: number
}

/** Organic glass blob scene for loader and hero accents. */
export function OrganicBlobCanvas({
  className = '',
  sphereScale = 0.34,
  sphereX = 0.72,
  sphereY = 0.48,
  progress = 1,
  interactive = true,
  atmosphere = true,
  grain = 0.07,
}: OrganicBlobCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<BlobPointer>({ x: 0, y: 0 })
  const progressRef = useRef(progress)
  progressRef.current = progress

  useEffect(() => {
    if (!interactive) return

    const onMove = (event: MouseEvent) => {
      pointerRef.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [interactive])

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      time: number,
    ) => {
      drawOrganicScene(ctx, width, height, time, pointerRef.current, {
        progress: progressRef.current,
        sphereScale,
        sphereX,
        sphereY,
        grain,
        atmosphere,
      })
    },
    [sphereScale, sphereX, sphereY, grain, atmosphere],
  )

  const canvas = useCanvasSurface(draw, containerRef)

  return (
    <div ref={containerRef} className={`absolute inset-0 ${className}`}>
      {canvas}
    </div>
  )
}
