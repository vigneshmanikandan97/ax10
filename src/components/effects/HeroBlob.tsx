import { useCallback, useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import type { BlobPointer } from '../../lib/organicBlob'
import { drawDitheredGlobe } from '../../lib/ditheredGlobe'
import { useCanvasSurface } from '../../hooks/useCanvasSurface'

const BASE_ROT_X = 6
const BASE_ROT_Y = -14
const BASE_SKEW_Y = -5
const BASE_SCALE = 1.42
const CURSOR_ROT_X = 5
const CURSOR_ROT_Y = 8

function applyGlobeTransform(el: HTMLElement, rotX: number, rotY: number) {
  el.style.transform = [
    'translateX(18%)',
    'perspective(1200px)',
    `rotateX(${rotX}deg)`,
    `rotateY(${rotY}deg)`,
    `skewY(${BASE_SKEW_Y}deg)`,
    `scale(${BASE_SCALE})`,
  ].join(' ')
}

/** Cursor-reactive dithered globe blob for the hero. */
export function HeroBlob() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasHostRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<BlobPointer>({ x: 0, y: 0 })

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    applyGlobeTransform(wrapper, BASE_ROT_X, BASE_ROT_Y)

    if (reduced) return

    const tilt = { x: BASE_ROT_X, y: BASE_ROT_Y }
    const target = { x: 0, y: 0 }

    const onMove = (event: MouseEvent) => {
      target.x = (event.clientX / window.innerWidth - 0.5) * 2
      target.y = (event.clientY / window.innerHeight - 0.5) * 2
      pointerRef.current = { x: target.x, y: target.y }
    }

    const onTick = () => {
      tilt.x += (BASE_ROT_X + target.y * CURSOR_ROT_X - tilt.x) * 0.06
      tilt.y += (BASE_ROT_Y + target.x * CURSOR_ROT_Y - tilt.y) * 0.06
      applyGlobeTransform(wrapper, tilt.x, tilt.y)
    }

    gsap.ticker.add(onTick)
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      gsap.ticker.remove(onTick)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      time: number,
    ) => {
      drawDitheredGlobe(ctx, width, height, time, pointerRef.current, {
        centerX: width * 0.56,
        centerY: height * 0.58,
        scale: 0.44,
      })
    },
    [],
  )

  const canvas = useCanvasSurface(draw, canvasHostRef)

  return (
    <div
      ref={wrapperRef}
      className="relative h-[min(108vh,1020px)] w-[min(108vh,1020px)] origin-center overflow-visible will-change-transform transform-gpu select-none"
      aria-hidden="true"
    >
      <div ref={canvasHostRef} className="absolute -inset-[24%] overflow-visible">
        {canvas}
      </div>
    </div>
  )
}
