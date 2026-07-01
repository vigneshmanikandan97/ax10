import { useCallback, useEffect, useRef } from 'react'
import { useCanvasSurface } from '../../hooks/useCanvasSurface'
import { useCoarsePointer } from '../../hooks/useCoarsePointer'

type Pointer = { x: number; y: number; active: boolean }

// AX10 theme — mint primary fading to bright mint inside the lantern.
const BASE_RGB = [105, 201, 145] as const
const HOT_RGB = [159, 255, 176] as const

const GRID_STEP = 20 // px between particles in buffer space
const AMBIENT = 0.03 // faint field outside the lantern
const LANTERN_RADIUS = 0.26 // fraction of min(w, h)

/**
 * Full-bleed pixel field that drifts in a wave. Particles are near-invisible
 * except inside a soft lantern around the cursor, which reveals and brightens
 * them. Falls back to an auto-roaming lantern when no pointer is present.
 */
export function LanternField({ enabled = true }: { enabled?: boolean }) {
  const coarse = useCoarsePointer()
  const containerRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<Pointer>({ x: 0.5, y: 0.5, active: false })
  const reducedRef = useRef(false)

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onMove = (event: PointerEvent) => {
      pointerRef.current = {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
        active: true,
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      time: number,
    ) => {
      ctx.clearRect(0, 0, width, height)

      const reduced = reducedRef.current
      const t = reduced ? 0 : time

      // Resolve lantern center. Auto-roam on a Lissajous path until the user
      // moves a pointer, so touch devices still get the reveal.
      const pointer = pointerRef.current
      let cx: number
      let cy: number
      if (pointer.active) {
        cx = pointer.x * width
        cy = pointer.y * height
      } else {
        const roam = t * 0.00018
        cx = width * (0.5 + Math.sin(roam) * 0.26)
        cy = height * (0.5 + Math.cos(roam * 0.8) * 0.2)
      }

      const radius = Math.min(width, height) * LANTERN_RADIUS
      const invR2 = 1 / (radius * radius)
      const amp = GRID_STEP * 0.45

      // Soft lantern halo behind the particles.
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.6)
      halo.addColorStop(0, 'rgba(105, 201, 145, 0.10)')
      halo.addColorStop(0.5, 'rgba(105, 201, 145, 0.04)')
      halo.addColorStop(1, 'rgba(8, 9, 10, 0)')
      ctx.fillStyle = halo
      ctx.fillRect(0, 0, width, height)

      for (let gy = 0; gy <= height + GRID_STEP; gy += GRID_STEP) {
        for (let gx = 0; gx <= width + GRID_STEP; gx += GRID_STEP) {
          // Wave displacement — diagonal travelling wave.
          const phase = gx * 0.012 + gy * 0.009 + t * 0.0012
          const dx = Math.sin(phase) * amp
          const dy = Math.cos(gx * 0.01 - gy * 0.011 + t * 0.001) * amp
          const px = gx + dx
          const py = gy + dy

          // Lantern falloff (gaussian-ish) around the cursor.
          const ddx = px - cx
          const ddy = py - cy
          const lantern = Math.exp(-(ddx * ddx + ddy * ddy) * invR2)
          if (lantern < 0.01 && AMBIENT < 0.01) continue

          // Wave brightness ripples through the revealed area.
          const wave = 0.5 + 0.5 * Math.sin(phase * 1.4 - t * 0.0016)
          const intensity = AMBIENT + lantern * (0.25 + 0.75 * wave)
          if (intensity <= 0.012) continue

          const mix = Math.min(1, lantern * 1.1)
          const r = Math.round(BASE_RGB[0] + (HOT_RGB[0] - BASE_RGB[0]) * mix)
          const g = Math.round(BASE_RGB[1] + (HOT_RGB[1] - BASE_RGB[1]) * mix)
          const b = Math.round(BASE_RGB[2] + (HOT_RGB[2] - BASE_RGB[2]) * mix)
          const alpha = Math.min(1, intensity)

          const size = 1.5 + lantern * 1.5
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`
          ctx.fillRect(px, py, size, size)
        }
      }
    },
    [],
  )

  const canvas = useCanvasSurface(draw, containerRef, '', {
    maxBufferEdge: coarse ? 500 : 1000,
    maxFps: coarse ? 24 : 40,
    pauseOnScroll: false,
    enabled,
  })

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {canvas}
    </div>
  )
}
