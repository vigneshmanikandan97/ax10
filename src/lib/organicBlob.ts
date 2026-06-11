export type BlobPalette = {
  deep: string
  primary: string
  mint: string
  accent: string
  amber: string
}

export type BlobPointer = {
  x: number
  y: number
}

export const AX10_BLOB_PALETTE: BlobPalette = {
  deep: '#08090A',
  primary: '#69C991',
  mint: '#9FFFB0',
  accent: '#FF8FAB',
  amber: '#FFB84D',
}

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}

function noise2(x: number, y: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const a = hash(xi, yi)
  const b = hash(xi + 1, yi)
  const c = hash(xi, yi + 1)
  const d = hash(xi + 1, yi + 1)
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

function fbm(x: number, y: number, octaves = 3) {
  let value = 0
  let amplitude = 0.5
  let frequency = 1
  for (let i = 0; i < octaves; i += 1) {
    value += amplitude * noise2(x * frequency, y * frequency)
    amplitude *= 0.5
    frequency *= 2
  }
  return value
}

export function drawOrganicAtmosphere(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: BlobPointer,
  progress = 1,
  scrollY = 0,
) {
  ctx.fillStyle = AX10_BLOB_PALETTE.deep
  ctx.fillRect(0, 0, width, height)

  const span = Math.hypot(width, height)
  const driftX = pointer.x * width * 0.05
  const driftY = pointer.y * height * 0.04
  const parallax = scrollY * 0.08
  const breathe = 0.5 + Math.sin(time * 0.00035) * 0.08
  const flow = fbm(time * 0.00004, scrollY * 0.0002, 2)

  const mercury = ctx.createLinearGradient(0, 0, width, 0)
  mercury.addColorStop(0, `rgba(159, 255, 176, ${0.08 * progress})`)
  mercury.addColorStop(0.45, `rgba(255, 184, 77, ${0.06 * progress})`)
  mercury.addColorStop(0.72, `rgba(255, 143, 171, ${0.04 * progress})`)
  mercury.addColorStop(1, 'rgba(8, 9, 10, 0)')
  ctx.fillStyle = mercury
  ctx.fillRect(0, 0, width, height)

  const washes = [
    {
      x: width * (0.18 + pointer.x * 0.05 + flow * 0.04) + driftX,
      y: height * (0.24 + pointer.y * 0.04) + driftY - parallax * 0.35,
      r: span * (0.48 + breathe * 0.08),
      inner: 'rgba(159, 255, 176, 0.38)',
      mid: 'rgba(105, 201, 145, 0.18)',
    },
    {
      x: width * (0.82 + pointer.x * 0.03) + driftX * 0.6,
      y: height * (0.32 - pointer.y * 0.03) - parallax * 0.22,
      r: span * (0.4 + breathe * 0.05),
      inner: 'rgba(105, 201, 145, 0.32)',
      mid: 'rgba(36, 40, 43, 0.14)',
    },
    {
      x: width * (0.54 + flow * 0.06) + driftX * 0.4,
      y: height * (0.68 + pointer.y * 0.02) - parallax * 0.18,
      r: span * 0.38,
      inner: 'rgba(255, 184, 77, 0.2)',
      mid: 'rgba(255, 143, 171, 0.08)',
    },
    {
      x: width * (0.38 - pointer.x * 0.02),
      y: height * (0.52 + flow * 0.05) - parallax * 0.28,
      r: span * 0.28,
      inner: 'rgba(105, 201, 145, 0.14)',
      mid: 'rgba(8, 9, 10, 0)',
    },
  ]

  ctx.globalCompositeOperation = 'lighter'
  for (const wash of washes) {
    const gradient = ctx.createRadialGradient(
      wash.x,
      wash.y,
      0,
      wash.x,
      wash.y,
      wash.r * progress,
    )
    gradient.addColorStop(0, wash.inner)
    gradient.addColorStop(0.42, wash.mid)
    gradient.addColorStop(1, 'rgba(8, 9, 10, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }
  ctx.globalCompositeOperation = 'source-over'
}

export function drawAtmosphereScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: BlobPointer,
  options: {
    progress?: number
    grain?: number
    scrollY?: number
  } = {},
) {
  const { progress = 1, grain = 0.09, scrollY = 0 } = options
  drawOrganicAtmosphere(ctx, width, height, time, pointer, progress, scrollY)
  if (grain > 0) drawFilmGrain(ctx, width, height, time, grain)
}

export function drawGlassSphere(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  time: number,
  pointer: BlobPointer,
  intensity = 1,
) {
  const tiltX = pointer.y * 0.18
  const tiltY = pointer.x * 0.24
  const highlightX = cx + radius * (-0.22 + pointer.x * 0.12 + tiltY * 0.08)
  const highlightY = cy + radius * (-0.28 + pointer.y * 0.1 + tiltX * 0.08)
  const pulse = 0.5 + Math.sin(time * 0.00055) * 0.12
  const flowShift =
    fbm(pointer.x * 0.8 + time * 0.00008, pointer.y * 0.8 - time * 0.00006) * 0.12

  ctx.save()
  ctx.translate(cx, cy)
  ctx.transform(1, tiltX * 0.35, tiltY * 0.28, 1, 0, 0)

  const body = ctx.createRadialGradient(
    -radius * (0.18 - flowShift),
    -radius * (0.22 - flowShift),
    radius * 0.08,
    radius * 0.08,
    radius * 0.12,
    radius * 1.02,
  )
  body.addColorStop(0, `rgba(159, 255, 176, ${0.42 * intensity})`)
  body.addColorStop(0.28, `rgba(105, 201, 145, ${0.34 * intensity})`)
  body.addColorStop(0.58, `rgba(36, 40, 43, ${0.28 * intensity})`)
  body.addColorStop(0.86, `rgba(8, 9, 10, ${0.72 * intensity})`)
  body.addColorStop(1, `rgba(8, 9, 10, ${0.95 * intensity})`)

  ctx.fillStyle = body
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2)
  ctx.fill()

  const caustic = ctx.createRadialGradient(
    radius * (-0.08 + flowShift),
    radius * 0.18,
    0,
    radius * 0.05,
    radius * 0.08,
    radius * 0.72,
  )
  caustic.addColorStop(0, `rgba(255, 184, 77, ${0.18 * intensity})`)
  caustic.addColorStop(0.45, `rgba(105, 201, 145, ${0.12 * intensity})`)
  caustic.addColorStop(1, 'rgba(8, 9, 10, 0)')
  ctx.globalCompositeOperation = 'screen'
  ctx.fillStyle = caustic
  ctx.beginPath()
  ctx.arc(0, 0, radius * 0.92, 0, Math.PI * 2)
  ctx.fill()

  const rim = ctx.createRadialGradient(0, 0, radius * 0.72, 0, 0, radius * 1.02)
  rim.addColorStop(0, 'rgba(105, 201, 145, 0)')
  rim.addColorStop(0.82, `rgba(159, 255, 176, ${(0.22 + pulse * 0.12) * intensity})`)
  rim.addColorStop(1, `rgba(255, 143, 171, ${0.08 * intensity})`)
  ctx.fillStyle = rim
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2)
  ctx.fill()

  ctx.globalCompositeOperation = 'source-over'
  const specular = ctx.createRadialGradient(
    highlightX - cx,
    highlightY - cy,
    0,
    highlightX - cx,
    highlightY - cy,
    radius * 0.28,
  )
  specular.addColorStop(0, `rgba(255, 255, 255, ${0.72 * intensity})`)
  specular.addColorStop(0.35, `rgba(255, 255, 255, ${0.12 * intensity})`)
  specular.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = specular
  ctx.beginPath()
  ctx.arc(0, 0, radius * 0.96, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()

  const aura = ctx.createRadialGradient(cx, cy, radius * 0.65, cx, cy, radius * 1.35)
  aura.addColorStop(0, 'rgba(105, 201, 145, 0)')
  aura.addColorStop(0.55, `rgba(105, 201, 145, ${0.08 * intensity})`)
  aura.addColorStop(1, 'rgba(8, 9, 10, 0)')
  ctx.fillStyle = aura
  ctx.beginPath()
  ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2)
  ctx.fill()
}

export function drawFilmGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  amount = 0.08,
) {
  const tile = 96
  const seed = Math.floor(time * 0.04)
  ctx.save()
  ctx.globalAlpha = amount
  ctx.globalCompositeOperation = 'overlay'

  for (let y = 0; y < height; y += tile) {
    for (let x = 0; x < width; x += tile) {
      const n = hash(x + seed, y - seed)
      ctx.fillStyle = n > 0.5 ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'
      ctx.fillRect(x, y, tile, tile)
    }
  }

  ctx.restore()
}

export function drawOrganicScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: BlobPointer,
  options: {
    progress?: number
    sphereScale?: number
    sphereX?: number
    sphereY?: number
    grain?: number
    atmosphere?: boolean
  } = {},
) {
  const {
    progress = 1,
    sphereScale = 0.34,
    sphereX = 0.72,
    sphereY = 0.48,
    grain = 0.07,
    atmosphere = true,
  } = options

  if (atmosphere) {
    drawOrganicAtmosphere(ctx, width, height, time, pointer, progress)
  } else {
    ctx.clearRect(0, 0, width, height)
  }

  const span = Math.min(width, height)
  const radius = span * sphereScale * (0.92 + progress * 0.08)
  const cx =
    width * sphereX +
    pointer.x * width * 0.035 +
    Math.sin(time * 0.00025) * width * 0.012
  const cy =
    height * sphereY +
    pointer.y * height * 0.028 +
    Math.cos(time * 0.00022) * height * 0.01

  drawGlassSphere(ctx, cx, cy, radius, time, pointer, progress)
  if (grain > 0) drawFilmGrain(ctx, width, height, time, grain)
}
