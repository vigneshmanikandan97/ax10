import { useCallback, useEffect, useRef, useState } from 'react'
import { drawDitheredGlobe } from '../../lib/ditheredGlobe'
import { useCanvasSurface } from '../../hooks/useCanvasSurface'
import { useAppReady } from '../../context/AppReadyContext'

const GLOBE_FPS = 60

const BASE_ROT_X = 6
const BASE_ROT_Y = -14
const BASE_SKEW_Y = -5

function getGlobeLayout(width: number) {
  if (width < 640) {
    return {
      scale: 0.72,
      translateX: '4%',
      drawScale: 0.38,
      centerX: 0.5,
      centerY: 0.5,
      maxBufferEdge: 520,
      maxFps: GLOBE_FPS,
    }
  }

  if (width < 1024) {
    return {
      scale: 1,
      translateX: '10%',
      drawScale: 0.42,
      centerX: 0.5,
      centerY: 0.5,
      maxBufferEdge: 640,
      maxFps: GLOBE_FPS,
    }
  }

  return {
    scale: 1.42,
    translateX: '18%',
    drawScale: 0.44,
    centerX: 0.5,
    centerY: 0.5,
    maxBufferEdge: 720,
    maxFps: GLOBE_FPS,
  }
}

function applyGlobeTransform(el: HTMLElement, width: number) {
  const layout = getGlobeLayout(width)

  el.style.transform = [
    `translateX(${layout.translateX})`,
    'perspective(1200px)',
    `rotateX(${BASE_ROT_X}deg)`,
    `rotateY(${BASE_ROT_Y}deg)`,
    `skewY(${BASE_SKEW_Y}deg)`,
    `scale(${layout.scale})`,
  ].join(' ')
}

/** Auto-spinning dithered globe blob for the hero. */
export function HeroBlob() {
  const appReady = useAppReady()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasHostRef = useRef<HTMLDivElement>(null)
  const layoutRef = useRef(getGlobeLayout(window.innerWidth))
  const [canvasOptions, setCanvasOptions] = useState(() => {
    const layout = layoutRef.current
    return {
      maxBufferEdge: layout.maxBufferEdge,
      maxFps: layout.maxFps,
      pauseOnScroll: true,
      enabled: appReady,
    }
  })

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const syncLayout = () => {
      const layout = getGlobeLayout(window.innerWidth)
      layoutRef.current = layout
      setCanvasOptions({
        maxBufferEdge: layout.maxBufferEdge,
        maxFps: layout.maxFps,
        pauseOnScroll: true,
        enabled: appReady,
      })
      applyGlobeTransform(wrapper, window.innerWidth)
    }

    syncLayout()
    window.addEventListener('resize', syncLayout, { passive: true })

    return () => window.removeEventListener('resize', syncLayout)
  }, [appReady])

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      time: number,
    ) => {
      const layout = layoutRef.current

      drawDitheredGlobe(ctx, width, height, time, {
        centerX: width * layout.centerX,
        centerY: height * layout.centerY,
        scale: layout.drawScale,
      })
    },
    [],
  )

  const canvas = useCanvasSurface(draw, canvasHostRef, '', canvasOptions)

  return (
    <div
      ref={wrapperRef}
      className="relative h-full w-full origin-center overflow-visible will-change-transform transform-gpu select-none"
      aria-hidden="true"
    >
      <div ref={canvasHostRef} className="absolute -inset-[12%] sm:-inset-[16%] md:-inset-[20%] lg:-inset-[24%] overflow-visible">
        {canvas}
      </div>
    </div>
  )
}
