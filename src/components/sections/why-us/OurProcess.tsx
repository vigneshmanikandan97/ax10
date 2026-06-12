import { useRef } from 'react'
import { gsap } from '../../../lib/gsap'
import { whyUsProcess } from '../../../data/content'
import { SectionLabel } from '../../ui/BrutalCard'

const processSteps = whyUsProcess.steps.map((step, index) => ({
  index: String(index + 1).padStart(2, '0'),
  label: step,
}))

export function OurProcess() {
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])

  const handleEnter = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardRefs.current[index]
    if (!card) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rect = card.getBoundingClientRect()
    // Normalized entry offset from card center, -1..1
    const dx = Math.max(-1, Math.min(1, (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)))
    const dy = Math.max(-1, Math.min(1, (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)))

    gsap.to(card, {
      x: -dx * 14,
      y: -dy * 10,
      rotateY: -dx * 7,
      rotateX: dy * 7,
      skewX: -dx * 3,
      duration: 0.45,
      ease: 'power3.out',
      overwrite: true,
    })
  }

  const handleLeave = (index: number) => {
    const card = cardRefs.current[index]
    if (!card) return

    gsap.to(card, {
      x: 0,
      y: 0,
      rotateY: 0,
      rotateX: 0,
      skewX: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.55)',
      overwrite: true,
    })
  }

  return (
    <div data-our-process className="border-t border-white/[0.06] pt-14 md:pt-20">
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
        className="grid gap-4 md:grid-cols-3 md:gap-5 [perspective:1200px]"
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
            onMouseEnter={(event) => handleEnter(event, index)}
            onMouseLeave={() => handleLeave(index)}
            className="group liquid-glass flex min-h-[150px] flex-col justify-between p-5 transition-colors duration-300 hover:border-primary/40 md:min-h-[190px] md:p-6 [transform-style:preserve-3d]"
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

            <p className="mt-6 font-label-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-text-secondary transition-colors duration-300 group-hover:text-text-primary md:text-[11px] md:tracking-[0.12em]">
              {step.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
