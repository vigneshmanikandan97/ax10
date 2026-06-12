import { useRef } from 'react'
import { gsap } from '../../../lib/gsap'
import { whyUsProcess } from '../../../data/content'
import { SectionLabel } from '../../ui/BrutalCard'

const processSteps = whyUsProcess.steps.map((step, index) => ({
  index: String(index + 1).padStart(2, '0'),
  title: step.title,
  description: step.description,
}))

const MAX_TILT = 3.5
const MAX_SKEW = 1.2

type TiltSetters = {
  rotateX: (value: number) => void
  rotateY: (value: number) => void
  skewX: (value: number) => void
}

export function OurProcess() {
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])
  const settersRef = useRef<Map<number, TiltSetters>>(new Map())

  const getSetters = (index: number): TiltSetters | null => {
    const card = cardRefs.current[index]
    if (!card) return null

    let setters = settersRef.current.get(index)
    if (!setters) {
      const config = { duration: 0.35, ease: 'power2.out' }
      setters = {
        rotateX: gsap.quickTo(card, 'rotateX', config),
        rotateY: gsap.quickTo(card, 'rotateY', config),
        skewX: gsap.quickTo(card, 'skewX', config),
      }
      settersRef.current.set(index, setters)
    }
    return setters
  }

  const handleMove = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardRefs.current[index]
    if (!card) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const setters = getSetters(index)
    if (!setters) return

    const rect = card.getBoundingClientRect()
    const dx = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const dy = ((event.clientY - rect.top) / rect.height) * 2 - 1

    // Repel: the edge under the cursor leans away from the viewer
    setters.rotateY(dx * MAX_TILT)
    setters.rotateX(-dy * MAX_TILT)
    setters.skewX(-dx * MAX_SKEW)
  }

  const handleLeave = (index: number) => {
    const setters = getSetters(index)
    if (!setters) return

    setters.rotateX(0)
    setters.rotateY(0)
    setters.skewX(0)
  }

  return (
    <div data-our-process className="border-t border-white/[0.06] pt-8 md:pt-10">
      <div className="mb-8 md:mb-10">
        <SectionLabel>Our process</SectionLabel>
        <h3 className="type-display max-w-2xl text-[30px] leading-[1.04] md:text-[44px]">
          How we work
        </h3>
        <p className="type-body mt-4 max-w-2xl text-[15px] md:text-base">
          {whyUsProcess.body}
        </p>
      </div>

      <div
        className="grid gap-4 md:grid-cols-3 md:gap-5 [perspective:1400px]"
        role="list"
        aria-label="Our delivery process"
      >
        {processSteps.map((step, index) => (
          <div
            key={step.index}
            ref={(el) => {
              cardRefs.current[index] = el
            }}
            role="listitem"
            onMouseMove={(event) => handleMove(event, index)}
            onMouseLeave={() => handleLeave(index)}
            className="group liquid-glass flex flex-col p-5 transition-colors duration-300 hover:border-primary/40 md:p-6 [transform-style:preserve-3d]"
          >
            <div className="flex items-center gap-3">
              <span className="font-label-mono text-lg tabular-nums text-primary/40 transition-colors duration-300 group-hover:text-primary md:text-xl">
                {step.index}
              </span>
              <span
                className="h-px w-6 bg-border-subtle transition-all duration-300 group-hover:w-10 group-hover:bg-primary/60"
                aria-hidden="true"
              />
            </div>

            <p className="mt-5 font-label-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-text-primary md:mt-6 md:text-[11px] md:tracking-[0.12em]">
              {step.title}
            </p>

            <p className="type-body mt-3 text-[13px] leading-relaxed text-text-secondary md:text-sm">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
