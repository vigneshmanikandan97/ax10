import { useLayoutEffect, useState } from 'react'
import { whyUsProcess } from '../../../data/content'
import { SectionLabel } from '../../ui/BrutalCard'

const processSteps = whyUsProcess.steps.map((step, index) => ({
  index: String(index + 1).padStart(2, '0'),
  label: step,
}))

const STEP_DELAY = 5200

export function OurProcess() {
  const [activeIndex, setActiveIndex] = useState(0)

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % processSteps.length)
    }, STEP_DELAY)

    return () => window.clearInterval(interval)
  }, [])

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
        className="liquid-glass max-w-3xl p-2 md:p-3"
        role="tablist"
        aria-label="Our delivery process"
      >
        {processSteps.map((step, index) => {
          const isActive = index === activeIndex

          return (
            <button
              key={step.index}
              type="button"
              role="tab"
              aria-selected={isActive}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              className={`group relative z-[1] w-full border-2 px-4 py-4 text-left transition-all duration-300 md:px-6 md:py-5 ${
                isActive
                  ? 'border-primary bg-surface/50 shadow-[4px_4px_0_0_rgba(105,201,145,0.28)] backdrop-blur-md'
                  : 'border-transparent hover:border-white/10 hover:bg-surface/20'
              }`}
            >
              <div className="flex items-center gap-3 md:gap-4">
                <span
                  className={`shrink-0 font-label-mono text-sm tabular-nums transition-colors md:text-base ${
                    isActive ? 'text-primary' : 'text-primary/30 group-hover:text-primary/50'
                  }`}
                >
                  {step.index}
                </span>

                <span
                  className={`h-px shrink-0 transition-all duration-300 ${
                    isActive
                      ? 'w-8 bg-primary/70 md:w-10'
                      : 'w-5 bg-border-subtle group-hover:w-7 group-hover:bg-primary/25'
                  }`}
                  aria-hidden="true"
                />

                <span
                  className={`font-label-mono text-[10px] uppercase leading-snug tracking-[0.14em] md:text-[11px] md:tracking-[0.12em] ${
                    isActive
                      ? 'text-text-primary'
                      : 'text-text-muted group-hover:text-text-secondary'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
