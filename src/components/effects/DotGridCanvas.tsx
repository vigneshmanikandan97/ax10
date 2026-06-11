import { useCallback } from 'react'
import { useCanvasLoop } from '../../hooks/useCanvasLoop'

const SPACING = 28
const DOT_RADIUS = 0.9

type DotGridCanvasProps = {
  className?: string
  /** When true, only dots are drawn so the layer can sit above an existing background. */
  overlay?: boolean
}

export function DotGridCanvas({ className = '', overlay = false }: DotGridCanvasProps) {
  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      time: number,
    ) => {
      if (overlay) {
        ctx.clearRect(0, 0, width, height)
      } else {
        ctx.fillStyle = '#08090A'
        ctx.fillRect(0, 0, width, height)
      }

      const driftX = Math.sin(time * 0.00018) * SPACING * 0.35
      const driftY = Math.cos(time * 0.00014) * SPACING * 0.35
      const pulse = 0.55 + Math.sin(time * 0.0005) * 0.15

      const cols = Math.ceil(width / SPACING) + 2
      const rows = Math.ceil(height / SPACING) + 2
      const startX = -SPACING + (driftX % SPACING)
      const startY = -SPACING + (driftY % SPACING)

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const x = startX + col * SPACING
          const y = startY + row * SPACING
          const nx = x / width - 0.5
          const ny = y / height - 0.5
          const vignette = 1 - Math.min(1, Math.hypot(nx * 1.2, ny * 1.2))
          const alpha = pulse * vignette * (overlay ? 0.42 : 0.55)

          if (alpha < 0.04) continue

          ctx.beginPath()
          ctx.fillStyle = `rgba(105, 201, 145, ${alpha})`
          ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    },
    [overlay],
  )

  return useCanvasLoop(draw, className)
}
