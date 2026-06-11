import { useCallback } from 'react'
import { useCanvasLoop } from '../../hooks/useCanvasLoop'

const BLOBS = [
  { cx: 0.18, cy: 0.22, radius: 0.55, speed: 0.00018, phase: 0 },
  { cx: 0.82, cy: 0.18, radius: 0.5, speed: 0.00014, phase: 2.1 },
  { cx: 0.55, cy: 0.78, radius: 0.62, speed: 0.00016, phase: 4.4 },
  { cx: 0.28, cy: 0.72, radius: 0.42, speed: 0.0002, phase: 1.5 },
] as const

export function HeatmapCanvas({ className = '' }: { className?: string }) {
  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      time: number,
    ) => {
      ctx.fillStyle = '#08090A'
      ctx.fillRect(0, 0, width, height)

      const span = Math.hypot(width, height)

      for (const blob of BLOBS) {
        const x =
          (blob.cx + Math.sin(time * blob.speed + blob.phase) * 0.06) * width
        const y =
          (blob.cy + Math.cos(time * blob.speed * 0.85 + blob.phase) * 0.05) *
          height
        const r = blob.radius * span

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
        gradient.addColorStop(0, 'rgba(159, 255, 176, 0.55)')
        gradient.addColorStop(0.25, 'rgba(105, 201, 145, 0.28)')
        gradient.addColorStop(0.55, 'rgba(36, 40, 43, 0.12)')
        gradient.addColorStop(1, 'rgba(8, 9, 10, 0)')

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
      }
    },
    [],
  )

  return useCanvasLoop(draw, className)
}
