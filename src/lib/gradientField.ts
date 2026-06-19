import type { BlobPointer } from './organicBlob'
import { drawFilmGrain } from './organicBlob'

const BASE = '#050608'

type Wash = {
  // Resting position as a fraction of the viewport
  x: number
  y: number
  // Radius as a fraction of the viewport diagonal
  radius: number
  color: string
  alpha: number
  // Per-wash drift so the washes never move in lockstep
  driftSpeed: number
  driftPhase: number
  pointerPull: number
  scrollPull: number
}

const WASHES: Wash[] = [
  {
    x: 0.16,
    y: 0.18,
    radius: 0.5,
    color: '34, 197, 130',
    alpha: 0.13,
    driftSpeed: 0.000041,
    driftPhase: 0,
    pointerPull: 0.05,
    scrollPull: 0.1,
  },
  {
    x: 0.88,
    y: 0.3,
    radius: 0.46,
    color: '99, 102, 241',
    alpha: 0.11,
    driftSpeed: 0.000033,
    driftPhase: 2.1,
    pointerPull: 0.035,
    scrollPull: 0.06,
  },
  {
    x: 0.55,
    y: 0.85,
    radius: 0.52,
    color: '17, 94, 110',
    alpha: 0.16,
    driftSpeed: 0.000027,
    driftPhase: 4.4,
    pointerPull: 0.04,
    scrollPull: 0.04,
  },
  {
    x: 0.32,
    y: 0.6,
    radius: 0.3,
    color: '244, 150, 86',
    alpha: 0.045,
    driftSpeed: 0.000052,
    driftPhase: 1.3,
    pointerPull: 0.06,
    scrollPull: 0.08,
  },
]

export function drawGradientField(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: BlobPointer,
  options: { scrollY?: number; grain?: number } = {},
) {
  const { scrollY = 0, grain = 0.06 } = options
  const span = Math.hypot(width, height)

  ctx.fillStyle = BASE
  ctx.fillRect(0, 0, width, height)

  ctx.globalCompositeOperation = 'screen'
  for (const wash of WASHES) {
    const t = time * wash.driftSpeed + wash.driftPhase
    const cx =
      (wash.x + Math.sin(t) * 0.06 + pointer.x * wash.pointerPull) * width
    const cy =
      (wash.y + Math.cos(t * 0.8) * 0.05 + pointer.y * wash.pointerPull) * height -
      scrollY * wash.scrollPull
    const radius = span * wash.radius * (1 + Math.sin(t * 1.3) * 0.06)

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
    gradient.addColorStop(0, `rgba(${wash.color}, ${wash.alpha})`)
    gradient.addColorStop(0.5, `rgba(${wash.color}, ${wash.alpha * 0.4})`)
    gradient.addColorStop(1, `rgba(${wash.color}, 0)`)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }
  ctx.globalCompositeOperation = 'source-over'

  // Gentle darkening toward the edges keeps content the brightest thing on screen
  const vignette = ctx.createRadialGradient(
    width * 0.5,
    height * 0.42,
    Math.min(width, height) * 0.36,
    width * 0.5,
    height * 0.5,
    span * 0.58,
  )
  vignette.addColorStop(0, 'rgba(5, 6, 8, 0)')
  vignette.addColorStop(1, 'rgba(5, 6, 8, 0.6)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, width, height)

  if (grain > 0) drawFilmGrain(ctx, width, height, time, grain)
}
