import { useCallback, useRef } from 'react'
import { useCanvasLoop } from '../../hooks/useCanvasLoop'

// Ordered dither matrix for an even, animated halftone field.
const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

function sampleField(
  x: number,
  y: number,
  width: number,
  height: number,
  time: number,
) {
  const t = time * 0.00028
  const nx = (x / width) * 1000
  const ny = (y / height) * 1000
  const wave =
    Math.sin(nx * 0.003 + t) * Math.cos(ny * 0.0028 - t * 0.85) * 0.5 + 0.5
  const wave2 = Math.sin((nx + ny) * 0.002 + t * 0.7) * 0.5 + 0.5
  const wave3 = Math.cos(nx * 0.0016 - t * 0.55 + ny * 0.004) * 0.5 + 0.5

  return Math.max(0.08, Math.min(1, wave * 0.42 + wave2 * 0.33 + wave3 * 0.25))
}

type DitherCanvasProps = {
  className?: string
}

export function DitherCanvas({ className = '' }: DitherCanvasProps) {
  const imageDataRef = useRef<ImageData | null>(null)
  const sizeRef = useRef({ width: 0, height: 0 })

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      time: number,
    ) => {
      ctx.fillStyle = '#08090A'
      ctx.fillRect(0, 0, width, height)

      const step = width > 640 ? 2 : 3

      if (
        !imageDataRef.current ||
        sizeRef.current.width !== width ||
        sizeRef.current.height !== height
      ) {
        imageDataRef.current = ctx.createImageData(width, height)
        sizeRef.current = { width, height }
      }

      const imageData = imageDataRef.current
      const data = imageData.data

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const field = sampleField(x, y, width, height, time)
          const threshold = BAYER_4[y % 4][x % 4] / 16
          const on = field > threshold

          const r = on ? 105 : 18
          const g = on ? 201 : 20
          const b = on ? 145 : 22
          const a = on ? 255 : 72

          for (let dy = 0; dy < step && y + dy < height; dy += 1) {
            for (let dx = 0; dx < step && x + dx < width; dx += 1) {
              const i = ((y + dy) * width + (x + dx)) * 4
              data[i] = r
              data[i + 1] = g
              data[i + 2] = b
              data[i + 3] = a
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)
    },
    [],
  )

  return useCanvasLoop(draw, className)
}
