import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import { LanternField } from '../effects/LanternField'

const MIN_LOADER_MS = 1200

function waitForAssets() {
  return Promise.all([
    document.fonts?.ready ?? Promise.resolve(),
    new Promise<void>((resolve) => {
      if (document.readyState === 'complete') {
        resolve()
        return
      }
      window.addEventListener('load', () => resolve(), { once: true })
    }),
  ])
}

/** Cinematic preloader inspired by monopo saigon, tailored to AX10. */
export function AppLoader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useLayoutEffect(() => {
    const root = rootRef.current
    const text = textRef.current
    const progressEl = progressRef.current
    if (!root || !text || !progressEl) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const counter = { value: 0 }

    const ctx = gsap.context(() => {
      gsap.set(root, { autoAlpha: 1 })
      gsap.set(text, { y: 28, autoAlpha: 0 })
      gsap.set(progressEl, { autoAlpha: 0, y: 8 })

      const intro = gsap.timeline()
      intro
        .to(text, {
          y: 0,
          autoAlpha: 1,
          duration: reduced ? 0.01 : 0.9,
          ease: 'power3.out',
          delay: reduced ? 0 : 0.15,
        })
        .to(
          progressEl,
          {
            autoAlpha: 1,
            y: 0,
            duration: reduced ? 0.01 : 0.45,
            ease: 'power2.out',
          },
          '-=0.35',
        )

      const loadStart = performance.now()

      const finish = () => {
        const elapsed = performance.now() - loadStart
        const remaining = Math.max(0, MIN_LOADER_MS - elapsed)

        window.setTimeout(() => {
          gsap.to(root, {
            autoAlpha: 0,
            duration: reduced ? 0.01 : 0.75,
            ease: 'power2.inOut',
            onComplete: () => {
              setVisible(false)
              onComplete()
            },
          })
        }, remaining)
      }

      waitForAssets().then(() => {
        gsap.to(counter, {
          value: 100,
          duration: reduced ? 0.01 : 1.35,
          ease: 'power2.inOut',
          onUpdate: () => {
            const next = Math.round(counter.value)
            setProgress(next)
            progressEl.textContent = `${next}%`
          },
          onComplete: finish,
        })
      })
    }, root)

    return () => ctx.revert()
  }, [onComplete])

  if (!visible) return null

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-deep"
      aria-live="polite"
      aria-busy={progress < 100}
      aria-label="Loading AX10"
    >
      <LanternField enabled={visible} />

      <div className="relative z-10 px-6 text-center">
        <div
          ref={textRef}
          className="font-body-lg text-[clamp(52px,11vw,132px)] font-light leading-[0.76] tracking-[-0.03em] text-text-primary"
        >
          Hello <span className="italic font-display">&apos;Dreamer&apos;</span>
        </div>
        <span
          ref={progressRef}
          className="mt-8 inline-block font-label-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary"
        >
          0%
        </span>
      </div>
    </div>
  )
}
