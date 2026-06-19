const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

type Vec3 = { x: number; y: number; z: number }
type Point2 = { x: number; y: number; z: number }

// Coarsen the dither grid on low-core devices — (3/2)^2 ≈ 2.25x fewer pixel
// iterations per frame, traded against a slightly chunkier sphere.
const LOW_END =
  typeof navigator !== 'undefined' && (navigator.hardwareConcurrency ?? 8) <= 4

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
    frequency *= 2
    amplitude *= 0.5
  }
  return value
}

function latLonToVec3(lat: number, lon: number): Vec3 {
  const latR = (lat * Math.PI) / 180
  const lonR = (lon * Math.PI) / 180
  return {
    x: Math.cos(latR) * Math.sin(lonR),
    y: Math.sin(latR),
    z: Math.cos(latR) * Math.cos(lonR),
  }
}

function rotateY(v: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return { x: v.x * c + v.z * s, y: v.y, z: -v.x * s + v.z * c }
}

function rotateX(v: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return { x: v.x, y: v.y * c - v.z * s, z: v.y * s + v.z * c }
}

function vec3ToLatLon(v: Vec3) {
  const lat = (Math.asin(Math.max(-1, Math.min(1, v.y))) * 180) / Math.PI
  const lon = (Math.atan2(v.x, v.z) * 180) / Math.PI
  return { lat, lon }
}

function project(
  v: Vec3,
  cx: number,
  cy: number,
  radius: number,
): Point2 | null {
  if (v.z <= 0.02) return null
  return {
    x: cx + v.x * radius,
    y: cy - v.y * radius,
    z: v.z,
  }
}

function globeField(lat: number, lon: number, time: number) {
  const t = time * 0.00035
  const wave =
    Math.sin(lat * 0.09 + lon * 0.07 + t) *
      Math.cos(lon * 0.05 - t * 0.8) *
      0.5 +
    0.5
  const wave2 = Math.sin((lat + lon) * 0.06 + t * 0.65) * 0.5 + 0.5
  const wave3 = Math.cos(lat * 0.04 - t * 0.5 + lon * 0.08) * 0.5 + 0.5
  const graticuleLat = Math.abs(Math.sin((lat * Math.PI) / 180 * 6)) > 0.92 ? 0.18 : 0
  const graticuleLon = Math.abs(Math.sin((lon * Math.PI) / 180 * 6)) > 0.92 ? 0.14 : 0

  return Math.max(
    0.1,
    Math.min(1, wave * 0.38 + wave2 * 0.3 + wave3 * 0.22 + graticuleLat + graticuleLon),
  )
}

function distortedRadius(angle: number, base: number, time: number) {
  const warp =
    fbm(Math.cos(angle) * 2.2 + time * 0.00008, Math.sin(angle) * 2.2, 3) * 0.14
  const pulse = Math.sin(time * 0.00045) * 0.04
  return base * (1 + warp + pulse)
}

function screenToSphere(
  px: number,
  py: number,
  cx: number,
  cy: number,
  radius: number,
  rotY: number,
  rotX: number,
): Vec3 | null {
  const nx = (px - cx) / radius
  const ny = -(py - cy) / radius
  const r2 = nx * nx + ny * ny
  if (r2 > 1.02) return null

  const nz = Math.sqrt(Math.max(0, 1 - r2))
  let v: Vec3 = { x: nx, y: ny, z: nz }
  v = rotateX(v, -rotX)
  v = rotateY(v, -rotY)
  return v
}

// Base graticule grid points are fixed in model space — only the per-frame
// rotation changes. Precompute the lat/lon vectors once so the draw loop skips
// ~1.5k latLonToVec3 (sin/cos) calls every frame.
function buildGraticuleGrid() {
  const latLines: Vec3[][] = []
  const lonLines: Vec3[][] = []

  for (let lat = -75; lat <= 75; lat += 15) {
    const line: Vec3[] = []
    for (let lon = 0; lon <= 360; lon += 5) {
      line.push(latLonToVec3(lat, lon))
    }
    latLines.push(line)
  }

  for (let lon = 0; lon < 360; lon += 20) {
    const line: Vec3[] = []
    for (let lat = -90; lat <= 90; lat += 5) {
      line.push(latLonToVec3(lat, lon))
    }
    lonLines.push(line)
  }

  return { latLines, lonLines }
}

const GRATICULE_GRID = buildGraticuleGrid()

function buildGraticulePath2Ds(
  lines: Vec3[][],
  cx: number,
  cy: number,
  radius: number,
  rotY: number,
  rotX: number,
) {
  const paths: Path2D[] = []

  for (const line of lines) {
    const path = new Path2D()
    let count = 0
    for (const base of line) {
      let v = rotateY(base, rotY)
      v = rotateX(v, rotX)
      const p = project(v, cx, cy, radius)
      if (!p) continue
      if (count === 0) path.moveTo(p.x, p.y)
      else path.lineTo(p.x, p.y)
      count += 1
    }
    if (count > 2) paths.push(path)
  }

  return paths
}

export function drawDitheredGlobe(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  options: {
    centerX?: number
    centerY?: number
    scale?: number
  } = {},
) {
  const centerX = options.centerX ?? width * 0.5
  const centerY = options.centerY ?? height * 0.5
  const radius = Math.min(width, height) * (options.scale ?? 0.44)
  const rotY = time * 0.00022
  const rotX = 0.32

  ctx.clearRect(0, 0, width, height)

  const aura = ctx.createRadialGradient(
    centerX,
    centerY,
    radius * 0.5,
    centerX,
    centerY,
    radius * 1.28,
  )
  aura.addColorStop(0, 'rgba(105, 201, 145, 0.1)')
  aura.addColorStop(0.6, 'rgba(105, 201, 145, 0.04)')
  aura.addColorStop(1, 'rgba(8, 9, 10, 0)')
  ctx.fillStyle = aura
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius * 1.28, 0, Math.PI * 2)
  ctx.fill()

  const step = width > 520 ? (LOW_END ? 3 : 2) : LOW_END ? 4 : 3
  const minX = Math.floor(centerX - radius * 1.08)
  const maxX = Math.ceil(centerX + radius * 1.08)
  const minY = Math.floor(centerY - radius * 1.08)
  const maxY = Math.ceil(centerY + radius * 1.08)

  // Only paint lit dither pixels — skip "off" cells so the sphere stays transparent.
  for (let py = minY; py < maxY; py += step) {
    for (let px = minX; px < maxX; px += step) {
      const dx = px - centerX
      const dy = py - centerY
      const angle = Math.atan2(dy, dx)
      const dist = Math.hypot(dx, dy)
      const edgeR = distortedRadius(angle, radius, time)
      if (dist > edgeR) continue

      const v = screenToSphere(px, py, centerX, centerY, radius, rotY, rotX)
      if (!v || v.z <= 0.04) continue

      const { lat, lon } = vec3ToLatLon(v)
      const depth = Math.min(1, (v.z - 0.04) * 1.8)
      const field = globeField(lat, lon, time) * (0.55 + depth * 0.45)
      const threshold = BAYER_4[py % 4][px % 4] / 16
      if (field <= threshold) continue

      const alpha = (155 + depth * 100) / 255
      ctx.fillStyle = `rgba(105, 201, 145, ${alpha.toFixed(3)})`
      ctx.fillRect(px, py, step, step)
    }
  }

  const latPaths = buildGraticulePath2Ds(
    GRATICULE_GRID.latLines,
    centerX,
    centerY,
    radius,
    rotY,
    rotX,
  )
  const lonPaths = buildGraticulePath2Ds(
    GRATICULE_GRID.lonLines,
    centerX,
    centerY,
    radius,
    rotY,
    rotX,
  )

  ctx.save()
  ctx.strokeStyle = 'rgba(159, 255, 176, 0.22)'
  ctx.lineWidth = 0.75
  ctx.setLineDash([2, 5])
  for (const path of latPaths) ctx.stroke(path)
  for (const path of lonPaths) ctx.stroke(path)
  ctx.setLineDash([])
  ctx.restore()

  ctx.save()
  ctx.strokeStyle = 'rgba(105, 201, 145, 0.35)'
  ctx.lineWidth = 1.25
  ctx.beginPath()
  for (let a = 0; a < Math.PI * 2; a += 0.04) {
    const r = distortedRadius(a, radius, time)
    const x = centerX + Math.cos(a) * r
    const y = centerY + Math.sin(a) * r
    if (a === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.stroke()
  ctx.restore()
}
