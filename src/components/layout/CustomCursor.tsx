import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'

const BASE_SIZE = 18
const HOVER_SIZE = 112

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const hoveringRef = useRef(false)
  const currentCardRef = useRef<Element | null>(null)

  useEffect(() => {
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (coarsePointer || reducedMotion) return

    const cursor = cursorRef.current
    const ring = ringRef.current
    if (!cursor || !ring) return

    const setX = gsap.quickSetter(cursor, 'x', 'px')
    const setY = gsap.quickSetter(cursor, 'y', 'px')
    const setRingX = gsap.quickSetter(ring, 'x', 'px')
    const setRingY = gsap.quickSetter(ring, 'y', 'px')

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const target = { x: pos.x, y: pos.y }
    let raf = 0

    const animate = () => {
      pos.x += (target.x - pos.x) * 0.2
      pos.y += (target.y - pos.y) * 0.2
      setX(pos.x)
      setY(pos.y)
      setRingX(pos.x)
      setRingY(pos.y)
      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)

    const onMove = (event: MouseEvent) => {
      target.x = event.clientX
      target.y = event.clientY
    }

    const onEnter = () => {
      if (hoveringRef.current) return
      hoveringRef.current = true
      gsap.to(cursor, {
        width: HOVER_SIZE,
        height: HOVER_SIZE,
        duration: 0.35,
        ease: 'power3.out',
      })
      gsap.to(ring, {
        scale: 1.4,
        opacity: 1,
        duration: 0.35,
        ease: 'power3.out',
      })
    }

    const onLeave = () => {
      if (!hoveringRef.current) return
      hoveringRef.current = false
      currentCardRef.current = null
      gsap.to(cursor, {
        width: BASE_SIZE,
        height: BASE_SIZE,
        duration: 0.4,
        ease: 'power3.out',
      })
      gsap.to(ring, {
        scale: 1,
        opacity: 0.5,
        duration: 0.4,
        ease: 'power3.out',
      })
    }

    const onMouseOver = (event: MouseEvent) => {
      const card = (event.target as Element | null)?.closest('[data-cursor-card]')
      if (card && card !== currentCardRef.current) {
        currentCardRef.current = card
        onEnter()
      }
    }

    const onMouseOut = (event: MouseEvent) => {
      const fromCard = (event.target as Element | null)?.closest(
        '[data-cursor-card]',
      )
      const toCard = (event.relatedTarget as Element | null)?.closest(
        '[data-cursor-card]',
      )
      if (fromCard && !toCard) onLeave()
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
      gsap.killTweensOf([cursor, ring])
    }
  }, [])

  return (
    <>
      <div
        ref={ringRef}
        className="custom-cursor-ring pointer-events-none fixed left-0 top-0 z-[200] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/80 will-change-transform"
        aria-hidden="true"
      />
      <div
        ref={cursorRef}
        className="custom-cursor-dot pointer-events-none fixed left-0 top-0 z-[201] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference will-change-transform"
        style={{ width: BASE_SIZE, height: BASE_SIZE }}
        aria-hidden="true"
      />
    </>
  )
}
