import { useLayoutEffect, useState } from 'react'
import { whyUsProcess } from '../../../data/content'

const processSteps = whyUsProcess.steps.map((step, index) => ({
  index: String(index + 1).padStart(2, '0'),
  label: step,
}))

export function WhyUsAside() {
  const [activeIndex, setActiveIndex] = useState(0)

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % processSteps.length)
    }, 5200)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <aside className="flex h-full flex-col gap-6 lg:gap-8">
      <div className="liquid-glass relative p-8 md:p-10">
        <div className="absolute left-0 top-0 h-1 w-1/4 bg-primary" aria-hidden="true" />

        <p className="type-display relative z-[1] text-[28px] leading-[1.05] text-primary md:text-[32px]">
          {whyUsProcess.headline}
        </p>
        <p className="type-body relative z-[1] mt-4 max-w-md text-[15px] leading-relaxed md:mt-5 md:text-base">
          {whyUsProcess.body}
        </p>
      </div>

      <div
        className="liquid-glass p-2 md:p-3"
        role="tablist"
        aria-label="How we work"
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
              className={`relative z-[1] w-full border-2 px-4 py-4 text-left transition-colors md:px-5 md:py-5 ${
                isActive
                  ? 'border-primary bg-surface/45 shadow-brutal-primary-sm backdrop-blur-md'
                  : 'border-transparent hover:border-white/10 hover:bg-surface/25'
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`font-label-mono text-sm tabular-nums transition-colors ${
                    isActive ? 'text-primary' : 'text-primary/35'
                  }`}
                >
                  {step.index}
                </span>
                <span
                  className={`h-px transition-all ${
                    isActive
                      ? 'w-10 bg-primary/60'
                      : 'w-6 bg-border-subtle hover:w-8 hover:bg-primary/30'
                  }`}
                />
                <span
                  className={`font-label-mono text-[11px] uppercase tracking-[0.12em] md:text-label-mono ${
                    isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
